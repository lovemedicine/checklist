import { NextResponse } from 'next/server'
import prisma from '../../../../../prisma'

type Params = {
  id: number
  itemId: number
}

export async function PUT(request: Request, { params }: Params) {
  const result = await prisma.listItem.create({
    data: {
      listId: parseInt(params.id),
      itemId: parseInt(params.itemId),
    },
  })
  return NextResponse.json(result)
}

export async function DELETE(request: Request, { params }: Params) {
  const result = await prisma.listItem.delete({
    where: {
      listId_itemId: {
        listId: parseInt(params.id),
        itemId: parseInt(params.itemId),
      },
    },
  })
  return NextResponse.json(result)
}
