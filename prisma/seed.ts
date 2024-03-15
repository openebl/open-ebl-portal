import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const platform1 = await prisma.platform.upsert({
    where: { id: 100 },
    update: {
      platformId: "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9"
    },
    create: {
      id: 100,
      platformId: "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9",
      name: "Issuer Agent A, LTD",
    },
  });
  const platform2 = await prisma.platform.upsert({
    where: { id: 101 },
    update: {
      platformId: "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614"
    },
    create: {
      id: 101,
      platformId: "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614",
      name: "A Factory Co., Ltd",
    },
  });
  const platform3 = await prisma.platform.upsert({
    where: { id: 102 },
    update: {
      platformId: "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5"
    },
    create: {
      id: 102,
      platformId: "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5",
      name: "Importer A, Inc",
    },
  });
  const platform4 = await prisma.platform.upsert({
    where: { id: 103 },
    update: {
      platformId: "did:openebl:66c71465-3d0b-43d8-9e1b-c88c7a7634ca"
    },
    create: {
      id: 103,
      platformId: "did:openebl:66c71465-3d0b-43d8-9e1b-c88c7a7634ca",
      name: "Release Agent A, Inc",
    },
  });

  await prisma.user.upsert({
    where: { email: "kevin@bluextrade.com" },
    update: {},
    create: {
      email: "kevin@bluextrade.com",
      name: "Kevin Chung",
      activePlatform: {
        connect: {
          id: platform1.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform1.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "kevin+shipper@bluextrade.com" },
    update: {},
    create: {
      email: "kevin+shipper@bluextrade.com",
      name: "Shipper Smith",
      activePlatform: {
        connect: {
          id: platform2.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform2.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "kevin+consignee@bluextrade.com" },
    update: {},
    create: {
      email: "kevin+consignee@bluextrade.com",
      name: "Consignee Dollar",
      activePlatform: {
        connect: {
          id: platform3.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform3.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "kevin+ff@bluextrade.com" },
    update: {},
    create: {
      email: "kevin+ff@bluextrade.com",
      name: "DEF Brown",
      activePlatform: {
        connect: {
          id: platform4.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform4.id,
          role: "admin",
        },
      },
    },
  });
  // -----
  await prisma.user.upsert({
    where: { email: "jason@bluextrade.com" },
    update: {},
    create: {
      email: "jason@bluextrade.com",
      name: "Jason Juang",
      activePlatform: {
        connect: {
          id: platform1.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform1.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "jason+shipper@bluextrade.com" },
    update: {},
    create: {
      email: "jason+shipper@bluextrade.com",
      name: "Shipper Smith",
      activePlatform: {
        connect: {
          id: platform2.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform2.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "jason+consignee@bluextrade.com" },
    update: {},
    create: {
      email: "jason+consignee@bluextrade.com",
      name: "Consignee Dollar",
      activePlatform: {
        connect: {
          id: platform3.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform3.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "jason+ff@bluextrade.com" },
    update: {},
    create: {
      email: "jason+ff@bluextrade.com",
      name: "Releaser",
      activePlatform: {
        connect: {
          id: platform4.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform4.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "jordan.hsu@bluextrade.com" },
    update: {},
    create: {
      email: "jordan.hsu@bluextrade.com",
      name: "Jordan Hsu",
      activePlatform: {
        connect: {
          id: platform1.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform1.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "jordan.hsu+shipper@bluextrade.com" },
    update: {},
    create: {
      email: "jordan.hsu+shipper@bluextrade.com",
      name: "Shipper Jordan",
      activePlatform: {
        connect: {
          id: platform2.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform2.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "jordan.hsu+consignee@bluextrade.com" },
    update: {},
    create: {
      email: "jordan.hsu+consignee@bluextrade.com",
      name: "Consignee Jordan",
      activePlatform: {
        connect: {
          id: platform3.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform3.id,
          role: "admin",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "jordan.hsu+ff@bluextrade.com" },
    update: {},
    create: {
      email: "jordan.hsu+ff@bluextrade.com",
      name: "Releaser Jordan",
      activePlatform: {
        connect: {
          id: platform4.id,
        },
      },
      userRoles: {
        create: {
          platformId: platform4.id,
          role: "admin",
        },
      },
    },
  });

  console.log('Seeded!');
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
