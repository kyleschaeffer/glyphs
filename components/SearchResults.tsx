import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { glyphRoute } from '../core/glyph'
import { useAppStore } from '../store/app'
import type { Glyph } from '../store/types'
import { useLoading } from './hooks/useLoading'

export function SearchResults() {
  const query = useAppStore((store) => store.query)
  const scrollPosition = useAppStore((store) => store.scrollPosition)
  const results = useAppStore((store) => store.results)
  const loading = useLoading()

  useEffect(() => {
    if (scrollPosition === null || !document.scrollingElement) return
    document.scrollingElement.scrollTop = scrollPosition
  }, [scrollPosition])

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
  const setScrollPosition = useAppStore((store) => store.setScrollPosition)
  const select = useCallback(() => {
    setScrollPosition(document.scrollingElement?.scrollTop ?? null)
    router.push(glyphRoute(glyph.c))
  }, [glyph, setScrollPosition, router])

  return (
    <button className="result" onClick={select}>
      {glyph.c}
    </button>
  )
}
