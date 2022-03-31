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

export const Glyph: Component = () => {
  const glyph = search.state.selected
  if (!glyph) return null

  const name = glyphName(glyph.n)
  const description = glyphDescription(glyph.n, glyph.k)
  const complexGlyph = glyph.c.length > 2

  return (
    <article>
      <button onClick={() => search.setSelected(null)}>&#x2573;</button>
      <h1 style={{ 'text-transform': 'uppercase' }}>{name}</h1>
      <h2 style={{ 'font-size': '128px', 'line-height': '1', margin: '0' }}>{glyph.c}</h2>
      {description && (
        <h3>
          {description.split(', ').map((term, i) => (
            <>
              {i > 0 ? ', ' : ''}
              <a href={`#q=${encodeURIComponent(term)}`}>{term}</a>
            </>
          ))}
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
      <pre>
        &lt;b&gt;<b>{glyph.c}</b>&lt;/b&gt;
      </pre>
      {!complexGlyph && (
        <>
          <pre>
            &lt;b&gt;&amp;<b>{decimalToHtml(glyph.d)}</b>;&lt;/b&gt;
          </pre>
          <pre>
            &lt;b&gt;&amp;<b>{hexToHtml(glyph.u)}</b>;&lt;/b&gt;
          </pre>
          {glyph.e?.split(' ').map((e) => (
            <pre>
              &lt;b&gt;<b>&amp;{e};</b>&lt;/b&gt;
            </pre>
          ))}
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
              <a href={`#q=${encodeURIComponent(glyph.g)}`}>{glyph.g}</a>
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
