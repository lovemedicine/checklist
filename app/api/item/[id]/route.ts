import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";
import { findOrderedItems } from "@/util/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await getUserId();
  const result = await prisma.item.findUnique({
    where: {
      id: parseInt(params.id),
      userId,
    },
    select: {
      order: true,
    },
  });

  if (!result) {
    return NextResponse.json({ error: "Item Not Found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await prisma.item.delete({
      where: {
        id: parseInt(params.id),
        userId,
      },
    });

    await tx.item.updateMany({
      where: { order: { gt: result.order }, userId },
      data: { order: { decrement: 1 } },
    });
  });

  const items = await findOrderedItems(userId);
  return NextResponse.json(items);
}
