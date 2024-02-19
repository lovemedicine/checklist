import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";

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
      checked: data.value,
    },
  });
  return NextResponse.json(result);
}

export async function DELETE(
  request: Request,
  { params: { id, itemId } }: { params: Params }
) {
  const userId = await getUserId();
  const result = await prisma.item.delete({
    where: {
      id: parseInt(itemId),
      list: { id: parseInt(id), userId },
    },
  });
  return NextResponse.json(result);
}
