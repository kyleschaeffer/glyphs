#!/usr/bin/env node

const chalk = require('chalk');
const fetch = require('node-fetch');
const fs = require('fs');
const utility = require('../src/utility');

const scrape = async function() {
  // Init glyphs array
  const glyphs = [];

  // Get unicode data (semi-colon separated w/ 14 columns)
  console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/Public/11.0.0/ucd/UnicodeData.txt')}`);
  const unicodeData = await fetch('https://www.unicode.org/Public/11.0.0/ucd/UnicodeData.txt').then(r => r.text());

  // Get HTML entity data
  console.log(`${chalk.green('GET')} ${chalk.underline('https://dev.w3.org/html5/html-author/charref')}`);
  const entityData = await fetch('https://dev.w3.org/html5/html-author/charref').then(r => r.text());

  // Get Emoji list
  console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/emoji/charts-11.0/emoji-list.html')}`);
  const emojiData = await fetch('https://www.unicode.org/emoji/charts-11.0/emoji-list.html').then(r => r.text());

  // Get Emoji tones
  console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/emoji/charts-11.0/full-emoji-modifiers.html')}`);
  const emojiToneData = await fetch('https://www.unicode.org/emoji/charts-11.0/full-emoji-modifiers.html').then(r => r.text());

  // Process entities
  const entities = [];
  const entitiesSearch = /<tr title="U\+(.*?) (.*?)".*?<td class="named"><code>(.*?)<\/code>/ig;
  let entityMatch;
  while (entityMatch = entitiesSearch.exec(entityData)) {
    // Get decimal
    const decimal = parseInt(entityMatch[1], 16);

    // Save entities
    entities[decimal] = entityMatch[3].replace(/&amp;/g, '&').replace(/&/g, '').replace(/;/g, '');
  }

  // Process unicode
  const rows = unicodeData.split('\n');
  for (let row of rows) {
    // Parse columns
    const cols = row.split(';');
    if (cols.length < 14) continue;

    // Disregard <control> characters
    if (cols[1] == '<control>') continue;

    // Get hex array
    const hexes = utility.hexStrToHexes(cols[0]);

    // Get decimal value
    const d = parseInt(cols[0], 16);

    // Get character
    const c = utility.decimalToStr(d);

    // Create glyph
    const glyph = {
      c,
      u: cols[0],
      h: hexes.join(' '),
      n: `${cols[1] ? cols[1] : cols[10]}`,
    };

    // Add keywords
    if (cols[1] && cols[10] && cols[1] !== cols[10]) {
      glyph.k = cols[10];
    }

    // Add entities
    if (entities[d]) {
      glyph.e = entities[d];
    }

    // Add glyph
    glyphs.push(glyph);
  }

  // Process Emoji
  const emojiSearch = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/ig;
  let emojiMatch;
  while (emojiMatch = emojiSearch.exec(emojiData)) {
    // Get character
    const c = emojiMatch[2];

    // Get hexes
    const hexes = utility.strToHexes(c);

    // Create glyph
    const glyph = {
      c,
      u: emojiMatch[1].replace(/U\+/g, ''),
      h: hexes.join(' '),
      n: emojiMatch[3],
    };

    // Add keywords
    const keywords = emojiMatch[4].replace(/ \| /g, ',');
    if (glyph.n !== keywords) {
      glyph.k = keywords;
    }

    // Add glyph
    glyphs.push(glyph);
  }

  // Process Emoji skin tones
  const emojiToneSearch = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/ig;
  let emojiToneMatch;
  while (emojiToneMatch = emojiToneSearch.exec(emojiToneData)) {
    // Get character
    const c = emojiToneMatch[2];

    // Get hexes
    const hexes = utility.strToHexes(c);

    // Create glyph
    const glyph = {
      c,
      u: emojiToneMatch[1].replace(/U\+/g, ''),
      h: hexes.join(' '),
      n: emojiToneMatch[3]
    };

    // Add glyph
    glyphs.push(glyph);
  }

  // Write to file
  console.log(`Writing ${chalk.cyan.bold(glyphs.length)} glyphs to file...`);
  fs.writeFileSync('docs/glyphs/unicode-11.0.0.json', JSON.stringify({glyphs}), { flag: 'w' });
};

scrape();
