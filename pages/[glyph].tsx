import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Glyph } from '../components/Glyph'
import { useLoading } from '../components/hooks/useLoading'
import { useAppStore } from '../store/app'

export default function GlyphRoute() {
  const router = useRouter()
  const loading = useLoading()
  const glyph = router.isReady ? z.string().parse(router.query.glyph).replace('period', '.') : null
  const setChar = useAppStore((store) => store.setChar)

  const glyphRoute = useRef<string | null>(null)
  useEffect(() => {
    if (!router.isReady || loading || glyphRoute.current === glyph) return
    setChar(glyph)
    glyphRoute.current = glyph
  }, [glyph, loading, router.isReady, setChar])

  if (loading)
    return (
      <div className="splash center">
        <div className="loading">{glyph}</div>
      </div>
    )

  return <Glyph />
}
