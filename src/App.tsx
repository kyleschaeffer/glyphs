import React from 'react'

import { SearchController } from './components/SearchController'
import { SearchForm } from './components/SearchForm'

export const App: React.FC = () => (
  <SearchController>
    <SearchForm />
  </SearchController>
)
