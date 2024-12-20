import { Assign } from '../utils/types'
import { Tags } from './logger'

export type GlyphsErrorOptions = Assign<
  ErrorOptions,
  {
    status?: ErrorStatus
    tags?: Tags
  }
>

export enum ErrorStatus {
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  RequestTimeout = 408,
  Conflict = 409,
  Locked = 423,
  TooManyRequests = 429,
  ServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
}

export function isErrorStatus(status: number): status is ErrorStatus {
  return Object.values(ErrorStatus).includes(status)
}

export const ErrorStatusMessage: Record<ErrorStatus, string> = {
  [ErrorStatus.BadRequest]: 'Bad request',
  [ErrorStatus.Unauthorized]: 'Unauthorized',
  [ErrorStatus.PaymentRequired]: 'Payment required',
  [ErrorStatus.Forbidden]: 'Forbidden',
  [ErrorStatus.NotFound]: 'Not found',
  [ErrorStatus.MethodNotAllowed]: 'Method not allowed',
  [ErrorStatus.RequestTimeout]: 'Request timeout',
  [ErrorStatus.Conflict]: 'Conflict',
  [ErrorStatus.Locked]: 'Locked',
  [ErrorStatus.TooManyRequests]: 'Too many requests',
  [ErrorStatus.ServerError]: 'Server error',
  [ErrorStatus.NotImplemented]: 'Not implemented',
  [ErrorStatus.BadGateway]: 'Bad gateway',
  [ErrorStatus.ServiceUnavailable]: 'Service unavailable',
}

export class GlyphsError extends Error {
  private _status: ErrorStatus
  public get status() {
    return this._status
  }

  private _tags: Tags
  public get tags() {
    return this._tags
  }

  constructor(message?: string, options?: GlyphsErrorOptions) {
    super(message, options)
    this._status = options?.status ?? 500
    this._tags = options?.tags ?? {}
  }
}

/**
 * Assert that a value is not `undefined`
 *
 * @param value   Value to assert
 * @param message Error message
 * @param options Error options
 *
 * @throws If `value` is `undefined`
 */
export function assertDefined<T>(
  value: T,
  message: string = 'Value is undefined',
  options?: GlyphsErrorOptions
): Exclude<T, undefined> {
  if (value === undefined) throw new GlyphsError(message, options)
  return value as Exclude<T, undefined>
}

/**
 * Assert that a value is not `undefined` or `null`
 *
 * @param value   Value to assert
 * @param message Error message
 * @param options Error options
 *
 * @throws If `value` is `undefined` or `null`
 */
export function assertNonNullable<T>(
  value: T,
  message: string = 'Value is nullable',
  options?: GlyphsErrorOptions
): NonNullable<T> {
  if (value === undefined || value === null) throw new GlyphsError(message, options)
  return value as NonNullable<T>
}

/**
 * Assert that a value is a number
 *
 * @param value   Value to assert
 * @param message Error message
 * @param options Error options
 *
 * @throws If `value` is not a number
 */
export function assertNumber<T>(
  value: T,
  message: string = 'Value is not a number',
  options?: GlyphsErrorOptions
): number {
  if (typeof value !== 'number' || isNaN(value)) throw new GlyphsError(message, options)
  return value as number
}

/**
 * Throw an unreachable error if this function is executed
 *
 * @param message Error message
 * @param options Error options
 *
 * @throws If executed
 */
export function throwUnreachable(message: string = 'Unreachable', options?: GlyphsErrorOptions): never {
  throw new GlyphsError(message, options)
}
