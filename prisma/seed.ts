import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const sysPlatform = await prisma.platform.upsert({
    where: { id: 1 },
    update: {
      admin: true,
    },
    create: {
      id: 1,
      admin: true,
      name: "System Admin Platform",
    },
  });

  if (process.env.SYSADMIN_EMAIL) {
    const adminEmail = process.env.SYSADMIN_EMAIL;
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: "System Admin",
        activePlatform: {
          connect: {
            id: sysPlatform.id,
          },
        },
        userRoles: {
          create: {
            platformId: sysPlatform.id,
            role: "admin",
          },
        },
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_platformId_role: {
          userId: admin.id,
          platformId: sysPlatform.id,
          role: "admin",
        },
      },
      update: {},
      create: {
        userId: admin.id,
        platformId: sysPlatform.id,
        role: "admin",
      },
    });
  }

  console.info("Seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error", e);
    await prisma.$disconnect();
    process.exit(1);
  });
