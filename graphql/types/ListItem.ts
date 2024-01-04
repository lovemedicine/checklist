import { builder } from "@/graphql/builder";

builder.prismaObject('ListItem', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    listId: t.exposeInt('listId'),
    list: t.relation('list'),
    itemId: t.exposeInt('itemId'),
    item: t.relation('item')
  })
})