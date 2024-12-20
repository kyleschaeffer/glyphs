/**
 * Return the current Unix epoch time, or seconds since 00:00:00, Jan 1, 1970
 *
 * @param addend Optional offset added to the current time
 */
export function now(addend: number = 0): number {
  return Math.floor(Date.now() / 1000) + addend
}
