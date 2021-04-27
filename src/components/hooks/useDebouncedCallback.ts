import { DependencyList, useCallback, useEffect, useRef } from 'react'

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList
) => {
  const timerRef = useRef<NodeJS.Timeout>()
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerRef.current!)
      timerRef.current = setTimeout(() => callback.apply(this, args), delay)
    },
    [callback, delay, ...deps]
  )
  useEffect(() => () => clearTimeout(timerRef.current!), [timerRef])
  return debounced
}
