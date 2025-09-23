import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as argon2 from 'argon2'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'Unable to create account' }, { status: 400 })
    }

    const displayName = typeof name === 'string' ? (name.trim().length ? name.trim() : null) : null

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id })
    // Use raw SQL to allow insert even if Prisma client types are out-of-date
    const id = randomUUID()
    await prisma.$executeRaw`INSERT INTO "User" (id, email, name, passwordHash) VALUES (${id}, ${normalizedEmail}, ${displayName}, ${passwordHash})`
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('Register error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
