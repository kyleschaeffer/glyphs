import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { z } from 'zod'
import { Glyph } from '../components/Glyph'
import { useAppStore } from '../store/app'

export default function GlyphRoute() {
  const router = useRouter()
  const glyph = router.isReady ? z.string().parse(router.query.glyph) : null
  const setChar = useAppStore((store) => store.setChar)

  useEffect(() => {
    if (!router.isReady) return
    setChar(glyph)
  }, [glyph, router.isReady, setChar])

  return <Glyph />
}
