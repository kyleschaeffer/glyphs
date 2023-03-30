import Head from 'next/head'
import { useScrollAfterLoading } from '../hooks/useScroll'
import { useAppStore } from '../store/app'
import { GlyphFeed } from './GlyphFeed'

export function SearchResults() {
  const query = useAppStore((store) => store.query)
  const results = useAppStore((store) => store.results)
  const loading = useAppStore((store) => store.debouncingQuery || store.loadingResults)
  useScrollAfterLoading(loading)

  if (!loading && !results.length) return <div>No results</div>
  if (!results.length) return null

  return (
    <>
      <Head>
        <title>Search: {query}</title>
      </Head>
      <GlyphFeed glyphs={results} />
    </>
  )
}
