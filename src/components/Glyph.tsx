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
} from '../core/convert'
import { search } from '../store'
import { Linkify } from './Linkify'

const HTML_RESERVED_CHARACTERS = ['&', '<', '>', '"']

export const Glyph: Component = () => {
  const glyph = search.state.selected
  if (!glyph) return null

  const name = glyphName(glyph.n)
  const description = glyphDescription(glyph.n, glyph.k)
  const complexGlyph = glyph.c.length > 2

  return (
    <article>
      <button onClick={() => search.setSelected(null)}>&#x2573;</button>
      <h1 style={{ 'text-transform': 'uppercase' }}>
        <Linkify phrase={name} />
      </h1>
      <h2 style={{ 'font-size': '128px', 'line-height': '1', margin: '0' }}>{glyph.c}</h2>
      {description && (
        <h3>
          <Linkify phrase={description} />
        </h3>
      )}

      <h4>JavaScript:</h4>
      <pre>
        '<b>{escapeQuotes(glyph.c)}</b>'
      </pre>
      <pre>
        '<b>{hexesToUnicodeEscapeSequence(glyph.h)}</b>'
      </pre>
      <pre>
        String.fromCharCode(<b>{hexesToJs(glyph.h)}</b>)
      </pre>

      <h4>HTML:</h4>
      {!HTML_RESERVED_CHARACTERS.includes(glyph.c) && (
        <pre>
          &lt;b&gt;<b>{glyph.c}</b>&lt;/b&gt;
        </pre>
      )}
      {!complexGlyph && (
        <>
          {glyph.e?.split(' ').map((e) => (
            <pre>
              &lt;b&gt;<b>&amp;{e};</b>&lt;/b&gt;
            </pre>
          ))}
          <pre>
            &lt;b&gt;&amp;<b>{decimalToHtml(glyph.d)}</b>;&lt;/b&gt;
          </pre>
          <pre>
            &lt;b&gt;&amp;<b>{hexToHtml(glyph.u)}</b>;&lt;/b&gt;
          </pre>
        </>
      )}

      <h4>CSS:</h4>
      <pre>
        content: '<b>{glyph.c}</b>';
      </pre>
      {!complexGlyph && (
        <pre>
          content: '<b>{hexToCss(glyph.u)}</b>';
        </pre>
      )}

      <h4>Unicode:</h4>
      <dl>
        {!complexGlyph && (
          <>
            <dt>Reference</dt>
            <dd>
              <code>U+{glyph.u}</code>
            </dd>
            <dt>Decimal</dt>
            <dd>
              <code>{glyph.d}</code>
            </dd>
            <dt>UTF-32</dt>
            <dd>
              <code>{hexToJs(glyph.u.padStart(8, '0'))}</code>
            </dd>
          </>
        )}
        <dt>UTF-16</dt>
        <dd>
          <code>{hexesToJs(glyph.h, ' ')}</code>
        </dd>
        {glyph.g && (
          <>
            <dt>Block</dt>
            <dd>
              <Linkify phrase={glyph.g} />
            </dd>
          </>
        )}
        {glyph.v && (
          <>
            <dt>Version</dt>
            <dd>
              <code>{glyph.v}</code>
            </dd>
          </>
        )}
      </dl>
    </article>
  )
}
