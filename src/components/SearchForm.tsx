import { ChangeEvent, useCallback } from 'react'
import { useAppStore } from '../store/app'

export function SearchForm() {
  const loading = useAppStore((store) => store.loading)
  const query = useAppStore((store) => store.query)
  const ready = useAppStore((store) => store.ready)
  const setQuery = useAppStore((store) => store.setQuery)

  const handleQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value),
    [setQuery]
  )

  return (
    <div>
      <input type="search" value={query} onChange={handleQueryChange} />
      {(loading || !ready) && <div>Loading&hellip;</div>}
    </div>
  )
}
