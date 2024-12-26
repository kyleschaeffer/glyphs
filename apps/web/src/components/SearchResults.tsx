import { useAppStore } from '../store/app'
import { GlyphFeed } from './GlyphFeed'

export function SearchResults() {
  const results = useAppStore((store) => store.results)
  const loading = useAppStore((store) => store.debouncingQuery || store.loadingResults)

  if (!loading && !results.length) return <div>No results</div>
  if (!results.length) return null

  return (
    <>
      <GlyphFeed glyphs={results} />
    </>
  )
}
