import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { bindStyles } from '../core/browser'
import { glyphRoute } from '../core/glyph'
import { useAppStore } from '../store/app'
import { Glyph } from '../store/types'
import styles from './Script.module.scss'
import { Footer } from './Footer'
import { Splash } from './Splash'

const cx = bindStyles(styles)

export function Script() {
  const router = useRouter()
  const script = useAppStore((store) => store.script)

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

  if (!script.script) return <Splash title="Not found" />

  return (
    <>
      <Head>
        <title>{script.script}</title>
      </Head>
      <div className={cx('script')}>
        <h1 className={cx('title')}>Unicode Script: {script.script}</h1>
        <p className={cx('title')}>{script.glyphs.length.toLocaleString()} glyphs</p>
        <ul className={cx('results')}>
          {script.glyphs.map((glyph) => (
            <li key={glyph.char}>
              <ScriptGlyph glyph={glyph} />
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  )
}

type ScriptGlyphProps = {
  glyph: Glyph
}

export function ScriptGlyph(props: ScriptGlyphProps) {
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
