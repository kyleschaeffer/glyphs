import { throttle } from '../async/throttle'
import { Unsubscribe } from '../utils/types'

export type Observable<T> = {
  value: T
  mutate(): void
  next(nextValue: T): void
  subscribe(listener: (next: T) => void): Unsubscribe
}

export type ObservableOptions = {
  throttleTimeMs: number
}

export function makeObservable<T>(initialValue?: T, options: Partial<ObservableOptions> = {}): Observable<T> {
  const subscribers: ((next: T) => void)[] = []

  const config: ObservableOptions = {
    throttleTimeMs: 16,
    ...options,
  }

  let value: T = initialValue as T

  function notify(): void {
    subscribers.forEach((listener) => listener(value))
  }

  const throttledNotify = throttle(notify, config.throttleTimeMs, { leading: false })

  function mutate(): void {
    if (config.throttleTimeMs) {
      throttledNotify()
    } else {
      notify()
    }
  }

  function next(nextValue: T): void {
    value = nextValue
    if (config.throttleTimeMs) {
      throttledNotify()
    } else {
      notify()
    }
  }

  function subscribe(listener: (next: T) => void): Unsubscribe {
    subscribers.push(listener)
    listener(value)

    return () => {
      const listenerIndex = subscribers.indexOf(listener)
      if (listenerIndex >= 0) {
        subscribers.splice(listenerIndex, 1)
      }
    }
  }

  return {
    value,
    mutate,
    next,
    subscribe,
  }
}
