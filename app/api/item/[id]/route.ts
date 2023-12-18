import { NextResponse } from 'next/server'
import prisma from '../../../prisma'

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
  const { order } = await prisma.item.findUnique({
    where: {
      id: parseInt(params.id)
    },
    select: {
      order: true
    },
  })

  await prisma.$transaction(async (tx) => {
    await prisma.item.delete({
      where: {
        id: parseInt(params.id),
      },
    })

    await tx.item.updateMany({
      where: { order: { gt: order } },
      data: { order: { decrement: 1 } },
    })
  })

  return NextResponse.json({ deleted: params.id })
}
