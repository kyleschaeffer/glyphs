import { Component, onMount } from 'solid-js'
import { glyphs } from '../store'

export const GlyphsProvider: Component = () => {
  onMount(async () => {
    await glyphs.loadGlyphs()
  })

  return (
    <>
      {glyphs.state.error && (
        <div>
          <b>Unable to load glyphs data:</b> {glyphs.state.error}
        </div>
      )}
    </>
  )
}
