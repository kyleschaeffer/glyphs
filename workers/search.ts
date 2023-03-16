import type { ClientRequestMessage, WorkerResponseMessage } from './types'

export function registerSearchWorker(onResponse?: (message: WorkerResponseMessage) => void) {
  const worker = new Worker(new URL('./search.worker.ts', import.meta.url))
  worker.addEventListener('message', (event: MessageEvent<WorkerResponseMessage>) => onResponse?.(event.data))
  return (message: ClientRequestMessage) => worker.postMessage(message)
}
