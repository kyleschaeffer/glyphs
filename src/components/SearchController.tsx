import React, { useMemo, useState } from 'react'

export type SearchState = {
  query: string
  setQuery: (newQuery: string) => void
}

export const SearchContext = React.createContext<SearchState>({
  query: '',
  setQuery: () => null,
})

export const SearchController: React.FC = ({ children }) => {
  const [query, setQuery] = useState('')

  const state = useMemo<SearchState>(
    () => ({
      query,
      setQuery,
    }),
    [query]
  )

  return <SearchContext.Provider value={state}>{children}</SearchContext.Provider>
}
