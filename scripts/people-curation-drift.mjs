#!/usr/bin/env node
// Read-only research output, never a review or publication authorization.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { computeCurationDrift, parseCurationDriftJson, verifyCurationDrift } from './lib/people-curation-drift.mjs';

function load(file) {
  const bytes = fs.readFileSync(file);
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return { sha256: `sha256:${createHash('sha256').update(bytes).digest('hex')}`, data: parseCurationDriftJson(text) };
}

try {
  const args = process.argv.slice(2);
  if (args.length !== 2 && !(args.length === 4 && args[2] === '--verify')) {
    throw new Error('Usage: node scripts/people-curation-drift.mjs BEFORE.json AFTER.json [--verify INVENTORY.json]');
  }
  const before = load(args[0]), after = load(args[1]);
  const inventory = computeCurationDrift(before.data, after.data);
  if (args.length === 4) verifyCurationDrift(before.data, after.data, load(args[3]).data);
  process.stdout.write(`${JSON.stringify({ kind: 'mechanical-drift-evidence-not-approval', beforeBytesSha256: before.sha256, afterBytesSha256: after.sha256, verifiedSuppliedInventory: args.length === 4, inventory }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`Curation drift error: ${error.message}\n`);
  process.exitCode = 1;
}
