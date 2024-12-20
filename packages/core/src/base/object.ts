export function patch<T>(obj: T, ...patches: Partial<T>[]): T {
  const next = { ...obj }
  for (const patch of patches) {
    for (const prop in patch) {
      if (patch[prop] !== undefined) {
        next[prop as keyof T] = patch[prop]
      }
    }
  }
  return next
}
