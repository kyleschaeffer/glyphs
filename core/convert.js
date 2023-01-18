/**
 * Convert a string to individual character decimal values
 *
 * @param   {string}   str String
 * @returns {number[]}
 */
function stringToDecimals(str) {
  return str.split('').map((char) => char.charCodeAt(0))
}

/**
 * Convert a hexadecimal value to a decimal value
 *
 * @param   {string} hex Hexadecimal value
 * @returns {number}
 */
function hexToDecimal(hex) {
  return parseInt(hex, 16)
}

/**
 * Convert a decimal value to a fixed-size hexadecimal value
 *  - Example: `90` -> `"005A"`
 *
 * @param   {number} decimal Decimal value
 * @param   {size}   size    String size, padded with leading zeroes if needed (default: `4`)
 * @returns {string}
 */
function decimalToHex(decimal, size = 4) {
  return decimal.toString(16).toUpperCase().padStart(size, '0')
}

/**
 * Trim leading zeroes from a hexadecimal value
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
function trimHex(hex) {
  return hex.replace(/^0*/, '')
}

/**
 * Convert an HTML entity name to an HTML entity
 *
 * @param   {string} entity Entity name
 * @returns {string}
 */
function entityToHtml(entity) {
  return `&${entity};`
}

/**
 * Convert a decimal value to an HTML entity
 *
 * @param   {number} decimal Decimal value
 * @returns {string}
 */
function decimalToHtml(decimal) {
  return `&#${decimal};`
}

/**
 * Convert a hexadecimal value to an HTML entity; note that HTML requires UTF-32 encoded values
 *
 * @param   {string} hex UTF-32 encoded hexadecimal value
 * @returns {string}
 */
function utf32ToHtml(hex) {
  return `&#x${trimHex(hex)};`
}

/**
 * Convert a hexadecimal value to CSS notation; note that CSS requires UTF-32 encoded values without leading zeroes
 *
 * @param   {string} hex Hexadecimal value to convert
 * @returns {string}
 */
function utf32ToCss(hex) {
  return `\\${trimHex(hex)}`
}

/**
 * Convert UTF-16 hexadecimal encodings to a Unicode escape sequence
 *
 * @param   {string[]} hexes  UTF-16 hexadecimal encodings
 * @returns {string}
 */
function utf16ToUnicodeEscapeSequence(hexes) {
  return hexes.map((hex) => `\\u${hex}`).join('')
}

/**
 * Sanitize a string by escaping single quotes
 *
 * @param   {string} str String value
 * @returns {string}
 */
function escapeSingleQuotes(str) {
  return str.replace(/'/g, "\\'")
}

/**
 * Convert a decimal value to one or more UTF-16 hexadecimal encodings
 *
 * @param   {number}   decimal Decimal value to convert
 * @returns {string[]}
 */
function decimalToUtf16(decimal) {
  if (decimal <= 0xffff) return [decimalToHex(decimal)]
  decimal -= 0x10000
  const lead = 0xd800 + (decimal >> 10)
  const tail = 0xdc00 + (decimal & parseInt('1111111111', 2))
  return [decimalToHex(lead), decimalToHex(tail)]
}

/**
 * Convert a string to one or more UTF-16 hexadecimal encodings
 *
 * @param   {string}   str String
 * @returns {string[]}
 */
function stringToUtf16(str) {
  return stringToDecimals(str).flatMap(decimalToUtf16)
}

/**
 * Convert a decimal value to a UTF-32 hexadecimal encoding
 *
 * @param   {number} decimal Decimal value
 * @returns {string}
 */
function decimalToUtf32(decimal) {
  return decimalToHex(decimal, 8)
}

/**
 * Convert UTF-16 hexadecimal encodings to a string
 *
 * @param   {string[]} hexes UTF-16 Hexadecimal encodings
 * @returns {string}
 */
function utf16ToString(hexes) {
  return String.fromCharCode(...hexes.map((hex) => hexToDecimal(hex)))
}

/**
 * Convert a decimal value to a string
 *
 * @param   {number} decimal Decimal value
 * @returns {string}
 */
function decimalToString(decimal) {
  return utf16ToString(decimalToUtf16(decimal))
}

module.exports = {
  decimalToHex,
  decimalToHtml,
  decimalToString,
  decimalToUtf16,
  decimalToUtf32,
  entityToHtml,
  escapeSingleQuotes,
  hexToDecimal,
  stringToDecimals,
  stringToUtf16,
  trimHex,
  utf16ToString,
  utf16ToUnicodeEscapeSequence,
  utf32ToCss,
  utf32ToHtml,
}
