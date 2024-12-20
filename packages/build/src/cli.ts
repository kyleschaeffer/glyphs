#!/usr/bin/env bun
import chalk from 'chalk'
import { BuildOptions } from 'esbuild'
import fs from 'fs'
import path from 'path'
import build, { GlyphsBuildOptions } from './build'

const watch = process.argv.includes('--watch') || process.argv.includes('-w')
const types = process.argv.includes('--types') || process.argv.includes('-t')

let copy: GlyphsBuildOptions['copy'] = undefined

type ArgValue = string | string[] | boolean | undefined

function parseOptions(): BuildOptions {
  const options: { [key: string]: ArgValue } = {}

  process.argv.forEach((arg) => {
    if (arg === '--watch' || arg === '-w' || arg === '--types' || arg === '-t') return

    const match = arg.match(/--(\w+)(?:=(.*))?/)
    if (!match) return

    const [, key, value] = match
    if (!key) return

    let option: ArgValue = value

    if (value === undefined || value === 'true') {
      option = true
    } else if (value === 'false') {
      option = false
    } else if (value.startsWith('{')) {
      try {
        option = JSON.parse(value)
      } catch (e) {
        console.warn('Failed to parse JSON:', e instanceof Error ? e.message : e)
      }
    } else if (value.includes(',')) {
      option = value.split(',').filter(Boolean)
    }

    if (key === 'copy' && Array.isArray(option)) {
      const [source, dest] = option
      if (source && dest) {
        copy = [...(copy ?? []), { source, dest }]
      }
    } else {
      options[key] = option
    }
  })

  return options
}

const options = parseOptions()

async function main() {
  await build(options, { copy, types })
}

await main()

if (watch) {
  console.log('Watching for changes…')

  const cwd = process.cwd()

  const watcher = fs.watch(path.join(cwd, 'src'), { recursive: true }, (event, file) => {
    console.log(`File ${chalk.green(`/src/${file}`)} ${event}d`)
    void build(options, { copy, types })
  })

  process.on('SIGINT', () => {
    watcher.close()
    process.exit(0)
  })
}
