import { useCallback } from 'react'
import { useAppStore } from '../store/app'
import type { Glyph } from '../store/types'
import { useLoading } from './hooks/useLoading'

export function SearchResults() {
  const results = useAppStore((store) => store.results)
  const loading = useLoading()

  if (!loading && !results.length) return <div>No results</div>
  if (!results.length) return null

  return (
    <ul className="results">
      {results.map((result) => (
        <li key={result.item.c}>
          <SearchResult glyph={result.item} />
        </li>
      ))}
    </ul>
  )
}

type SearchResultProps = {
  glyph: Glyph
}

export function SearchResult(props: SearchResultProps) {
  const { glyph } = props

  const setGlyph = useAppStore((store) => store.setGlyph)

  const select = useCallback(() => setGlyph(glyph), [glyph, setGlyph])

  return (
    <button className="result" onClick={select}>
      {glyph.c}
    </button>
  )
}
