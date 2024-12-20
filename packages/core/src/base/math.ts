/**
 * Constrain `value` between `min` and `max`
 *
 * @param value Value
 * @param min   Minimum value
 * @param max   Maximum value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linearly interpolate from `x` to `y` by `time`
 *
 * @param x    Starting value
 * @param y    Ending value
 * @param time Interpolation value from `0` (`x`) and `1` (`y`)
 */
export function lerp(x: number, y: number, time: number): number {
  return x * (1 - time) + y * time
}

/**
 * Get the `time` value between `x` and `y` at value `value`
 *
 * @param x     Starting value
 * @param y     Ending value
 * @param value Value between `x` and `y`
 */
export function invlerp(x: number, y: number, value: number): number {
  return (value - x) / (y - x)
}

/**
 * Convert degrees to radians
 *
 * @param deg Degrees
 */
export function degreesToRadians(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 *
 * @param rad Radians
 */
export function radiansToDegrees(rad: number): number {
  return rad * (180 / Math.PI)
}

/**
 * Round `value` to `precision` decimal places
 *
 * @param value     Value
 * @param precision Precision; i.e. number of decimal places
 */
export function toPrecision(value: number, precision: number): number {
  const d = Math.pow(10, precision)
  return Math.round(value * d) / d
}

/**
 * Round a value to a nearest increment
 *
 * @param nearest Nearest increment used for rounding
 * @param value   Value to be rounded
 */
export function roundToNearest(nearest: number, value: number): number {
  return Math.round(value / nearest) * nearest
}
