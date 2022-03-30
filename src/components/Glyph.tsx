import { Component } from 'solid-js'
import {
  decimalToHtml,
  escapeQuotes,
  glyphDescription,
  glyphName,
  hexesToJs,
  hexesToUnicodeEscapeSequence,
  hexToCss,
  hexToHtml,
  hexToJs,
  trimHex,
} from '../core/convert'
import { search } from '../store'

export const Glyph: Component = () => {
  const glyph = search.state.selected
  if (!glyph) return null

  const name = glyphName(glyph.n)
  const description = glyphDescription(glyph.n, glyph.k)

  return (
    <article>
      <button onClick={() => search.setSelected(null)}>❌</button>
      <h1 style={{ 'text-transform': 'uppercase' }}>{name}</h1>
      <h2 style={{ 'font-size': '128px', 'line-height': '1', margin: '0' }}>{glyph.c}</h2>
      {description && <h3>{description}</h3>}

      <h4>JavaScript:</h4>
      <pre>let s = '{escapeQuotes(glyph.c)}';</pre>
      <pre>let s = '{hexesToUnicodeEscapeSequence(glyph.h)}';</pre>
      <pre>let s = String.fromCharCode({hexesToJs(glyph.h)});</pre>

      <h4>HTML:</h4>
      <pre>&lt;span&gt;{glyph.c}&lt;/span&gt;</pre>
      <pre>&lt;span&gt;&amp;{decimalToHtml(glyph.d)};&lt;/span&gt;</pre>
      <pre>&lt;span&gt;&amp;{hexToHtml(glyph.u)};&lt;/span&gt;</pre>
      {glyph.e?.split(' ').map((e) => (
        <pre>&lt;span&gt;&amp;{e};&lt;/span&gt;</pre>
      ))}

      <h4>CSS:</h4>
      <pre>content: '{glyph.c}';</pre>
      <pre>content: '{hexToCss(glyph.u)}';</pre>

      <h4>Unicode:</h4>
      <pre>U+{trimHex(glyph.u)}</pre>
      <pre>
        <b>UTF-32:</b> {hexToJs(glyph.u)}
      </pre>
      <pre>
        <b>UTF-16:</b> {hexesToJs(glyph.h, ' ')}
      </pre>
      <pre>
        <b>Decimal:</b> {glyph.d}
      </pre>
      {glyph.v && (
        <pre>
          <b>Version:</b> {glyph.v}
        </pre>
      )}
    </article>
  )
}
