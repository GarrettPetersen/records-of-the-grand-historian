#!/usr/bin/env node
/**
 * Remove Wikisource public-domain boilerplate sentences from source fields.
 *
 * Dry-run by default. Use --apply to rewrite chapter JSON.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SOURCE_FIELDS = ['zh', 'source', 'content', 'text'];
const PD_BOILERPLATE_RE = /^(?:PD-icon\.svg\s*)?本(?:北宋|南宋|唐|元|明|清)?作品在全世界都属于公有领域，因为作者逝世已经遠?遠?超过100年。?$/u;

function parseArgs(argv) {
  const opts = {
    apply: false,
    inputs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.inputs.push(path.join(DATA_DIR, argv[++index] || ''));
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.inputs.push(path.join(DATA_DIR, arg.slice('--book='.length)));
      continue;
    }
    if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    opts.inputs.push(arg);
  }

  if (opts.inputs.length === 0) opts.inputs.push(DATA_DIR);
  return opts;
}

function chapterFiles(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!entry || !fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/u.test(path.basename(entry))) files.push(entry);
  };
  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function sourceKey(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string') || null;
}

function updateMeta(chapter) {
  let sentenceCount = 0;
  for (const block of chapter.content || []) {
    sentenceCount += (block.sentences || []).length + (block.cells || []).length;
  }
  chapter.meta = chapter.meta || {};
  chapter.meta.sentenceCount = sentenceCount;
  chapter.meta.translatedCount = sentenceCount;
  if (Array.isArray(chapter.meta.translators) && chapter.meta.translators[0]) {
    chapter.meta.translators[0].paragraphs = (chapter.content || []).length;
    chapter.meta.translators[0].sentences = sentenceCount;
  }
}

function cleanChapter(file) {
  const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
  const removed = [];
  const nextContent = [];

  for (const [blockIndex, block] of (chapter.content || []).entries()) {
    let changed = false;
    const nextBlock = { ...block };
    if (Array.isArray(block.sentences)) {
      nextBlock.sentences = block.sentences.filter((sentence, sentenceIndex) => {
        const key = sourceKey(sentence);
        const text = key ? String(sentence[key] || '').trim() : '';
        if (!PD_BOILERPLATE_RE.test(text)) return true;
        removed.push({
          blockIndex,
          kind: 'sentence',
          index: sentenceIndex,
          id: sentence.id || '',
          text,
        });
        changed = true;
        return false;
      });
    }
    if (Array.isArray(block.cells)) {
      nextBlock.cells = block.cells.filter((cell, cellIndex) => {
        const key = sourceKey(cell);
        const text = key ? String(cell[key] || '').trim() : '';
        if (!PD_BOILERPLATE_RE.test(text)) return true;
        removed.push({
          blockIndex,
          kind: 'cell',
          index: cellIndex,
          id: cell.id || '',
          text,
        });
        changed = true;
        return false;
      });
    }

    const hasSentences = !Array.isArray(nextBlock.sentences) || nextBlock.sentences.length > 0;
    const hasCells = !Array.isArray(nextBlock.cells) || nextBlock.cells.length > 0;
    if (changed && !hasSentences && !hasCells) continue;
    nextContent.push(nextBlock);
  }

  if (removed.length > 0) {
    chapter.content = nextContent;
    updateMeta(chapter);
  }
  return { chapter, removed };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const summary = {
    apply: opts.apply,
    filesChanged: 0,
    unitsRemoved: 0,
    byFile: {},
    samples: [],
  };

  for (const file of chapterFiles(opts.inputs)) {
    const result = cleanChapter(file);
    if (result.removed.length === 0) continue;
    summary.filesChanged += 1;
    summary.unitsRemoved += result.removed.length;
    summary.byFile[path.relative(process.cwd(), file)] = result.removed.length;
    for (const removal of result.removed) {
      if (summary.samples.length >= 20) break;
      summary.samples.push({
        file: path.relative(process.cwd(), file),
        ...removal,
      });
    }
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(result.chapter, null, 2)}\n`, 'utf8');
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
