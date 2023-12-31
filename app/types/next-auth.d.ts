import { User } from "next-auth"

type PersistentUserFields = {
  id: number,
  googleId: string
}

declare module "next-auth" {
  interface Session {
    user: Omit<User, 'id'> & PersistentUserFields
  }
}