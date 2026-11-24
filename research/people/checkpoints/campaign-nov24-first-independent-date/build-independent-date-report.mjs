#!/usr/bin/env node
/**
 * Offline assembler + validator for checkpoint independent date reports.
 * Substantive verdict text is authored in the caller's scope review; this script
 * only handles evidence wiring, person/unit coverage, and validateDateAuditReport.
 */
import fs from 'node:fs';
import path from 'node:path';
import { writeJsonAtomic, readJson } from '../../../../scripts/lib/people-content.mjs';
import { validateDateAuditReport } from '../../../../scripts/lib/people-date-audit.mjs';

export function personFirstUnitMap(packet) {
  const personFirstUnit = new Map();
  for (const [unitId, pids] of Object.entries(packet.unitPeople ?? {})) {
    for (const pid of pids) if (!personFirstUnit.has(pid)) personFirstUnit.set(pid, unitId);
  }
  for (const item of packet.items) {
    if (item.evidence?.length && !personFirstUnit.has(item.personId)) {
      personFirstUnit.set(item.personId, item.evidence[0]);
    }
  }
  return personFirstUnit;
}

export function quoteForUnit(unit) {
  if (!unit?.zh) throw new Error('missing zh');
  if (unit.zh.length <= 28) return unit.zh;
  const match = unit.zh.match(/[^，。；]{4,22}/);
  return match?.[0] ?? unit.zh.slice(0, 22);
}

export function evidenceForItem(item, packet, personFirstUnit) {
  const unitMap = new Map(packet.units.map(u => [u.id, u]));
  if (item.evidence?.length) {
    const unitId = item.evidence[0];
    const unit = unitMap.get(unitId);
    const quote = quoteForUnit(unit);
    if (!unit.zh.includes(quote)) throw new Error(`quote not in unit for ${item.id}`);
    return [{ unit: unitId, quote }];
  }
  const unitId = personFirstUnit.get(item.personId);
  if (!unitId) throw new Error(`no unit for ${item.id}`);
  const unit = unitMap.get(unitId);
  return [{ unit: unitId, quote: quoteForUnit(unit) }];
}

export function writeValidatedReport(report, packet, outPath) {
  validateDateAuditReport(report, packet);
  writeJsonAtomic(outPath, report);
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [packetPath, outPath] = process.argv.slice(2);
  if (!packetPath || !outPath) {
    console.error('usage: build-independent-date-report.mjs PACKET OUT (report JSON on stdin)');
    process.exit(1);
  }
  const packet = readJson(packetPath);
  const report = JSON.parse(fs.readFileSync(0, 'utf8'));
  writeValidatedReport(report, packet, outPath);
  console.log('validated', outPath);
}