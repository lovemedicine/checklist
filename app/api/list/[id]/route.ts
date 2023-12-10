import { NextResponse } from 'next/server'
import prisma from '../../../prisma'

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const result = await prisma.list.findUnique({
    where: { id: parseInt(params.id) },
  })
  return NextResponse.json(result)
}

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
  const result = await prisma.list.delete({
    where: {
      id: parseInt(params.id),
    },
    include: {
      listItems: true
    },
  })
  return NextResponse.json(result)
}

