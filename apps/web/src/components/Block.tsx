import { Glyph, decimalToUtf32 } from '@glyphs/core'
import { useCallback, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAppStore } from '../store/app'
import { glyphRoute } from '../utils/route'
import { Footer } from './Footer'
import { GlyphFeed } from './GlyphFeed'
import { Splash } from './Splash'

export function Block() {
  const navigate = useNavigate()
  const block = useAppStore((store) => store.block)

  const close = useCallback(() => navigate('/'), [navigate])

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

  if (!block) return <Splash title="Not found" />

  return (
    <>
      <title>{block.name}</title>
      <h1>Unicode Block: {block.name}</h1>
      <p>
        U+{decimalToUtf32(block.range[0])} → U+{decimalToUtf32(block.range[1])} • {block.glyphs.length.toLocaleString()}{' '}
        glyphs
      </p>
      <GlyphFeed glyphs={block.glyphs} />
      <Footer />
    </>
  )
}

type BlockGlyphProps = {
  glyph: Glyph
}

export function BlockGlyph(props: BlockGlyphProps) {
  const { glyph } = props

  return (
    <NavLink to={glyphRoute(glyph.char)} title={`${glyph.char} ${glyph.name}`}>
      {glyph.char}
    </NavLink>
  )
}
