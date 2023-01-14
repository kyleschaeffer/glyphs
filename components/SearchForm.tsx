import { ChangeEvent, useCallback } from 'react'
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

  const clear = useCallback(() => setQuery(''), [setQuery])

  return (
    <div className="search">
      <input className="input" type="text" value={query} onChange={handleQueryChange} />
      {!loading && !!query && (
        <button className="clear" onClick={clear}>
          ╳
        </button>
      )}
      {loading && <div className="loading">◌</div>}
    </div>
  )
}
