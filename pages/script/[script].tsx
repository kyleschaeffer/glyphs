import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Script } from '../../components/Script'
import { Splash } from '../../components/Splash'
import { useAppStore } from '../../store/app'

export default function ScriptRoute() {
  const router = useRouter()
  const loading = useAppStore((store) => store.loadingScript)
  const route = z.string().parse(router.query.script)
  const setRoute = useAppStore((store) => store.setScriptRoute)

  const scriptRoute = useRef<string | null>(null)
  useEffect(() => {
    if (loading || !route || scriptRoute.current === route) return
    void setRoute(route)
    scriptRoute.current = route
  }, [loading, route, setRoute])

  if (loading || !route || scriptRoute.current !== route)
    return (
      <Splash>
        <div className="loading">⎈</div>
      </Splash>
    )

  return <Script />
}
