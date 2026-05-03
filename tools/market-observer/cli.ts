#!/usr/bin/env bun
/**
 * CLI entry-point for the market-observer classifier.
 *
 * Usage:
 *   bun run tools/market-observer/cli.ts [--input <path>] [--output <path>]
 *
 * Flags:
 *   --input  <path>   Path to a JSON file containing Listing[]. Defaults to stdin.
 *   --output <path>   Path to write ClassifyOutput JSON. Defaults to stdout.
 *   --query  <str>    Query label embedded in output metadata. Default: "(unknown)".
 *
 * Examples:
 *   # Pipe from another tool
 *   bun run tools/market-observer/index.ts | bun run tools/market-observer/cli.ts
 *
 *   # File-to-file
 *   bun run tools/market-observer/cli.ts \
 *     --input  data/listings.json \
 *     --output snapshots/latest.json \
 *     --query  "Sony WH-1000XM5"
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { classify } from './core/classify'
import type { Listing } from './core/types'

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {}
  for (let i = 0; i < argv.length - 1; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1]
    }
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  // Read input
  let raw: string
  if (args.input) {
    raw = readFileSync(args.input, 'utf8')
  } else {
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer)
    }
    raw = Buffer.concat(chunks).toString('utf8')
  }

  let listings: Listing[]
  try {
    listings = JSON.parse(raw.trim() || '[]')
  } catch {
    console.error('[market-observer/cli] Failed to parse input JSON')
    process.exit(1)
  }

  const query = args.query ?? '(unknown)'
  const output = classify(query, listings)
  const json = JSON.stringify(output, null, 2)

  // Write output
  if (args.output) {
    mkdirSync(dirname(args.output), { recursive: true })
    writeFileSync(args.output, json, 'utf8')
    console.error(
      `[market-observer/cli] Written ${output.meta.totalListings} listings → ${args.output}`,
    )
  } else {
    process.stdout.write(json + '\n')
  }
}

main().catch((err) => {
  console.error('[market-observer/cli] Fatal:', err)
  process.exit(1)
})
