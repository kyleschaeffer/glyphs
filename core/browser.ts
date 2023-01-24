/**
 * Get system color scheme preference
 */
export function getColorSchemePreference(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export type CSSClassName = string | null | undefined | { [className: string]: boolean | null | undefined }

/**
 * Create a CSS class name utility
 *
 * @param styles Imported style class name obfuscation record
 */
export function bindStyles(styles: { [key: string]: string } = {}) {
  /**
   * Build a CSS class names string
   *
   * @param classNames CSS class names and/or class name conditionals
   */
  return function cx(...classNames: CSSClassName[]): string | undefined {
    const truthyClassNames: string[] = []
    for (const className of classNames) {
      if (!className) continue
      if (typeof className === 'string') {
        truthyClassNames.push(styles[className] ?? className)
        continue
      }
      for (const [classNameKey, classNameValue] of Object.entries(className)) {
        if (!classNameValue) continue
        truthyClassNames.push(styles[classNameKey] ?? classNameKey)
      }
    }
    return truthyClassNames.length ? truthyClassNames.join(' ') : undefined
  }
}
