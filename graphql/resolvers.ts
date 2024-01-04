import { getUserId } from '@/util/auth'
import { findOrderedLists } from '@/util/db'

export const resolvers = {
  Query: {
    lists: async () => {
      const userId = await getUserId()
      return await findOrderedLists(userId)
    },
  },
}