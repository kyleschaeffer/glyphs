/**
 * Convert a potentially large decimal value to one or more hexes
 *
 * @param   {number}   decimal Decimal value to convert
 * @returns {string[]}
 */
export const decimalToHexes = (decimal) => {
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
 *
 * @param   {string} char Character to convert
 * @returns {number}
 */
export const charToDecimal = (char) => char.charCodeAt(0)

/**
 * Convert a single character to hexadecimal notation
 *
 * @param   {string} char Character to convert
 * @returns {string}
 */
export const charToHex = (char) => charToDecimal(char).toString(16).toUpperCase().padStart(4, '0')

/**
 * Convert a hexadecimal value to JavaScript notation
 *
 * @param   {string} hex Hexadecimal value to convert
 * @returns {string}
 */
export const hexToJs = (hex) => `\\u${hex}`

/**
 * Convert a hexadecimal value to CSS notation
 *
 * @param   {string} hex Hexadecimal value to convert
 * @returns {string}
 */
export const hexToCss = (hex) => `\\${hex}`

/**
 * Convert a hexadecimal value to HTML notation
 *
 * @param   {string} hex Hexadecimal value to convert
 * @returns {string}
 */
export const hexToHtml = (hex) => `&x#${hex}`

/**
 * Convert a potentially large hexadecimal value into multiple hexes
 *
 * @param   {string}   hexStr Potentially large hexadecimal value
 * @returns {string[]}
 */
export const hexStrToHexes = (hexStr) => decimalToHexes(parseInt(hexStr, 16))

/**
 * Convert a string to a hexadecimal array
 *
 * @param   {string}   str String to convert
 * @returns {string[]}
 */
export const strToHexes = (str) => str.split('').map((c) => charToHex(c))

/**
 * Convert a string to a decimal array
 *
 * @param   {string}   str String to convert
 * @returns {number[]}
 */
export const strToDecimals = (str) => str.split('').map((c) => charToDecimal(c))

/**
 * Convert a string to JavaScript notation array
 *
 * @param   {string}   str String to convert
 * @returns {string[]}
 */
export const strToJs = (str) => strToHexes(str).map((hex) => hexToJs(hex))

/**
 * Convert a string to CSS notation array
 *
 * @param   {string}   str String to convert
 * @returns {string[]}
 */
export const strToCss = (str) => strToHexes(str).map((hex) => hexToCss(hex))

/**
 * Convert a string to HTML notation array
 *
 * @param   {string}   str String to convert
 * @returns {string[]}
 */
export const strToHtml = (str) => strToHexes(str).map((hex) => hexToHtml(hex))

/**
 * Convert an array of hexes to a character string
 *
 * @param   {string[]} hexes Hex array to convert
 * @returns {string}
 */
export const hexesToStr = (hexes) => hexes.map((hex) => hexToJs(hex)).join('')

/**
 * Convert a decimal value to a string
 *
 * @param   {number} decimal The decimal to convert
 * @returns {string}
 */
export const decimalToStr = (decimal) => String.fromCodePoint(decimal)
