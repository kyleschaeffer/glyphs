import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { bindStyles } from '../core/browser'
import {
  decimalToHexEscapeSequence,
  escapeSingleQuotes,
  utf16ToUnicodeEscapeSequence,
  utf32ToCodePointEscapeSequence,
} from '../core/convert'
import { cssEntities, htmlEntities } from '../core/glyph'
import { slugify } from '../core/lang'
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
          {glyph.char} {glyph.name}
        </title>
      </Head>
      <div className={cx('glyph')}>
        <header className={cx('head')}>
          <h2 className={cx('name')}>{glyph.name}</h2>
          <button className={cx('close')} onClick={close} title="Close (⎋)">
            ✗
          </button>
        </header>
        <Character>{glyph.char}</Character>
        <div className="center">
          <CopyButton text={glyph.char} copyLabel="Copy glyph" />
        </div>
        <div className={cx('section')}>
          <h3>JavaScript:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code prefix="str\A0=\A0'" suffix="'">
                {escapeSingleQuotes(glyph.char)}
              </Code>
            </li>
            {glyph.decimals.length === 1 && glyph.decimals[0] <= 0xff && (
              <li>
                <Code prefix="str\A0=\A0'" suffix="'">
                  {decimalToHexEscapeSequence(glyph.decimals[0])}
                </Code>
              </li>
            )}
            <li>
              <Code prefix="str\A0=\A0'" suffix="'" wrap>
                {utf32ToCodePointEscapeSequence(glyph.utf32)}
              </Code>
            </li>
            <li>
              <Code prefix="str\A0=\A0'" suffix="'" wrap>
                {utf16ToUnicodeEscapeSequence(glyph.utf16)}
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
          <h3>URI:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code prefix="glyphs.dev/" wrap>
                {encodeURIComponent(glyph.char)}
              </Code>
            </li>
          </ul>
        </div>
        <div className={cx('section')}>
          <h3>UTF-32:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code>{glyph.utf32.map((u) => `U+${u}`).join(' ')}</Code>
            </li>
          </ul>
        </div>
        <div className={cx('section')}>
          <h3>UTF-16:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code>{glyph.utf16.map((u) => `U+${u}`).join(' ')}</Code>
            </li>
          </ul>
        </div>
        <div className={cx('section')}>
          <h3>UTF-8:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code>{glyph.utf8.map((u) => `U+${u}`).join(' ')}</Code>
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
                    <Link className={cx('ligature-link')} href={`/${encodeURIComponent(r.char)}`}>
                      <span className={cx('ligature-char')}>{r.char} </span>
                      <span className={cx('ligature-name')}>{r.name}</span>
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
        {glyph.ligatures?.length && (
          <div className={cx('section')}>
            <h3>Used in:</h3>
            <div className={cx('used-in')}>
              {glyph.ligatures.map((l, i) => (
                <span key={i}>
                  {
                    <Link className={cx('ligature-link')} href={`/${encodeURIComponent(l)}`}>
                      <span className={cx('ligature-char')}>{l} </span>
                    </Link>
                  }
                </span>
              ))}
            </div>
          </div>
        )}
        <div className={cx('section')}>
          <h3>About:</h3>
          <ul className={cx('codes')} role="list">
            {glyph.script && (
              <li>
                Script: <Link href={`/script/${slugify(glyph.script)}`}>{glyph.script}</Link>
              </li>
            )}
            {glyph.block && (
              <li>
                Block: <Link href={`/block/${slugify(glyph.block)}`}>{glyph.block}</Link>
              </li>
            )}
            {glyph.keywords && (
              <li>
                Keywords:{' '}
                {glyph.keywords.map((keyword, i) => (
                  <span key={i}>
                    {i > 0 && <span>, </span>}
                    <Link href={`/?q=${encodeURIComponent(keyword)}`}>{keyword}</Link>
                  </span>
                ))}
              </li>
            )}
            {glyph.version && (
              <li>
                Unicode version:{' '}
                <Link href={`https://www.unicode.org/versions/Unicode${glyph.version}.0/`} target="_blank">
                  <span>{glyph.version}.0</span>
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
