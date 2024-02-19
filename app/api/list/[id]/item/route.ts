import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";
import { findOrderedItems } from "@/util/db";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const userId = await getUserId();
  const result = await prisma.item.findMany({
    where: { list: { id: parseInt(id), userId } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(result);
}

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const userId = await getUserId();
  const data = await request.json();
  const {
    _max: { order: maxOrder },
  } = await prisma.item.aggregate({
    where: { list: { id: parseInt(id), userId } },
    _max: { order: true },
  });
  await prisma.item.create({
    data: {
      name: data.name,
      order: (maxOrder || 0) + 1,
      checked: true,
      list: {
        connect: {
          id: parseInt(id),
        },
      },
    },
  });
  const items = await findOrderedItems(parseInt(id));
  return NextResponse.json(items);
}

function getUpsAndDowns(
  from: number,
  to: number
): { ups?: number[] | undefined; downs?: number[] } {
  const range = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, i) => start + i);
  let ups;
  let downs;

  if (from < to) {
    downs = range(from + 1, to);
  } else {
    ups = range(to, from - 1);
  }

  return { ups, downs };
}

export async function PUT(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const userId = await getUserId();
  const { from, to } = await request.json();
  const { ups, downs } = getUpsAndDowns(from, to);

  await prisma.$transaction(async (tx) => {
    await tx.item.update({
      where: {
        order_listId: { order: from, listId: parseInt(id) },
        list: { userId },
      },
      data: { order: -1 },
    });

    if (ups) {
      // sqlite will throw unique constraint error if values are incremented directly.
      // instead we have to raise them above the current max order then lower them to
      // the value we intended to increment to.
      // see: https://stackoverflow.com/questions/7703196/sqlite-increment-unique-integer-field

      const {
        _max: { order: maxOrder },
      } = await prisma.item.aggregate({
        where: { listId: parseInt(id), list: { userId } },
        _max: { order: true },
      });

      const diff = (maxOrder as number) - Math.min(...ups);

      await tx.item.updateMany({
        where: { order: { in: ups }, listId: parseInt(id), list: { userId } },
        data: { order: { increment: diff + 1 } },
      });

      const newUps = ups.map((order) => order + diff + 1);

      await tx.item.updateMany({
        where: {
          order: { in: newUps },
          listId: parseInt(id),
          list: { userId },
        },
        data: { order: { decrement: diff } },
      });
    }

    if (downs) {
      // sqlite will throw unique constraint error if values are decremented directly.
      // instead we have to raise them above the current max order then lower them to
      // the value we intended to increment to.
      // see: https://stackoverflow.com/questions/7703196/sqlite-increment-unique-integer-field

      const {
        _max: { order: maxOrder },
      } = await prisma.item.aggregate({
        where: { listId: parseInt(id), list: { userId } },
        _max: { order: true },
      });

      const diff = (maxOrder as number) - Math.min(...downs);

      await tx.item.updateMany({
        where: { order: { in: downs }, listId: parseInt(id), list: { userId } },
        data: { order: { increment: diff + 1 } },
      });

      const newDowns = downs.map((order) => order + diff + 1);

      await tx.item.updateMany({
        where: {
          order: { in: newDowns },
          listId: parseInt(id),
          list: { userId },
        },
        data: { order: { decrement: diff + 2 } },
      });
    }

    await tx.item.update({
      where: {
        order_listId: { order: -1, listId: parseInt(id) },
        list: { userId },
      },
      data: { order: to },
    });
  });

  const items = await findOrderedItems(userId);
  return NextResponse.json(items);
}
