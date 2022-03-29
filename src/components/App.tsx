import type { Component } from 'solid-js'
import { search } from '../store'
import { Glyph } from './Glyph'
import { GlyphsLoader } from './GlyphsLoader'
import { Search } from './Search'

export const App: Component = () => {
  return (
    <>
      <GlyphsLoader />
      {!search.state.selected && <Search />}
      {search.state.selected && <Glyph />}
    </>
  )
}
