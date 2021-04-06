import React from 'react'
import { useContext } from 'react'

import { SearchContext } from '../controllers/SearchController'

export const SearchForm: React.FC = () => {
  const { query, setQuery } = useContext(SearchContext)

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.currentTarget.value)}
      autoComplete="none"
      autoFocus
    />
  )
}
