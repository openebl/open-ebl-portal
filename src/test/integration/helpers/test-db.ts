import { env } from "@/env.js";
import { randomId } from "@/lib/utils";
import { createDb, db } from "@/server/db";
import { Prisma, PrismaClient } from "@prisma/client";

export async function spinUpTestPrisma<R>(
  fn: (testPrisma: typeof db) => Promise<R>,
) {
  const schemaName = `test_${randomId(10)}`;
  try {
    await cloneSchema("public", schemaName);

    const url = new URL(env.DATABASE_URL);
    url.searchParams.set("schema", schemaName);

    return await fn(createDb({datasourceUrl: url.toString()}),
    );
  } finally {
    await dropSchema(schemaName);
  }
}

export async function cloneSchema2(source: string, target: string) {
  await db.$executeRawUnsafe(`SELECT clone_schema('${source}', '${target}')`);
}

export async function cloneSchema(source: string, target: string) {
  await db.$executeRawUnsafe(`CREATE SCHEMA "${target}";`);

  const seqs: Record<string, string>[] = await db.$queryRaw(
    Prisma.sql`SELECT sequence_name::text FROM information_schema.SEQUENCES WHERE sequence_schema = ${source}`,
  );

  await Promise.all(
    seqs.map(async (seq) => {
      if (!seq.sequence_name || seq.sequence_name.length === 0) return false;
      return db.$queryRawUnsafe(
        `CREATE SEQUENCE ${target}."${seq.sequence_name}"`,
      );
    }),
  );

  const tables: Record<string, string>[] = await db.$queryRaw(
    Prisma.sql`SELECT table_name::text FROM information_schema.TABLES WHERE table_schema = ${source}`,
  );

  await Promise.all(
    tables.map(async (table) => {
      const tableName = table.table_name;
      if (!tableName || tableName.length === 0) return false;

      await db.$queryRawUnsafe(
        `CREATE TABLE "${target}"."${tableName}" (LIKE "${source}"."${tableName}" INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING DEFAULTS)`,
      );

      const sourceSchema = source === "public" ? "" : source;
      const cols: { name: string; defu: string }[] = await db.$queryRawUnsafe(
        `SELECT column_name::text as name, column_default::text as defu FROM information_schema.COLUMNS where table_schema = '${target}' AND table_name = '${tableName}' AND column_default LIKE 'nextval(%${sourceSchema}%::regclass)'`,
      );
      for (const { name, defu } of cols) {
        await db.$executeRawUnsafe(
          `ALTER TABLE "${target}"."${tableName}" ALTER COLUMN "${name}" SET DEFAULT ${replaceNextVal(defu, target)}`,
        );
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
  return db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
}
