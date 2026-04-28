#!/usr/bin/env node
/**
 * Scan chapter JSON for rubric/editorial scaffolding on short headings.
 * Uses the same rules as translation-guards.mjs (submit + score).
 *
 * Usage:
 *   node scripts/scan-rubric-scaffolding.mjs data/hanshu
 *   node scripts/scan-rubric-scaffolding.mjs data/hanshu/064.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { rubricScaffoldingIssue } from '../translation-guards.mjs';

function* walkSentences(data) {
  if (!data?.content) return;
  for (const block of data.content) {
    const rows = block.type === 'table_row' ? block.cells : block.sentences;
    if (!rows) continue;
    for (const s of rows) {
      const zh = s.zh || s.content;
      const tr = s.translations?.[0];
      const lit = tr?.literal || s.literal || '';
      const idm = tr?.idiomatic || s.idiomatic || '';
      const translator = tr?.translator || s.translator;
      if (translator === 'Herbert J. Allen (1894)') continue;
      if (!lit && !idm) continue;
      yield { id: s.id, zh, lit, idm };
    }
  }
}

function scanFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const hits = [];
  for (const row of walkSentences(data)) {
    const litMsg = rubricScaffoldingIssue(row.zh, row.lit);
    const idmMsg = rubricScaffoldingIssue(row.zh, row.idm);
    if (litMsg || idmMsg) {
      hits.push({ ...row, litMsg, idmMsg });
    }
  }
  return hits;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/scan-rubric-scaffolding.mjs <path.json|dir> [...]');
  process.exit(1);
}

/** Expand paths: directories become all *.json inside (non-recursive). */
function expandInputs(inputs) {
  const files = [];
  for (const arg of inputs) {
    if (!fs.existsSync(arg)) continue;
    const st = fs.statSync(arg);
    if (st.isDirectory()) {
      for (const name of fs.readdirSync(arg)) {
        if (name.endsWith('.json')) files.push(path.join(arg, name));
      }
    } else if (arg.endsWith('.json')) {
      files.push(arg);
    }
  }
  return [...new Set(files)].sort();
}

let total = 0;
for (const fp of expandInputs(args)) {
  const hits = scanFile(fp);
  if (hits.length === 0) continue;
  console.log(`\n${fp} (${hits.length}):`);
  for (const h of hits) {
    total++;
    console.log(`  ${h.id}  ${h.zh}`);
    if (h.litMsg) console.log(`    literal: ${h.litMsg}`);
    if (h.idmMsg) console.log(`    idiomatic: ${h.idmMsg}`);
  }
}
console.log(total ? `\nTotal: ${total} sentence(s) with rubric issues.` : '\nNo rubric scaffolding issues found.');
