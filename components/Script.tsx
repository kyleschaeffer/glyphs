import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { bindStyles } from '../core/browser'
import { useScrollAfterLoading } from '../hooks/useScroll'
import { useAppStore } from '../store/app'
import { Footer } from './Footer'
import { GlyphFeed } from './GlyphFeed'
import styles from './Script.module.scss'
import { Splash } from './Splash'

const cx = bindStyles(styles)

export function Script() {
  const router = useRouter()
  const script = useAppStore((store) => store.script)
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

  if (!script) return <Splash title="Not found" />

  return (
    <>
      <Head>
        <title>{script.name}</title>
      </Head>
      <h1 className={cx('title')}>Unicode Script: {script.name}</h1>
      <p className={cx('title')}>{script.glyphs.length.toLocaleString()} glyphs</p>
      <GlyphFeed glyphs={script.glyphs} />
      <Footer />
    </>
  )
}
