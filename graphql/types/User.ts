import { builder } from '@/graphql/builder'

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    googleId: t.exposeString('googleId', { nullable: true })
  })
})