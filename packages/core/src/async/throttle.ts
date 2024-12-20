import { debounce } from './debounce'

export type ThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}

/**
 * Create a throttled function that invokes `callback` at most once per every `wait` milliseconds
 * Based on https://lodash.com/docs/4.17.15#throttle
 *
 * @param callback The function to throttle.
 * @param wait     Throttle interval in milliseconds
 * @param options  Throttle options
 */
export function throttle<T extends (this: any, ...args: any[]) => any>(
  callback: T,
  wait: number,
  options?: ThrottleOptions
) {
  return debounce(callback, wait, {
    leading: options?.leading ?? true,
    maxWait: wait,
    trailing: options?.trailing ?? true,
  })
}
