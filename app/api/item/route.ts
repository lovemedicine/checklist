import { NextResponse } from 'next/server'
import prisma from '@/prisma'

export async function GET(request: Request) {
  const result = await prisma.item.findMany({ orderBy: { order: 'asc' }})
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const data = await request.json()
  const result = await prisma.item.create({ data })
  return NextResponse.json(result)
}

function getUpsAndDowns(from: number, to: number): { ups?: number[] | undefined, downs?: number[] } {
  const range = (start: number, stop: number) => Array.from({ length: stop - start + 1 }, (_, i) => start + i)
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
      // sqlite will throw unique constraint error if values are incremented directly.
      // instead we have to raise them above the current max order then lower them to
      // the value we intended to increment to.
      // see: https://stackoverflow.com/questions/7703196/sqlite-increment-unique-integer-field

      const { _max: { order: maxOrder } } = await prisma.item.aggregate({
        _max: { order: true },
      })

      const diff = (maxOrder as number) - Math.min(...ups)

      await tx.item.updateMany({
        where: { order: { in: ups } },
        data: { order: { increment: diff + 1 } },
      })

      const newUps = ups.map(order => order + diff + 1)

      await tx.item.updateMany({
        where: { order: { in: newUps } },
        data: { order: { decrement: diff } },
      })
    }

    if (downs) {
      // sqlite will throw unique constraint error if values are decremented directly.
      // instead we have to raise them above the current max order then lower them to
      // the value we intended to increment to.
      // see: https://stackoverflow.com/questions/7703196/sqlite-increment-unique-integer-field

      const { _max: { order: maxOrder } } = await prisma.item.aggregate({
        _max: { order: true },
      })

      const diff = (maxOrder as number) - Math.min(...downs)

      await tx.item.updateMany({
        where: { order: { in: downs } },
        data: { order: { increment: diff + 1 } },
      })

      const newDowns = downs.map(order => order + diff + 1)

      await tx.item.updateMany({
        where: { order: { in: newDowns } },
        data: { order: { decrement: diff + 2 } },
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
