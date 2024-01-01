import { NextResponse } from 'next/server'
import authMiddleware, { NextRequestWithAuth } from 'next-auth/middleware'

export default function middleware(request: NextRequestWithAuth) {
  // we don't use isAuthEnabled() here because '@/util/auth' module imports from next-auth,
  // which breaks the middleware.
  // see: https://stackoverflow.com/questions/73588525/why-am-i-getting-this-error-when-using-next-js-middleware
  if (process.env.USER_MODE === 'auth') {
    return authMiddleware(request)
  } else {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}