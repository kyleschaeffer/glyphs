/**
 * Get system color scheme preference
 */
export function getColorSchemePreference(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function parseHash(hash: string = location.hash): Record<string, string | undefined> {
  const parsed: Record<string, string | undefined> = {}

  const params = hash.slice(1).split('&')
  for (const param of params) {
    const [key, value] = param.split('=', 2)
    if (!key || !value) continue
    parsed[key] = decodeURIComponent(value)
  }

  return parsed
}
