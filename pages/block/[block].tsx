import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Block } from '../../components/Block'
import { Splash } from '../../components/Splash'
import { useAppStore } from '../../store/app'

export default function BlockRoute() {
  const router = useRouter()
  const loading = useAppStore((store) => store.loadingBlock)
  const route = router.isReady ? z.string().parse(router.query.block) : null
  const setRoute = useAppStore((store) => store.setBlockRoute)

  const blockRoute = useRef<string | null>(null)
  useEffect(() => {
    if (!router.isReady || loading || !route || blockRoute.current === route) return
    setRoute(route)
    blockRoute.current = route
  }, [router.isReady, loading, route, setRoute])

  if (loading || !route || blockRoute.current !== route)
    return (
      <Splash>
        <div className="loading">⎈</div>
      </Splash>
    )

  return <Block />
}
