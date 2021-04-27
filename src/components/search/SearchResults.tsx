import React from 'react'

import { useSelector } from '../hooks/useSelector'

export const SearchResults: React.FC = () => {
  const glyphs = useSelector((state) => state.glyphs)
  const query = useSelector((state) => state.query)
  const results = useSelector((state) => state.results)

  if (!query) {
    return null
  }

  if (!results.length) {
    return (
      <div>
        Nothing found for: <strong>{query}</strong>
      </div>
    )
  }

  return (
    <div>
      {results.map((char) => {
        const glyph = glyphs.get(char)
        if (!glyph) return null

        return (
          <div key={glyph.u}>
            <div>{char}</div>
            <pre>{JSON.stringify(glyph, null, 2)}</pre>
          </div>
        )
      })}
    </div>
  )
}
