import React from 'react'
import { useContext } from 'react'

import { SearchContext } from './SearchController'

export const SearchForm: React.FC = () => {
  const { query, setQuery } = useContext(SearchContext)

  return (
    <input type="text" autoFocus autoComplete="none" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
  )
}
