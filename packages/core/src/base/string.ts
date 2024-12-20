import { titleCase } from './lang'

/**
 * Convert a string to individual character decimal values
 *
 * @param str String
 */
export function stringToDecimals(str: string): number[] {
  return str.split('').map((char) => char.charCodeAt(0))
}

/**
 * Convert a hexadecimal value to a decimal value
 *
 * @param hex Hexadecimal value
 */
export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16)
}

/**
 * Convert a hexadecimal value to a binary value
 *
 * @param hex Hexadecimal value
 */
export function hexToBinary(hex: string): string {
  return parseInt(hex, 16).toString(2).padStart(8, '0')
}

/**
 * Convert a decimal value to a fixed-size hexadecimal value
 *  - Example: `90` -> `"005A"`
 *
 * @param decimal Decimal value
 * @param size    String size, padded with leading zeroes if needed (default: `4`)
 */
export function decimalToHex(decimal: number, size: number = 4): string {
  return decimal.toString(16).toUpperCase().padStart(size, '0')
}

/**
 * Trim leading zeroes from a hexadecimal value
 *
 * @param hex Hexadecimal value
 */
export function trimHex(hex: string): string {
  return hex.replace(/^0*/, '')
}

/**
 * Convert an HTML entity name to an HTML entity
 *
 * @param entity Entity name
 */
export function entityToHtml(entity: string): string {
  return `&${entity};`
}

/**
 * Convert a decimal value to an HTML entity
 *
 * @param decimal Decimal value
 */
export function decimalToHtml(decimal: number): string {
  return `&#${decimal};`
}

/**
 * Convert a hexadecimal value to an HTML entity; note that HTML requires UTF-32 encoded values
 *
 * @param hex UTF-32 encoded hexadecimal value
 */
export function utf32ToHtml(hex: string): string {
  return `&#x${trimHex(hex)};`
}

/**
 * Convert a hexadecimal value to CSS notation; note that CSS requires UTF-32 encoded values without leading zeroes
 *
 * @param hex Hexadecimal value to convert
 */
export function utf32ToCss(hex: string): string {
  return `\\${trimHex(hex)}`
}

/**
 * Convert UTF-16 hexadecimal encodings to a Unicode escape sequence
 *
 * @param hexes UTF-16 hexadecimal encodings
 */
export function utf16ToUnicodeEscapeSequence(hexes: string[]): string {
  return hexes.map((hex) => `\\u${hex}`).join('')
}

/**
 * Convert decimal value to a Unicode hexadecimal escape sequence
 *
 * @param decimal Decimal value
 */
export function decimalToHexEscapeSequence(decimal: number): string {
  return decimal <= 0xff ? `\\x${decimalToHex(decimal, 0)}` : ''
}

/**
 * Convert UTF-32 hexadecimal encodings to a Unicode code point escape sequence
 *
 * @param hexes UTF-32 hexadecimal encodings
 */
export function utf32ToCodePointEscapeSequence(hexes: string[]): string {
  return hexes.map((hex) => `\\u{${trimHex(hex)}}`).join('')
}

/**
 * Sanitize a string by escaping single quotes
 *
 * @param str String value
 */
export function escapeSingleQuotes(str: string): string {
  return str.replace(/'/g, "\\'")
}

/**
 * Convert a decimal value to one or more UTF-16 hexadecimal encodings
 *
 * @param decimal Decimal value to convert
 */
export function decimalToUtf16(decimal: number): string[] {
  if (decimal <= 0xffff) return [decimalToHex(decimal)]
  decimal -= 0x10000
  const lead = 0xd800 + (decimal >> 10)
  const tail = 0xdc00 + (decimal & parseInt('1111111111', 2))
  return [decimalToHex(lead), decimalToHex(tail)]
}

/**
 * Convert a string to one or more UTF-8 hexadecimal encodings
 *
 * @param str String to convert
 */
export function stringToUtf8(str: string): string[] {
  return Array.from(new TextEncoder().encode(str)).map((d) => decimalToHex(d, 2))
}

/**
 * Convert a string to one or more UTF-8 binary encodings
 *
 * @param str String to convert
 */
export function stringToBinary(str: string): string[] {
  return stringToUtf8(str).map(hexToBinary)
}

/**
 * Convert a string to one or more UTF-16 hexadecimal encodings
 *
 * @param str String
 */
export function stringToUtf16(str: string): string[] {
  return stringToDecimals(str).flatMap(decimalToUtf16)
}

/**
 * Convert a decimal value to a UTF-32 hexadecimal encoding
 *
 * @param decimal Decimal value
 */
export function decimalToUtf32(decimal: number): string {
  return decimalToHex(decimal, 8)
}

/**
 * Convert UTF-16 hexadecimal encodings to a string
 *
 * @param hexes UTF-16 Hexadecimal encodings
 */
export function utf16ToString(hexes: string[]): string {
  return String.fromCharCode(...hexes.map((hex) => hexToDecimal(hex)))
}

/**
 * Convert a decimal value to a string
 *
 * @param decimal Decimal value
 */
export function decimalToString(decimal: number): string {
  return utf16ToString(decimalToUtf16(decimal))
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
