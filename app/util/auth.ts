import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"
import prisma from '@/prisma'

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
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

export { authOptions }