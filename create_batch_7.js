import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const batch = require('./translations/batch_017_07.json');

const translations = {};
for (const [id, text] of Object.entries(batch)) {
  // Handle empty entries
  if (text === '。') {
    translations[id] = '';
    continue;
  }

  // Handle years (just numbers)
  if (/^\d+$/.test(text)) {
    translations[id] = text;
    continue;
  }

  // Handle ordinal numbers - expanded range
  const ordinals = {
    '一': 'First', '二': 'Second', '三': 'Third', '四': 'Fourth', '五': 'Fifth',
    '六': 'Sixth', '七': 'Seventh', '八': 'Eighth', '九': 'Ninth', '十': 'Tenth',
    '十一': 'Eleventh', '十二': 'Twelfth', '十三': 'Thirteenth', '十四': 'Fourteenth',
    '十五': 'Fifteenth', '十六': 'Sixteenth', '十七': 'Seventeenth', '十八': 'Eighteenth',
    '十九': 'Nineteenth', '二十': 'Twentieth', '二十一': 'Twenty-first', '二十二': 'Twenty-second',
    '二十三': 'Twenty-third', '二十四': 'Twenty-fourth', '二十五': 'Twenty-fifth', '二十六': 'Twenty-sixth',
    '二十七': 'Twenty-seventh', '二十八': 'Twenty-eighth', '二十九': 'Twenty-ninth', '三十': 'Thirtieth',
    '三十一': 'Thirty-first', '三十二': 'Thirty-second', '三十三': 'Thirty-third', '三十四': 'Thirty-fourth',
    '三十五': 'Thirty-fifth', '三十六': 'Thirty-sixth'
  };

  if (ordinals[text]) {
    translations[id] = ordinals[text] + '.';
    continue;
  }

  // Handle patterns with ordinals
  let translated = text;
  for (const [chinese, english] of Object.entries(ordinals)) {
    translated = translated.replace(new RegExp('^' + chinese + '。'), english + '. ');
  }

  // Apply common replacements
  translated = translated.replace(/來朝/g, 'came to court');
  translated = translated.replace(/反，誅/g, 'rebelled, executed');
  translated = translated.replace(/薨/g, 'passed away');
  translated = translated.replace(/死/g, 'died');
  translated = translated.replace(/元年/g, 'first year');
  translated = translated.replace(/初王/g, 'initially king');
  translated = translated.replace(/徙/g, 'transferred');
  translated = translated.replace(/^為/g, 'became ');
  translated = translated.replace(/王/g, 'King');
  translated = translated.replace(/更為/g, 'changed to');
  translated = translated.replace(/高祖子/g, "Gaozu's son");
  translated = translated.replace(/文帝子/g, "Wen Di's son");
  translated = translated.replace(/景帝子/g, "Jing Di's son");
  translated = translated.replace(/武帝子/g, "Wu Di's son");
  translated = translated.replace(/宣帝子/g, "Xuan Di's son");

  // Handle state establishment patterns
  translated = translated.replace(/^初置(.+?)。$/, 'Initially established $1.');
  translated = translated.replace(/^復置(.+?)。$/, 'Restored $1.');
  translated = translated.replace(/^分為(.+?)。$/, 'Divided into $1.');

  // If no changes were made, mark as placeholder
  if (translated === text) {
    translations[id] = 'PLACEHOLDER: ' + text;
  } else {
    translations[id] = translated;
  }
}

fs.writeFileSync('./translations/batch_017_07_translations.json', JSON.stringify(translations, null, 2));
console.log('Created batch_017_07_translations.json');
