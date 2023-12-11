import { NextResponse } from 'next/server'
import prisma from '../../prisma'

export async function GET(request: Request) {
  const result = await prisma.item.findMany({ orderBy: { order: 'asc' }})
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const data = await request.json()
  const result = await prisma.item.create({ data })
  return NextResponse.json(result)
}

function getUpsAndDowns(from: number, to: number): { ups: number[], downs: number[] } {
  const range = (start, stop) => Array.from({ length: stop - start + 1 }, (_, i) => start + i)
  let ups
  let downs

  if (from < to) {
    downs = range(from + 1, to)
  } else {
    ups = range(to, from - 1)
  }

  return { ups, downs }
}

export async function PUT(request: Request) {
  const { from, to } = await request.json()
  const { ups, downs } = getUpsAndDowns(from, to)

  await prisma.$transaction(async (tx) => {
    await tx.item.update({
      where: { order: from },
      data: { order: -1 },
    })

    if (ups) {
      await tx.item.updateMany({
        where: { order: { in: ups } },
        data: { order: { increment: 1 } },
      })
    }

    if (downs) {
      await tx.item.updateMany({
        where: { order: { in: downs } },
        data: { order: { decrement: 1 } },
      })
    }

    await tx.item.update({
      where: { order: -1 },
      data: { order: to },
    })
  })

  const items = await prisma.item.findMany({ orderBy: { order: 'asc' } })
  const itemNames = items.map(item => item.name)
  return NextResponse.json(itemNames)
}
