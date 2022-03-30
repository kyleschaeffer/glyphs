import { Component } from 'solid-js'
import { search } from '../store'

export const Results: Component = () => {
  return (
    <ul>
      {!search.state.loading && search.state.query.length && !search.state.results.length && (
        <li>
          No results for <b>{search.state.query}</b>
        </li>
      )}
      {search.state.results.map((glyph) => (
        <li>
          <button onClick={() => search.setSelected(glyph)} style={{ 'font-family': 'inherit' }}>
            <h3>{glyph.c}</h3>
          </button>
        </li>
      ))}
    </ul>
  )
}
