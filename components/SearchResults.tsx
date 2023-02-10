import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { bindStyles } from '../core/browser'
import { glyphRoute } from '../core/glyph'
import { useAppStore } from '../store/app'
import type { Glyph } from '../store/types'
import { useLoading } from './hooks/useLoading'
import styles from './SearchResults.module.scss'

const cx = bindStyles(styles)

export function SearchResults() {
  const query = useAppStore((store) => store.query)
  const scrollPosition = useAppStore((store) => store.scrollPosition)
  const results = useAppStore((store) => store.results)
  const loading = useLoading()

  useEffect(() => {
    if (scrollPosition === null) return
    document.scrollingElement?.scrollTo(0, scrollPosition)
  }, [scrollPosition])

  if (!loading && !results.length) return <div>No results</div>
  if (!results.length) return null

  return (
    <>
      <Head>
        <title>Search: {query}</title>
      </Head>
      <ul className={cx('results')}>
        {results.map((result) => (
          <li key={result.item.char}>
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
    router.push(glyphRoute(glyph.char))
  }, [glyph, setScrollPosition, router])

  return (
    <button className={cx('result')} onClick={select} title={`${glyph.char} ${glyph.name}`}>
      {glyph.char}
    </button>
  )
}
