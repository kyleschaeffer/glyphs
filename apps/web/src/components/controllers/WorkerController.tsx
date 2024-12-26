import { useEffect, useRef } from 'react'
import { useAppStore } from '../../store/app'

export function WorkerController() {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) return
    isMounted.current = true

    useAppStore.getState().startWorkers()
  }, [])

  return null
}
