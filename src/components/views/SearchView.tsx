import React from 'react'

import { LoadingBar } from '../glyphs/LoadingBar'
import { SearchForm } from '../search/SearchForm'

export const SearchView: React.FC = () => {
  return (
    <div>
      <LoadingBar />
      <SearchForm />
    </div>
  )
}
