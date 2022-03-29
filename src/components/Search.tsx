import { Component } from 'solid-js'
import { UNICODE_VERSION, UNICODE_VERSION_SHORT } from '../config'
import { glyphs, search } from '../store'
import { Results } from './Results'

export const Search: Component = () => {
  return (
    <>
      <h1>Glyphs</h1>
      <div>
        <input type="search" value={search.state.query} onInput={(e) => search.setQuery(e.currentTarget.value)} />
      </div>
      {search.state.idle && (
        <div>
          {glyphs.state.loading && <div>Loading&hellip;</div>}
          {!glyphs.state.loading && (
            <>
              <div>
                Searching <b>{glyphs.state.count}</b> glyphs in{' '}
                <a href={`https://www.unicode.org/versions/Unicode${UNICODE_VERSION}/`} target="_blank" rel="nofollow">
                  Unicode {UNICODE_VERSION_SHORT}
                </a>
              </div>
              <div>
                <button onClick={() => search.selectRandom()}>🎲</button>
              </div>
            </>
          )}
        </div>
      )}
      <Results />
    </>
  )
}
