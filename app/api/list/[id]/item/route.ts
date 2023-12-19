import { NextResponse } from 'next/server'
import prisma from '../../../../prisma'

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  const result = await prisma.item.findMany({
    orderBy: { order: 'asc' },
    include: { lists: { where: { listId: parseInt(id) } } },
  })
  return NextResponse.json(result)
}

export async function POST(request: Request, { params: { id } }: { params: { id: string } }) {
  const data = await request.json()
  const { _max: { order: maxOrder } } = await prisma.item.aggregate({
    _max: { order: true },
  })
  const result = await prisma.listItem.create({
    data: {
      list: {
        connect: {
          id: parseInt(id),
        },
      },
      item: {
        create: {
          name: data.name,
          order: (maxOrder || 0) + 1,
        },
      },
    },
  })
  return NextResponse.json(result)
}
