import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { bindStyles } from '../core/browser'
import { glyphRoute } from '../core/glyph'
import { useAppStore } from '../store/app'
import { Glyph } from '../store/types'
import styles from './Block.module.scss'
import { Footer } from './Footer'
import { Splash } from './Splash'

const cx = bindStyles(styles)

export function Block() {
  const router = useRouter()
  const block = useAppStore((store) => store.block)

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

  if (!block.block) return <Splash title="Not found" />

  return (
    <>
      <Head>
        <title>{block.block}</title>
      </Head>
      <div className={cx('block')}>
        <h1 className={cx('title')}>Unicode Block: {block.block}</h1>
        <ul className={cx('results')}>
          {block.glyphs.map((glyph) => (
            <li key={glyph.char}>
              <BlockGlyph glyph={glyph} />
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  )
}

type BlockGlyphProps = {
  glyph: Glyph
}

export function BlockGlyph(props: BlockGlyphProps) {
  const { glyph } = props

  const router = useRouter()
  const select = useCallback(() => {
    router.push(glyphRoute(glyph.char))
  }, [glyph, router])

  return (
    <button className={cx('result')} onClick={select} title={`${glyph.char} ${glyph.name}`}>
      {glyph.char}
    </button>
  )
}
