import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";
import { findOrderedLists } from "@/util/db";

type Params = { params: { id: string } };

export async function GET(request: Request, { params }: Params) {
  const userId = await getUserId();
  const result = await prisma.list.findUnique({
    where: { id: parseInt(params.id), userId },
  });
  return NextResponse.json(result);
}

export async function PATCH(request: Request, { params }: Params) {
  const userId = await getUserId();
  const data = await request.json();
  await prisma.list.update({
    where: { id: parseInt(params.id), userId },
    data,
  });
  const lists = await findOrderedLists(userId);
  return NextResponse.json(lists);
}

export async function DELETE(request: Request, { params }: Params) {
  const userId = await getUserId();
  await prisma.list.delete({
    where: {
      id: parseInt(params.id),
      userId,
    },
    include: {
      items: true,
    },
  });
  const lists = await findOrderedLists(userId);
  return NextResponse.json(lists);
}
