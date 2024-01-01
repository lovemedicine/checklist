import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const googleId = process.env.SEED_USER_GOOGLE_ID

if (googleId !== undefined) {
  throw new Error("Can't create seed data without SEED_USER_GOOGLE_ID set in env")
}

async function main() {
  const user1 = await prisma.user.create({ data: { googleId: (googleId as string) } })

  const item1 = await prisma.item.create({
    data: {
      name: 'blueberries',
      order: 1,
      userId: user1.id,
    }
  })

  const item2 = await prisma.item.create({
    data: {
      name: 'strawberries',
      order: 2,
      userId: user1.id,
    }
  })

  const item3 = await prisma.item.create({
    data: {
      name: 'spinach',
      order: 3,
      userId: user1.id,
    }
  })

  const item4 = await prisma.item.create({
    data: {
      name: 'lettuce',
      order: 4,
      userId: user1.id,
    }
  })

  const list1 = await prisma.list.create({
    data: {
      name: 'food',
      date: '2023-12-02',
      userId: user1.id,
      items: {
        create: [
          {
            item: {
              connect: {
                id: item1.id
              }
            }
          },
          {
            item: {
              connect: {
                id: item2.id
              }
            }
          },
          {
            item: {
              connect: {
                id: item3.id
              }
            }
          },
          {
            item: {
              connect: {
                id: item4.id
              }
            }
          },
        ]
      }
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
