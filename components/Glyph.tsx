import Head from 'next/head'
import Link from 'next/link'
import { useCallback } from 'react'
import { decimalToUtf16, decimalToUtf32 } from '../core/convert'
import { cssEntities, decimalValues, escapedHex16, escapedHex32, htmlEntities } from '../core/glyph'
import { useAppStore } from '../store/app'
import { useLoading } from './hooks/useLoading'

export function Glyph() {
  const glyph = useAppStore((store) => store.glyph)
  const loading = useLoading()

  const setChar = useAppStore((store) => store.setChar)
  const close = useCallback(() => setChar(null), [setChar])

  if (loading) return <div>Loading&hellip;</div>
  if (!glyph) return <div>Not found</div>

  return (
    <>
      <Head>
        <title>
          {glyph.c} — {glyph.n} — Glyphs
        </title>
      </Head>
      <div className="glyph">
        <button className="close" onClick={close}>
          ╳
        </button>
        <h2 className="name">{glyph.n}</h2>
        <h1 className="char">
          <span className="char-inner">{glyph.c}</span>
        </h1>
        <h3>HTML:</h3>
        <ul>
          {htmlEntities(glyph).map((e, i) => (
            <li key={i}>
              <code>{e}</code>
            </li>
          ))}
        </ul>
        <h3>CSS:</h3>
        <ul>
          {cssEntities(glyph).map((e, i) => (
            <li key={i}>
              <code>{e}</code>
            </li>
          ))}
        </ul>
        <h3>JavaScript:</h3>
        <ul>
          <li>
            <code>{escapedHex32(glyph)}</code>
          </li>
          <li>
            <code>{escapedHex16(glyph)}</code>
          </li>
        </ul>
        <h3>UTF-32:</h3>
        <ul>
          <li>
            <code>0x{decimalToUtf32(parseInt(glyph.d, 10))}</code>
          </li>
        </ul>
        <h3>UTF-16:</h3>
        <ul>
          <li>
            <code>0x{decimalToUtf16(parseInt(glyph.d, 10)).join(' 0x')}</code>
          </li>
        </ul>
        <h3>Decimal:</h3>
        <ul>
          <li>
            <code>{decimalValues(glyph).join(' ')}</code>
          </li>
        </ul>
        <h3>About:</h3>
        <ul>
          {glyph.g && <li>Group: {glyph.g}</li>}
          {glyph.k && <li>Keywords: {glyph.k.split(',').join(', ')}</li>}
          {glyph.v && (
            <li>
              Unicode version:{' '}
              <Link href={`https://www.unicode.org/versions/Unicode${glyph.v}.0/`} target="_blank">
                <span>{glyph.v}.0</span>
                <span> ↗</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}
