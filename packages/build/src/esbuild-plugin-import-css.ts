import { Plugin } from 'esbuild'
import fs from 'fs'

const plugin: Plugin = {
  name: 'esbuild-plugin-import-css',
  setup: (build) => {
    build.onLoad({ filter: /^.*\.css$/ }, async (args) => {
      const cssContent = await fs.promises.readFile(args.path, 'utf8')
      console.log(cssContent)
      return null
    })
  },
}

export default plugin
