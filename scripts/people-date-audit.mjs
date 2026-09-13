#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { PEOPLE_DIR, readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { sourceChapterIds } from './lib/people-corpus.mjs';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems, dateAuditStatus, recordDateAudit, DATE_AUDIT_VERSION } from './lib/people-date-audit.mjs';

const { values, positionals } = parseArgs({ allowPositionals: true, options: {
  book: { type: 'string' }, chapter: { type: 'string' }, out: { type: 'string' }, report: { type: 'string' },
} });
const [command] = positionals;
if (positionals.length !== 1 || (values.chapter && !values.book)) throw new Error('Use one command; --chapter requires --book');
const scopes = sourceChapterIds();
if (command === 'init') {
  const file = path.join(PEOPLE_DIR, 'date-audit-baseline.json');
  if (fs.existsSync(file)) throw new Error('Date audit baseline already exists; refusing to reset audit work');
  writeJsonAtomic(file, { schemaVersion: 1, auditVersion: DATE_AUDIT_VERSION, initializedAt: new Date().toISOString(),
    reason: 'All pre-existing chapters require an independent chronology audit; extraction completion is retained.',
    chapters: Object.fromEntries(scopes.map(scope => [scope, 'un-audited'])) });
  console.log(`Initialized ${scopes.length} chapters as date-un-audited; no extractions modified.`);
} else if (command === 'packet') {
  if (!values.out) throw new Error('packet requires --book --chapter --out');
  const packet = buildDateAuditPacket(values.book, values.chapter);
  writeJsonAtomic(path.resolve(values.out), packet);
  console.log(`${packet.book}/${packet.chapter}: ${packet.items.length} date/hint checks, ${packet.people.length} people, ${packet.units.length} source units`);
} else if (command === 'record') {
  if (!values.report) throw new Error('record requires --report');
  console.log(JSON.stringify(recordDateAudit(readJson(path.resolve(values.report)))));
} else if (command === 'scan') {
  const findings = [];
  let extractedChapters = 0;
  for (const scope of scopes) {
    const [book, chapter] = scope.split(':');
    if ((values.book && values.book !== book) || (values.chapter && values.chapter !== chapter)) continue;
    const file = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
    if (!fs.existsSync(file)) continue;
    extractedChapters += 1;
    findings.push(...dateAuditDiagnostics(dateAuditItems(readJson(file))).map(finding => ({ book, chapter, ...finding })));
  }
  if (!extractedChapters) throw new Error('No matching extracted chapters');
  const result = { auditVersion: DATE_AUDIT_VERSION, generatedAt: new Date().toISOString(), extractedChapters, findings };
  if (values.out) writeJsonAtomic(path.resolve(values.out), result);
  console.log(JSON.stringify({ extractedChapters, findings: findings.length, chapters: new Set(findings.map(f => `${f.book}:${f.chapter}`)).size }));
} else if (command === 'status' || command === 'verify') {
  const selected = values.book ? scopes.filter(scope => scope.startsWith(`${values.book}:`) && (!values.chapter || scope.endsWith(`:${values.chapter}`))) : scopes;
  if (!selected.length) throw new Error('No matching date audit chapters');
  const counts = {};
  const chapters = selected.map(scope => {
    const [book, chapter] = scope.split(':');
    const audit = dateAuditStatus(book, chapter);
    counts[audit.status] = (counts[audit.status] ?? 0) + 1;
    return { book, chapter, ...audit };
  });
  const result = { auditVersion: DATE_AUDIT_VERSION, total: selected.length, counts, chapters };
  if (values.out) writeJsonAtomic(path.resolve(values.out), result);
  console.log(JSON.stringify({ total: result.total, counts, ...(values.chapter ? { chapters } : {}) }, null, 2));
  if (command === 'verify' && chapters.some(chapter => chapter.status === 'stale')) process.exitCode = 1;
} else throw new Error('Use init, packet --book B --chapter NNN --out PATH, record --report PATH, scan, status, or verify');
