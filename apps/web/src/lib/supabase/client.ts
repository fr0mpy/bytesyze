import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return key
}

/** Anon client for public reads. Creates fresh instance per call (edge-compatible). */
export function createAnonClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey())
}
