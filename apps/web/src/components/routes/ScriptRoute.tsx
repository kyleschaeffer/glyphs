import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { Splash } from '../../components/Splash'
import { useAppStore } from '../../store/app'
import { Page } from '../Page'
import { Script } from '../Script'

type RouteParams = {
  script: string
}

export default function ScriptRoute() {
  const params = useParams<RouteParams>()
  const loading = useAppStore((store) => store.loadingScript)
  const route = params.script
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

  return (
    <Page>
      <Script />
    </Page>
  )
}
