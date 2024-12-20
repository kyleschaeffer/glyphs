import { $ } from 'bun'
import { Plugin } from 'esbuild'

const plugin: Plugin = {
  name: 'esbuild-plugin-tsc',
  setup: (build) => {
    build.onEnd(async () => {
      try {
        await $`tsc`
      } catch (e) {
        console.error(e)
      }
    })
  },
}

export default plugin
