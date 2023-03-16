import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/app'

export function WorkerController() {
  const startWorkers = useAppStore((store) => store.startWorkers)

  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) return
    isMounted.current = true
    startWorkers()
  }, [startWorkers])

  return null
}
