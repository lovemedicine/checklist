import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/util/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 403 })
  }

  const result = await prisma.list.findMany({
    orderBy: { id: 'desc' }
  })
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const data = await request.json()
  const result = await prisma.list.create({ data })
  return NextResponse.json(result)
}
