// ---------------------------------------------------------------------------
// Pipeline Supabase Client
// Service role client for pipeline database operations
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

/** Service role client for pipeline database operations */
export function createPipelineClient() {
  const url = process.env['SUPABASE_URL']
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY']

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  }

  return createClient(url, key)
}
