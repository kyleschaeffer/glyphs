import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { Splash } from '../../components/Splash'
import { useAppStore } from '../../store/app'
import { Block } from '../Block'
import { Page } from '../Page'

type RouteParams = {
  block: string
}

export default function BlockRoute() {
  const params = useParams<RouteParams>()
  const route = params.block
  const loading = useAppStore((store) => store.loadingBlock)
  const setRoute = useAppStore((store) => store.setBlockRoute)

  const blockRoute = useRef<string | null>(null)
  useEffect(() => {
    if (loading || !route || blockRoute.current === route) return
    void setRoute(route)
    blockRoute.current = route
  }, [loading, route, setRoute])

  if (loading || !route || blockRoute.current !== route)
    return (
      <Splash>
        <div className="loading">⎈</div>
      </Splash>
    )

  return (
    <Page>
      <Block />
    </Page>
  )
}
