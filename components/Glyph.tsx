import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { bindStyles } from '../core/browser'
import { escapeSingleQuotes, utf16ToUnicodeEscapeSequence } from '../core/convert'
import { cssEntities, htmlEntities } from '../core/glyph'
import { useAppStore } from '../store/app'
import { Character } from './Character'
import { Code } from './Code'
import { CopyButton } from './CopyButton'
import { Footer } from './Footer'
import styles from './Glyph.module.scss'
import { Splash } from './Splash'

const cx = bindStyles(styles)

export function Glyph() {
  const router = useRouter()
  const char = useAppStore((store) => store.char)
  const glyph = useAppStore((store) => store.glyph)
  const query = useAppStore((store) => store.query)
  const related = useAppStore((store) => store.related)
  const hasLigature = useMemo(() => related.some((r) => r !== null), [related])

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

  if (!glyph) return <Splash title="Not found">{char}</Splash>

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
        <div className="center">
          <CopyButton text={glyph.c} copyLabel="Copy glyph" />
        </div>
        <div className={cx('section')}>
          <h3>JavaScript:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code prefix="str\A0=\A0'" suffix="'">
                {escapeSingleQuotes(glyph.c)}
              </Code>
            </li>
            <li>
              <Code prefix="str\A0=\A0'" suffix="'" wrap>
                {utf16ToUnicodeEscapeSequence(glyph.h)}
              </Code>
            </li>
          </ul>
        </div>
        <div className={cx('section')}>
          <h3>HTML:</h3>
          <ul className={cx('codes')} role="list">
            {htmlEntities(glyph).map((e, i) => (
              <li key={i}>
                <Code prefix="<i>" suffix="</i>" wrap>
                  {e}
                </Code>
              </li>
            ))}
          </ul>
        </div>
        <div className={cx('section')}>
          <h3>CSS:</h3>
          <ul className={cx('codes')} role="list">
            {cssEntities(glyph).map((e, i) => (
              <li key={i}>
                <Code prefix="content:\A0'" suffix="';" wrap>
                  {e}
                </Code>
              </li>
            ))}
          </ul>
        </div>
        <div className={cx('section')}>
          <h3>UTF-32:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code>{glyph.u.map((u) => `U+${u}`).join(' ')}</Code>
            </li>
          </ul>
        </div>
        <div className={cx('section')}>
          <h3>UTF-16:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code>{glyph.h.map((h) => `U+${h}`).join(' ')}</Code>
            </li>
          </ul>
        </div>
        {hasLigature && (
          <div className={cx('section')}>
            <h3>Ligature:</h3>
            <ol className={cx('codes')}>
              {related.map((r, i) => (
                <li key={i}>
                  {r ? (
                    <Link className={cx('ligature-link')} href={`/${r.c}`}>
                      <span className={cx('ligature-char')}>{r.c} </span>
                      <span className={cx('ligature-name')}>{r.n}</span>
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className={cx('section')}>
          <h3>About:</h3>
          <ul className={cx('codes')} role="list">
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
      </div>
      <Footer />
    </>
  )
}
