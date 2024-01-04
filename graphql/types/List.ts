// /graphql/types/Link.ts
import { builder } from "@/graphql/builder"
import prisma from "@/prisma"

builder.prismaObject('List', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    userId: t.exposeInt('userId'),
    user: t.relation('user'),
    items: t.relation('items')
  })
})

builder.queryField("lists", (t) =>
  t.prismaField({
    type: ['List'],
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.list.findMany({ ...query })
  })
)