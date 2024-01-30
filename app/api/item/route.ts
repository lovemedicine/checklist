import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";
import { findOrderedItems } from "@/util/db";

export async function GET(request: Request) {
  const userId = await getUserId();
  const result = await findOrderedItems(userId);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  let data = await request.json();
  data.userId = userId;
  await prisma.item.create({ data });
  const items = await findOrderedItems(userId);
  return NextResponse.json(items);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  const result = await prisma.listItem.delete({
    where: { id },
  });
  revalidatePath("/item");
  return NextResponse.json(result);
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

export async function PUT(request: Request) {
  const userId = await getUserId();
  const { from, to } = await request.json();
  const { ups, downs } = getUpsAndDowns(from, to);

  await prisma.$transaction(async (tx) => {
    await tx.item.update({
      where: { order_userId: { order: from, userId } },
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
        where: { userId },
        _max: { order: true },
      });

      const diff = (maxOrder as number) - Math.min(...ups);

      await tx.item.updateMany({
        where: { order: { in: ups }, userId },
        data: { order: { increment: diff + 1 } },
      });

      const newUps = ups.map((order) => order + diff + 1);

      await tx.item.updateMany({
        where: { order: { in: newUps }, userId },
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
        where: { userId },
        _max: { order: true },
      });

      const diff = (maxOrder as number) - Math.min(...downs);

      await tx.item.updateMany({
        where: { order: { in: downs }, userId },
        data: { order: { increment: diff + 1 } },
      });

      const newDowns = downs.map((order) => order + diff + 1);

      await tx.item.updateMany({
        where: { order: { in: newDowns }, userId },
        data: { order: { decrement: diff + 2 } },
      });
    }

    await tx.item.update({
      where: { order_userId: { order: -1, userId } },
      data: { order: to },
    });
  });

  const items = await findOrderedItems(userId);
  return NextResponse.json(items);
}
