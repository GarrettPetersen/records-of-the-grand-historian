#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import {
  compactPeopleExtraction,
  expandPeopleExtraction,
  isCompactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import { packetPath, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

const ROOT = process.cwd();
const HAN_RE = /[\u3400-\u9fff]+/gu;
const TABLE_REASON_RE = /(?:dense.*office.*table|office.*table.*cell|table.*cell)/iu;

function usage() {
  console.error(`Usage:
  node scripts/romanize-qing-table-names.mjs --chapter NNN [--apply]
  node scripts/romanize-qing-table-names.mjs --self-test

Replaces Chinese personal names in a Qing office-table translation only when
every Han span has one unambiguous romanization in the accepted extraction.`);
}

function parseArgs(argv) {
  const opts = { chapter: '', apply: false, selfTest: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--chapter') {
      opts.chapter = argv[++index] || '';
    } else if (arg.startsWith('--chapter=')) {
      opts.chapter = arg.slice('--chapter='.length);
    } else if (arg === '--apply') {
      opts.apply = true;
    } else if (arg === '--self-test') {
      opts.selfTest = true;
    } else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!opts.selfTest && !/^\d{3}$/u.test(opts.chapter)) {
    throw new Error('--chapter must be a three-digit Qing History chapter number');
  }
  return opts;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function addName(names, zh, romanization) {
  if (!zh || !romanization || !/[\u3400-\u9fff]/u.test(zh)) return;
  const values = names.get(zh) || new Set();
  values.add(String(romanization).trim());
  names.set(zh, values);
}

function extractionNames(extraction) {
  const names = new Map();
  for (const person of extraction.people || []) {
    const identity = person[1] || [];
    const fallback = identity[0] || identity[2];
    addName(names, identity[1], fallback);
    for (const surfaceRow of person[5] || []) {
      const surface = surfaceRow[0] || {};
      addName(names, surface.zh, surface.en || surface.pinyin || fallback);
    }
  }
  return names;
}

function mappedText(text, names, context, replacements) {
  return String(text).replace(HAN_RE, (zh) => {
    const options = [...(names.get(zh) || [])];
    if (options.length === 0) {
      throw new Error(`${context}: no extraction-backed romanization for ${zh}`);
    }
    if (options.length > 1) {
      throw new Error(`${context}: ambiguous romanizations for ${zh}: ${options.join(', ')}`);
    }
    replacements.push({ context, zh, romanization: options[0] });
    return options[0];
  });
}

function collectMappingIssues(chapter, extraction, names) {
  const issuesByKey = new Map();
  const inspect = (text, context) => {
    for (const match of String(text || '').matchAll(HAN_RE)) {
      const zh = match[0];
      const options = [...(names.get(zh) || [])].sort();
      if (options.length === 1) continue;
      const kind = options.length === 0 ? 'missing' : 'ambiguous';
      const key = `${kind}\u0000${zh}\u0000${options.join('\u0000')}`;
      const issue = issuesByKey.get(key) || { kind, zh, options, contexts: [] };
      if (!issue.contexts.includes(context)) issue.contexts.push(context);
      issuesByKey.set(key, issue);
    }
  };

  for (const block of chapter.content || []) {
    for (const sentence of block.sentences || []) {
      for (const translation of sentence.translations || []) {
        const allowed = translation.allowChineseCharacters === true
          || sentence.allowChineseCharacters === true;
        const reason = translation.allowChineseCharactersReason
          || sentence.allowChineseCharactersReason
          || '';
        if (!allowed || !TABLE_REASON_RE.test(reason)) continue;
        for (const field of ['literal', 'idiomatic']) {
          inspect(translation[field], `${sentence.id}.${field}`);
        }
      }
    }
  }
  for (const row of extraction.surfaces || []) {
    if (row[2] === 'en') inspect(row[3], `extraction surface ${row[0]}`);
  }
  return [...issuesByKey.values()].sort((left, right) =>
    left.zh.localeCompare(right.zh) || left.kind.localeCompare(right.kind)
  );
}

function assertCompleteMappings(chapter, extraction, names) {
  const issues = collectMappingIssues(chapter, extraction, names);
  if (issues.length === 0) return;
  const details = issues.map((issue) => {
    const mapping = issue.kind === 'missing'
      ? 'no extraction-backed romanization'
      : `ambiguous romanizations: ${issue.options.join(', ')}`;
    const contexts = issue.contexts.slice(0, 8).join(', ');
    const extra = issue.contexts.length > 8 ? ` (+${issue.contexts.length - 8} more)` : '';
    return `- ${issue.zh}: ${mapping}; ${contexts}${extra}`;
  });
  throw new Error(
    `Cannot romanize Qing table: ${issues.length} distinct unmapped Han span(s):\n${details.join('\n')}`,
  );
}

function enrichCandidateError(error, packet) {
  const ids = (error?.errors || [])
    .map((message) => String(message).match(/preflight candidate (\S+) is not accounted for/u)?.[1])
    .filter(Boolean);
  if (ids.length === 0) throw error;
  const candidates = new Map((packet.preflight?.candidates || []).map((candidate) => [candidate.id, candidate]));
  const details = ids.map((id) => {
    const candidate = candidates.get(id);
    return candidate
      ? `${id}: ${JSON.stringify(candidate)}`
      : `${id}: candidate details unavailable`;
  });
  throw new Error(`${error.message}\nCandidate details:\n${details.join('\n')}`, { cause: error });
}

function repairChapter(chapter, names) {
  const replacements = [];
  let fieldsChanged = 0;
  for (const block of chapter.content || []) {
    for (const sentence of block.sentences || []) {
      for (const translation of sentence.translations || []) {
        const allowed = translation.allowChineseCharacters === true
          || sentence.allowChineseCharacters === true;
        const reason = translation.allowChineseCharactersReason
          || sentence.allowChineseCharactersReason
          || '';
        if (!allowed || !TABLE_REASON_RE.test(reason)) continue;

        for (const field of ['literal', 'idiomatic']) {
          if (!HAN_RE.test(String(translation[field] || ''))) {
            HAN_RE.lastIndex = 0;
            continue;
          }
          HAN_RE.lastIndex = 0;
          translation[field] = mappedText(
            translation[field],
            names,
            `${sentence.id}.${field}`,
            replacements,
          );
          fieldsChanged += 1;
        }
        if (!HAN_RE.test(`${translation.literal || ''}${translation.idiomatic || ''}`)) {
          delete translation.allowChineseCharacters;
          delete translation.allowChineseCharactersReason;
        }
        HAN_RE.lastIndex = 0;
      }

      const sentenceText = (sentence.translations || [])
        .flatMap((translation) => [translation.literal, translation.idiomatic])
        .filter(Boolean)
        .join('\n');
      if (!HAN_RE.test(sentenceText)) {
        delete sentence.allowChineseCharacters;
        delete sentence.allowChineseCharactersReason;
      }
      HAN_RE.lastIndex = 0;
    }
  }
  return { fieldsChanged, replacements };
}

function repairExtractionSurfaces(extraction, names) {
  if (!isCompactPeopleExtraction(extraction)) {
    throw new Error('Qing table-name repair requires a compact accepted extraction');
  }
  const repaired = structuredClone(extraction);
  let surfacesChanged = 0;
  for (const row of repaired.surfaces || []) {
    if (row[2] !== 'en' || !/[\u3400-\u9fff]/u.test(String(row[3] || ''))) continue;
    row[3] = mappedText(row[3], names, `extraction surface ${row[0]}`, []);
    surfacesChanged += 1;
  }
  return { repaired, surfacesChanged };
}

function selfTest() {
  const names = new Map([['張三', new Set(['Zhang San'])]]);
  const chapter = {
    content: [{
      sentences: [{
        id: 's0001',
        allowChineseCharacters: true,
        allowChineseCharactersReason: 'Chinese personal names are retained in dense Qing office table cells.',
        translations: [{
          literal: '張三.',
          idiomatic: '張三 was appointed.',
          allowChineseCharacters: true,
        }],
      }],
    }],
  };
  const result = repairChapter(chapter, names);
  const translation = chapter.content[0].sentences[0].translations[0];
  if (result.fieldsChanged !== 2
    || translation.literal !== 'Zhang San.'
    || translation.idiomatic !== 'Zhang San was appointed.'
    || translation.allowChineseCharacters !== undefined) {
    throw new Error('Qing table romanization self-test failed to repair an exact name');
  }
  let failedClosed = false;
  try {
    mappedText('李四', names, 'self-test', []);
  } catch {
    failedClosed = true;
  }
  if (!failedClosed) throw new Error('Qing table romanization self-test failed to reject an unknown name');
  const issues = collectMappingIssues(chapter, { surfaces: [["p999", "personal-name", "en", "李四", []]] }, names);
  if (issues.length !== 1 || issues[0].zh !== '李四' || issues[0].contexts.length !== 1) {
    throw new Error('Qing table romanization self-test failed to aggregate unmapped spans');
  }
  console.log('Qing table romanization self-test: ok');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) {
    selfTest();
    return;
  }
  const chapterFile = path.join(ROOT, 'data', 'qingshigao', `${opts.chapter}.json`);
  const extractionFile = path.join(
    ROOT,
    'data',
    'people',
    'extractions',
    'qingshigao',
    `${opts.chapter}.json`,
  );
  if (!fs.existsSync(chapterFile) || !fs.existsSync(extractionFile)) {
    throw new Error(`Missing chapter or accepted extraction for qingshigao/${opts.chapter}`);
  }

  const chapter = readJson(chapterFile);
  const extraction = readJson(extractionFile);
  const names = extractionNames(extraction);
  assertCompleteMappings(chapter, extraction, names);
  const result = repairChapter(chapter, names);
  const extractionResult = repairExtractionSurfaces(extraction, names);
  if (result.fieldsChanged === 0 && extractionResult.surfacesChanged === 0) {
    throw new Error(`No extraction-backed Qing table-name repairs found in chapter ${opts.chapter}`);
  }

  const packet = buildPeopleExtractionPacket('qingshigao', opts.chapter, {
    chapterData: chapter,
    chapterFile,
    properNounMatcher: loadProperNounMatcher(),
  });
  const expanded = expandPeopleExtraction(extractionResult.repaired, packet);
  let validated;
  try {
    validated = validatePeopleExtraction(expanded, packet);
  } catch (error) {
    enrichCandidateError(error, packet);
  }
  const compact = compactPeopleExtraction(validated.normalized, packet);
  validateCompactPeopleExtraction(compact, packet);

  const uniqueNames = new Set(result.replacements.map(({ zh }) => zh));
  console.log(
    `${opts.apply ? 'Applied' : 'Would apply'} ${result.replacements.length} replacements `
      + `across ${result.fieldsChanged} fields (${uniqueNames.size} unique names) and `
      + `${extractionResult.surfacesChanged} extraction surfaces.`,
  );
  if (!opts.apply) return;

  writeJsonAtomic(chapterFile, chapter);
  writeTextAtomic(extractionFile, serializeCompactPeopleExtraction(compact));
  writeJsonAtomic(packetPath('qingshigao', opts.chapter), packet);
}

main();
