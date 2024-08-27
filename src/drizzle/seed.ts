import * as schema from "@/drizzle/schema";
import { Platforms, UserRoles, Users } from "@/drizzle/schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function main() {
  const conn = postgres(process.env.DATABASE_URL ?? "");
  const db = drizzle(conn, { schema, logger: false });

  const [sysPlatform] = await db
    .insert(Platforms)
    .values({
      id: 1n,
      admin: true,
      name: "System Admin Platform",
    })
    .onConflictDoUpdate({
      target: Platforms.id,
      set: {
        admin: true,
      },
    })
    .returning();

  if (process.env.SYSADMIN_EMAIL) {
    const adminEmail = process.env.SYSADMIN_EMAIL;
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(Users)
        .values({
          email: adminEmail,
          name: "System Admin",
          activePlatformId: sysPlatform!.id,
        })
        .onConflictDoUpdate({
          target: Users.email,
          set: { email: adminEmail },
        })
        .returning();

      await tx
        .insert(UserRoles)
        .values({
          userId: user!.id,
          platformId: sysPlatform!.id,
          role: "admin",
        })
        .onConflictDoNothing({
          target: [UserRoles.userId, UserRoles.platformId, UserRoles.role],
        });
    });
  }

  await conn.end();
  console.info("Seeded!");
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seed error", e);
    process.exit(1);
  });
