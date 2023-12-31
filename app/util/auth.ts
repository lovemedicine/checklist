import { NextResponse } from 'next/server'
import GoogleProvider from "next-auth/providers/google"
import { getServerSession } from 'next-auth/next'
import type { Session, NextAuthOptions } from 'next-auth'
import prisma from '@/prisma'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.googleId = token.sub as string

        if (!session.user.id) {
          let user = await prisma.user.findUnique({
            where: { googleId: token.sub }
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                googleId: token.sub,
              }
            })
          }

          session.user.id = user.id
        }
      }

      return session;
    },
  }
}

export async function getUserId(): Promise<number> {
  const session = await getServerSession(authOptions)
  return (session as Session).user.id
}

export async function withUser(fn: (user: Session['user']) => Promise<NextResponse<unknown>>) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 403 })
  }

  return fn(session.user)
}