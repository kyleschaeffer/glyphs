import { Glyph } from '@glyphs/core'
import { NavLink } from 'react-router'
import { bindStyles, decodeHtml } from '../utils/browser'
import { glyphRoute } from '../utils/route'
import { Character } from './Character'
import styles from './GlyphFeed.module.css'

const cx = bindStyles(styles)

type GlyphFeedProps = {
  glyphs: Glyph[]
}

export function GlyphFeed(props: GlyphFeedProps) {
  const { glyphs } = props

  return (
    <ul className={cx('feed')}>
      {glyphs.map((glyph) => (
        <li key={glyph.char}>
          <GlyphFeedItem key={glyph.char} glyph={glyph} />
        </li>
      ))}
    </ul>
  )
}

type GlyphFeedItemProps = {
  glyph: Glyph
}

function GlyphFeedItem(props: GlyphFeedItemProps) {
  const { glyph } = props

  return (
    <NavLink className={cx('item')} to={glyphRoute(glyph.char)} title={`${decodeHtml(glyph.char)} ${glyph.name}`}>
      <Character>{glyph.char}</Character>
    </NavLink>
  )
}
