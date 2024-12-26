import { ChangeEvent, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAppStore } from '../store/app'
import { bindStyles } from '../utils/browser'
import styles from './SearchForm.module.css'

const cx = bindStyles(styles)

export function SearchForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const loading = useAppStore((store) => store.debouncingQuery || store.loadingResults)
  const query = useAppStore((store) => store.query)
  const setQuery = useAppStore((store) => store.setQuery)

  const handleQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.currentTarget.value)
      searchParams.set('q', e.currentTarget.value)
      setSearchParams(searchParams)
      document.scrollingElement?.scrollTo(0, 0)
    },
    [searchParams, setQuery, setSearchParams]
  )

  const loadedQuery = useRef(false)
  useEffect(() => {
    if (loadedQuery.current) return
    const q = searchParams.get('q')
    if (q && query !== q) {
      setQuery(q)
    }
    loadedQuery.current = true
  }, [query, searchParams, setQuery])

  const routeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (routeTimer.current !== null) {
      clearTimeout(routeTimer.current)
    }
    if (loading || (searchParams.get('q') ?? '') === query) return

    routeTimer.current = setTimeout(() => {
      // router.replace(!query ? '/' : `?q=${encodeURIComponent(query)}`)
    }, 500)

    return () => {
      if (routeTimer.current !== null) {
        clearTimeout(routeTimer.current)
      }
    }
  }, [loading, query, searchParams])

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
      <input
        className={cx('input')}
        type="text"
        value={query}
        onChange={handleQueryChange}
        maxLength={128}
        placeholder="Enter a character or keywords"
      />
      {!loading && !!query && (
        <button className={cx('input-addon', 'clear')} onClick={clear} title="Clear (⎋)">
          ✗
        </button>
      )}
      {loading && (
        <div className={cx('input-addon', 'center')}>
          <div className={cx('loading')}>⎈</div>
        </div>
      )}
    </div>
  )
}
