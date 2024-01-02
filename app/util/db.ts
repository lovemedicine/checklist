import prisma from '@/prisma'

export async function findOrderedLists(userId: number) {
  return await prisma.list.findMany({
    where: { userId },
    orderBy: { id: 'desc' }
  })
}

export async function findOrderedItems(userId: number) {
  return await prisma.item.findMany({
    where: { userId },
    orderBy: { order: 'asc' }
  })
}