/**
 * Convert a string to individual character decimal values
 *
 * @param   {string}   str String
 * @returns {number[]}
 */
export const stringToDecimals = (str) => str.split('').map((char) => char.charCodeAt(0))

/**
 * Convert a hexadecimal value to a decimal value
 *
 * @param   {string} hex Hexadecimal value
 * @returns {number}
 */
export const hexToDecimal = (hex) => parseInt(hex, 16)

/**
 * Convert a decimal value to a fixed-size hexadecimal value
 *  - Example: `90` -> `"005A"`
 *
 * @param   {number} decimal Decimal value
 * @param   {size}   size    String size, padded with leading zeroes if needed (default: `4`)
 * @returns {string}
 */
export const decimalToHex = (decimal, size = 4) => decimal.toString(16).toUpperCase().padStart(size, '0')

/**
 * Convert an HTML entity name to an HTML entity
 *
 * @param   {string} entity Entity name
 * @returns {string}
 */
export const entityToHtml = (entity) => `&${entity};`

/**
 * Convert a decimal value to an HTML entity
 *
 * @param   {string} decimal Decimal value
 * @returns {string}
 */
export const decimalToHtml = (decimal) => `&#${decimal};`

/**
 * Convert a hexadecimal value to an HTML entity; note that HTML requires UTF-32 encoded values
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
export const hexToHtml = (hex) => `&#x${hex};`

/**
 * Convert a hexadecimal value to CSS notation; note that CSS requires UTF-16 encoded values
 *
 * @param   {string} hex Hexadecimal value to convert
 * @returns {string}
 */
export const hexToCss = (hex) => `\\${hex}`

/**
 * Convert a hexadecimal value to a JavaScript notation; note that JavaScript requires UTF-16 encoded values
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
export const hexToJs = (hex) => `0x${hex}`

/**
 * Convert a hexadecimal value to a Unicode escape sequence; note that JavaScript requires UTF-16 encoded values
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
export const hexToUnicodeEscapeSequence = (hex) => `\\u${hex}`

/**
 * Sanitize a string by escaping single quotes
 *
 * @param   {string} str String value
 * @returns {string}
 */
export const escapeQuotes = (str) => str.replace(/'/g, "\\'")

/**
 * Convert a decimal value to one or more UTF-16 hexadecimal encodings
 *
 * @param   {number}   decimal Decimal value to convert
 * @returns {string[]}
 */
export const decimalToUtf16 = (decimal) => {
  if (decimal <= 0xffff) return [decimalToHex(decimal)]
  decimal -= 0x10000
  const lead = 0xd800 + (decimal >> 10)
  const tail = 0xdc00 + (decimal & parseInt('1111111111', 2))
  return [decimalToHex(lead), decimalToHex(tail)]
}

/**
 * Convert a decimal value to a UTF-32 hexadecimal encoding
 *
 * @param   {number} decimal Decimal value
 * @returns {string}
 */
export const decimalToUtf32 = (decimal) => decimalToHex(decimal, 8)

/**
 * Convert UTF-16 hexadecimal encodings to a string
 *
 * @param   {string[]} hexes UTF-16 Hexadecimal encodings
 * @returns {string}
 */
export const utf16ToString = (hexes) => String.fromCharCode(...hexes.map((hex) => hexToDecimal(hex)))

/**
 * Convert a decimal value to a string
 *
 * @param   {number} decimal Decimal value
 * @returns {string}
 */
export const decimalToString = (decimal) => utf16ToString(decimalToUtf16(decimal))
