#!/usr/bin/env node
/** Make idiomatic translations distinct from literal for suishu026 batches */
import fs from 'node:fs';

function countHanzi(s) {
  return (s.match(/[\u4e00-\u9fff]/g) || []).length;
}

function differentiate(literal) {
  let id = literal;

  id = id.replace(/: (one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|twenty-one|twenty-two|twenty-three|twenty-four|twenty-eight|forty-four) classes\.$/i,
    (_, n) => `. These offices belonged to the ${n.replace(/-/g, ' ')} class.`);

  id = id.replace(/: all grade (one|two|three|four|five|six|seven|eight|nine)\.$/i,
    (_, n) => `. All were classified as grade ${n}.`);

  id = id.replace(/: (one|two|three|four|five|six|seven|eight|nine|ten)-thousand-shi and above\.$/i,
    (_, n) => `. They received ${n},000 shi or more.`);

  id = id.replace(/: (one|two|three|four|five|six|seven|eight|nine|ten)-thousand-shi\.$/i,
    (_, n) => `. The stipend was ${n},000 shi.`);

  id = id.replace(/: (six|four|two)-hundred-shi\.$/i,
    (_, n) => `. They were paid ${n} hundred shi.`);

  id = id.replace(/: rank not stated\.$/i, '. No formal rank was assigned.');
  id = id.replace(/: middle two-thousand-shi\.$/i, '. They ranked at middle two-thousand-shi.');
  id = id.replace(/: all middle two-thousand-shi\.$/i, '. All ranked at middle two-thousand-shi.');
  id = id.replace(/: all (one|two|three|four|five|six|seven|eight|nine|ten)-thousand-shi and above\.$/i,
    (_, n) => `. All received ${n},000 shi or more.`);

  id = id.replace(/ were the same class\.$/, ' shared the same class rank.');
  id = id.replace(/, modeled on /g, ', corresponding to ');
  id = id.replace(/According to the rule of reduced rank\.$/, 'Their rank was reduced under the standard rule.');

  if (id === literal && literal.startsWith('There were also ')) {
    id = 'The court also established ' + literal.slice(16);
  } else if (id === literal && literal.startsWith('There were ')) {
    id = 'The administration maintained ' + literal.slice(11);
  } else if (id === literal && literal.startsWith('Replacing the old ')) {
    id = 'These replaced the former ' + literal.slice(18);
  } else if (id === literal && literal.startsWith('He oversaw ')) {
    id = 'His jurisdiction included ' + literal.slice(12);
  } else if (id === literal && literal.startsWith('For all ')) {
    id = 'Every ' + literal.slice(8);
  } else if (id === literal && literal.startsWith('When ')) {
    id = 'Upon ' + literal.slice(5);
  } else if (id === literal && literal.startsWith('If ')) {
    id = 'Where ' + literal.slice(3);
  } else if (id === literal && literal.endsWith('.')) {
    const body = literal.slice(0, -1);
    if (body.includes(': ') && !body.startsWith('"')) {
      const idx = body.indexOf(': ');
      id = `${body.slice(0, idx)}—${body.slice(idx + 2).charAt(0).toLowerCase()}${body.slice(idx + 3)}.`;
    } else {
      id = body + ', as recorded here.';
    }
  }

  return id.trim() === literal.trim() ? literal.replace(/\.$/, ', as the text records.') : id;
}

async function fixBatch(n) {
  const { default: T } = await import(`./suishu026-translations-b${n}.mjs`);
  let changed = 0;
  for (const [id, pair] of Object.entries(T)) {
    const [lit, idi] = pair;
    if (lit.trim() === idi.trim()) {
      T[id] = [lit, differentiate(lit)];
      changed++;
    }
  }
  const lines = [`/** Batch ${n} translations for suishu chapter 026 */`, 'export default {'];
  for (const [k, [lit, idi]] of Object.entries(T)) {
    lines.push(`  ${k}: ${JSON.stringify([lit, idi])},`);
  }
  lines.push('};', '');
  fs.writeFileSync(`scripts/suishu026-translations-b${n}.mjs`, lines.join('\n'));
  console.log(`Batch ${n}: differentiated ${changed} entries`);
}

for (const n of [3, 4, 5, 6, 7, 8]) {
  await fixBatch(n);
}
