import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import * as argon2 from "argon2"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = []
providers.push(
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase()
      const password = credentials?.password || ""
      if (!email || !password) return null
      // Use raw query to avoid schema drift when Prisma client isn't regenerated
      const rows = await prisma.$queryRaw<{ id: string; email: string | null; name: string | null; passwordHash: string | null }[]>`
        SELECT id, email, name, passwordHash FROM "User" WHERE email = ${email} LIMIT 1
      `
      const user = rows[0]
      if (!user || !user.passwordHash) return null
      let ok = false
      try {
        ok = await argon2.verify(user.passwordHash, password)
      } catch {
        ok = false
      }
      if (!ok) return null
      return { id: user.id, email: user.email ?? undefined, name: user.name ?? undefined }
    },
  })
)

// Add Google if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }))
}

// Keep GitHub if configured (optional)
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(GitHub({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }))
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: '/auth',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
