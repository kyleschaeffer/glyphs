import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Block } from '../../components/Block'
import { useLoading } from '../../components/hooks/useLoading'
import { Splash } from '../../components/Splash'
import { useAppStore } from '../../store/app'

export default function BlockRoute() {
  const router = useRouter()
  const loading = useLoading()
  const block = router.isReady ? z.string().parse(router.query.block) : null
  const requestBlock = useAppStore((store) => store.requestBlock)

  const blockRoute = useRef<string | null>(null)
  useEffect(() => {
    if (!router.isReady || loading || !block || blockRoute.current === block) return
    requestBlock(block)
    blockRoute.current = block
  }, [block, loading, router.isReady, requestBlock])

  if (loading || !block || blockRoute.current !== block)
    return (
      <Splash>
        <div className="loading">⎈</div>
      </Splash>
    )

  return <Block />
}
