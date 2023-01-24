import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useRef } from 'react'
import { z } from 'zod'
import { bindStyles } from '../core/browser'
import { useAppStore } from '../store/app'
import { useLoading } from './hooks/useLoading'
import styles from './SearchForm.module.scss'

const cx = bindStyles(styles)

export function SearchForm() {
  const router = useRouter()
  const loading = useLoading()
  const query = useAppStore((store) => store.query)
  const setQuery = useAppStore((store) => store.setQuery)

  const handleQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.currentTarget.value)
      document.scrollingElement?.scrollTo(0, 0)
    },
    [setQuery]
  )

  const loadedQuery = useRef(false)
  useEffect(() => {
    if (loadedQuery.current || !router.isReady) return
    const q = z.string().optional().parse(router.query.q)
    if (q && query !== q) {
      setQuery(q)
    }
    loadedQuery.current = true
  }, [query, router.isReady, router.query, setQuery])

  const routeTimer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    clearTimeout(routeTimer.current)
    if (loading || router.query.q === query) return

    routeTimer.current = setTimeout(() => {
      router.replace(!query ? '/' : `?q=${encodeURIComponent(query)}`)
    }, 500)

    return () => clearTimeout(routeTimer.current)
  }, [loading, query, router])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setQuery])

  const clear = useCallback(() => setQuery(''), [setQuery])

  return (
    <div className={cx('search')}>
      <input className={cx('input')} type="text" value={query} onChange={handleQueryChange} maxLength={128} />
      {!loading && !!query && (
        <button className={cx('input-addon', 'clear')} onClick={clear} title="Clear (⎋)">
          ✗
        </button>
      )}
      {loading && <div className={cx('input-addon', 'loading')}>◌</div>}
    </div>
  )
}
