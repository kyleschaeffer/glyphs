export type Resolver<T> = {
  promise: Promise<T>
  reject: (reason?: any) => void
  resolve: (value: T | PromiseLike<T>) => void
}

/**
 * Create a deferred resolver promise
 *
 * @returns an object with the resolver promise and reject/resolve methods
 */
export function createResolver<T>(): Resolver<T> {
  let resolve: (value: T | PromiseLike<T>) => void = () => {}
  let reject: (reason?: any) => void = () => {}

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    promise,
    reject,
    resolve,
  }
}
