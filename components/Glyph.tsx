import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { bindStyles } from '../core/browser'
import { utf16ToUnicodeEscapeSequence } from '../core/convert'
import { cssEntities, htmlEntities } from '../core/glyph'
import { useAppStore } from '../store/app'
import { Character } from './Character'
import { CopyButton } from './CopyButton'
import styles from './Glyph.module.scss'

const cx = bindStyles(styles)

export function Glyph() {
  const router = useRouter()
  const glyph = useAppStore((store) => store.glyph)
  const related = useAppStore((store) => store.related)
  const query = useAppStore((store) => store.query)

  const close = useCallback(() => router.push(query ? `/?q=${encodeURIComponent(query)}` : '/'), [query, router])

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

  if (!glyph) return <div>Not found</div>

  return (
    <>
      <Head>
        <title>
          {glyph.c} {glyph.n}
        </title>
      </Head>
      <div className={cx('glyph')}>
        <header className={cx('head')}>
          <h2 className={cx('name')}>{glyph.n}</h2>
          <button className={cx('close')} onClick={close} title="Close (⎋)">
            ✗
          </button>
        </header>
        <Character>{glyph.c}</Character>
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
            {glyph.u.map((u, i) => {
              const g = related[i]
              return <code key={i}>{g ? <Link href={`/${g.c}`}>{`U+${u}`}</Link> : `U+${u}`} </code>
            })}
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
