import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { utf16ToUnicodeEscapeSequence } from '../core/convert'
import { cssEntities, htmlEntities } from '../core/glyph'
import { useAppStore } from '../store/app'
import { CopyButton } from './CopyButton'
import { useLoading } from './hooks/useLoading'

export function Glyph() {
  const router = useRouter()
  const glyph = useAppStore((store) => store.glyph)
  const loading = useLoading()

  const close = useCallback(() => router.back(), [router])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close])

  if (loading) return <div>Loading&hellip;</div>
  if (!glyph) return <div>Not found</div>

  return (
    <>
      <Head>
        <title>
          {glyph.c} {glyph.n}
        </title>
      </Head>
      <div className="glyph">
        <header className="head">
          <h2 className="name">{glyph.n}</h2>
          <button className="close" onClick={close}>
            ✗
          </button>
        </header>
        <h1 className="char">
          <span className="char-inner">{glyph.c}</span>
          <span className="char-measure">
            <span className="measure measure-width">
              <span className="tick tick1" />
              <span className="measure-value"> em</span>
              <span className="tick tick2" />
            </span>
            <span className="measure measure-height">
              <span className="tick tick1" />
              <span className="measure-height-value">1 em</span>
              <span className="tick tick2" />
            </span>
          </span>
        </h1>
        <CopyButton text={glyph.c} copyLabel="Copy glyph" />
        <h3>JavaScript:</h3>
        <ul role="list">
          <li>
            <code>{glyph.c}</code>
          </li>
          <li>
            <code>{utf16ToUnicodeEscapeSequence(glyph.h)}</code>
          </li>
        </ul>
        <h3>HTML:</h3>
        <ul role="list">
          {htmlEntities(glyph).map((e, i) => (
            <li key={i}>
              <code>{e}</code>
            </li>
          ))}
        </ul>
        <h3>CSS:</h3>
        <ul role="list">
          {cssEntities(glyph).map((e, i) => (
            <li key={i}>
              <code>{e}</code>
            </li>
          ))}
        </ul>
        <h3>UTF-32:</h3>
        <ul role="list">
          <li>
            <code>{glyph.u.map((u) => `U+${u}`).join(' ')}</code>
          </li>
        </ul>
        <h3>UTF-16:</h3>
        <ul role="list">
          <li>
            <code>{glyph.h.map((h) => `U+${h}`).join(' ')}</code>
          </li>
        </ul>
        <h3>About:</h3>
        <ul role="list">
          {glyph.g && <li>Category: {glyph.g}</li>}
          {glyph.k && <li>Keywords: {glyph.k.join(', ')}</li>}
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
