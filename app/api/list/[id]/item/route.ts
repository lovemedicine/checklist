import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import { getUserId } from '@/util/auth'
import { findOrderedItems } from '@/util/db'

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  const userId = await getUserId()
  const result = await prisma.item.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
    include: { lists: { where: { listId: parseInt(id) } } },
  })
  return NextResponse.json(result)
}

export async function POST(request: Request, { params: { id } }: { params: { id: string } }) {
  const userId = await getUserId()
  const data = await request.json()
  const { _max: { order: maxOrder } } = await prisma.item.aggregate({
    where: { userId },
    _max: { order: true },
  })
  await prisma.listItem.create({
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
          user: {
            connect: {
              id: userId
            }
          }
        },
      },
    },
  })
  const items = await findOrderedItems(userId)
  return NextResponse.json(items)
}
