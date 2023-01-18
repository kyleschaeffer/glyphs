import { ChangeEvent, useCallback, useEffect } from 'react'
import { useAppStore } from '../store/app'
import { useLoading } from './hooks/useLoading'

export function SearchForm() {
  const loading = useLoading()
  const query = useAppStore((store) => store.query)
  const setQuery = useAppStore((store) => store.setQuery)

  const handleQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value),
    [setQuery]
  )

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
    <div className="search">
      <input className="input" type="text" value={query} onChange={handleQueryChange} />
      {!loading && !!query && (
        <button className="input-addon clear" onClick={clear}>
          ✗
        </button>
      )}
      {loading && <div className="input-addon loading">◌</div>}
    </div>
  )
}
