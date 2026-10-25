#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { prepareOwnershipPlan } from './lib/people-ownership-plan.mjs';
const args = process.argv.slice(2), options = {};
const allowed = new Set(['root', 'commit', 'book', 'chapter', 'candidate', 'proposal', 'review', 'pins']);
for (let i = 0; i < args.length; i += 2) {
  const key = args[i]?.replace(/^--/, '');
  if (!allowed.has(key) || !args[i + 1] || args[i + 1].startsWith('--') || key in options) throw new Error(`Invalid argument: ${args[i]}`);
  options[key] = args[i + 1];
}
for (const key of allowed) if (!options[key]) throw new Error(`Missing --${key}`);
if (!path.isAbsolute(options.root)) throw new Error('--root must be absolute');
const plan = await prepareOwnershipPlan({ ...options, candidateBytes: fs.readFileSync(options.candidate), proposalBytes: fs.readFileSync(options.proposal), reviewBytes: fs.readFileSync(options.review), pins: JSON.parse(fs.readFileSync(options.pins, 'utf8')) });
// stdout only. The host chooses a unique artifact destination; no --apply exists.
process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
