import { builder } from '@/graphql/builder'

builder.prismaObject('Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    userId: t.exposeInt('userId'),
    user: t.relation('user'),
    lists: t.relation('lists')
  })
})