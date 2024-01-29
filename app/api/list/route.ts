import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";
import { findOrderedLists } from "@/util/db";

export async function GET(request: NextRequest) {
  const userId = await getUserId();
  const lists = await findOrderedLists(userId);
  return NextResponse.json(lists);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  let data = await request.json();
  data.userId = userId;
  await prisma.list.create({ data });
  const lists = await findOrderedLists(userId);
  return NextResponse.json(lists);
}
