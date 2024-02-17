import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const platform1 = await prisma.platform.upsert({
    where: { id: 168 },
    update: {},
    create: {

    id: 168,
      name: 'BlueX Freight Forwarder'
    },
  })
  const platform2 = await prisma.platform.upsert({
    where: { id: 169 },
    update: {},
    create: {
      id: 169,
      name: 'Foxxxon Technology Group'
    },
  })
  const platform3 = await prisma.platform.upsert({
    where: { id: 188 },
    update: {},
    create: {
      id: 188,
      name: 'Dollar Forest'
    },
  })
  const platform4 = await prisma.platform.upsert({
    where: { id: 189 },
    update: {},
    create: {
      id: 189,
      name: 'DEF Freight Forwarder'
    },
  })

  await prisma.user.upsert({
    where: { email: 'kevin@bluextrade.com' },
    update: {},
    create: {
      email: 'kevin@bluextrade.com',
      name: 'Kevin Chung',
      activePlatform: {
        connect: platform1
      },
      userRoles: {
        create: {
          platformId: platform1.id,
          role: 'admin',
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: 'kevin+shipper@bluextrade.com' },
    update: {},
    create: {
      email: 'kevin+shipper@bluextrade.com',
      name: 'Shipper Smith',
      activePlatform: {
        connect: platform2
      },
      userRoles: {
        create: {
          platformId: platform2.id,
          role: 'admin',
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: 'kevin+consignee@bluextrade.com' },
    update: {},
    create: {
      email: 'kevin+consignee@bluextrade.com',
      name: 'Consignee Dollar',
      activePlatform: {
        connect: platform3
      },
      userRoles: {
        create: {
          platformId: platform3.id,
          role: 'admin',
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: 'kevin+ff@bluextrade.com' },
    update: {},
    create: {
      email: 'kevin+ff@bluextrade.com',
      name: 'DEF Brown',
      activePlatform: {
        connect: platform4
      },
      userRoles: {
        create: {
          platformId: platform4.id,
          role: 'admin',
        },
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed error', e)
    await prisma.$disconnect()
    process.exit(1)
  })
