import {
  decimalToHexEscapeSequence,
  escapeSingleQuotes,
  slugify,
  utf16ToUnicodeEscapeSequence,
  utf32ToCodePointEscapeSequence,
} from '@glyphs/core'
import { useCallback, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAppStore } from '../store/app'
import { bindStyles, cssEntities, decodeHtml, htmlEntities } from '../utils/browser'
import { Character } from './Character'
import { CharacterCanvas } from './CharacterCanvas'
import { Code } from './Code'
import { CopyButton } from './CopyButton'
import { Footer } from './Footer'
import styles from './Glyph.module.css'
import { Splash } from './Splash'

const cx = bindStyles(styles)

export function Glyph() {
  const navigate = useNavigate()
  const route = useAppStore((store) => store.glyphRoute)
  const glyph = useAppStore((store) => store.glyph)
  const block = useAppStore((store) => store.glyphBlock)
  const ligature = useAppStore((store) => store.glyphLigature)
  const query = useAppStore((store) => store.query)

  const close = useCallback(() => navigate(query ? `/?q=${encodeURIComponent(query)}` : '/'), [navigate, query])

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

  if (!glyph) return <Splash title="Not found">{route}</Splash>

  return (
    <>
      <title>
        {glyph.char} {glyph.name}
      </title>
      <div className={cx('glyph')}>
        <header className={cx('head')}>
          <h2 className={cx('name')}>{glyph.name}</h2>
          <button className={cx('close')} onClick={close} title="Close (⎋)">
            ✗
          </button>
        </header>
        <CharacterCanvas>{glyph.char}</CharacterCanvas>
        <div className="center">
          <CopyButton text={decodeHtml(glyph.char)} copyLabel="Copy glyph" />
        </div>
        <div className={cx('section')}>
          <h3>JavaScript:</h3>
          <ul className={cx('codes')} role="list">
            <li>
              <Code prefix="str\A0=\A0'" suffix="'">
                {escapeSingleQuotes(decodeHtml(glyph.char))}
              </Code>
            </li>
            {glyph.decimals.length === 1 && glyph.decimals[0]! <= 0xff && (
              <li>
                <Code prefix="str\A0=\A0'" suffix="'">
                  {decimalToHexEscapeSequence(glyph.decimals[0]!)}
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
        {ligature.length > 0 && (
          <div className={cx('section')}>
            <h3>Ligature:</h3>
            <ol className={cx('codes')}>
              {ligature.map((r, i) => (
                <li key={i}>
                  {r ? (
                    <NavLink className={cx('ligature-link')} to={`/${encodeURIComponent(r.char)}`}>
                      <span className={cx('ligature-char')}>{r.char} </span>
                      <span className={cx('ligature-name')}>{r.name}</span>
                    </NavLink>
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
                    <NavLink className={cx('ligature-link')} to={`/${encodeURIComponent(l)}`}>
                      <span className={cx('ligature-char')}>
                        <Character>{l}</Character>
                      </span>
                    </NavLink>
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
                Script: <NavLink to={`/script/${slugify(glyph.script)}`}>{glyph.script}</NavLink>
              </li>
            )}
            {glyph.block && block && (
              <li>
                Block: <NavLink to={`/block/${slugify(glyph.block)}`}>{block.name}</NavLink>
              </li>
            )}
            {glyph.keywords && (
              <li>
                Keywords:{' '}
                {glyph.keywords.map((keyword, i) => (
                  <span key={i}>
                    {i > 0 && <span>, </span>}
                    <NavLink to={`/?q=${encodeURIComponent(keyword)}`}>{keyword}</NavLink>
                  </span>
                ))}
              </li>
            )}
            {glyph.version && (
              <li>
                Unicode version:{' '}
                <a href={`https://www.unicode.org/versions/Unicode${glyph.version}.0/`} target="_blank">
                  <span>{glyph.version}</span>
                  <span> ↗</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  )
}
