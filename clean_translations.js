import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./data/shiji/017.json', 'utf8'));

// Function to clean all translations
function cleanTranslations(obj) {
  // Clean paragraph-level translations
  if (obj.translations) {
    obj.translations = [];
  }

  // Clean sentence-level translations
  if (obj.sentences) {
    for (const sentence of obj.sentences) {
      if (sentence.translations) {
        sentence.translations = [];
      }
    }
  }

  // Clean cell-level translations
  if (obj.cells) {
    for (const cell of obj.cells) {
      if (cell.translation) {
        delete cell.translation;
      }
      if (cell.translator) delete cell.translator;
      if (cell.model) delete cell.model;
    }
  }

  // Recurse on children
  if (obj.children) {
    obj.children.forEach(cleanTranslations);
  }
}

cleanTranslations(data);

// Reset count
data.meta.translatedCount = 0;

// Write back
fs.writeFileSync('./data/shiji/017.json', JSON.stringify(data, null, 2));
console.log('Cleaned all translations from Chapter 17');


