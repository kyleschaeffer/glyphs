import { Component, For } from 'solid-js'
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
import { CopyButton } from './CopyButton'
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
      <h1 class="title">
        <Linkify phrase={name} />
        <button class="close" onClick={() => search.setSelected(null)}>
          &cross;
        </button>
      </h1>
      <h2 class="glyph-row">
        <CopyButton copyText={glyph.c} promptMessage="Copy glyph">
          <span class="glyph">{glyph.c}</span>
        </CopyButton>
      </h2>
      {description && (
        <h3 class="keywords">
          <Linkify phrase={description} />
        </h3>
      )}

      <div class="panels">
        <div class="panel">
          <h4>JavaScript</h4>
          <pre>
            '<CopyButton copyText={escapeQuotes(glyph.c)}>{escapeQuotes(glyph.c)}</CopyButton>'
          </pre>
          <pre>
            '
            <CopyButton copyText={hexesToUnicodeEscapeSequence(glyph.h)}>
              {hexesToUnicodeEscapeSequence(glyph.h)}
            </CopyButton>
            '
          </pre>
          <pre>
            String.fromCharCode({glyph.h.split(' ').length > 2 ? '\n' : ''}
            <CopyButton copyText={hexesToJs(glyph.h)}>
              {hexesToJs(glyph.h, glyph.h.split(' ').length > 2 ? ',\n  ' : undefined)}
              {glyph.h.split(' ').length > 2 ? ',' : ''}
            </CopyButton>
            {glyph.h.split(' ').length > 2 ? '\n' : ''})
          </pre>
        </div>

        <div class="panel">
          <h4>HTML</h4>
          {!HTML_RESERVED_CHARACTERS.includes(glyph.c) && (
            <pre>
              &lt;b&gt;
              <CopyButton copyText={glyph.c}>{glyph.c}</CopyButton>
              &lt;/b&gt;
            </pre>
          )}
          {!complexGlyph && (
            <>
              <For each={glyph.e?.split(' ')}>
                {(e) => (
                  <pre>
                    &lt;b&gt;
                    <CopyButton copyText={`&${e};`}>&amp;{e};</CopyButton>
                    &lt;/b&gt;
                  </pre>
                )}
              </For>
              <pre>
                &lt;b&gt;
                <CopyButton copyText={`&${decimalToHtml(glyph.d)};`}>&amp;{decimalToHtml(glyph.d)};</CopyButton>
                &lt;/b&gt;
              </pre>
              <pre>
                &lt;b&gt;
                <CopyButton copyText={`&${hexToHtml(glyph.u)};`}>&amp;{hexToHtml(glyph.u)};</CopyButton>
                &lt;/b&gt;
              </pre>
            </>
          )}
        </div>

        <div class="panel">
          <h4>CSS</h4>
          <pre>
            content: '<CopyButton copyText={escapeQuotes(glyph.c)}>{escapeQuotes(glyph.c)}</CopyButton>';
          </pre>
          {!complexGlyph && (
            <pre>
              content: '<CopyButton copyText={hexToCss(glyph.u)}>{hexToCss(glyph.u)}</CopyButton>';
            </pre>
          )}
        </div>

        <div class="panel">
          <h4>Unicode</h4>
          <dl>
            {!complexGlyph && (
              <>
                <dt>Reference:</dt>
                <dd>
                  <code>
                    <CopyButton copyText={`U+${glyph.u}`}>U+{glyph.u}</CopyButton>
                  </code>
                </dd>
                <dt>Decimal:</dt>
                <dd>
                  <code>
                    <CopyButton copyText={glyph.d}>{glyph.d}</CopyButton>
                  </code>
                </dd>
                <dt>UTF-32:</dt>
                <dd>
                  <code>
                    <CopyButton copyText={hexToJs(glyph.u.padStart(8, '0'))}>
                      {hexToJs(glyph.u.padStart(8, '0'))}
                    </CopyButton>
                  </code>
                </dd>
              </>
            )}
            <dt>UTF-16:</dt>
            <dd>
              <code>
                <CopyButton copyText={hexesToJs(glyph.h, ' ')}>{hexesToJs(glyph.h, ' ')}</CopyButton>
              </code>
            </dd>
            {glyph.g && (
              <>
                <dt>Block:</dt>
                <dd>
                  <Linkify phrase={glyph.g} />
                </dd>
              </>
            )}
            {glyph.v && (
              <>
                <dt>Version:</dt>
                <dd>{glyph.v}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </article>
  )
}
