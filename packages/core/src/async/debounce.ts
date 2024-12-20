export type DebounceOptions = {
  leading?: boolean
  maxWait?: number
  trailing?: boolean
}

export type Debounce<T extends (this: unknown, ...args: any[]) => any> = T & {
  cancel(): void
  flush(): ReturnType<T>
}

/**
 * Create a debounced function that delays invoking `callback` until after `wait` milliseconds
 * Based on https://lodash.com/docs/4.17.15#debounce
 *
 * @param callback Callback function
 * @param wait     Debounce delay in milliseconds
 * @param options  Debounce options
 */
export function debounce<T extends (this: any, ...args: any[]) => any>(
  callback: T,
  wait: number,
  options?: DebounceOptions
): Debounce<T> {
  let lastArgs: Parameters<T> | undefined
  let lastThis: ThisType<T> | undefined
  let lastCallTime: number | undefined
  let lastInvokeTime = Date.now()
  let timerId: Timer | undefined
  let result: ReturnType<T>

  const leading = options?.leading ?? false
  const trailing = options?.trailing ?? true
  const maxWait = options?.maxWait
  const maxing = maxWait !== undefined

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = undefined
    lastThis = undefined
    lastInvokeTime = time

    result = callback.apply(thisArg, args as Parameters<T>)
    return result
  }

  function leadingEdge(time: number): ReturnType<T> {
    lastInvokeTime = time
    timerId = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime!
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall
    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime!
    const timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired(): ReturnType<T> | undefined {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time: number): ReturnType<T> {
    timerId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = undefined
    lastThis = undefined
    return result
  }

  function cancel(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = undefined
    lastCallTime = undefined
    lastThis = undefined
    timerId = undefined
  }

  function flush(): ReturnType<T> {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function debounced(this: ThisType<T>): ReturnType<T> {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = arguments as unknown as Parameters<T>
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush

  return debounced as Debounce<T>
}
