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

      <h3>HTML:</h3>
      <pre>&lt;span&gt;{glyph.c}&lt;/span&gt;</pre>
      {glyph.e?.split(' ').map((e) => (
        <pre>&lt;span&gt;&amp;{e};&lt;/span&gt;</pre>
      ))}

      <h3>CSS:</h3>
      <pre>content: '{glyph.c}';</pre>
      {glyph.h.split(' ').length === 1 && <pre>content: '\\{glyph.h.replace(/'/g, "\\'")}';</pre>}

      <h3>JavaScript:</h3>
      <pre>let s = "{JSON.stringify(glyph.c).slice(1, -1)}";</pre>
      <pre>
        let s = "
        {glyph.h
          .split(' ')
          .map((h) => `\\u${h}`)
          .join('')}
        ";
      </pre>

      <h3>Decimal:</h3>
      <pre>
        {glyph.u
          .split(' ')
          .map((u) => parseInt(u, 16).toString())
          .join(' ')}
      </pre>

      <h3>Hexadecimal:</h3>
      <pre>{glyph.h}</pre>
    </article>
  )
}
