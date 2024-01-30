import { builder } from "@/graphql/builder";
import prisma from "@/prisma";
import { getUserId } from "@/util/auth";

builder.prismaObject("Item", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    order: t.exposeInt("order"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    userId: t.exposeInt("userId"),
    user: t.relation("user"),
    lists: t.relation("lists"),
  }),
});

builder.queryField("items", (t) =>
  t.prismaField({
    type: ["Item"],
    resolve: async (query, _parent, _args, _ctx, _info) => {
      const userId = await getUserId();
      return await prisma.item.findMany({
        ...query,
        where: { userId },
        orderBy: { order: "asc" },
      });
    },
  })
);

builder.mutationField("deleteItem", (t) =>
  t.prismaField({
    type: ["Item"],
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, args, _ctx) => {
      const { id } = args;
      const userId = await getUserId();

      await prisma.item.delete({
        where: {
          id,
          userId,
        },
      });

      return await prisma.item.findMany({
        ...query,
        where: { userId },
        orderBy: { order: "asc" },
      });
    },
  })
);
