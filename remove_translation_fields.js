import fs from 'fs';

// Read the file
let content = fs.readFileSync('./data/shiji/017.json', 'utf8');

// Remove all translation fields completely
content = content.replace(/"translation": "[^"]*",?\s*/g, '');
content = content.replace(/"translator": "[^"]*",?\s*/g, '');
content = content.replace(/"model": "[^"]*",?\s*/g, '');

// Clean up empty objects and arrays
content = content.replace(/\s*{\s*},?/g, '');
content = content.replace(/\s*\[\s*\],?/g, '');

// Clean up trailing commas
content = content.replace(/,(\s*[}\]])/g, '$1');

// Fix the translatedCount
content = content.replace(/"translatedCount": \d+/, '"translatedCount": 0');

// Write back
fs.writeFileSync('./data/shiji/017.json', content);
console.log('Completely removed all translation fields from Chapter 17');




