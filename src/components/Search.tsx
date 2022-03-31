import { Component } from 'solid-js'
import { UNICODE_VERSION, UNICODE_VERSION_SHORT } from '../config'
import { glyphs, search } from '../store'
import { Results } from './Results'

export const Search: Component = () => {
  return (
    <>
      <header class="head">
        <h1 class="brand">
          <img class="logo" src="favicon.svg" alt="Glyphs" />
          <span>Glyphs</span>
        </h1>
        <div class="search-bar">
          <input
            class="search-input"
            type="text"
            value={search.state.query}
            onInput={(e) => search.setQuery(e.currentTarget.value)}
            placeholder="Enter a character or search keywords&hellip;"
          />
          {!search.state.query.length && (
            <button class="search-btn" onClick={() => search.selectRandom()}>
              🎲
            </button>
          )}
          {search.state.query.length && (
            <button class="search-btn close" onClick={() => search.setQuery('')}>
              &#x2573;
            </button>
          )}
        </div>
        {search.state.idle && (
          <div class="stats">
            {glyphs.state.loading && <div>Loading&hellip;</div>}
            {!glyphs.state.loading && (
              <>
                <div>
                  Searching <b>{glyphs.state.count}</b> glyphs in{' '}
                  <a
                    href={`https://www.unicode.org/versions/Unicode${UNICODE_VERSION}/`}
                    target="_blank"
                    rel="nofollow"
                  >
                    Unicode {UNICODE_VERSION_SHORT}
                  </a>
                </div>
              </>
            )}
          </div>
        )}
      </header>
      <Results />
    </>
  )
}
