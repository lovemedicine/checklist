import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/prisma'
import { getUserId } from '@/util/auth'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  const result = await prisma.list.findMany({
    where: { userId },
    orderBy: { id: 'desc' }
  })
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const userId = await getUserId()
  let data = await request.json()
  data.userId = userId
  const result = await prisma.list.create({ data })
  return NextResponse.json(result)
}
