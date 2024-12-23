import { registerSearchWorker } from '../workers/search'
import { WorkerResponseMessage } from '../workers/types'

const onMessage = (message: WorkerResponseMessage) => {
  console.log(message)
}

const postMessage = registerSearchWorker(onMessage)

export function SearchController({ children }: { children?: React.ReactNode }) {
  console.log({ onMessage, postMessage })

  return <>{children}</>
}
