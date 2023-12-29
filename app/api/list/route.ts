import { NextResponse } from 'next/server'
import prisma from '@/prisma'

export async function GET(request: Request) {
  const result = await prisma.list.findMany({ orderBy: { id: 'desc' }})
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const data = await request.json()
  const result = await prisma.list.create({ data })
  return NextResponse.json(result)
}
