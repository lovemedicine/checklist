import { NextResponse } from 'next/server'
import prisma from '../../../../../prisma'

type Params = {
  id: string
  itemId: string
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const result = await prisma.listItem.create({
    data: {
      listId: parseInt(params.id),
      itemId: parseInt(params.itemId),
    },
  })
  return NextResponse.json(result)
}

export async function DELETE(request: Request, { params }: { params: Params }) {
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
