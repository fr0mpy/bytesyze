'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { JsonViewStyles as S } from './styles'

// ============================================================================
// Types
// ============================================================================

type JsonValue = string | number | boolean | null | JsonObject | JsonArray
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[]

export interface JsonViewProps {
  /** JSON data to display (object, array, or primitive) */
  data: unknown
  /** Optional label above the JSON */
  label?: string
  /** Initial expand depth (default: 2) */
  defaultExpandDepth?: number
  /** Show line numbers (default: false) */
  showLineNumbers?: boolean
  /** Maximum height with scroll (default: '400px') */
  maxHeight?: string
  /** Additional className for container */
  className?: string
}

interface JsonNodeProps {
  value: JsonValue
  depth: number
  expandDepth: number
  isLast: boolean
}

interface JsonKeyProps {
  keyName: string
  children: ReactNode
}

// ============================================================================
// Collapsible Bracket
// ============================================================================

function CollapsibleBracket({
  isArray,
  items,
  depth,
  expandDepth,
}: {
  isArray: boolean
  items: [string, JsonValue][] | JsonValue[]
  depth: number
  expandDepth: number
}) {
  const [isExpanded, setIsExpanded] = useState(depth < expandDepth)
  const openBracket = isArray ? '[' : '{'
  const closeBracket = isArray ? ']' : '}'
  const isEmpty = items.length === 0

  if (isEmpty) {
    return (
      <span className={S.bracket}>
        {openBracket}{closeBracket}
      </span>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={S.collapseButton}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        <ChevronRight className={cn(S.chevron, isExpanded && S.chevronExpanded)} />
      </button>
      <span className={S.bracket}>{openBracket}</span>
      {isExpanded ? (
        <>
          <div className={S.nested}>
            {isArray
              ? (items as JsonValue[]).map((item, index) => (
                <div key={index} className={S.line}>
                  <JsonNode
                    value={item}
                    depth={depth + 1}
                    expandDepth={expandDepth}
                    isLast={index === items.length - 1}
                  />
                </div>
              ))
              : (items as [string, JsonValue][]).map(([key, val], index) => (
                <div key={key} className={S.line}>
                  <JsonKey keyName={key}>
                    <JsonNode
                      value={val}
                      depth={depth + 1}
                      expandDepth={expandDepth}
                      isLast={index === items.length - 1}
                    />
                  </JsonKey>
                </div>
              ))}
          </div>
          <span className={S.bracket}>{closeBracket}</span>
        </>
      ) : (
        <>
          <span className={S.collapsed}>
            {isArray ? `${items.length} items` : `${items.length} keys`}
          </span>
          <span className={S.bracket}>{closeBracket}</span>
        </>
      )}
    </>
  )
}

// ============================================================================
// JSON Key (with colon)
// ============================================================================

function JsonKey({ keyName, children }: JsonKeyProps) {
  return (
    <>
      <span className={S.key}>&quot;{keyName}&quot;</span>
      <span className={S.colon}>: </span>
      {children}
    </>
  )
}

// ============================================================================
// JSON Node (recursive renderer)
// ============================================================================

function JsonNode({ value, depth, expandDepth, isLast }: JsonNodeProps) {
  const comma = isLast ? '' : ','

  // Null
  if (value === null) {
    return (
      <>
        <span className={S.null}>null</span>
        {comma}
      </>
    )
  }

  // String
  if (typeof value === 'string') {
    return (
      <>
        <span className={S.string}>&quot;{value}&quot;</span>
        {comma}
      </>
    )
  }

  // Number
  if (typeof value === 'number') {
    return (
      <>
        <span className={S.number}>{value}</span>
        {comma}
      </>
    )
  }

  // Boolean
  if (typeof value === 'boolean') {
    return (
      <>
        <span className={S.boolean}>{value ? 'true' : 'false'}</span>
        {comma}
      </>
    )
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <>
        <CollapsibleBracket
          isArray
          items={value}
          depth={depth}
          expandDepth={expandDepth}
        />
        {comma}
      </>
    )
  }

  // Object
  if (typeof value === 'object') {
    const entries = Object.entries(value)
    return (
      <>
        <CollapsibleBracket
          isArray={false}
          items={entries}
          depth={depth}
          expandDepth={expandDepth}
        />
        {comma}
      </>
    )
  }

  // Fallback for unknown types
  return (
    <>
      <span className={S.unknown}>{String(value)}</span>
      {comma}
    </>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function JsonView({
  data,
  label,
  defaultExpandDepth = 2,
  showLineNumbers = false,
  maxHeight = '400px',
  className,
}: JsonViewProps) {
  const parsedData = useMemo(() => {
    if (data === null || data === undefined) {
      return null
    }

    if (typeof data === 'string') {
      try {
        return JSON.parse(data)
      } catch {
        return data // Return as-is if not valid JSON
      }
    }

    return data
  }, [data])

  if (parsedData === null || parsedData === undefined) {
    return null
  }

  return (
    <div className={cn(S.container, className)} style={{ maxHeight }}>
      {label && <div className={S.label}>{label}</div>}
      <pre className={cn(S.content, showLineNumbers && S.withLineNumbers)}>
        <code>
          <JsonNode
            value={parsedData as JsonValue}
            depth={0}
            expandDepth={defaultExpandDepth}
            isLast
          />
        </code>
      </pre>
    </div>
  )
}
