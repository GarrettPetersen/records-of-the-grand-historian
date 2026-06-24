#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function usage() {
  console.error(`Usage:
  node scripts/fix-missing-english-quote-closers.mjs [--apply] [--book BOOK] [path ...]

Adds missing trailing English quote marks when Chinese quote spans close in the
same source unit or at the end of a multi-unit quote span. Dry-run by default.`);
}

function parseArgs(argv) {
  const opts = { apply: false, book: null, inputs: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('--')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }
  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }
  return opts;
}

function chapterFiles(opts) {
  const inputs = opts.inputs.length > 0
    ? opts.inputs
    : opts.book
      ? [path.join('data', opts.book)]
      : fs.readdirSync('data')
        .map((entry) => path.join('data', entry))
        .filter((entry) => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
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

function isWordChar(ch) {
  return /[A-Za-z]/.test(ch);
}

function isWhitespaceOrEnd(ch) {
  return !ch || /\s/.test(ch);
}

function isQuoteBoundaryChar(ch) {
  return ch === '' || /[\s,.;:!?)>\]〉）"'“”‘’—–-]/u.test(ch);
}

function isNumericPrimeMark(text, index) {
  const prev = text[index - 1] || '';
  const next = text[index + 1] || '';
  if (!/\d/.test(prev)) return false;
  return next === '' || /[\s,.;:!?)}\]〉）]/u.test(next);
}

function isLikelySingleQuoteApostrophe(text, index, singleQuoteDepth = 0) {
  const prev = text[index - 1] || '';
  const next = text[index + 1] || '';
  if (!prev && !next) return false;
  if (isWordChar(prev) && isWordChar(next)) return true;
  if (isWordChar(prev) && !isWordChar(next)) return singleQuoteDepth === 0;
  return false;
}

