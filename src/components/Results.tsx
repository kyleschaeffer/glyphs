import { Component, For } from 'solid-js'
import { search } from '../store'

export const Results: Component = () => {
  return (
    <ul>
      {!search.state.loading && search.state.query.length && !search.state.results.length && (
        <li>
          No results for <b>{search.state.query}</b>
        </li>
      )}
      <For each={search.state.results}>
        {(glyph) => (
          <li>
            <button onClick={() => search.setSelected(glyph)}>
              <h3>{glyph.c}</h3>
            </button>
          </li>
        )}
      </For>
    </ul>
  )
}
