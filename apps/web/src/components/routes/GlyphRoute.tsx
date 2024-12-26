import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { useAppStore } from '../../store/app'
import { Glyph } from '../Glyph'
import { Page } from '../Page'
import { Splash } from '../Splash'

type RouteParams = {
  glyph: string
}

export default function GlyphRoute() {
  const params = useParams<RouteParams>()
  const loading = useAppStore((store) => store.loadingGlyph)
  const route = (params.glyph ?? '').replace('period', '.')
  const setRoute = useAppStore((store) => store.setGlyphRoute)

  const glyphRoute = useRef<string | null>(null)
  useEffect(() => {
    if (loading || glyphRoute.current === route) return
    void setRoute(route)
    glyphRoute.current = route
  }, [loading, route, setRoute])

  if (loading || glyphRoute.current !== route)
    return (
      <Splash>
        <div className="loading">{route}</div>
      </Splash>
    )

  return (
    <Page>
      <Glyph />
    </Page>
  )
}
