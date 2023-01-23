import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Glyph } from '../components/Glyph'
import { useLoading } from '../components/hooks/useLoading'
import { useAppStore } from '../store/app'

export default function GlyphRoute() {
  const router = useRouter()
  const loading = useLoading()
  const glyph = router.isReady ? z.string().parse(router.query.glyph) : null
  const setChar = useAppStore((store) => store.setChar)

  const init = useRef(false)
  useEffect(() => {
    if (init.current || !router.isReady || loading) return
    setChar(glyph)
    init.current = true
  }, [glyph, loading, router.isReady, setChar])

  if (loading) return <div>Loading&hellip;</div>

  return <Glyph />
}
