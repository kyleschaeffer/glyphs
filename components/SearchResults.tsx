import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { glyphRoute } from '../core/glyph'
import { useAppStore } from '../store/app'
import type { Glyph } from '../store/types'
import { useLoading } from './hooks/useLoading'

export function SearchResults() {
  const query = useAppStore((store) => store.query)
  const results = useAppStore((store) => store.results)
  const loading = useLoading()

  if (!loading && !results.length) return <div>No results</div>
  if (!results.length) return null

  return (
    <>
      <Head>
        <title>Search: {query} — Glyphs</title>
      </Head>
      <ul className="results">
        {results.map((result) => (
          <li key={result.item.c}>
            <SearchResult glyph={result.item} />
          </li>
        ))}
      </ul>
    </>
  )
}

type SearchResultProps = {
  glyph: Glyph
}

export function SearchResult(props: SearchResultProps) {
  const { glyph } = props

  const router = useRouter()
  const select = useCallback(() => router.push(glyphRoute(glyph.c)), [glyph, router])

  return (
    <button className="result" onClick={select}>
      {glyph.c}
    </button>
  )
}
