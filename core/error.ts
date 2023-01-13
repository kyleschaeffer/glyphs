/**
 * Assert that a value is not `undefined`
 *
 * @param value     Value to assert
 * @param message   Error message
 * @param ErrorType Error type thrown if reached
 * @param options   Error options
 *
 * @throws If `value` is `undefined`
 */
export function assertDefined<T>(
  value: T,
  message: string = 'Value is undefined',
  ErrorType: typeof Error = Error,
  options?: ErrorOptions
): Exclude<T, undefined> {
  if (value === undefined) throw new ErrorType(message, options)
  return value as Exclude<T, undefined>
}

/**
 * Assert that a value is not `undefined` or `null`
 *
 * @param value     Value to assert
 * @param message   Error message
 * @param ErrorType Error type thrown if reached
 * @param options   Error options
 *
 * @throws If `value` is `undefined` or `null`
 */
export function assertNonNullable<T>(
  value: T,
  message: string = 'Value is nullable',
  ErrorType: typeof Error = Error,
  options?: ErrorOptions
): NonNullable<T> {
  if (value === undefined || value === null) throw new ErrorType(message, options)
  return value as NonNullable<T>
}

/**
 * Throw an unreachable error if this function is executed
 *
 * @param message   Error message
 * @param ErrorType Error type thrown if reached
 * @param options   Error options
 *
 * @throws If executed
 */
export function throwUnreachable(
  message: string = 'Unreachable',
  ErrorType: typeof Error = Error,
  options?: ErrorOptions
): never {
  throw new ErrorType(message, options)
}
