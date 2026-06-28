#!/usr/bin/env node
/**
 * Mark source-correspondence queue items without hand-editing large JSON files.
 */
import fs from 'node:fs';

function usage() {
  console.error(`Usage:
  node scripts/mark-source-correspondence.mjs --queue PATH --item ID --decision denied --notes TEXT [--reviewer NAME]

Supported decisions: denied, approved, applied.`);
}

function parseArgs(argv) {
  const opts = {
    queue: null,
    items: [],
    decision: null,
    notes: null,
    reviewer: 'sdk-repair-chapter',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => {
      if (i + 1 >= argv.length) throw new Error(`Missing value for ${arg}`);
      i += 1;
      return argv[i];
    };

    if (arg === '--queue') opts.queue = value();
    else if (arg.startsWith('--queue=')) opts.queue = arg.slice('--queue='.length);
    else if (arg === '--item') opts.items.push(...value().split(',').filter(Boolean));
    else if (arg.startsWith('--item=')) opts.items.push(...arg.slice('--item='.length).split(',').filter(Boolean));
    else if (arg === '--decision') opts.decision = value();
    else if (arg.startsWith('--decision=')) opts.decision = arg.slice('--decision='.length);
    else if (arg === '--notes') opts.notes = value();
    else if (arg.startsWith('--notes=')) opts.notes = arg.slice('--notes='.length);
    else if (arg === '--reviewer') opts.reviewer = value();
    else if (arg.startsWith('--reviewer=')) opts.reviewer = arg.slice('--reviewer='.length);
    else if (arg === '-h' || arg === '--help') {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!opts.queue) throw new Error('Missing --queue PATH.');
  if (!opts.items.length) throw new Error('Missing --item ID.');
  if (!new Set(['approved', 'applied', 'denied']).has(opts.decision)) {
    throw new Error('Missing or unsupported --decision. Use approved, applied, or denied.');
  }
  if (!opts.notes?.trim()) throw new Error('Missing --notes TEXT.');
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queue = JSON.parse(fs.readFileSync(opts.queue, 'utf8'));
  const items = queue.items || queue.hits || [];
  const wanted = new Set(opts.items);
  const now = new Date().toISOString();
  const updated = [];

  for (const item of items) {
    if (!wanted.has(item.id)) continue;
    item.status = opts.decision;
    item.decision = opts.decision;
    item.notes = opts.notes;
    item.reviewedAt = now;
    item.reviewer = opts.reviewer;
    if (opts.decision === 'denied') item.retainedAfterRescan = true;
    if (opts.decision === 'applied') item.appliedAt = item.appliedAt || now;
    updated.push(item.id);
  }

  const missing = [...wanted].filter((id) => !updated.includes(id));
  if (missing.length) throw new Error(`Item(s) not found: ${missing.join(', ')}`);

  fs.writeFileSync(opts.queue, `${JSON.stringify(queue, null, 2)}\n`);
  // Re-parse the exact bytes written before reporting success.
  JSON.parse(fs.readFileSync(opts.queue, 'utf8'));
  console.log(`Marked ${updated.length} item(s) ${opts.decision}: ${updated.join(', ')}`);
}

try {
  main();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  usage();
  process.exit(2);
}
