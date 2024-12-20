import buildConfig from '@glyphs/config/esbuild-base'
import chalk from 'chalk'
import esbuild, { BuildOptions } from 'esbuild'
import fs from 'fs'
import path from 'path'
import tscPlugin from './esbuild-plugin-tsc'
import { copyFolder } from './file'

export type FolderCopyDefinition = { source: string; dest: string }

export type GlyphsBuildOptions = {
  copy?: FolderCopyDefinition[]
  types?: boolean
}

export default async function build(options: BuildOptions = {}, { copy, types }: GlyphsBuildOptions = {}) {
  const cwd = process.cwd()

  console.log(`Build ${chalk.blue(`/${path.basename(cwd)}`)}`)

  if (copy) {
    for (const { source, dest } of copy) {
      await copyFolder(path.join(cwd, source), path.join(cwd, dest), { recursive: true })
    }
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json')).toString())

  return await esbuild.build({
    ...buildConfig,
    entryPoints: [path.join(cwd, 'src/index.ts')],
    external: [...Object.keys(packageJson.peerDependencies ?? {})].filter(Boolean),
    outdir: path.join(cwd, 'dist'),
    plugins: [...(buildConfig.plugins ?? []), ...(types ? [tscPlugin] : [])],
    target: ['chrome106', 'edge106', 'firefox110', 'safari16'],
    ...options,
  })
}
