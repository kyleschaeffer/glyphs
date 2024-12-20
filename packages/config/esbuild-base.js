import postCssPlugin from 'esbuild-postcss'

/** @type {import('esbuild').BuildOptions} */
export default {
  bundle: true,
  plugins: [postCssPlugin()],
}
