import { NextResponse } from 'next/server'
import prisma from '@/prisma'

type Params = { params: { id: string } }

export async function GET(request: Request, { params }: Params) {
  const result = await prisma.list.findUnique({
    where: { id: parseInt(params.id) },
  })
  return NextResponse.json(result)
}

export async function PATCH(request: Request, { params }: Params) {
  const data = await request.json()
  const result = await prisma.list.update({
    where: { id: parseInt(params.id) },
    data
  })
  return NextResponse.json(result)
}

export async function DELETE(request: Request, { params }: Params) {
  const result = await prisma.list.delete({
    where: {
      id: parseInt(params.id),
    },
    include: {
      items: true
    },
  })
  return NextResponse.json(result)
}

