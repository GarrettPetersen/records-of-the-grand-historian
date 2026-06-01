#!/usr/bin/env node
/**
 * Scan English translation text for split romanizations of common compound
 * Chinese surnames/names, such as "Si Ma" where house style expects "Sima".
 *
 * Usage:
 *   node scripts/scan-compound-name-spacing.mjs
 *   node scripts/scan-compound-name-spacing.mjs --book shiji
 *   node scripts/scan-compound-name-spacing.mjs --book shiji --include-literal
 *   node scripts/scan-compound-name-spacing.mjs --book shiji --fix
 *   node scripts/scan-compound-name-spacing.mjs data/shiji/005.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(process.cwd(), 'data');

export const COMPOUND_NAME_RULES = [
  ['Gao Zu', 'Gaozu', ['高祖']],
  ['Xiao Hui', 'Xiaohui', ['孝惠']],
  ['Xiao Wen', 'Xiaowen', ['孝文']],
  ['Xiao Jing', 'Xiaojing', ['孝景']],
  ['Xiao Wu', 'Xiaowu', ['孝武']],
  ['Bai Li', 'Baili', ['百里']],
  ['Duan Mu', 'Duanmu', ['端木']],
  ['Dong Fang', 'Dongfang', ['東方', '东方']],
  ['Dong Guo', 'Dongguo', ['東郭', '东郭']],
  ['Du Gu', 'Dugu', ['獨孤', '独孤']],
  ['Gong Sun', 'Gongsun', ['公孫', '公孙']],
  ['Gong Xi', 'Gongxi', ['公西']],
  ['Gong Yang', 'Gongyang', ['公羊']],
  ['Gong Ye', 'Gongye', ['公冶']],
  ['Gong Yi', 'Gongyi', ['公儀', '公仪']],
  ['Gong Shu', 'Gongshu', ['公輸', '公输']],
  ['He Lian', 'Helian', ['赫連', '赫连']],
  ['Hu Yan', 'Huyan', ['呼延']],
  ['Huang Fu', 'Huangfu', ['皇甫']],
  ['Ji Sun', 'Jisun', ['季孫', '季孙']],
  ['Liang Qiu', 'Liangqiu', ['梁丘']],
  ['Ling Hu', 'Linghu', ['令狐']],
  ['Meng Sun', 'Mengsun', ['孟孫', '孟孙']],
  ['Mu Rong', 'Murong', ['慕容']],
  ['Nan Gong', 'Nangong', ['南宮', '南宫']],
  ['Ou Yang', 'Ouyang', ['歐陽', '欧阳']],
  ['Pu Yang', 'Puyang', ['濮陽', '濮阳']],
  ['Qi Diao', 'Qidiao', ['漆雕']],
  ['Shang Guan', 'Shangguan', ['上官']],
  ['Shen Tu', 'Shentu', ['申屠']],
  ['Shu Sun', 'Shusun', ['叔孫', '叔孙']],
  ['Si Kong', 'Sikong', ['司空']],
  ['Si Ma', 'Sima', ['司馬', '司马']],
  ['Si Tu', 'Situ', ['司徒']],
  ['Tan Tai', 'Tantai', ['澹臺', '澹台']],
  ['Tuo Ba', 'Tuoba', ['拓跋']],
  ['Wan Yan', 'Wanyan', ['完顏', '完颜']],
  ['Wu Ma', 'Wuma', ['巫馬', '巫马']],
  ['Xia Hou', 'Xiahou', ['夏侯']],
  ['Xian Yu', 'Xianyu', ['鮮于', '鲜于']],
  ['Xi Men', 'Ximen', ['西門', '西门']],
  ['Yu Chi', 'Yuchi', ['尉遲', '尉迟']],
  ['Yu Wen', 'Yuwen', ['宇文']],
  ['Zai Fu', 'Zaifu', ['宰父']],
  ['Zhang Sun', 'Zhangsun', ['長孫', '长孙']],
  ['Zhong Hang', 'Zhonghang', ['中行']],
  ['Zhong Xing', 'Zhonghang', ['中行']],
  ['Zhong Li', 'Zhongli', ['鍾離', '钟离']],
  ['Zhong Sun', 'Zhongsun', ['仲孫', '仲孙']],
  ['Zhu Ge', 'Zhuge', ['諸葛', '诸葛']],
];

const CHECK_FIELDS = new Set([
  'en',
  'english',
  'idiomatic',
  'raw',
  'translation',
  'author',
  'authorEnglish',
]);

let includeLiteral = false;

function usage() {
  console.error(`Usage:
  node scripts/scan-compound-name-spacing.mjs [--book BOOK] [--json] [--summary] [--fail] [--fix] [--include-literal] [path ...]

Options:
  --book BOOK       Scan data/BOOK
  --json            Emit machine-readable JSON
  --summary         Emit per-book counts only
  --fail            Exit 1 when candidates are found
  --fix             Rewrite scanned fields to the preferred one-word forms
  --include-literal Also scan literal fields, which are useful for cleanup but noisier
  --no-source-check Also report English matches not confirmed by matching Chinese source characters`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false, fix: false, sourceAware: true };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--fix') {
      opts.fix = true;
      continue;
    }
    if (arg === '--no-source-check') {
      opts.sourceAware = false;
      continue;
    }
    if (arg === '--include-literal') {
      includeLiteral = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('-')) {
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

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makePattern(split) {
  const parts = split.split(' ').map(escapeRegex);
  return new RegExp(`\\b${parts.join('[\\s-]+')}\\b`, 'g');
}

const PATTERNS = COMPOUND_NAME_RULES.map(([split, preferred, sourceForms]) => ({
  split,
  preferred,
  sourceForms,
  re: makePattern(split),
}));

function excerpt(text, index, width = 46) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function chapterFiles(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/.test(path.basename(entry))) files.push(entry);
  };

  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function isTranslationField(keyPath) {
  const key = keyPath[keyPath.length - 1] || '';
  if (key === 'literal') return includeLiteral;
  if (CHECK_FIELDS.has(key)) return true;
  return keyPath.includes('translations') && key === 'idiomatic';
}

function nearestContext(keyPath) {
  const sentenceIndex = keyPath.lastIndexOf('sentences');
  if (sentenceIndex >= 0 && keyPath.length > sentenceIndex + 1) {
    return `sentences.${keyPath[sentenceIndex + 1]}.${keyPath.slice(sentenceIndex + 2).join('.')}`;
  }
  return keyPath.join('.');
}

function hasCjk(text) {
  return /[\u3400-\u9fff]/.test(text);
}

function objectSource(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const parts = [];
  for (const key of ['zh', 'chinese', 'content', 'source']) {
    if (typeof value[key] === 'string' && hasCjk(value[key])) parts.push(value[key]);
  }
  if (value.title && typeof value.title === 'object') {
    for (const key of ['zh', 'chinese']) {
      if (typeof value.title[key] === 'string' && hasCjk(value.title[key])) parts.push(value.title[key]);
    }
  }
  for (const key of ['sentences', 'cells']) {
    if (Array.isArray(value[key])) {
      for (const child of value[key]) {
        const childSource = objectSource(child);
        if (childSource) parts.push(childSource);
      }
    }
  }
  return parts.join('\n');
}

function sourceConfirms(pattern, sourceText) {
  return Boolean(sourceText) && pattern.sourceForms.some(form => sourceText.includes(form));
}

function isLikelyTitleContext(text, matchIndex, pattern) {
  // In names such as "King Gong Xi", "Gong" is a posthumous title, not the
  // first half of a compound surname. This matters most in --no-source-check
  // mode, where we deliberately accept noisier candidates.
  if (!pattern.split.startsWith('Gong ')) return false;
  const prefix = text.slice(Math.max(0, matchIndex - 16), matchIndex);
  return /\b(?:King|Queen|Duke|Marquis|Lord|Prince)\s+$/u.test(prefix);
}

function isKnownNonCompoundSource(pattern, sourceText) {
  return pattern.split === 'Zhong Xing' && sourceText.includes('仲行') && !sourceConfirms(pattern, sourceText);
}

export function scanCompoundNameText(text, sourceText = '', opts = {}) {
  const scanOptions = { sourceAware: true, ...opts };
  const hits = [];
  for (const pattern of PATTERNS) {
    pattern.re.lastIndex = 0;
    let match;
    while ((match = pattern.re.exec(text)) !== null) {
      if (isLikelyTitleContext(text, match.index, pattern)) continue;
      if (isKnownNonCompoundSource(pattern, sourceText)) continue;
      const confirmed = sourceConfirms(pattern, sourceText);
      if (scanOptions.sourceAware && !confirmed) continue;
      hits.push({
        found: match[0],
        preferred: pattern.preferred,
        sourceForms: pattern.sourceForms,
        sourceConfirmed: confirmed,
        index: match.index,
        excerpt: excerpt(text, match.index),
      });
    }
  }
  return hits.sort((a, b) => a.index - b.index || a.preferred.localeCompare(b.preferred));
}

function replaceText(text, sourceText, opts) {
  let next = text;
  for (const pattern of PATTERNS) {
    if (isKnownNonCompoundSource(pattern, sourceText)) continue;
    if (opts.sourceAware && !sourceConfirms(pattern, sourceText)) continue;
    pattern.re.lastIndex = 0;
    next = next.replace(pattern.re, (match, ...args) => {
      const offset = args.at(-2);
      if (isLikelyTitleContext(next, offset, pattern)) return match;
      return pattern.preferred;
    });
  }
  return next;
}

function* walk(value, keyPath = [], sentenceId = '', sourceText = '', opts) {
  if (typeof value === 'string') {
    if (!isTranslationField(keyPath)) return;
    for (const hit of scanCompoundNameText(value, sourceText, opts)) {
      yield {
        path: nearestContext(keyPath),
        sentenceId,
        ...hit,
      };
    }
    return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      yield* walk(value[i], keyPath.concat(String(i)), sentenceId, sourceText, opts);
    }
    return;
  }

  if (!value || typeof value !== 'object') return;
  const nextSentenceId = typeof value.id === 'string' ? value.id : sentenceId;
  const localSourceText = objectSource(value);
  const nextSourceText = [sourceText, localSourceText].filter(Boolean).join('\n');
  for (const [key, child] of Object.entries(value)) {
    yield* walk(child, keyPath.concat(key), nextSentenceId, nextSourceText, opts);
  }
}

function fixWalk(value, keyPath = [], sourceText = '', opts) {
  if (Array.isArray(value)) {
    let changed = false;
    for (let i = 0; i < value.length; i += 1) {
      changed = fixWalk(value[i], keyPath.concat(String(i)), sourceText, opts) || changed;
    }
    return changed;
  }

  if (!value || typeof value !== 'object') return false;

  const localSourceText = objectSource(value);
  const nextSourceText = [sourceText, localSourceText].filter(Boolean).join('\n');
  let changed = false;
  for (const [key, child] of Object.entries(value)) {
    const childPath = keyPath.concat(key);
    if (typeof child === 'string' && isTranslationField(childPath)) {
      const next = replaceText(child, nextSourceText, opts);
      if (next !== child) {
        value[key] = next;
        changed = true;
      }
      continue;
    }
    changed = fixWalk(child, childPath, nextSourceText, opts) || changed;
  }
  return changed;
}

function scanFile(filePath, opts) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return {
      file: path.relative(process.cwd(), filePath),
      parseError: error.message,
      hits: [],
    };
  }

  const hits = [...walk(data, [], '', '', opts)];
  if (opts.fix && hits.length > 0) {
    const changed = fixWalk(data, [], '', opts);
    if (changed) {
      fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
    }
  }
  return {
    book: data.meta?.book || path.basename(path.dirname(filePath)),
    chapter: data.meta?.chapter || path.basename(filePath, '.json'),
    file: path.relative(process.cwd(), filePath),
    hits,
    fixed: opts.fix && hits.length > 0,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const inputs = opts.book
    ? [path.join(DATA_DIR, opts.book)]
    : opts.inputs.length > 0
      ? opts.inputs
      : [DATA_DIR];
  const rows = chapterFiles(inputs).map(file => scanFile(file, opts)).filter(row => row.parseError || row.hits.length > 0);

  rows.sort((a, b) => (
    String(a.book).localeCompare(String(b.book)) ||
    String(a.chapter).localeCompare(String(b.chapter), undefined, { numeric: true })
  ));

  const totalHits = rows.reduce((sum, row) => sum + row.hits.length, 0);

  if (opts.json) {
    console.log(JSON.stringify({ totalChapters: rows.length, totalHits, rows }, null, 2));
  } else if (opts.summary) {
    const byBook = new Map();
    for (const row of rows) {
      const current = byBook.get(row.book) || { chapters: 0, hits: 0 };
      current.chapters += 1;
      current.hits += row.hits.length;
      byBook.set(row.book, current);
    }
    const prefix = opts.fix ? 'Fixed compound name spacing candidates' : 'Compound name spacing candidates';
    console.log(`${prefix}: ${totalHits} hit(s) in ${rows.length} chapter(s)`);
    console.log('');
    console.log('book\tchapters\thits');
    for (const [book, counts] of [...byBook.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`${book}\t${counts.chapters}\t${counts.hits}`);
    }
  } else {
    const prefix = opts.fix ? 'Fixed compound name spacing candidates' : 'Compound name spacing candidates';
    console.log(`${prefix}: ${totalHits} hit(s) in ${rows.length} chapter(s)`);
    if (totalHits > 0) console.log('');
    for (const row of rows) {
      if (row.parseError) {
        console.log(`${row.file}\tparse-error\t${row.parseError}`);
        continue;
      }
      console.log(`${row.book}\t${row.chapter}\t${row.hits.length}\t${row.file}`);
      for (const hit of row.hits) {
        const id = hit.sentenceId ? `${hit.sentenceId}\t` : '';
        console.log(`  ${id}${hit.found} -> ${hit.preferred}\t${hit.path}\t${JSON.stringify(hit.excerpt)}`);
      }
    }
  }

  if (opts.fail && (totalHits > 0 || rows.some(row => row.parseError))) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
