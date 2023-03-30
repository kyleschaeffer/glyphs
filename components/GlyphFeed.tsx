import Link from 'next/link'
import { bindStyles } from '../core/browser'
import { glyphRoute } from '../core/glyph'
import { Glyph } from '../workers/types'
import styles from './GlyphFeed.module.scss'

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
    <Link className={cx('item')} href={glyphRoute(glyph.char)} title={`${glyph.char} ${glyph.name}`}>
      {glyph.char}
    </Link>
  )
}
