// ---------------------------------------------------------------------------
// Source Health Tracker
// Tracks fetch success/failure per source, manages backoff for degraded sources
// ---------------------------------------------------------------------------

import { createHash } from 'node:crypto'
import { createPipelineClient } from './supabase.js'
import {
  SOURCE_HEALTH_DEGRADED_THRESHOLD,
  SOURCE_HEALTH_DOWN_THRESHOLD,
  SOURCE_HEALTH_BACKOFF_BASE_MS,
  SOURCE_HEALTH_BACKOFF_MAX_MS,
} from './config.js'

export interface FetchResult {
  sourceName: string
  sourceId: string
  articleCount: number
  httpStatus: number | null
  error: string | null
  fetchedAt: string
}

type SourceHealthStatus = 'healthy' | 'degraded' | 'down' | 'disabled'

/**
 * Generate a deterministic source ID from the source name.
 */
export function generateSourceId(name: string): string {
  return createHash('sha256').update(name).digest('hex').slice(0, 12)
}

/**
 * Determine health status from consecutive failure count.
 */
function deriveStatus(consecutiveFailures: number): SourceHealthStatus {
  if (consecutiveFailures >= SOURCE_HEALTH_DOWN_THRESHOLD) return 'down'
  if (consecutiveFailures >= SOURCE_HEALTH_DEGRADED_THRESHOLD) return 'degraded'
  return 'healthy'
}

/**
 * Calculate backoff time for down sources.
 */
function calculateBackoff(consecutiveFailures: number): string | null {
  if (consecutiveFailures < SOURCE_HEALTH_DOWN_THRESHOLD) return null

  const backoffMs = Math.min(
    SOURCE_HEALTH_BACKOFF_BASE_MS * consecutiveFailures,
    SOURCE_HEALTH_BACKOFF_MAX_MS
  )

  return new Date(Date.now() + backoffMs).toISOString()
}

/**
 * Update source health records after a fetch cycle.
 * Upserts results to the source_health table.
 */
export async function updateSourceHealth(
  results: FetchResult[]
): Promise<void> {
  if (results.length === 0) return

  const supabase = createPipelineClient()

  for (const result of results) {
    try {
      // Fetch current state
      const { data: current } = await supabase
        .from('source_health')
        .select('consecutive_failures, avg_items_per_cycle')
        .eq('source_id', result.sourceId)
        .single()

      const prevFailures = current?.consecutive_failures ?? 0
      const prevAvg = current?.avg_items_per_cycle ?? 0

      const isSuccess = result.error === null && result.articleCount >= 0
      const consecutiveFailures = isSuccess ? 0 : prevFailures + 1
      const status = deriveStatus(consecutiveFailures)

      // Rolling average of items per cycle (only on success)
      const avgItems = isSuccess
        ? prevAvg === 0
          ? result.articleCount
          : prevAvg * 0.7 + result.articleCount * 0.3
        : prevAvg

      const record = {
        source_id: result.sourceId,
        last_success_at: isSuccess ? result.fetchedAt : undefined,
        last_error_at: isSuccess ? undefined : result.fetchedAt,
        consecutive_failures: consecutiveFailures,
        last_http_status: result.httpStatus,
        avg_items_per_cycle: avgItems,
        status,
        backoff_until: calculateBackoff(consecutiveFailures),
      }

      // Remove undefined fields
      const cleanRecord = Object.fromEntries(
        Object.entries(record).filter(([, v]) => v !== undefined)
      )

      await supabase
        .from('source_health')
        .upsert(cleanRecord, { onConflict: 'source_id' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(
        `[source-health] Failed to update ${result.sourceName}: ${message}`
      )
    }
  }

  console.log(`[source-health] Updated ${results.length} source health records`)
}

/**
 * Check which sources should be skipped due to backoff.
 * Returns a set of source IDs that are currently backed off.
 */
export async function getBackedOffSources(): Promise<Set<string>> {
  const supabase = createPipelineClient()

  const { data } = await supabase
    .from('source_health')
    .select('source_id, backoff_until')
    .eq('status', 'down')

  const backedOff = new Set<string>()
  const now = new Date()

  for (const row of data ?? []) {
    if (row.backoff_until && new Date(row.backoff_until) > now) {
      backedOff.add(row.source_id)
    }
  }

  if (backedOff.size > 0) {
    console.log(
      `[source-health] ${backedOff.size} sources backed off (skipping)`
    )
  }

  return backedOff
}
