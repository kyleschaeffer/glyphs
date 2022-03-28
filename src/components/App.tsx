import type { Component } from 'solid-js'
import { UNICODE_VERSION } from '../config'
import { glyphs } from '../store'
import { GlyphsLoader } from './GlyphsLoader'
import { Search } from './Search'

export const App: Component = () => {
  return (
    <>
      <GlyphsLoader />
      <h1>Glyphs</h1>
      {glyphs.state.loading && <div>Loading&hellip;</div>}
      {!glyphs.state.loading && (
        <div>
          Searching <b>{glyphs.state.count}</b> glyphs in{' '}
          <a href={`https://www.unicode.org/versions/Unicode${UNICODE_VERSION}/`} target="_blank" rel="nofollow">
            Unicode {UNICODE_VERSION}
          </a>
        </div>
      )}
      <Search />
    </>
  )
}
