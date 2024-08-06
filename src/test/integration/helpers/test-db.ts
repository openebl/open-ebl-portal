import { env } from "@/env.js";
import { randomId } from "@/lib/utils";
import { type DatabaseType, db } from "@/server/db";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import { groupBy } from "remeda";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema  from "@/drizzle/schema";

export async function spinUpTestPrisma<R>(
  fn: (db: DatabaseType) => Promise<R>,
) {
  const schemaName = `test_${randomId(10)}`;
  try {
    await cloneSchema("public", schemaName);

    const url = new URL(env.DATABASE_URL);
    // url.searchParams.set("schema", schemaName);
    // url.searchParams.set("connection_limit", "1");

    const conn = postgres(url.toString(), { max: 1, connection: { search_path: schemaName } });
    const testDb = drizzle(conn, { schema, logger: true });
    const res = await fn(testDb);
    await conn.end();
    return res;
  } finally {
    await dropSchema(schemaName);
  }
}

export async function cloneSchema(source: string, target: string) {
  await db.execute(sql.raw(`CREATE SCHEMA "${target}";`));

  const seqs: Record<string, string>[] = await db.execute(
    sql`SELECT sequence_name::text FROM information_schema.SEQUENCES WHERE sequence_schema = ${source}`,
  );

  await Promise.all(
    seqs.map(async (seq) => {
      if (!seq.sequence_name || seq.sequence_name.length === 0) return false;
      return db.execute(
        sql.raw(`CREATE SEQUENCE ${target}."${seq.sequence_name}"`),
      );
    }),
  );

  const enums: { name: string; value: string }[] = await db.execute(sql.raw(`
    SELECT t.typname AS name,
           e.enumlabel AS value
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype = 'e'
      AND n.nspname = '${source}'
    ORDER BY t.typname, e.enumsortorder;
  `));

  await Promise.all(
    Object.entries(groupBy(enums, (item) => item.name)).map(
      ([name, values]) => {
        const enumValues = values.map((item) => item.value).join("', '");
        return db.execute(
          sql.raw(`CREATE TYPE ${target}."${name}" AS ENUM ('${enumValues}')`),
        );
      },
    ),
  );

  const tables: Record<string, string>[] = await db.execute(
    sql`SELECT table_name::text FROM information_schema.TABLES WHERE table_schema = ${source}`,
  );

  await Promise.all(
    tables.map(async (table) => {
      const tableName = table.table_name;
      if (!tableName || tableName.length === 0) return false;

      await db.execute(
        sql.raw(`CREATE TABLE "${target}"."${tableName}" (LIKE "${source}"."${tableName}" INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING DEFAULTS)`),
      );

      // set default value for seq
      const sourceSchema = source === "public" ? "" : source;
      const cols: { name: string; defu: string }[] = await db.execute(sql.raw(
        `SELECT column_name::text as name, column_default::text as defu FROM information_schema.COLUMNS
         WHERE table_schema = '${target}' AND table_name = '${tableName}' AND column_default LIKE 'nextval(%${sourceSchema}%::regclass)'`,
      ));
      for (const { name, defu } of cols) {
        await db.execute(sql.raw(
          `ALTER TABLE "${target}"."${tableName}" ALTER COLUMN "${name}" SET DEFAULT ${replaceNextVal(defu, target)}`,
        ));
      }

      // change enum from public.x to target.x
      const enumColumns: {
        column_name: string;
        udt_name: string;
        defu: string;
      }[] = await db.execute(sql.raw(`
        SELECT column_name, udt_name, column_default::text as defu FROM information_schema.columns
          WHERE table_schema = '${source}' AND table_name = '${tableName}'
          AND data_type = 'USER-DEFINED'`));

      for (const { column_name, udt_name, defu } of enumColumns) {
        if (!defu) {
          await db.execute(sql.raw(`
          ALTER TABLE ${target}."${tableName}"
          ALTER COLUMN "${column_name}" DROP DEFAULT,
          ALTER COLUMN "${column_name}"
          SET DATA TYPE ${target}."${udt_name}"
          USING "${column_name}"::text::${target}."${udt_name}"`));
        } else {
          const newDefault = defu.replace("::", `::${target}.`);
          await db.execute(sql.raw(`
          ALTER TABLE ${target}."${tableName}"
          ALTER COLUMN "${column_name}" DROP DEFAULT,
          ALTER COLUMN "${column_name}"
          SET DATA TYPE ${target}."${udt_name}"
          USING "${column_name}"::text::${target}."${udt_name}",
          ALTER COLUMN ${column_name} SET DEFAULT ${newDefault}`));
        }
      }
    }),
  );
}

function replaceNextVal(str: string, targetSchema: string) {
  const regex = new RegExp(`nextval\\('([^']*\\.)?"(.*?)"'::regclass\\)`, "g");
  return str.replace(
    regex,
    (_match, _p1, p2) => `nextval('${targetSchema}."${p2}"'::regclass)`,
  );
}

async function dropSchema(schemaName: string) {
  return db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`));
}
