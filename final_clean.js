import fs from 'fs';

// Read the file
let content = fs.readFileSync('./data/shiji/017.json', 'utf8');

// Remove all translation arrays and objects
content = content.replace(/"translations": \[[^\]]*\]/g, '"translations": []');
content = content.replace(/"translation": "[^"]*"/g, '');
content = content.replace(/"translator": "[^"]*"/g, '');
content = content.replace(/"model": "[^"]*"/g, '');

// Clean up any double commas or formatting issues
content = content.replace(/,(\s*[}\]])/g, '$1');
content = content.replace(/,(\s*),/g, ',');
content = content.replace(/\n\s*\n/g, '\n');

// Reset the translated count
content = content.replace(/"translatedCount": \d+/, '"translatedCount": 0');

// Write back
fs.writeFileSync('./data/shiji/017.json', content);
console.log('Completely cleaned Chapter 17 of all translations');

