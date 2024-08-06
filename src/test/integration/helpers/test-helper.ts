import {
  EBlNotifications,
  EBlStashes,
  Platforms,
  Users,
} from "@/drizzle/schema";
import { type DatabaseType } from "@/server/db";
import { and, count, eq } from "drizzle-orm";

export async function countEBlNotifications(
  db: DatabaseType,
  name: string,
  stashId: bigint,
): Promise<number> {
  const [{ total }] = (await db
    .select({ total: count() })
    .from(EBlNotifications)
    .where(
      and(
        eq(EBlNotifications.name, name),
        eq(EBlNotifications.eBlStashId, stashId),
      ),
    )
    .execute()) as [{ total: number }];

  return total;
}

export async function createPlatform(db: DatabaseType, did: string) {
  const [platform] = await db
    .insert(Platforms)
    .values({
      name: "Test Company",
      platformId: did,
    })
    .returning()
    .execute();

  return platform!;
}

export async function createPlatformAndUsers(db: DatabaseType, did: string) {
  const platform = await createPlatform(db, did);
  const users = await db
    .insert(Users)
    .values([
      {
        email: "a@example.com",
        name: "User A",
        activePlatformId: platform.id,
      },
      {
        email: "b@example.com",
        name: "User B",
        activePlatformId: platform.id,
      },
    ])
    .returning()
    .execute();
  return { platform, users };
}

export async function createTransferEBlStash({
  db,
  platformId,
  did,
  eBlId,
  status,
}: {
  db: DatabaseType;
  platformId: bigint;
  did: string;
  eBlId: string;
  status: string;
}) {
  const [res] = await db
    .insert(EBlStashes)
    .values({
      eBlId: eBlId,
      platformId,
      status: status,
      version: 6,
      currentOwner: did,
    })
    .returning()
    .execute();
  return res!;
}
