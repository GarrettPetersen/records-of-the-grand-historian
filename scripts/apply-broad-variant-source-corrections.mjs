#!/usr/bin/env node
/**
 * Apply narrow source-correspondence repairs where upstream and local text have
 * the same Han/digit content after approved graph normalization.
 *
 * This does not translate. It only approves same-unit-count replacements and
 * delegates to apply-source-correspondence with preserve-existing-translations.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { variantText } from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'apply-broad-variant-source-corrections';
const REPAIR_TYPES = new Set([
  'text_discrepancy_candidate',
  'source_replacement_candidate',
]);

// Pairs that the shared normalizer intentionally treats as meaning-sensitive.
// Here they are allowed only inside a full-span equality check and applied as
// source-text corrections with existing English preserved.
const EXTRA_VARIANT_GROUPS = [
  '後后',
  '餘余',
  '云雲',
  '禦御',
  '發髮',
  '干乾',
  '谷穀',
  '斗鬥',
  '鍾鐘',
  '制製',
  '歌哥',
  '嘗嚐',
  '復複',
  '幸倖',
  '榆楡',
  '村邨',
  '梲棁',
  '檦㯹',
  '氈氊',
  '沉沈',
  '浚濬',
  '璵玙',
  '槊矟',
  '答荅',
  '綿緜',
  '搢縉',
  '肇肈',
  '蒞莅',
  '蔥葱',
  '梁樑',
  '坂阪',
  '彦彥',
  '暦曆',
  '朱硃',
  '鉢缽',
  '台臺',
  '呑吞',
  '崑昆崐',
  '昇升陞',
  '𣏌杞',
  '綵彩',
  '閲閱',
  '兪俞',
  '冢塚',
  '凌淩',
  '剋克',
  '劍劔',
  '呪咒',
  '喩喻',
  '寖浸',
  '屛屏',
  '巖岩',
  '布佈',
  '彝彜',
  '掲揭',
  '搆構',
  '旛幡',
  '稱称',
  '里裏',
  '个個',
  '莊庄',
  '屢屡',
  '塗途',
  '幞襆',
  '志誌',
  '丑醜',
  '厨廚',
  '么麼',
  '仆僕',
  '迭叠',
  '遯遁',
  '鋭銳',
  '閑閒',
  '闚窺',
  '隄堤',
  '霑沾',
];

const EXTRA_VARIANTS = new Map();
for (const group of EXTRA_VARIANT_GROUPS) {
  const chars = [...group];
  const canonical = chars[0];
  for (const char of chars) EXTRA_VARIANTS.set(char, canonical);
}

function usage() {
  console.error(`Usage:
  node scripts/apply-broad-variant-source-corrections.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME] [--validate]

Dry-run by default. With --apply, approves same-content graph/source-form
corrections and applies them through apply-source-correspondence.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Infinity,
    reviewer: DEFAULT_REVIEWER,
    validate: false,
  };

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
    if (arg === '--validate') {
      opts.validate = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(String(argv[++i] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .filter((file) => {
      if (opts.books.size === 0) return true;
      const base = path.basename(file);
      return [...opts.books].some((book) => base.includes(`-${book}.json`) || base.includes(`-${book}-`));
    })
    .sort();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (
    item.appliedAt
    || status === 'applied'
    || status === 'denied'
    || status === 'approved'
    || status === 'rejected'
    || decision === 'included'
    || decision === 'applied'
    || decision === 'denied'
    || decision === 'approved'
    || decision === 'rejected'
  ) return 'done';
  return 'pending';
}

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/gu, '，')
    .replace(/[﹔;]/gu, '；')
    .replace(/[﹕:]/gu, '：')
    .replace(/[﹗!]/gu, '！')
    .replace(/[﹖?]/gu, '？')
    .replace(/[“”]/gu, '「')
    .replace(/[‘’]/gu, '」')
    .replace(/[〈《]/gu, '《')
    .replace(/[〉》]/gu, '》')
    .replace(/[（]/gu, '(')
    .replace(/[）]/gu, ')');
}

function broadVariantText(text) {
  let out = '';
  for (const char of String(text || '')) {
    out += EXTRA_VARIANTS.get(char) || variantText(char);
  }
  return out;
}

function comparisonKey(text) {
  return broadVariantText(normalizePunctuation(String(text || '').replace(/\s+/gu, '').trim()).normalize('NFKC'))
    .replace(/[^\p{Script=Han}0-9]/gu, '');
}

function itemInScope(item, opts) {
  if (statusOf(item) !== 'pending') return false;
  if (!REPAIR_TYPES.has(item.type || '')) return false;
  if (opts.books.size > 0 && !opts.books.has(item.book)) return false;
  if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter || '').padStart(3, '0'))) return false;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  if (comparisonKey(source) !== comparisonKey(local)) return false;
  const sourceCount = item.sourceRange?.count ?? 0;
  const localCount = item.localRange?.count ?? 0;
  const ids = item.localRange?.ids || [];
  return sourceCount > 0 && sourceCount === localCount && ids.length === localCount;
}

function short(text) {
  const value = String(text || '').replace(/\s+/gu, '');
  return value.length > 140 ? `${value.slice(0, 139)}...` : value;
}

function runApplyQueue(queueFile, ids, opts, { dryRun = false } = {}) {
  const args = [
    'scripts/apply-source-correspondence.mjs',
    '--queue',
    queueFile,
    '--approve',
    ids.join(','),
    '--item',
    ids.join(','),
    '--preserve-existing-translations',
    '--reviewer',
    opts.reviewer,
  ];
  if (dryRun) args.push('--dry-run');
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    throw new Error(`apply-source-correspondence failed for ${queueFile}\n${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout);
}

function validateIds(queueFile, ids, opts) {
  const passed = [];
  const failed = [];
  for (const id of ids) {
    try {
      const report = runApplyQueue(queueFile, [id], opts, { dryRun: true });
      passed.push(id);
      void report;
    } catch (error) {
      failed.push({
        id,
        reason: String(error.message || error).split('\n').slice(1, 4).join(' '),
      });
    }
  }
  return { passed, failed };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const selectedByQueue = new Map();
  const summary = {
    apply: opts.apply,
    selected: 0,
    applied: 0,
    byBook: {},
    byQueue: {},
    samples: [],
    applyReports: [],
    validationReports: [],
    skippedValidation: [],
  };

  for (const queueFile of queueFiles(opts)) {
    if (summary.selected >= opts.limit) break;
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    for (const item of queue.items || []) {
      if (summary.selected >= opts.limit) break;
      if (!itemInScope(item, opts)) continue;
      const bucket = selectedByQueue.get(queueFile) || [];
      bucket.push(item.id);
      selectedByQueue.set(queueFile, bucket);
      summary.selected += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      summary.byQueue[path.relative(process.cwd(), queueFile)] = (summary.byQueue[path.relative(process.cwd(), queueFile)] || 0) + 1;
      if (summary.samples.length < 30) {
        summary.samples.push({
          id: item.id,
          chapter: `${item.book}/${String(item.chapter || '').padStart(3, '0')}`,
          type: item.type,
          source: short(item.sourceRange?.text || ''),
          local: short(item.localRange?.text || ''),
        });
      }
    }
  }

  if (opts.validate && !opts.apply) {
    for (const [queueFile, ids] of selectedByQueue.entries()) {
      const validation = validateIds(queueFile, ids, opts);
      summary.validationReports.push({
        queue: path.relative(process.cwd(), queueFile),
        wouldApply: validation.passed.length,
        skipped: validation.failed.length,
      });
      summary.skippedValidation.push(...validation.failed.map((failure) => ({
        queue: path.relative(process.cwd(), queueFile),
        ...failure,
      })));
    }
  }

  if (opts.apply) {
    for (const [queueFile, ids] of selectedByQueue.entries()) {
      const validation = validateIds(queueFile, ids, opts);
      summary.skippedValidation.push(...validation.failed.map((failure) => ({
        queue: path.relative(process.cwd(), queueFile),
        ...failure,
      })));
      if (validation.passed.length === 0) continue;
      const report = runApplyQueue(queueFile, validation.passed, opts);
      const applied = report.queues?.[0]?.appliedItems || 0;
      summary.applied += applied;
      summary.applyReports.push({
        queue: path.relative(process.cwd(), queueFile),
        applied,
      });
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
