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

  return (
    <div>
      <input type="search" value={query} onChange={handleQueryChange} />
      {loading && <span>🌀</span>}
    </div>
  )
}