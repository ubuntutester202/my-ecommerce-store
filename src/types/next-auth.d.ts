import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
} 