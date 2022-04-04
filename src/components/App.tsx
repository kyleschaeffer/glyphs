import type { Component } from 'solid-js'
import { search } from '../store'
import { Glyph } from './Glyph'
import { GlyphsProvider } from './GlyphsProvider'
import { Search } from './Search'
import { SearchProvider } from './SearchProvider'

export const App: Component = () => {
  return (
    <>
      <GlyphsProvider />
      <SearchProvider />
      {!search.state.selected && <Search />}
      {search.state.selected && <Glyph />}
    </>
  )
}
