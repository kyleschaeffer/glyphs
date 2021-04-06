/**
 * Convert a potentially large decimal value to one or more hexes
 * @param decimal Decimal value to convert
 */
export const decimalToHexes = (decimal: number): string[] => {
  // Normal hexadecimal
  if (decimal <= 0xffff) return [decimal.toString(16).toUpperCase().padStart(4, '0')]

  // Convert to lead & tail hexadecimals
  decimal -= 0x10000
  const lead = 0xd800 + (decimal >> 10)
  const tail = 0xdc00 + (decimal & parseInt('1111111111', 2))

  return [lead.toString(16).toUpperCase(), tail.toString(16).toUpperCase()]
}

/**
 * Convert a single character to decimal notation
 * @param char Character to convert
 */
export const charToDecimal = (char: string): number => char.charCodeAt(0)

/**
 * Convert a single character to hexadecimal notation
 * @param char Character to convert
 */
export const charToHex = (char: string): string => charToDecimal(char).toString(16).toUpperCase().padStart(4, '0')

/**
 * Convert a hexadecimal value to JavaScript notation
 * @param hex Hexadecimal value to convert
 */
export const hexToJs = (hex: string): string => `\\u${hex}`

/**
 * Convert a hexadecimal value to CSS notation
 * @param hex Hexadecimal value to convert
 */
export const hexToCss = (hex: string): string => `\\${hex}`

/**
 * Convert a hexadecimal value to HTML notation
 * @param hex Hexadecimal value to convert
 */
export const hexToHtml = (hex: string): string => `&x#${hex}`

/**
 * Convert a potentially large hexadecimal value into multiple hexes
 * @param hexStr Potentially large hexadecimal value
 */
export const hexStrToHexes = (hexStr: string): string[] => decimalToHexes(parseInt(hexStr, 16))

/**
 * Convert a string to a hexadecimal array
 * @param str String to convert
 */
export const strToHexes = (str: string): string[] => str.split('').map((c) => charToHex(c))

/**
 * Convert a string to a decimal array
 * @param str String to convert
 */
export const strToDecimals = (str: string): number[] => str.split('').map((c) => charToDecimal(c))

/**
 * Convert a string to JavaScript notation array
 * @param str String to convert
 */
export const strToJs = (str: string): string[] => strToHexes(str).map((hex) => hexToJs(hex))

/**
 * Convert a string to CSS notation array
 * @param str String to convert
 */
export const strToCss = (str: string): string[] => strToHexes(str).map((hex) => hexToCss(hex))

/**
 * Convert a string to HTML notation array
 * @param str String to convert
 */
export const strToHtml = (str: string): string[] => strToHexes(str).map((hex) => hexToHtml(hex))

/**
 * Convert an array of hexes to a character string
 * @param hexes Hex array to convert
 */
export const hexesToStr = (hexes: string[]): string => hexes.map((hex) => hexToJs(hex)).join('')

/**
 * Convert a decimal value to a string
 * @param decimal The decimal to convert
 */
export const decimalToStr = (decimal: number): string => String.fromCodePoint(decimal)
