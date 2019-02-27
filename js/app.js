const axios = require('axios');
const Fuse = require('fuse.js');
const queryString = require('query-string');

// Fuse config
const fuseOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'name',
    'entity',
    'hex',
  ],
};

const init = async function () {
  // Get elements
  const searchBox = document.getElementById('search');
  const glyphResults = document.getElementById('glyphs');

  // Get glyph data
  let glyphs = [];
  let fuse;
  try {
    const utf = await axios.get('glyphs/utf.json');
    const emoji = await axios.get('glyphs/emoji.json');
    glyphs = utf.data.chars.concat(emoji.data.chars);
    fuse = new Fuse(glyphs, fuseOptions);
  } catch (e) {
    console.error(e);
  }

  // Activate search
  searchBox.removeAttribute('disabled');
  searchBox.setAttribute('placeholder', 'Search for glyphs\u2026');
  searchBox.focus();

  // Application state
  const state = {
    k: '',
    c: null,
    max: 256,
    last: null,
  };

  // Generate state hash
  const stateHash = state => {
    return `#k=${encodeURIComponent(state.k)}${state.c ? `&c=${encodeURIComponent(state.c)}` : ''}`;
  };

  // Perform search
  const searchGlyphs = () => {
    // Search hasn't changed
    if (state.k === state.last) return;

    // Reset glyphs
    glyphResults.innerHTML = '';

    // No search terms
    if (!state.k) return;

    // HTML builder
    let html = '';

    // Search glyphs
    const results = fuse.search(state.k);
    for (let i = 0; i < results.length; i++) {
      html += `<li title="${results[i].name}" data-char="${results[i].hex}">${charHexes(results[i])}</li>`;
      if (i >= state.max) break;
    };

    // Update glyph results
    glyphResults.innerHTML = html;

    // Save last search
    state.last = state.k;
  };

  // Handle hash changes
  const hashChange = () => {
    // Update state
    const { k, c } = queryString.parse(location.hash);
    state.k = k ? k : '';
    state.c = c ? c : null;

    // Update state hash
    const newStateHash = stateHash(state);
    if (location.hash != newStateHash) location.replace(newStateHash);

    // Update search box
    searchBox.value = state.k;

    // Trigger a new search
    searchGlyphs();
  };

  // Get hexes from character
  const charHexes = char => {
    let hexes = '';
    char.hex.split(' ').forEach(hex => {
      const unicode = parseInt(hex, 16);
      hexes += `&#x${hex};`;
    });
    return hexes;
  };

  // Handle input changes
  const inputChange = e => {
    location.replace(stateHash({
      k: e.target.value,
      c: state.char,
    }));
  };

  // Search
  searchBox.addEventListener('keyup', inputChange);
  searchBox.addEventListener('change', inputChange);
  searchBox.addEventListener('search', inputChange);

  // Hash
  window.addEventListener('hashchange', hashChange);

  // Load state
  hashChange();
};

init();
