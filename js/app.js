const axios = require('axios');

const init = async function () {
  // Get elements
  const searchBox = document.getElementById('search');
  const glyphResults = document.getElementById('glyphs');

  // Get glyph data
  const glyphs = {};
  try {
    const utf = await axios.get('glyphs/utf.json');
    const emoji = await axios.get('glyphs/emoji.json');
    glyphs.utf = utf.data;
    glyphs.emoji = emoji.data;
  } catch (e) {
    console.error(e);
  }

  // Activate search
  searchBox.removeAttribute('disabled');
  searchBox.setAttribute('placeholder', 'Search for glyphs\u2026');
  searchBox.focus();

  // Track current search keywords
  let keywords;

  // Get hexes from character
  const charHexes = char => {
    let hexes = '';
    char.hex.split(' ').forEach(hex => {
      const unicode = parseInt(hex, 16);
      hexes += `&#x${hex};`;
    });
    return hexes;
  };

  // Perform search
  const searchGlyphs = e => {
    // Search hasn't changed
    if (e.target.value === keywords) return;

    // Update keywords
    keywords = e.target.value;

    // Reset glyphs
    glyphResults.innerHTML = '';

    // No search terms
    if (!keywords) return;

    // Matching pattern
    let pattern = new RegExp(`${keywords}`, 'ig');
    if (keywords.length === 1) pattern = new RegExp(` ${keywords}$`, 'ig');

    // HTML builder
    let html = '';
    let resultCount = 0;

    // Search glyphs
    glyphs.utf.chars.forEach(char => {
      if (char.name && char.name.match(pattern)) {
        html += `<li title="${char.name}">${charHexes(char)}</li>`;
        resultCount++;
      }
      if (resultCount >= 256) return false;
    });

    // Search Emoji
    glyphs.emoji.chars.forEach(char => {
      if (char.name && char.name.match(pattern)) {
        html += `<li title="${char.name}">${charHexes(char)}</li>`;
        resultCount++;
      }
      if (resultCount >= 256) return false;
    });

    // Update glyph results
    glyphResults.innerHTML = html;
  };

  // Search
  searchBox.addEventListener('keyup', searchGlyphs);
  searchBox.addEventListener('change', searchGlyphs);
  searchBox.addEventListener('search', searchGlyphs);
};

init();
