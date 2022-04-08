/**
 * Convert a string to individual character decimal values
 *
 * @param   {string}   str String
 * @returns {number[]}
 */
const stringToDecimals = (str) => str.split('').map((char) => char.charCodeAt(0))

/**
 * Convert a hexadecimal value to a decimal value
 *
 * @param   {string} hex Hexadecimal value
 * @returns {number}
 */
const hexToDecimal = (hex) => parseInt(hex, 16)

/**
 * Convert a decimal value to a fixed-size hexadecimal value
 *  - Example: `90` -> `"005A"`
 *
 * @param   {number} decimal Decimal value
 * @param   {size}   size    String size, padded with leading zeroes if needed (default: `4`)
 * @returns {string}
 */
const decimalToHex = (decimal, size = 4) => decimal.toString(16).toUpperCase().padStart(size, '0')

/**
 * Trim leading zeroes from a hexadecimal value
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
const trimHex = (hex) => hex.replace(/^0*/, '')

/**
 * Convert an HTML entity name to an HTML entity
 *
 * @param   {string} entity Entity name
 * @returns {string}
 */
const entityToHtml = (entity) => `&${entity};`

/**
 * Convert a decimal value to an HTML entity
 *
 * @param   {string} decimal Decimal value
 * @returns {string}
 */
const decimalToHtml = (decimal) => `#${decimal}`

/**
 * Convert a hexadecimal value to an HTML entity; note that HTML requires UTF-32 encoded values
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
const hexToHtml = (hex) => `#x${hex}`

/**
 * Convert a hexadecimal value to CSS notation; note that CSS requires UTF-32 encoded values without leading zeroes
 *
 * @param   {string} hex Hexadecimal value to convert
 * @returns {string}
 */
const hexToCss = (hex) => `\\${trimHex(hex)}`

/**
 * Convert a hexadecimal value to a JavaScript notation; note that JavaScript requires UTF-16 encoded values
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
const hexToJs = (hex) => `0x${hex}`

/**
 * Convert UTF-16 hexadecimal encodings (space-separated) to comma-separated JavaScript hexadecimal notation
 *
 * @param   {string} hexes  UTF-16 hexadecimal encodings (space-separated)
 * @param   {string} [join] Join string (default: `", "`)
 * @returns {string}
 */
const hexesToJs = (hexes, join = ', ') => hexes.split(' ').map(hexToJs).join(join)

/**
 * Convert a hexadecimal value to a Unicode escape sequence; note that JavaScript requires UTF-16 encoded values
 *
 * @param   {string} hex Hexadecimal value
 * @returns {string}
 */
const hexToUnicodeEscapeSequence = (hex) => `\\u${hex}`

/**
 * Convert UTF-16 hexadecimal encodings (space-separated) to a Unicode escape sequence
 *
 * @param   {string} hexes UTF-16 hexadecimal encodings (space-separated)
 * @returns {string}
 */
const hexesToUnicodeEscapeSequence = (hexes) => hexes.split(' ').map(hexToUnicodeEscapeSequence).join('')

/**
 * Sanitize a string by escaping single quotes
 *
 * @param   {string} str String value
 * @returns {string}
 */
const escapeQuotes = (str) => str.replace(/'/g, "\\'")

/**
 * Convert a decimal value to one or more UTF-16 hexadecimal encodings
 *
 * @param   {number}   decimal Decimal value to convert
 * @returns {string[]}
 */
const decimalToUtf16 = (decimal) => {
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
const stringToUtf16 = (str) => stringToDecimals(str).map(decimalToUtf16).flat()

/**
 * Convert a decimal value to a UTF-32 hexadecimal encoding
 *
 * @param   {number} decimal Decimal value
 * @returns {string}
 */
const decimalToUtf32 = (decimal) => decimalToHex(decimal, 8)

/**
 * Convert UTF-16 hexadecimal encodings to a string
 *
 * @param   {string[]} hexes UTF-16 Hexadecimal encodings
 * @returns {string}
 */
const utf16ToString = (hexes) => String.fromCharCode(...hexes.map((hex) => hexToDecimal(hex)))

/**
 * Convert a decimal value to a string
 *
 * @param   {number} decimal Decimal value
 * @returns {string}
 */
const decimalToString = (decimal) => utf16ToString(decimalToUtf16(decimal))

/**
 * Format a glyph name
 *
 * @param   {string} names Glyph name(s); comma-separated
 * @returns {string}
 */
const glyphName = (names) => names.split(',')[0]

/**
 * Format a glyph description without repeating phrases
 *
 * @param   {string} names      Glyph name(s); comma-separated
 * @param   {string} [keywords] Keyword phrases; comma-separated
 * @returns {string | undefined}
 */
const glyphDescription = (names, keywords) => {
  const glyphNames = names.split(',')
  const descriptions = new Set([
    ...glyphNames,
    ...(keywords ?? '')
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length),
  ])
  descriptions.delete(glyphNames[0])
  return descriptions.size ? [...descriptions].join(', ') : undefined
}

module.exports = {
  stringToDecimals,
  hexToDecimal,
  decimalToHex,
  trimHex,
  entityToHtml,
  decimalToHtml,
  hexToHtml,
  hexToCss,
  hexToJs,
  hexesToJs,
  hexToUnicodeEscapeSequence,
  hexesToUnicodeEscapeSequence,
  escapeQuotes,
  decimalToUtf16,
  stringToUtf16,
  decimalToUtf32,
  utf16ToString,
  decimalToString,
  glyphName,
  glyphDescription,
}
