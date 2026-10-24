#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDossiers,
  dedupeResolutionDecisions,
  validateResolutionDocument,
} from './sdk-people-resolve.mjs';
import { PEOPLE_DIR, REPO_ROOT, readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { loadValidatedPeopleCorpus, loadValidatedResolutionDocuments } from './lib/people-corpus.mjs';
import { resolvePeopleClusters } from './lib/people-resolution.mjs';

function usage() {
  console.log(`Usage:
  node scripts/checkpoint-people-resolution-shards.mjs \\
    --source-batch NAME --batch NAME --chapters BOOK/NNN,... [--write]`);
}

function parseArgs(args) {
  const opts = { sourceBatch: null, batch: null, chapters: null, write: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = () => {
      const value = args[++index];
      if (!value) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--source-batch') opts.sourceBatch = next();
    else if (arg === '--batch') opts.batch = next();
    else if (arg === '--chapters') opts.chapters = next();
    else if (arg === '--write') opts.write = true;
    else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else throw new Error(`Unknown option ${arg}`);
  }
  if (!opts.sourceBatch || !opts.batch || !opts.chapters) {
    throw new Error('--source-batch, --batch, and --chapters are required');
  }
  if (!/^[a-z0-9][a-z0-9-]*$/u.test(opts.sourceBatch) || !/^[a-z0-9][a-z0-9-]*$/u.test(opts.batch)) {
    throw new Error('batch names must use lowercase letters, digits, and hyphens');
  }
  const chapters = new Set(opts.chapters.split(',').map((value) => value.trim()).filter(Boolean));
  if (chapters.size === 0 || [...chapters].some((value) => !/^[a-z]+\/\d{3}$/u.test(value))) {
    throw new Error('--chapters must be comma-separated BOOK/NNN scopes');
  }
  return { ...opts, chapters };
}

function checkpointFiles(sourceBatch) {
  const directory = path.join(PEOPLE_DIR, 'generated', 'resolution-shards', sourceBatch);
  if (!fs.existsSync(directory)) throw new Error(`Missing shard checkpoint directory ${path.relative(REPO_ROOT, directory)}`);
  const files = fs.readdirSync(directory)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(directory, name));
  if (files.length === 0) throw new Error(`No shard checkpoints found in ${path.relative(REPO_ROOT, directory)}`);
  return files;
}

function checkpointDocuments(files) {
  return files.map((file) => {
    const envelope = readJson(file);
    if (envelope.schemaVersion !== 1 || !envelope.document || typeof envelope.document !== 'object') {
      throw new Error(`${path.relative(REPO_ROOT, file)} is not a resolver shard checkpoint`);
    }
    if (typeof envelope.dossierFingerprint !== 'string' || envelope.dossierFingerprint.length === 0) {
      throw new Error(`${path.relative(REPO_ROOT, file)} has no source dossier fingerprint`);
    }
    return { file, document: envelope.document };
  });
}

function dossierForDecision(decision, dossiers) {
  const ids = new Set(decision.localPeople ?? []);
  const matches = dossiers.filter((dossier) =>
    [...ids].every((localId) => Object.hasOwn(dossier.document.people, localId))
  );
  if (matches.length !== 1) {
    throw new Error(
      `Cannot rebase decision for ${[...ids].join(', ')}: expected one current identity component, found ${matches.length}`,
    );
  }
  return matches[0];
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const output = path.join(PEOPLE_DIR, 'resolutions', `${opts.batch}.json`);
  if (fs.existsSync(output)) throw new Error(`Refusing to replace existing ${path.relative(REPO_ROOT, output)}`);
  const corpus = loadValidatedPeopleCorpus();
  const resolutions = loadValidatedResolutionDocuments(corpus.localPeople);
  const { dossiers } = buildDossiers({
    batch: opts.batch,
    chapters: opts.chapters,
    allUnresolved: false,
    componentShards: true,
    shards: 1,
  }, corpus, resolutions);
  const byDossier = new Map(dossiers.map((dossier) => [dossier.batch, []]));
  const saved = checkpointDocuments(checkpointFiles(opts.sourceBatch));
  for (const { file, document } of saved) {
    for (const decision of document.decisions ?? []) {
      if (!Array.isArray(decision.localPeople) || decision.localPeople.length < 2) {
        throw new Error(`${path.relative(REPO_ROOT, file)} contains a malformed decision`);
      }
      const dossier = dossierForDecision(decision, dossiers);
      byDossier.get(dossier.batch).push(decision);
    }
  }
  const rebased = [];
  for (const dossier of dossiers) {
    const decisions = dedupeResolutionDecisions(byDossier.get(dossier.batch));
    if (decisions.length === 0) continue;
    const document = { schemaVersion: 1, batch: dossier.batch, decisions };
    validateResolutionDocument(document, dossier, corpus, resolutions, rebased, { checkGlobalConsistency: false });
    rebased.push(document);
  }
  resolvePeopleClusters(corpus.localPeople, [...resolutions, ...rebased]);
  const aggregate = {
    schemaVersion: 1,
    batch: opts.batch,
    decisions: dedupeResolutionDecisions(rebased.flatMap((document) => document.decisions)),
  };
  console.log(
    `Revalidated ${aggregate.decisions.length} decision(s) from ${saved.length} shard checkpoint(s) ` +
    `against ${dossiers.length} current component shard(s).`,
  );
  if (!opts.write) {
    console.log('Dry run only; pass --write to create the tracked checkpoint resolution document.');
    return;
  }
  writeJsonAtomic(output, aggregate);
  console.log(`Wrote ${path.relative(REPO_ROOT, output)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
