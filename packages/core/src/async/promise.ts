import { GlyphsError, GlyphsErrorOptions } from '../base/error'

export type ResolveablePromise<T = unknown> = {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: any) => void
}

/**
 * Create a promise that can be resolved at a later time
 */
export function makeResolveablePromise<T = unknown>(): ResolveablePromise<T> {
  let resolve: (value: T) => void = () => {}
  let reject: (reason?: any) => void = () => {}

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return { promise, resolve, reject }
}

/**
 * Run a promise in the background, throwing an error if it fails
 *
 * @param promise Promise
 * @param message Error message
 * @param options Error options
 */
export function runInBackground<T extends Promise<unknown>>(
  promise: T,
  message: string = 'Failed to run in background',
  options?: GlyphsErrorOptions
): void {
  promise.catch((reason) => {
    throw new GlyphsError(message, { cause: reason, ...options })
  })
}
