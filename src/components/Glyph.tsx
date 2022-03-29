import { Component } from 'solid-js'
import { search } from '../store'

export const Glyph: Component = () => {
  const glyph = search.state.selected
  if (!glyph) return null

  return (
    <article>
      <button onClick={() => search.setSelected(null)}>❌</button>
      <h1>{glyph.n}</h1>
      <h2>{glyph.c}</h2>
      {glyph.k && <div>{glyph.k}</div>}
      {glyph.e && <div>{glyph.e}</div>}
      <div>{glyph.u}</div>
      <div>{glyph.h}</div>
    </article>
  )
}
