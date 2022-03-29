import { Component } from 'solid-js'
import { search } from '../store'

export const Glyph: Component = () => {
  const glyph = search.state.selected
  if (!glyph) return null

  return (
    <article>
      <button onClick={() => search.setSelected(null)}>❌</button>
      <h1
        title={glyph.k ? `${glyph.n.split(',')[0]}: ${glyph.k.split(',').join(', ')}` : undefined}
        style={{ 'text-transform': 'uppercase' }}
      >
        {glyph.n.split(',')[0]}
      </h1>
      <h2 style={{ 'font-size': '128px', 'line-height': '1', margin: '0' }}>{glyph.c}</h2>

      <h3>HTML:</h3>
      <pre>&lt;span&gt;{glyph.c}&lt;/span&gt;</pre>
      <pre>&lt;span&gt;&amp;#{parseInt(glyph.u, 16).toString()};&lt;/span&gt;</pre>
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
      {glyph.u.split(' ').length === 1 && <pre>let s = String.fromCharCode({parseInt(glyph.u, 16).toString()});</pre>}
      {glyph.h.split(' ').length === 1 && <pre>let s = String.fromCharCode(0x{glyph.h});</pre>}

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
