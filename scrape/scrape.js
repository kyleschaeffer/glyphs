const chalk = require('chalk');
const fetch = require('node-fetch');
const fs = require('fs');

const scrape = async function() {
  // Init glyphs array
  const glyphs = [];

  // Get unicode data (semi-colon separated w/ 14 columns)
  console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/Public/11.0.0/ucd/UnicodeData.txt')}`);
  const unicodeData = await fetch('https://www.unicode.org/Public/11.0.0/ucd/UnicodeData.txt').then(r => r.text());

  // Get HTML entity data
  console.log(`${chalk.green('GET')} ${chalk.underline('https://dev.w3.org/html5/html-author/charref')}`);
  const entityData = await fetch('https://dev.w3.org/html5/html-author/charref').then(r => r.text());

  // // Get Emoji list
  // console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/emoji/charts-11.0/emoji-list.html')}`);
  // const emojiData = await fetch('https://www.unicode.org/emoji/charts-11.0/emoji-list.html').then(r => r.text());

  // // Get Emoji tones
  // console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/emoji/charts-11.0/full-emoji-modifiers.html')}`);
  // const emojiToneData = await fetch('https://www.unicode.org/emoji/charts-11.0/full-emoji-modifiers.html').then(r => r.text());

  // Process entities
  const entities = [];
  const entitiesSearch = /<tr title="U\+(.*?) (.*?)".*?<td class="named"><code>(.*?)<\/code>/ig;
  let entityMatch;
  while (entityMatch = entitiesSearch.exec(entityData)) {
    // Get code point
    const codePoint = parseInt(entityMatch[1], 16);

    // Save entities
    entities[codePoint] = entityMatch[3].replace(/&amp;/g, '&');
  }

  // Process unicode
  const rows = unicodeData.split('\n');
  for (let row of rows) {
    // Parse columns
    const cols = row.split(';');
    if (cols.length < 14) continue;

    // Disregard <control> characters
    if (cols[1] == '<control>') continue;

    // Get code point
    const codePoint = parseInt(cols[0], 16);

    // Get character
    const char = String.fromCodePoint(codePoint);

    // Create glyph
    const glyph = {
      c: char,
      d: codePoint,
      h: cols[0],
      e: null,
      n: `${cols[1]}${cols[10] ? `, ${cols[10]}` : ''}`,
    };

    // Add entities
    if (entities[codePoint]) {
      glyph.e = entities[codePoint];
    }

    // Add glyph
    glyphs.push(glyph);
  }

  // JSON file
  const json = {
    unicode: "11.0",
    date: new Date().toString(),
    glyphs,
  };

  // Write to file
  console.log(`Writing ${chalk.cyan.bold(glyphs.length)} glyphs to file...`);
  fs.writeFileSync('scrape.json', JSON.stringify(json), { flag: 'w' });
};

scrape();
