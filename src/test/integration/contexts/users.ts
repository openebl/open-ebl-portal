import { type TestDbType } from "../fixtures/db-fixtures";

export const withValidPlatformAndUser = async (db: TestDbType) => {
  const platform = await db.platform.create({
    data: { name: "Mock FF" },
  });

  const user = await db.user.create({
    data: {
      name: "Good Smith",
      email: "goodsmith@example.com",
      emailVerified: new Date(),
      activePlatformId: platform.id,
    },
  });

  await db.userRole.createMany({
    data: [
      {
        userId: user.id,
        platformId: platform.id,
        role: "user",
      },
    ],
  });

  return { user, platform };
};
