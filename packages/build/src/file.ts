import fs from 'fs'
import path from 'path'

export function ensureDir(dir: string): void {
  if (fs.existsSync(dir)) return
  fs.mkdirSync(dir, { recursive: true })
}

export function cleanDir(dir: string): void {
  if (!fs.existsSync(dir)) return
  fs.rmSync(dir, { force: true, recursive: true })
  fs.mkdirSync(dir, { recursive: true })
}

export type FileInfo = {
  dir: boolean
  ext: string
  name: string
  path: string
  slug: string
}

export type ForEachFileOptions = {
  predicate?: (file: FileInfo) => boolean
  recursive?: boolean
}

export async function forEachFile(
  dir: string,
  callback: (file: FileInfo) => void | Promise<void>,
  options: ForEachFileOptions = {}
): Promise<void> {
  const files = fs.readdirSync(dir).sort()
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.resolve(dir, file)
      const ext = path.extname(file)
      const stat = fs.statSync(filePath)

      const info: FileInfo = {
        dir: stat.isDirectory(),
        ext,
        name: file,
        path: filePath,
        slug: path.basename(file, ext),
      }

      if (options.predicate?.(info) === false) return

      await callback(info)

      if (info.dir && options.recursive !== false) {
        await forEachFile(filePath, callback, options)
      }
    })
  )
}

export type CopyFolderOptions = {
  onFile?: (file: FileInfo) => void
  predicate?: (file: FileInfo) => boolean
  recursive?: boolean
}

export async function copyFolder(sourceDir: string, destDir: string, options: CopyFolderOptions = {}): Promise<void> {
  ensureDir(destDir)
  await forEachFile(
    sourceDir,
    async (file) => {
      if (file.dir) {
        if (options?.recursive === false) return
        await copyFolder(file.path, path.resolve(destDir, file.name), options)
      } else {
        options.onFile?.(file)
        fs.copyFileSync(file.path, path.resolve(destDir, file.name))
      }
    },
    {
      predicate: options.predicate,
      recursive: false,
    }
  )
}
