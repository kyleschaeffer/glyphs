import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Script } from '../../components/Script'
import { useLoading } from '../../components/hooks/useLoading'
import { Splash } from '../../components/Splash'
import { useAppStore } from '../../store/app'

export default function ScriptRoute() {
  const router = useRouter()
  const loading = useLoading()
  const script = router.isReady ? z.string().parse(router.query.script) : null
  const requestScript = useAppStore((store) => store.requestScript)

  const scriptRoute = useRef<string | null>(null)
  useEffect(() => {
    if (!router.isReady || loading || !script || scriptRoute.current === script) return
    requestScript(script)
    scriptRoute.current = script
  }, [script, loading, router.isReady, requestScript])

  if (loading || !script || scriptRoute.current !== script)
    return (
      <Splash>
        <div className="loading">⎈</div>
      </Splash>
    )

  return <Script />
}
