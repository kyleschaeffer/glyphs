import { ReactNode } from 'react'
import { useAppStore } from '../store/app'
import { Splash } from './Splash'

type PageProps = {
  children?: ReactNode
}

export function Page(props: PageProps) {
  const { children } = props

  const workerReady = useAppStore((store) => store.workerReady)

  if (!workerReady)
    return (
      <Splash>
        <div className="loading">⎈</div>
      </Splash>
    )

  return <>{children}</>
}
