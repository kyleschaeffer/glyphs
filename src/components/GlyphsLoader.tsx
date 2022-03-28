import { Component, createResource } from 'solid-js'
import { glyphs } from '../store'

export const GlyphsLoader: Component = () => {
  createResource(glyphs.loadGlyphs)

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
