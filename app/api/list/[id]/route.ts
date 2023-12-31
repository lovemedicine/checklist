import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import { getUserId } from '@/util/auth'

type Params = { params: { id: string } }

export async function GET(request: Request, { params }: Params) {
  const userId = await getUserId()
  const result = await prisma.list.findUnique({
    where: { id: parseInt(params.id), userId },
  })
  return NextResponse.json(result)
}

export async function PATCH(request: Request, { params }: Params) {
  const userId = await getUserId()
  const data = await request.json()
  const result = await prisma.list.update({
    where: { id: parseInt(params.id), userId },
    data
  })
  return NextResponse.json(result)
}

export async function DELETE(request: Request, { params }: Params) {
  const userId = await getUserId()
  const result = await prisma.list.delete({
    where: {
      id: parseInt(params.id),
      userId
    },
    include: {
      items: true
    },
  })
  return NextResponse.json(result)
}

