import { Component, For } from 'solid-js'
import { search } from '../store'

export const Results: Component = () => {
  return (
    <ul class="results">
      {!search.state.loading && search.state.query.length && !search.state.results.length && (
        <li class="empty">
          No results for <b>{search.state.query}</b>
        </li>
      )}
      <For each={search.state.results}>
        {(glyph) => (
          <li>
            <button class="result" onClick={() => search.setSelected(glyph)}>
              <span class="result-glyph">{glyph.c}</span>
            </button>
          </li>
        )}
      </For>
    </ul>
  )
}
