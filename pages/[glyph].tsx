import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Glyph } from '../components/Glyph'
import { Splash } from '../components/Splash'
import { useAppStore } from '../store/app'

export default function GlyphRoute() {
  const router = useRouter()
  const loading = useAppStore((store) => store.loadingGlyph)
  const route = router.isReady ? z.string().parse(router.query.glyph).replace('period', '.') : null
  const setRoute = useAppStore((store) => store.setGlyphRoute)

  const glyphRoute = useRef<string | null>(null)
  useEffect(() => {
    if (!router.isReady || loading || glyphRoute.current === route) return
    void setRoute(route)
    glyphRoute.current = route
  }, [router.isReady, loading, route, setRoute])

  if (loading || glyphRoute.current !== route)
    return (
      <Splash>
        <div className="loading">{route}</div>
      </Splash>
    )

  return <Glyph />
}
