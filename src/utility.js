const _ = require('lodash');

module.exports = {
  /**
   * Convert a potentially large decimal value to one or more hexes
   * @param {number} decimal Decimal value to convert
   */
  decimalToHexes (decimal) {
    // Normal hexadecimal
    if (decimal <= 0xFFFF) return [ _.padStart(decimal.toString(16).toUpperCase(), 4, '0') ];

    // Convert to lead & tail hexadecimals
    decimal -= 0x10000;
    const lead = 0xD800 + (decimal >> 10);
    const tail = 0xDC00 + (decimal & parseInt('1111111111', 2));

    return [
      lead.toString(16).toUpperCase(),
      tail.toString(16).toUpperCase(),
    ];
  },

  /**
   * Convert a single character to hexadecimal notation
   * @param {string} char Character to convert
   * @return {string}
   */
  charToHex (char) {
    return _.padStart(this.charToDecimal(char).toString(16).toUpperCase(), 4, '0');
  },

  /**
   * Convert a single character to decimal notation
   * @param {string} char Character to convert
   * @return {number}
   */
  charToDecimal (char) {
    return char.charCodeAt(0);
  },

  /**
   * Convert a hexadecimal value to JavaScript notation
   * @param {string} hex Hexadecimal value to convert
   * @return {string}
   */
  hexToJs (hex) {
    return `\\u${hex}`;
  },

  /**
   * Convert a hexadecimal value to CSS notation
   * @param {string} hex Hexadecimal value to convert
   * @return {string}
   */
  hexToCss (hex) {
    return `\\${hex}`;
  },

  /**
   * Convert a hexadecimal value to HTML notation
   * @param {string} hex Hexadecimal value to convert
   * @return {string}
   */
  hexToHtml (hex) {
    return `&x#${hex}`;
  },

  /**
   * Convert a potentially large hexadecimal value into multiple hexes
   * @param {string} hexStr Potentially large hexadecimal value
   * @return {string[]}
   */
  hexStrToHexes (hexStr) {
    return this.decimalToHexes(parseInt(hexStr, 16));
  },

  /**
   * Convert a string to a hexadecimal array
   * @param {string} str String to convert
   * @return {string[]}
   */
  strToHexes (str) {
    return str.split('').map(c => this.charToHex(c));
  },

  /**
   * Convert a string to a decimal array
   * @param {string} str String to convert
   * @return {number[]}
   */
  strToDecimals (str) {
    return str.split('').map(c => this.charToDecimal(c));
  },

  /**
   * Convert a string to JavaScript notation array
   * @param {string} str String to convert
   * @return {string[]}
   */
  strToJs (str) {
    return this.strToHexes(str).map(hex => this.hexToJs(hex));
  },

  /**
   * Convert a string to CSS notation array
   * @param {string} str String to convert
   * @return {string[]}
   */
  strToCss (str) {
    return this.strToHexes(str).map(hex => this.hexToCss(hex));
  },

  /**
   * Convert a string to HTML notation array
   * @param {string} str String to convert
   * @return {string[]}
   */
  strToHtml (str) {
    return this.strToHexes(str).map(hex => this.hexToHtml(hex));
  },

  /**
   * Convert an array of hexes to a character string
   * @param {string[]} hexes Hex array to convert
   */
  hexesToStr (hexes) {
    return hexes.map(hex => this.hexToJs(hex)).join('');
  },

  /**
   * Convert a decimal value to a string
   * @param {number} decimal The decimal to convert
   */
  decimalToStr (decimal) {
    return String.fromCodePoint(decimal);
  },
};
