/**
 * Capitalize the first letter in a string
 *
 * @param str String
 */
export function sentenceCase(str: string): string {
  return str.length ? `${str[0]!.toUpperCase()}${str.toLowerCase().slice(1)}` : str
}

/**
 * Transform a string to title case
 *
 * @param str String
 */
export function titleCase(str: string): string {
  return str
    .split(/[\s-]/)
    .filter((w) => w.length)
    .map((_word) => _word.split('.').map(sentenceCase).join('.'))
    .join(' ')
}

/**
 * Transform a string into a URL-friendly slug
 *
 * @param str String
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^\s+|\s+$/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/^\d+-*/, '')
}

/**
 * Slugified string regular expression pattern
 *  1. Starts with a lowercase letter
 *  2. Contains only lowercase letters, digits, and hyphens
 *  3. Ends with a lowercase letter or digit
 */
export const SLUG_REGEX = /^[a-z][a-z0-9-]*[a-z0-9]$/

/**
 * Slug repeat hyphen regular expression pattern; detects repeat hyphens in a slug string
 */
export const SLUG_REPEAT_HYPHEN_REGEX = /-{2,}/

/**
 * Determine if a slug string is valid
 *
 * @param slug Slug string
 *
 * @returns A boolean indicating whether or not the given slug is valid
 */
export function isSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug) && !SLUG_REPEAT_HYPHEN_REGEX.test(slug)
}
