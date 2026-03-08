#!/usr/bin/env bash
# Prompt Cache Hook
# Triggers context classification every N prompts to avoid context bloat
# Counter resets on session start (see session-start.sh)

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

INTERVAL=3  # Run classification every N prompts

# ============================================================================
# FIND PROJECT ROOT
# ============================================================================

CLAUDE_DIR=""
CURRENT_DIR="$(pwd)"
while [[ "$CURRENT_DIR" != "/" ]]; do
  if [[ -d "$CURRENT_DIR/.claude" ]]; then
    CLAUDE_DIR="$CURRENT_DIR/.claude"
    break
  fi
  CURRENT_DIR="$(dirname "$CURRENT_DIR")"
done

[[ -z "$CLAUDE_DIR" ]] && exit 0

STATE_DIR="$CLAUDE_DIR/hooks"
STATE_FILE="$STATE_DIR/.prompt-state"
LOCK_FILE="$STATE_DIR/.prompt-lock"

mkdir -p "$STATE_DIR"

# ============================================================================
# ATOMIC INCREMENT
# ============================================================================

increment_counter() {
  local count=0

  # Read current count
  if [[ -f "$STATE_FILE" ]]; then
    count=$(cat "$STATE_FILE" 2>/dev/null || echo "0")
    if ! [[ "$count" =~ ^[0-9]+$ ]]; then
      count=0
    fi
  fi

  # Increment
  count=$((count + 1))

  # Write atomically
  local temp_file="$STATE_FILE.tmp.$$"
  echo "$count" > "$temp_file"
  mv "$temp_file" "$STATE_FILE"

  echo "$count"
}

# ============================================================================
# LOCKING (platform-specific)
# ============================================================================

if command -v flock &> /dev/null; then
  # Linux: use flock
  COUNT=$(flock -x "$LOCK_FILE" bash -c "$(declare -f increment_counter); increment_counter")
else
  # macOS: use mkdir as atomic lock
  LOCK_DIR="$LOCK_FILE.d"
  LOCK_ACQUIRED=false

  for _ in {1..10}; do
    if mkdir "$LOCK_DIR" 2>/dev/null; then
      LOCK_ACQUIRED=true
      break
    fi
    # Check for stale lock (>5 seconds old)
    if [[ -d "$LOCK_DIR" ]]; then
      lock_age=$(($(date +%s) - $(stat -f %m "$LOCK_DIR" 2>/dev/null || echo "0")))
      [[ $lock_age -gt 5 ]] && rm -rf "$LOCK_DIR" 2>/dev/null
    fi
    sleep 0.1
  done

  if [[ "$LOCK_ACQUIRED" == "true" ]]; then
    COUNT=$(increment_counter)
    rm -rf "$LOCK_DIR" 2>/dev/null || true
  else
    exit 0
  fi
fi

# ============================================================================
# OUTPUT (agent checks state file directly)
# ============================================================================

# Output current count for debugging (optional)
# echo "Prompt $COUNT"

exit 0
