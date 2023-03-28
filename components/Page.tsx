import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useAppStore } from '../store/app'
import { Splash } from './Splash'

type PageProps = {
  children?: ReactNode
}

export function Page(props: PageProps) {
  const { children } = props

  const { isReady } = useRouter()
  const workerReady = useAppStore((store) => store.workerReady)
  const ready = isReady && workerReady

  if (!ready)
    return (
      <Splash>
        <div className="loading">⎈</div>
      </Splash>
    )

  return <>{children}</>
}
