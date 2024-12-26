import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAppStore } from '../store/app'
import { Footer } from './Footer'
import { GlyphFeed } from './GlyphFeed'
import { Splash } from './Splash'

export function Script() {
  const navigate = useNavigate()
  const script = useAppStore((store) => store.script)

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

  if (!script) return <Splash title="Not found" />

  return (
    <>
      <title>{script.name}</title>
      <h1>Unicode Script: {script.name}</h1>
      <p>{script.glyphs.length.toLocaleString()} glyphs</p>
      <GlyphFeed glyphs={script.glyphs} />
      <Footer />
    </>
  )
}
