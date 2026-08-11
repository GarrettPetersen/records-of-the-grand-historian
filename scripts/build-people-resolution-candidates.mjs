#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadValidatedPeopleCorpus } from './lib/people-corpus.mjs';
import { PEOPLE_DIR, REPO_ROOT, writeJsonAtomic } from './lib/people-content.mjs';
import { buildResolutionCandidates } from './lib/people-resolution.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function parseArgs(argv) {
  const options = {
    out: path.join(PEOPLE_DIR, 'generated', 'resolution-candidates.json'),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--out') {
      const value = argv[++index];
      if (!value) throw new Error('--out requires a path');
      options.out = path.resolve(REPO_ROOT, value);
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/build-people-resolution-candidates.mjs [--out PATH]');
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

export function buildPeopleResolutionCandidateDocument(corpus) {
  const candidates = buildResolutionCandidates(corpus.localPeople);
  return {
    ...candidates,
    generatedAt: new Date().toISOString(),
    stats: {
      chapters: corpus.chapters.length,
      localPeople: corpus.localPeople.size,
      candidateBlocks: candidates.blocks.length,
      localPeopleInCandidateBlocks: new Set(candidates.blocks.flatMap((block) => block.localPeople)).size,
      explicitSamePerson: candidates.explicitSamePerson.length,
      explicitDifferentPerson: candidates.explicitDifferentPerson.length,
    },
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const corpus = loadValidatedPeopleCorpus();
  const document = buildPeopleResolutionCandidateDocument(corpus);
  writeJsonAtomic(options.out, document);
  console.log(
    `people resolution candidates: ${document.stats.candidateBlocks} block(s), ` +
    `${document.stats.localPeopleInCandidateBlocks}/${document.stats.localPeople} local people -> ` +
    path.relative(REPO_ROOT, options.out),
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