function getEnglishQuoteTokens(text) {
  const tokens = [];
  let singleQuoteDepth = 0;
  const value = String(text || '');
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    if (!['"', '“', '”', "'", '‘', '’'].includes(ch)) continue;
    if ((ch === '"' || ch === "'" || ch === '’') && isNumericPrimeMark(value, i)) continue;

    if (ch === '"') {
      const prev = value[i - 1] || '';
      const next = value[i + 1] || '';
      if (!next || isWhitespaceOrEnd(next) || /^[,.;:!?)}\]—–]/u.test(next)) {
        tokens.push({ index: i, char: ch, type: 'close' });
      } else if (!prev || /\s/.test(prev) || /^[:：;\[({<〈—–-]/u.test(prev)) {
        tokens.push({ index: i, char: ch, type: 'open' });
      } else {
        tokens.push({ index: i, char: ch, type: 'close' });
      }
      continue;
    }

    if (ch === '“') {
      tokens.push({ index: i, char: ch, type: 'open' });
      continue;
    }
    if (ch === '”') {
      tokens.push({ index: i, char: ch, type: 'close' });
      continue;
    }

    if (ch === "'" && isLikelySingleQuoteApostrophe(value, i, singleQuoteDepth)) continue;
    if (isLikelySingleQuoteApostrophe(value, i, singleQuoteDepth)) {
      if (ch === '’' && singleQuoteDepth > 0) singleQuoteDepth = Math.max(0, singleQuoteDepth - 1);
      continue;
    }

    if (ch === '‘') {
      singleQuoteDepth += 1;
      tokens.push({ index: i, char: ch, type: 'open' });
      continue;
    }

    if (ch === '’') {
      if (singleQuoteDepth > 0) {
        singleQuoteDepth -= 1;
        tokens.push({ index: i, char: ch, type: 'close' });
      } else {
        const prev = value[i - 1] || '';
        const next = value[i + 1] || '';
        if (isWhitespaceOrEnd(prev) || /^[:：;\[({<〈—–-“‘'"]/.test(prev)) {
          singleQuoteDepth += 1;
          tokens.push({ index: i, char: ch, type: 'open' });
        } else if (isWhitespaceOrEnd(next) || isQuoteBoundaryChar(next)) {
          tokens.push({ index: i, char: ch, type: 'close' });
        }
      }
      continue;
    }

    const prev = value[i - 1] || '';
    const next = value[i + 1] || '';
    if (singleQuoteDepth > 0 && (isWhitespaceOrEnd(next) || isQuoteBoundaryChar(next))) {
      singleQuoteDepth -= 1;
      tokens.push({ index: i, char: ch, type: 'close' });
    } else if (isWhitespaceOrEnd(prev) || /^[:：;\[({<〈—–-“‘'"]/.test(prev)) {
      singleQuoteDepth += 1;
      tokens.push({ index: i, char: ch, type: 'open' });
    } else if (isWhitespaceOrEnd(next) || isQuoteBoundaryChar(next)) {
      tokens.push({ index: i, char: ch, type: 'close' });
    }
  }
  return tokens;
}

function translationFields(unit) {
  const fields = [];
  if (unit.translations?.[0]) {
    fields.push({ label: 'literal', owner: unit.translations[0], key: 'literal' });
    fields.push({ label: 'idiomatic', owner: unit.translations[0], key: 'idiomatic' });
  }
  for (const key of ['literal', 'idiomatic', 'translation']) {
    if (typeof unit[key] === 'string') fields.push({ label: key, owner: unit, key });
  }
  return fields.filter((field) => typeof field.owner[field.key] === 'string' && field.owner[field.key].trim());
}

function sourceText(unit) {
  return String(unit.zh || unit.content || '');
}

function simulate(stack, text) {
  const next = stack.slice();
  for (const token of getEnglishQuoteTokens(text)) {
    if (token.type === 'open') next.push(token.char);
    else if (next.length > 0) next.pop();
  }
  return next;
}

function closeFor(open) {
  return open === "'" || open === '‘' ? "'" : '"';
}

function appendClose(text, quote) {
  const original = String(text || '');
  const body = original.trimEnd();
  if (!body || /["'”’]\s*$/u.test(body)) return original;
  return `${body}${quote}${original.slice(body.length)}`;
}

function unitsForBlock(block) {
  if (Array.isArray(block.sentences)) return block.sentences;
  if (Array.isArray(block.cells)) return block.cells;
  return [];
}

function fixChapter(chapter) {
  const changed = [];
  const stacksByField = new Map();
  const zhStack = [];

  for (const block of chapter.content || []) {
    for (const unit of unitsForBlock(block)) {
      const zh = sourceText(unit);
      const beforeZhDepth = zhStack.length;
      let openCount = 0;
      let closeCount = 0;
      for (const char of zh) {
        if (char === '「' || char === '『') {
          openCount += 1;
          zhStack.push(char);
        } else if (char === '」' || char === '』') {
          closeCount += 1;
          if (zhStack.length > 0) zhStack.pop();
        }
      }
      const afterZhDepth = zhStack.length;
      const closesChineseSpan = afterZhDepth < beforeZhDepth;
      const completeChineseQuoteUnit = beforeZhDepth === afterZhDepth && openCount > 0 && closeCount > 0;

      for (const field of translationFields(unit)) {
        const stackKey = field.label;
        const beforeStack = stacksByField.get(stackKey) || [];
        let nextStack = simulate(beforeStack, field.owner[field.key]);
        let shouldClose = false;
        let quote = '';

        if (closesChineseSpan && beforeStack.length > 0 && nextStack.length >= beforeStack.length) {
          shouldClose = true;
          quote = closeFor(beforeStack[beforeStack.length - 1]);
        } else if (completeChineseQuoteUnit && nextStack.length > beforeStack.length) {
          shouldClose = true;
          quote = closeFor(nextStack[nextStack.length - 1]);
        }

        if (shouldClose) {
          const before = field.owner[field.key];
          const after = appendClose(before, quote);
          if (after !== before) {
            field.owner[field.key] = after;
            changed.push({ id: unit.id || '', field: field.label, quote, before, after });
            nextStack = nextStack.slice(0, -1);
          }
        }
        stacksByField.set(stackKey, nextStack);
      }
    }
  }

  return changed;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const files = chapterFiles(opts);
  let total = 0;
  for (const file of files) {
    const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
    const changes = fixChapter(chapter);
    if (changes.length === 0) continue;
    total += changes.length;
    console.log(`${file}: ${opts.apply ? 'applied' : 'would apply'} ${changes.length} missing quote closer(s)`);
    for (const change of changes) console.log(`  ${change.id}.${change.field} ${JSON.stringify(change.quote)}`);
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(chapter, null, 2)}\n`);
  }
  console.log(`${opts.apply ? 'Applied' : 'Would apply'} ${total} missing English quote closer(s) across ${files.length} chapter file(s).`);
}

main();
