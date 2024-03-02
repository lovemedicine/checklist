import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";
import { updateListItemOrdersInTransaction } from "@/util/db";

type Params = {
  id: string;
  itemId: string;
};

export async function PUT(
  request: Request,
  { params: { id, itemId } }: { params: Params }
) {
  const userId = await getUserId();
  const data = await request.json();
  const result = await prisma.item.update({
    where: {
      id: parseInt(itemId),
      list: { id: parseInt(id), userId },
    },
    data: {
      checked: data.checked,
    },
  });
  return NextResponse.json(result);
}

export async function DELETE(
  request: Request,
  { params: { id, itemId } }: { params: Params }
) {
  const listId = parseInt(id);
  const userId = await getUserId();
  const identifyingCondition = {
    where: {
      id: parseInt(itemId),
      list: { id: listId, userId },
    },
  };
  const item = await prisma.item.findUnique(identifyingCondition);

  if (!item) {
    return NextResponse.error();
  }

  const itemsToIncrement = await prisma.item.findMany({
    where: { list: { id: listId, userId }, order: { gt: item.order } },
    select: { order: true },
  });

  const orders = itemsToIncrement.map((item) => item.order);

  await prisma.$transaction(async (tx) => {
    await tx.item.delete(identifyingCondition);
    await updateListItemOrdersInTransaction(
      tx,
      listId,
      userId,
      orders,
      "decrement"
    );
  });

  const items = await prisma.item.findMany({
    where: { list: { id: listId, userId } },
  });

  return NextResponse.json(items);
}
