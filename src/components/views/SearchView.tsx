import React from 'react'

import { SearchForm } from '../search/SearchForm'
import { SearchResults } from '../search/SearchResults'

export const SearchView: React.FC = () => {
  return (
    <div>
      <h1>Search</h1>
      <SearchForm />
      <SearchResults />
    </div>
  )
}
