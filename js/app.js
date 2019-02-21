const axios = require('axios');

// Get glyphs container
const glyphs = document.getElementById('glyphs');

// Get UTF data
axios.get('glyphs/utf.json').then(response => {
  // String builder
  let newHtml = '';

  // Add characters
  response.data.chars.forEach(char => {
    let hexes = '';
    char.hex.split(' ').forEach(hex => {
      const unicode = parseInt(hex, 16);
      hexes += `&#x${hex};`;
    });
    newHtml += `<li class="glyph" title="${char.name}">${hexes}</li>`;
  });

  // Get Emoji data
  axios.get('glyphs/emoji.json').then(response => {
    // Add characters
    response.data.chars.forEach(char => {
      let hexes = '';
      char.hex.split(' ').forEach(hex => {
        const unicode = parseInt(hex, 16);
        hexes += `&#x${hex};`;
      });
      newHtml += `<li class="glyph" title="${char.name}">${hexes}</li>`;
    });

    // Update document
    glyphs.innerHTML = newHtml;
  });
});
