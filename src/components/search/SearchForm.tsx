import React, { useContext } from 'react'

import { setQuery } from '../../store/actions'
import { GlyphsContext } from '../controllers/GlyphsController'

export const SearchForm: React.FC = () => {
  const [{ query }, dispatch] = useContext(GlyphsContext)

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => dispatch(setQuery(e.currentTarget.value))}
      autoComplete="none"
      autoFocus
    />
  )
}
