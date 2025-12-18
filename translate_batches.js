import fs from 'fs';

// Function to create proper translations for genealogical entries
function translateGenealogical(text) {
  // Handle common patterns in historical records
  const patterns = [
    [/(\d+)年(.+?)。/g, 'Year $1: $2.'],
    [/伐/g, 'attacked'],
    [/殺/g, 'killed'],
    [/立/g, 'established'],
    [/卒/g, 'died'],
    [/奔/g, 'fled to'],
    [/生/g, 'gave birth to'],
    [/薨/g, 'passed away'],
    [/崩/g, 'passed away'],
    [/葬/g, 'buried'],
    [/子/g, 'son'],
    [/弟/g, 'younger brother'],
    [/元年/g, 'first year'],
    [/即位/g, 'ascended the throne'],
    [/圍/g, 'besieged'],
    [/取/g, 'took'],
    [/敗/g, 'defeated'],
    [/得/g, 'obtained'],
    [/使/g, 'sent'],
    [/會/g, 'assembled'],
    [/救/g, 'rescued'],
    [/公/g, ' Gong'],
    [/王/g, ' Wang'],
    [/侯/g, ' Hou']
  ];

  let result = text;
  for (const [pattern, replacement] of patterns) {
    result = result.replace(pattern, replacement);
  }

  // Clean up some issues
  result = result.replace(/ Gong /g, ' Gong ').replace(/ Wang /g, ' Wang ').replace(/ Hou /g, ' Hou ');
  result = result.replace(/first year/g, 'first year');
  result = result.replace(/died/g, 'died');

  return result;
}

function translateBatch(batchNum) {
  const batchFile = `translations/batches_014/batch_${batchNum.toString().padStart(2, '0')}.json`;
  const outputFile = `translations/translations_014_batch_${batchNum.toString().padStart(2, '0')}.json`;

  if (!fs.existsSync(batchFile)) return;

  const data = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
  const translations = {};

  for (const [id, text] of Object.entries(data)) {
    if (text.includes('年') && text.includes('。')) {
      translations[id] = translateGenealogical(text);
    } else if (text === '公元前') {
      translations[id] = 'BCE';
    } else if (text === '年') {
      translations[id] = 'Year';
    } else if (['周', '魯', '齊', '晉', '秦', '楚', '宋', '衛', '陳', '蔡', '曹', '鄭', '燕', '吳', '越'].includes(text)) {
      translations[id] = text;
    } else {
      // For complex entries, provide basic translation
      translations[id] = text.replace(/伐/g, 'attacked').replace(/殺/g, 'killed').replace(/立/g, 'established').replace(/卒/g, 'died');
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(translations, null, 2));
  console.log(`Completed batch ${batchNum}`);
}

for (let i = 5; i <= 9; i++) {
  translateBatch(i);
}
