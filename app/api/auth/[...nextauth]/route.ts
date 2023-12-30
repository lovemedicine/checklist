import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    })
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    session({ session, token }: any) {
      console.log("session", session)
      console.log("token", token)

      if (session.user) {
        session.user.id = token.sub as string;
      }

      return session;
    },
  }
})

export { handler as GET, handler as POST }