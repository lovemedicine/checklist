import { getUserId } from "@/util/auth";
import { findOrderedLists, findOrderedItems } from "@/util/db";

export const resolvers = {
  Query: {
    lists: async () => {
      const userId = await getUserId();
      return await findOrderedLists(userId);
    },
    items: async () => {
      const userId = await getUserId();
      return await findOrderedItems(userId);
    },
  },
};
