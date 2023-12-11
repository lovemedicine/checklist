import { NextResponse } from 'next/server'
import prisma from '../../../../prisma'

type Params = {
  id: number
}

export async function GET(request: Request, { params }: Params) {
  const result = await prisma.item.findMany({
    orderBy: { order: 'asc' },
    include: { lists: { where: { listId: parseInt(params.id) } } },
  })
  return NextResponse.json(result)
}

export async function POST(request: Request, { params }: Params) {
  const data = await request.json()
  const { _max: { order: maxOrder } } = await prisma.item.aggregate({
    _max: { order: true },
  })
  const result = await prisma.listItem.create({
    data: {
      list: {
        connect: {
          id: parseInt(params.id),
        },
      },
      item: {
        create: {
          name: data.name,
          order: maxOrder + 1,
        },
      },
    },
  })
  return NextResponse.json(result)
}
