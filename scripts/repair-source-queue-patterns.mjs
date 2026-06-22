#!/usr/bin/env node
/**
 * Clear high-confidence source repair queue patterns.
 *
 * Dry-run by default. With --apply:
 * - marks source-correspondence diffs that are only approved graph variants as
 *   denied/no-op reviewed;
 * - marks correspondence items caused by upstream-only MediaWiki residue
 *   (__TOC__, Category:..., PD-old) as denied/no-op reviewed;
 * - removes raw HTML tags and leading table span attributes from local source
 *   fields, then marks matching source-artifact queue items as applied.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_REVIEWER = 'repair-source-queue-patterns';
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const CORRESPONDENCE_RE = /^source-correspondence.+\.json$/u;
const SOURCE_ARTIFACTS_PATH = path.join(QUALITY_DIR, 'source-artifacts-corpus.json');
const STRUCTURAL_SOURCE_ARTIFACT_RULES = new Set([
  'SOURCE_HTML_TABLE_SPAN',
  'SOURCE_RAW_HTML_TAG',
  'SOURCE_CTEXT_INLINE_MARKUP',
]);
const REPAIRABLE_SOURCE_ARTIFACT_RULES = new Set([
  ...STRUCTURAL_SOURCE_ARTIFACT_RULES,
  'SOURCE_PRIVATE_USE_GLYPH',
]);
const UPSTREAM_RESIDUE_RE = /__TOC__|Category:[A-Za-z0-9_-]+|PD-old/u;
const RAW_HTML_TAG_RE = /<\/?[a-z][^>]*>/giu;
const REF_OPEN_RE = /<ref\b[^>]*>/iu;
const REF_CLOSE_RE = /<\/ref>/iu;
const TABLE_SPAN_ATTR_RE = /(?:^|\|)\s*(?:(?:rowspan|colspan|valign|align|style|width|height)\s*=\s*(?:"[^"]*"|'[^']*')\s*)+\|?/giu;
const CTEXT_INLINE_MARKUP_RE = /-\{([^}]+)\}-/gu;
const KNOWN_PRIVATE_USE_CHAR_REPAIRS = new Map([
  ['', '衞'],
  ['', '羣'],
  ['', '无'],
  ['', '卻'],
  ['', '饍'],
  ['', '矟'],
]);
const CONTEXTUAL_PRIVATE_USE_REPAIRS = [
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]012\.json$/u,
    textRe: /通憲/gu,
    replacement: '通幰',
    markerRe: /通憲/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]0(?:25|26)\.json$/u,
    textRe: /兀/gu,
    replacement: '兀朮',
    markerRe: /兀/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]207\.json$/u,
    textRe: /君/gu,
    replacement: '君㚟',
    markerRe: /君/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]006\.json$/u,
    textRe: /駝/gu,
    replacement: '橐駞',
    markerRe: /駝/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]179\.json$/u,
    textRe: /莊/gu,
    replacement: '莊昶',
    markerRe: /莊/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\](?:278|280)\.json$/u,
    textRe: /聿/gu,
    replacement: '聿𨮁',
    markerRe: /聿/u,
  },
];

const VARIANTS = new Map([
  ['并', '並'],
  ['竝', '並'],
  ['茍', '苟'],
  ['姧', '奸'],
  ['姦', '奸'],
  ['筭', '算'],
  ['恒', '恆'],
  ['辠', '罪'],
  ['輓', '挽'],
  ['範', '范'],
  ['祕', '秘'],
  ['徴', '徵'],
  ['征', '徵'],
  ['闇', '暗'],
  ['歎', '嘆'],
  ['廕', '蔭'],
  ['籓', '藩'],
  ['棊', '棋'],
  ['于', '於'],
  ['陜', '陝'],
  ['墻', '牆'],
  ['衞', '衛'],
  ['厠', '廁'],
  ['塼', '磚'],
  ['甎', '磚'],
  ['粘', '黏'],
  ['爲', '為'],
]);

function usage() {
  console.error(`Usage:
  node scripts/repair-source-queue-patterns.mjs [--apply] [--reviewer NAME]

Clears high-confidence repair queue patterns. Dry-run by default.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    reviewer: DEFAULT_REVIEWER,
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

  return opts;
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  const values = new Set([status, decision].filter(Boolean));

  if (item?.appliedAt || item?.appliedSummary || values.has('applied') || values.has('included')) return 'applied';
  if (values.has('denied') || values.has('rejected') || values.has('declined') || values.has('false-positive') || values.has('false_positive')) return 'rejected';
  if (values.has('approved')) return 'approved';
  return 'pending';
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/g, '，')
    .replace(/[﹔;]/g, '；')
    .replace(/[﹕:]/g, '：')
    .replace(/[﹗!]/g, '！')
    .replace(/[﹖?]/g, '？')
    .replace(/[“”]/g, '「')
    .replace(/[‘’]/g, '」')
    .replace(/[〈《]/g, '《')
    .replace(/[〉》]/g, '》')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')');
}

function strippedText(text) {
  return normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC')
    .replace(/[^\p{Script=Han}0-9A-Za-z]/gu, '');
}

function variantKey(text) {
  let out = '';
  for (const char of strippedText(text)) out += VARIANTS.get(char) || char;
  return out;
}

function isVariantOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  return strippedText(source) !== strippedText(local) && variantKey(source) === variantKey(local);
}

function isUpstreamResidueOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!UPSTREAM_RESIDUE_RE.test(source)) return false;
  return !UPSTREAM_RESIDUE_RE.test(local);
}

function markDenied(item, now, reviewer, notes) {
  item.status = 'denied';
  item.decision = 'denied';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.notes = item.notes ? `${item.notes}\n${notes}` : notes;
}

function markApplied(item, now, reviewer, summary) {
  item.status = 'applied';
  item.decision = 'included';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.appliedAt = item.appliedAt || now;
  item.appliedSummary = item.appliedSummary || summary;
  item.notes = item.notes || summary;
}

function sourceKey(unit) {
  for (const key of SOURCE_KEYS) {
    if (typeof unit?.[key] === 'string') return key;
  }
  return null;
}

function collectSourceUnits(data) {
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (Array.isArray(block.sentences)) {
      for (const [index, unit] of block.sentences.entries()) {
        const key = sourceKey(unit);
        if (!key) continue;
        units.push({
          blockIndex,
          blockType: block.type || 'paragraph',
          index,
          path: `sentences.${index}.${key}`,
          id: unit.id || '',
          unit,
          key,
        });
      }
    }
    if (Array.isArray(block.cells)) {
      for (const [index, unit] of block.cells.entries()) {
        const key = sourceKey(unit);
        if (!key) continue;
        units.push({
          blockIndex,
          blockType: block.type || 'table_row',
          index,
          path: `cells.${index}.${key}`,
          id: unit.id || '',
          unit,
          key,
        });
      }
    }
  }
  return units;
}

function sourceUnitKeys(file, unit) {
  return [
    `${path.resolve(file)}\u241f${unit.id}`,
    `${path.resolve(file)}\u241f${unit.path}`,
  ];
}

function artifactQueueKeys(item) {
  return [
    `${path.resolve(item.file || '')}\u241f${item.sentenceId || ''}`,
    `${path.resolve(item.file || '')}\u241f${item.path || ''}`,
  ];
}

function removeRefMarkup(text, state) {
  let out = '';
  let index = 0;
  let changed = false;
  let htmlTags = 0;
  let refTextRemoved = 0;
  const input = String(text || '');

  while (index < input.length) {
    if (state.inRef) {
      const rest = input.slice(index);
      const closeMatch = rest.match(REF_CLOSE_RE);
      changed = true;
      if (!closeMatch) {
        refTextRemoved += rest.length;
        return { text: out, changed, htmlTags, refTextRemoved };
      }
      refTextRemoved += closeMatch.index;
      htmlTags += 1;
      state.inRef = false;
      index += closeMatch.index + closeMatch[0].length;
      continue;
    }

    const rest = input.slice(index);
    const openMatch = rest.match(REF_OPEN_RE);
    if (!openMatch) {
      out += rest;
      break;
    }

    out += rest.slice(0, openMatch.index);
    changed = true;
    htmlTags += 1;
    index += openMatch.index + openMatch[0].length;

    const afterOpen = input.slice(index);
    const closeMatch = afterOpen.match(REF_CLOSE_RE);
    if (!closeMatch) {
      state.inRef = true;
      refTextRemoved += afterOpen.length;
      return { text: out, changed, htmlTags, refTextRemoved };
    }

    refTextRemoved += closeMatch.index;
    htmlTags += 1;
    index += closeMatch.index + closeMatch[0].length;
  }

  return { text: out, changed, htmlTags, refTextRemoved };
}

function repairKnownPrivateUseText(text, file) {
  let out = String(text || '');
  let knownGlyphs = 0;

  for (const [glyph, replacement] of KNOWN_PRIVATE_USE_CHAR_REPAIRS) {
    if (!out.includes(glyph)) continue;
    const before = out;
    out = out.split(glyph).join(replacement);
    knownGlyphs += before.split(glyph).length - 1;
  }

  for (const repair of CONTEXTUAL_PRIVATE_USE_REPAIRS) {
    if (!repair.fileRe.test(file) || !repair.textRe.test(out)) continue;
    out = out.replace(repair.textRe, () => {
      knownGlyphs += 1;
      return repair.replacement;
    });
  }

  return {
    text: out,
    changed: out !== text,
    knownGlyphs,
  };
}

function cleanSourceArtifactText(text, state = { inRef: false }, file = '') {
  let changed = false;
  let htmlTags = 0;
  let tableAttrs = 0;
  let ctextMarkup = 0;
  let refTextRemoved = 0;
  let knownGlyphs = 0;
  let out = String(text || '');

  const refResult = removeRefMarkup(out, state);
  out = refResult.text;
  changed = changed || refResult.changed;
  htmlTags += refResult.htmlTags;
  refTextRemoved += refResult.refTextRemoved;

  out = out.replace(RAW_HTML_TAG_RE, () => {
    changed = true;
    htmlTags += 1;
    return '';
  });

  out = out.replace(TABLE_SPAN_ATTR_RE, (match) => {
    const replacement = match.startsWith('|') ? '|' : '';
    if (replacement !== match) {
      changed = true;
      tableAttrs += 1;
    }
    return replacement;
  }).replace(/^\|+/u, () => {
    changed = true;
    return '';
  });

  out = out.replace(CTEXT_INLINE_MARKUP_RE, (_match, inner) => {
    changed = true;
    ctextMarkup += 1;
    return inner;
  });

  const glyphResult = repairKnownPrivateUseText(out, file);
  out = glyphResult.text;
  changed = changed || glyphResult.changed;
  knownGlyphs += glyphResult.knownGlyphs;

  return {
    text: out,
    changed,
    htmlTags,
    tableAttrs,
    ctextMarkup,
    refTextRemoved,
    knownGlyphs,
  };
}

function correspondenceQueueFiles() {
  if (!fs.existsSync(QUALITY_DIR)) return [];
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => CORRESPONDENCE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function clearCorrespondenceNoOps(opts, now) {
  const stats = {
    filesChanged: 0,
    variantNoOps: 0,
    upstreamResidueNoOps: 0,
  };
  const samples = [];

  for (const file of correspondenceQueueFiles()) {
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      if (isVariantOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: source/local difference is only approved graph variants; local corpus text retained.');
        stats.variantNoOps += 1;
        changed = true;
      } else if (isUpstreamResidueOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: discrepancy is caused by upstream MediaWiki residue such as __TOC__, Category, or PD-old text; local corpus text retained.');
        stats.upstreamResidueNoOps += 1;
        changed = true;
      } else {
        continue;
      }
      if (samples.length < 12) {
        samples.push({
          file,
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
        });
      }
    }
    if (!changed) continue;
    queue.updatedAt = now;
    stats.filesChanged += 1;
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  }

  return { stats, samples };
}

function loadArtifactQueue() {
  if (!fs.existsSync(SOURCE_ARTIFACTS_PATH)) return null;
  return JSON.parse(fs.readFileSync(SOURCE_ARTIFACTS_PATH, 'utf8'));
}

function isKnownPrivateUseArtifactItem(item) {
  if (item.ruleId !== 'SOURCE_PRIVATE_USE_GLYPH') return false;
  if (KNOWN_PRIVATE_USE_CHAR_REPAIRS.has(item.found)) return true;
  return CONTEXTUAL_PRIVATE_USE_REPAIRS.some((repair) => (
    item.found === repair.found &&
    repair.fileRe.test(item.file || '') &&
    repair.markerRe.test(item.excerpt || '')
  ));
}

function repairSourceArtifacts(opts, now) {
  const queue = loadArtifactQueue();
  if (!queue) {
    return {
      stats: {
        filesChanged: 0,
        unitsChanged: 0,
        htmlTagsRemoved: 0,
        tableAttrsRemoved: 0,
        ctextMarkupRemoved: 0,
        knownGlyphsRepaired: 0,
        queueMarked: 0,
      },
      samples: [],
      touchedBooks: [],
    };
  }

  const pending = (queue.hits || [])
    .filter((item) => statusOf(item) === 'pending' && REPAIRABLE_SOURCE_ARTIFACT_RULES.has(item.ruleId));
  const files = [...new Set(pending.map((item) => item.file).filter(Boolean))].sort();
  const changedUnitKeys = new Set();
  const touchedBooks = new Set();
  const samples = [];
  const stats = {
    filesChanged: 0,
    unitsChanged: 0,
    htmlTagsRemoved: 0,
    tableAttrsRemoved: 0,
    ctextMarkupRemoved: 0,
    refTextRemoved: 0,
    knownGlyphsRepaired: 0,
    queueMarked: 0,
  };

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    let fileChanged = false;
    const htmlState = { inRef: false };
    for (const unit of collectSourceUnits(data)) {
      const before = unit.unit[unit.key];
      const result = cleanSourceArtifactText(before, htmlState, file);
      if (!result.changed || result.text === before) continue;
      unit.unit[unit.key] = result.text;
      fileChanged = true;
      stats.unitsChanged += 1;
      stats.htmlTagsRemoved += result.htmlTags;
      stats.tableAttrsRemoved += result.tableAttrs;
      stats.ctextMarkupRemoved += result.ctextMarkup;
      stats.refTextRemoved += result.refTextRemoved;
      stats.knownGlyphsRepaired += result.knownGlyphs;
      for (const key of sourceUnitKeys(file, unit)) changedUnitKeys.add(key);
      if (samples.length < 12) {
        samples.push({
          file,
          id: unit.id,
          before: before.slice(0, 120),
          after: result.text.slice(0, 120),
        });
      }
    }
    if (!fileChanged) continue;
    stats.filesChanged += 1;
    touchedBooks.add(path.basename(path.dirname(file)));
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }

  for (const item of pending) {
    if (!artifactQueueKeys(item).some((key) => changedUnitKeys.has(key))) continue;
    if (
      !STRUCTURAL_SOURCE_ARTIFACT_RULES.has(item.ruleId) &&
      !isKnownPrivateUseArtifactItem(item)
    ) {
      continue;
    }
    markApplied(
      item,
      now,
      opts.reviewer,
      `Repaired local source scrape artifact for ${item.ruleId}.`,
    );
    stats.queueMarked += 1;
  }

  if (opts.apply && stats.queueMarked > 0) {
    queue.updatedAt = now;
    fs.writeFileSync(SOURCE_ARTIFACTS_PATH, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  }

  return { stats, samples, touchedBooks: [...touchedBooks].sort() };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const correspondence = clearCorrespondenceNoOps(opts, now);
  const artifacts = repairSourceArtifacts(opts, now);

  console.log(JSON.stringify({
    apply: opts.apply,
    correspondence: correspondence.stats,
    artifacts: artifacts.stats,
    touchedBooks: artifacts.touchedBooks,
    samples: {
      correspondence: correspondence.samples,
      artifacts: artifacts.samples,
    },
  }, null, 2));
}

main();
