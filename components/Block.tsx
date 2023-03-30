import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { bindStyles } from '../core/browser'
import { decimalToUtf32 } from '../core/convert'
import { glyphRoute } from '../core/glyph'
import { useScrollAfterLoading } from '../hooks/useScroll'
import { useAppStore } from '../store/app'
import { Glyph } from '../workers/types'
import styles from './Block.module.scss'
import { Footer } from './Footer'
import { GlyphFeed } from './GlyphFeed'
import { Splash } from './Splash'

const cx = bindStyles(styles)

export function Block() {
  const router = useRouter()
  const block = useAppStore((store) => store.block)
  useScrollAfterLoading(false)

  const close = useCallback(() => router.push('/'), [router])

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
      <Head>
        <title>{block.name}</title>
      </Head>
      <h1 className={cx('title')}>Unicode Block: {block.name}</h1>
      <p className={cx('title')}>
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
    <Link className={cx('result')} href={glyphRoute(glyph.char)} title={`${glyph.char} ${glyph.name}`}>
      {glyph.char}
    </Link>
  )
}
