import { PrismaClient } from "@prisma/client";
import config from "../app/config";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      id: config.singleUserId,
    },
  });

  const list1 = await prisma.list.create({
    data: {
      name: "food",
      date: "2023-12-02",
      userId: user1.id,
    },
  });

  await prisma.item.create({
    data: {
      name: "blueberries",
      order: 1,
      listId: list1.id,
    },
  });

  await prisma.item.create({
    data: {
      name: "strawberries",
      order: 2,
      listId: list1.id,
    },
  });

  await prisma.item.create({
    data: {
      name: "spinach",
      order: 3,
      listId: list1.id,
    },
  });

  await prisma.item.create({
    data: {
      name: "lettuce",
      order: 4,
      listId: list1.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
