import { Platforms, UserRoles, Users } from "@/drizzle/schema";
import { type TestDbType } from "../fixtures/db-fixtures";

export const withValidPlatformAndUser = async (db: TestDbType) => {
  const [platform] = await db
    .insert(Platforms)
    .values({
      name: "Mock FF",
      platformId: "",
    })
    .returning()
    .execute();

  const [user] = await db
    .insert(Users)
    .values({
      name: "Good Smith",
      email: "goodsmith@example.com",
      emailVerified: new Date(),
      activePlatformId: platform!.id,
    })
    .returning()
    .execute();

  await db
    .insert(UserRoles)
    .values([
      {
        userId: user!.id,
        platformId: platform!.id,
        role: "user",
      },
    ])
    .returning()
    .execute();

  return { user: user!, platform: platform! };
};
