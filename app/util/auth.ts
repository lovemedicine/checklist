import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import prisma from "@/prisma";
import config from "@/config";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.googleId = token.sub as string;

        if (!session.user.id) {
          let user = await prisma.user.findUnique({
            where: { googleId: token.sub },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                googleId: token.sub,
              },
            });
          }

          session.user.id = user.id;
        }
      }

      return session;
    },
  },
};

export function isAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USER_MODE === "auth";
}

export async function getUserId(): Promise<number> {
  if (isAuthEnabled()) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) return session.user.id;
  }

  return config.singleUserId;
}
