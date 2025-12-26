import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./data/shiji/017.json', 'utf8'));

// Function to recursively remove translations
function removeTranslations(obj) {
  if (obj.sentences) {
    for (const sentence of obj.sentences) {
      if (sentence.translations) {
        sentence.translations = []; // Remove all
      }
      // Also remove direct translation field if it exists
      if (sentence.translation) {
        delete sentence.translation;
      }
      // Remove translator and model fields
      if (sentence.translator) delete sentence.translator;
      if (sentence.model) delete sentence.model;
    }
  }

  if (obj.cells) {
    for (const cell of obj.cells) {
      if (cell.translation) {
        delete cell.translation;
      }
      // Also remove translator and model fields
      if (cell.translator) delete cell.translator;
      if (cell.model) delete cell.model;
    }
  }

  if (obj.translations) {
    obj.translations = []; // Remove all
  }

  if (obj.children) {
    obj.children.forEach(removeTranslations);
  }
}

removeTranslations(data);

// Reset translated count
data.meta.translatedCount = 0;

// Write back
fs.writeFileSync('./data/shiji/017.json', JSON.stringify(data, null, 2));
console.log('Removed all translations from Chapter 17 and reset count to 0');




