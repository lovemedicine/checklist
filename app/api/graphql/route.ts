import { createYoga } from 'graphql-yoga'
import type { NextRequest, NextResponse } from 'next/server'
import { schema } from '@/graphql/schema'


const { handleRequest } = createYoga<{
  req: NextRequest
  res: NextResponse
}>({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }