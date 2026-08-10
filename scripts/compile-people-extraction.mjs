#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  REPO_ROOT,
  readJson,
  writeTextAtomic,
} from './lib/people-content.mjs';
import {
  compactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function parseArgs(argv) {
  const opts = { input: null, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      return path.resolve(REPO_ROOT, value);
    };
    if (arg === '--input') opts.input = next();
    else if (arg === '--output') opts.output = next();
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/compile-people-extraction.mjs --input RAW.json --output COMPACT.json');
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (!opts.input || !opts.output) throw new Error('--input and --output are required');
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const raw = readJson(opts.input);
  const packet = buildPeopleExtractionPacket(raw.book, raw.chapter);
  const normalized = validatePeopleExtraction(raw, packet).normalized;
  const compact = compactPeopleExtraction(normalized, packet);
  const expanded = validateCompactPeopleExtraction(compact, packet);
  writeTextAtomic(opts.output, serializeCompactPeopleExtraction(compact));
  console.log(
    `Compiled ${path.relative(REPO_ROOT, opts.input)} -> ${path.relative(REPO_ROOT, opts.output)}: ` +
    `${compact.people.length} people, ${compact.surfaces.length} surfaces, ${expanded.stats.claims} expanded claims.`,
  );
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
