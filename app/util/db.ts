import prisma from "@/prisma";
import { PrismaClient, Prisma } from "@prisma/client";
import * as runtime from "@prisma/client/runtime/library";

export async function findOrderedLists(userId: number) {
  return await prisma.list.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });
}

export async function findOrderedItems(listId: number) {
  return await prisma.item.findMany({
    where: { listId },
    orderBy: { order: "asc" },
  });
}

// postgres will throw unique constraint error if values are (in/de)cremented directly.
// instead we have to raise them above the current max order then lower them to
// the value we intended to (in/de)crement to.
// see: https://stackoverflow.com/questions/7703196/sqlite-increment-unique-integer-field
export async function updateListItemOrdersInTransaction(
  transaction: Omit<
    PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      runtime.Types.Extensions.DefaultArgs
    >,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  listId: number,
  userId: number,
  orders: number[],
  type: "increment" | "decrement"
) {
  const {
    _max: { order: maxOrder },
  } = await prisma.item.aggregate({
    where: { listId, list: { userId } },
    _max: { order: true },
  });

  const diff = (maxOrder as number) - Math.min(...orders);

  await transaction.item.updateMany({
    where: { order: { in: orders }, listId, list: { userId } },
    data: { order: { increment: diff + 1 } },
  });

  const newOrders = orders.map((order) => order + diff + 1);
  const decrement = type === "increment" ? diff : diff + 2;

  await transaction.item.updateMany({
    where: {
      order: { in: newOrders },
      listId,
      list: { userId },
    },
    data: { order: { decrement } },
  });
}
