import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const item1 = await prisma.item.create({
    data: {
      name: 'blueberries',
      order: 1,
    }
  })

  const item2 = await prisma.item.create({
    data: {
      name: 'strawberries',
      order: 2,
    }
  })

  const item3 = await prisma.item.create({
    data: {
      name: 'spinach',
      order: 3,
    }
  })

  const item4 = await prisma.item.create({
    data: {
      name: 'lettuce',
      order: 4,
    }
  })

  const list1 = await prisma.list.create({
    data: {
      name: 'food',
      date: '2023-12-02',
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
