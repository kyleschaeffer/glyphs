export function defer<T extends (...args: any[]) => any>(callback: T, timeoutMs: number = 0) {
  setTimeout(callback, timeoutMs)
}
