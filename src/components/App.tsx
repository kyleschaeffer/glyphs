import { Component, onCleanup, onMount } from 'solid-js'
import { search } from '../store'
import { hydrateHash } from '../store/search'
import { Glyph } from './Glyph'
import { GlyphsLoader } from './GlyphsLoader'
import { Search } from './Search'

export const App: Component = () => {
  onMount(() => {
    const onHashChange = (e: HashChangeEvent) => hydrateHash(new URL(e.newURL).hash)
    window.addEventListener('hashchange', onHashChange)
    onCleanup(() => window.removeEventListener('hashchange', onHashChange))
  })

  return (
    <div style={{ 'font-family': 'system-ui' }}>
      <GlyphsLoader />
      {!search.state.selected && <Search />}
      {search.state.selected && <Glyph />}
    </div>
  )
}
