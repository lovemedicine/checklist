import { NextResponse } from 'next/server'
import prisma from '../../../prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const result = await prisma.list.findUnique({
    where: { id: parseInt(params.id) },
  })
  return NextResponse.json(result)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

