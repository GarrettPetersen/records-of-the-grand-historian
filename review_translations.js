import fs from 'fs';

// Read the file
const data = JSON.parse(fs.readFileSync('./data/shiji/017.json', 'utf8'));

// Patterns that indicate automated translations
const automatedPatterns = [
  /^\d{1,4} BCE$/,  // "206 BCE"
  /^Gaozu \w+ year$/,  // "Gaozu first year"
  /^Wen Di \w+ year$/,  // "Wen Di first year"
  /^Jing Di \w+ year$/,  // "Jing Di first year"
  /^Wu Di \w+ year$/,  // "Wu Di first year"
  /^[A-Z][a-z]+\.$/,  // Single word state names: "Chu.", "Qi.", "Yan.", etc.
  /^First\.?$/,  // "First." "First"
  /^Second\.?$/,  // "Second." "Second"
  /^Third\.?$/,  // "Third." "Third"
  /^Fourth\.?$/,  // "Fourth." "Fourth"
  /^Fifth\.?$/,  // "Fifth." "Fifth"
  /^Sixth\.?$/,  // "Sixth." "Sixth"
  /^Seventh\.?$/,  // "Seventh." "Seventh"
  /^Eighth\.?$/,  // "Eighth." "Eighth"
  /^Ninth\.?$/,  // "Ninth." "Ninth"
  /^Tenth\.?$/,  // "Tenth." "Tenth"
  /^Capital at .+\.$/,  // "Capital at Pengcheng."
  /^initially king .+ first year$/,  // "initially king [Name] first year"
  /^transferred$/,  // "transferred"
  /^died$/,  // "died"
  /^passed away$/,  // "passed away"
  /^came to court$/,  // "came to court"
  /^rebelled, executed$/,  // "rebelled, executed"
  /^became .+$/,  // "became [something]"
  /^King .+$/,  // "King [something]"
];

function isAutomatedTranslation(text) {
  if (!text || text.trim() === '') return false;

  for (const pattern of automatedPatterns) {
    if (pattern.test(text.trim())) {
      return true;
    }
  }

  return false;
}

// Function to clean automated translations
function cleanAutomatedTranslations(obj) {
  // Clean paragraph-level translations
  if (obj.translations) {
    obj.translations = obj.translations.filter(trans => !isAutomatedTranslation(trans.text));
  }

  // Clean sentence-level translations
  if (obj.sentences) {
    for (const sentence of obj.sentences) {
      if (sentence.translations) {
        sentence.translations = sentence.translations.filter(trans => !isAutomatedTranslation(trans.text));
      }
    }
  }

  // Clean cell-level translations
  if (obj.cells) {
    for (const cell of obj.cells) {
      if (cell.translation && isAutomatedTranslation(cell.translation)) {
        delete cell.translation;
        if (cell.translator) delete cell.translator;
        if (cell.model) delete cell.model;
      }
    }
  }

  // Recurse on children
  if (obj.children) {
    obj.children.forEach(cleanAutomatedTranslations);
  }
}

console.log('Starting automated translation cleanup...');
cleanAutomatedTranslations(data);

// Recalculate translated count
function countTranslations(obj) {
  let count = 0;

  if (obj.translations && obj.translations.length > 0) {
    count += obj.translations.length;
  }

  if (obj.sentences) {
    for (const sentence of obj.sentences) {
      if (sentence.translations && sentence.translations.length > 0) {
        count += sentence.translations.length;
      }
    }
  }

  if (obj.cells) {
    for (const cell of obj.cells) {
      if (cell.translation && cell.translation.trim() !== '') {
        count++;
      }
    }
  }

  if (obj.children) {
    for (const child of obj.children) {
      count += countTranslations(child);
    }
  }

  return count;
}

const actualCount = countTranslations(data);
data.meta.translatedCount = actualCount;

// Write back
fs.writeFileSync('./data/shiji/017.json', JSON.stringify(data, null, 2));
console.log(`Cleaned automated translations. Remaining legitimate translations: ${actualCount}`);





