'use server'

import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'admin_authenticated'
const ADMIN_COOKIE_VALUE = 'true'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function authenticateAdmin(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const password = formData.get('password')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return { error: 'Admin authentication is not configured.' }
  }

  if (typeof password !== 'string' || password !== adminPassword) {
    return { error: 'Invalid password.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/admin',
  })

  return null
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return true
  }

  const cookieStore = await cookies()
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME)

  return authCookie?.value === ADMIN_COOKIE_VALUE
}
