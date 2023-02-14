export const UNICODE_VERSIONS = ['5.0', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0', '12.0', '13.0', '14.0', '15.0']

export const EXCLUDED_BLOCKS = ['High Private Use Surrogates', 'High Surrogates', 'Low Surrogates']

// [1]=entity; [2]=decimal
export const HTML_ENTITY_DATA_URL = 'https://www.w3.org/TR/html4/sgml/entities.html'
export const HTML_ENTITY_DATA_SEARCH = /!ENTITY\s+(\w+)\s+CDATA\s+"&amp;#(\d+)/g

// [1]=utf32; [2]=character; [3]=name; [4]?=keywords
export const EMOJI_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/gi

// [1]=utf32; [2]=character; [3]=name
// TODO: categories and groups
export const EMOJI_TONE_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/gi

// CSV; 2 columns; [0]=utf32Start; [1]=utf32End; [2]=block
export const UNICODE_BLOCK_DATA_SEARCH = /(.*?)(?:\.\.(.*))?;\s(.*?)\n/gim

// CSV; 2 columns; [0]=utf32Start; [1]?=utf32End; [2]=version; [3]?=count; [4]=description
export const UNICODE_VERSION_DATA_URL = `https://www.unicode.org/Public/15.0.0/ucd/DerivedAge.txt`
export const UNICODE_VERSION_DATA_SEARCH = /(.*?)(?:\.\.(.*))?\s+;\s([\d.]+)\s#\s+(?:\[(\d+)\])?(.*?)\n/gim
