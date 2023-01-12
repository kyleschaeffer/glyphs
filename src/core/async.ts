/**
 * Create a debounced version of a function
 *
 * @param fn    Function to debounce
 * @param delay Debounce delay in MS
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
