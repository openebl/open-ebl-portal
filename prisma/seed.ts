import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const tradeRoleFreightForwarder = await prisma.tradeRole.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      tradeRole: "FreightForwarder",
    },
  });
  const tradeRoleShipper = await prisma.tradeRole.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      tradeRole: "Shipper",
    },
  });
  const tradeRoleConsignee = await prisma.tradeRole.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      tradeRole: "Consignee",
    },
  });
  const tradeRoleReleaseAgent = await prisma.tradeRole.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      tradeRole: "ReleaseAgent",
    },
  });

  const platform1 = await prisma.platform.upsert({
    where: { id: 100 },
    update: {},
    create: {
      id: 100,
      name: "Issuer Agent A, LTD",
      tradeRoles: {
        connect: [tradeRoleFreightForwarder],
      },
    },
  });
  const platform2 = await prisma.platform.upsert({
    where: { id: 101 },
    update: {},
    create: {
      id: 101,
      name: "A Factory Co., Ltd",
      tradeRoles: {
        connect: [tradeRoleShipper],
      },
    },
  });
  const platform3 = await prisma.platform.upsert({
    where: { id: 102 },
    update: {},
    create: {
      id: 102,
      name: "Importer A, Inc",
      tradeRoles: {
        connect: [tradeRoleConsignee],
      },
    },
  });
  const platform4 = await prisma.platform.upsert({
    where: { id: 103 },
    update: {},
    create: {
      id: 103,
      name: "Release Agent A, Inc",
      tradeRoles: {
        connect: [tradeRoleReleaseAgent],
      },
    },
  });
  await prisma.platform.upsert({
    where: { id: 168 },
    update: {},
    create: {
      id: 168,
      name: "BlueX Freight Forwarder",
      tradeRoles: {
        connect: [tradeRoleFreightForwarder, tradeRoleReleaseAgent],
      },
    },
  });
  await prisma.platform.upsert({
    where: { id: 169 },
    update: {},
    create: {
      id: 169,
      name: "Foxxxon Technology Group",
      tradeRoles: {
        connect: [tradeRoleShipper],
      },
    },
  });
  await prisma.platform.upsert({
    where: { id: 188 },
    update: {},
    create: {
      id: 188,
      name: "Dollar Forest",
      tradeRoles: {
        connect: [tradeRoleConsignee],
      },
    },
  });
  await prisma.platform.upsert({
    where: { id: 189 },
    update: {},
    create: {
      id: 189,
      name: "DEF Freight Forwarder",
      tradeRoles: {
        connect: [tradeRoleReleaseAgent],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "kevin@bluextrade.com" },
    update: {},
    create: {
      email: "kevin@bluextrade.com",
      name: "Kevin Chung",
      activePlatform: {
        connect: platform1,
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
        connect: platform2,
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
        connect: platform3,
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
        connect: platform4,
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
        connect: platform1,
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
        connect: platform2,
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
        connect: platform3,
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
        connect: platform4,
      },
      userRoles: {
        create: {
          platformId: platform4.id,
          role: "admin",
        },
      },
    },
  });
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
