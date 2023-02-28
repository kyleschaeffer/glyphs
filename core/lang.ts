/**
 * Capitalize the first letter in a string
 *
 * @param str String to modify
 */
export function sentenceCase(str: string): string {
  return str.length ? `${str[0].toUpperCase()}${str.toLowerCase().slice(1)}` : str
}

/**
 * Transform a string to title case
 *
 * @param str String to modify
 */
export function titleCase(str: string): string {
  return str
    .split(/[\s-]/)
    .filter((w) => w.length)
    .map((_word) => _word.split('.').map(sentenceCase).join('.'))
    .join(' ')
}

/**
 * Sanitize a word string
 *
 * @param word Word string
 */
export function sanitizeWord(word: string): string {
  return word
    .replace(/&amp;/gi, '&')
    .replace(/[⊛“”]|^<|>$/g, '')
    .trim()
    .toLowerCase()
}

/**
 * Merge names and keywords, ensuring that no duplicates appear
 *
 * @param name     Name
 * @param keywords Keywords: comma-, semicolon-, or pipe-separated
 */
export function mergeKeywords(name: string, keywords: string[]): [name: string, keywords: string[] | undefined] {
  const sanitizedName = sanitizeWord(name)
  const mergedKeywords = new Set([sanitizedName, ...keywords.map(sanitizeWord).filter((w) => w.length)])
  mergedKeywords.delete(sanitizedName)
  return [titleCase(sanitizedName), mergedKeywords.size ? Array.from(mergedKeywords) : undefined]
}
