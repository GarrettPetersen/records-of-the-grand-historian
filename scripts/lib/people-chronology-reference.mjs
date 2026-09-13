import path from 'node:path';
import { PEOPLE_DIR, readJson, sha256 } from './people-content.mjs';
import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
import { researchCitationValid } from './people-historical-research.mjs';

export function validateChronologyReference(data) {
  if (data.version !== 1 || !Array.isArray(data.entries) || !Array.isArray(data.sources)) throw new Error('Invalid chronology reference');
  const sources = new Set();
  for (const source of data.sources) {
    if (!source.id || sources.has(source.id) || !source.title || !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt) || new URL(source.url).protocol !== 'https:') throw new Error('Invalid or duplicate chronology source');
    sources.add(source.id);
  }
  const ids = new Set();
  for (const entry of data.entries) {
    if (!entry.id || ids.has(entry.id) || !['reign-year', 'person-attestation'].includes(entry.kind) || !entry.aliases?.length || !entry.sources?.length || entry.sources.some(id => !sources.has(id))) throw new Error('Invalid chronology entry or source link');
    ids.add(entry.id);
    if (!['BC', 'AD'].includes(entry.westernYear?.era) || !Number.isSafeInteger(entry.westernYear?.year) || entry.westernYear.year < 1 || entry.westernYear.precision !== 'year') throw new Error('Invalid Western year; there is no year zero');
    if (entry.kind === 'reign-year' && (!entry.ruler || !entry.period || !Number.isSafeInteger(entry.regnalYear) || entry.regnalYear < 1)) throw new Error('Reign rows require ruler, period, and positive regnal year');
    if (entry.kind === 'person-attestation' && (!entry.identity || !entry.event || !entry.sourceDate)) throw new Error('Personal chronology requires identity and dated event evidence');
  }
  return data;
}

export function loadChronologyReference() {
  const data = validateChronologyReference(readJson(path.join(PEOPLE_DIR, 'chronology-reference.json')));
  const chapters = new Map();
  for (const source of data.sources) {
    if (!source.local) continue;
    const { book, chapter, unit, quote } = source.local;
    if (!/^[a-z0-9_-]+$/.test(book) || !/^\d{3}$/.test(chapter) || typeof unit !== 'string' || !unit || typeof quote !== 'string' || !quote) throw new Error('Invalid chronology source path or excerpt');
    const key = `${book}/${chapter}`;
    if (!chapters.has(key)) chapters.set(key, buildPeopleExtractionPacket(book, chapter).units);
    if (chapters.get(key).find(row => row.id === unit)?.zh !== quote) throw new Error(`Chronology source changed: ${source.id}; independent re-review required`);
  }
  return { ...data, digest: sha256(JSON.stringify(data)) };
}

export function lookupChronology(reference, query) {
  const normalized = query.normalize('NFKC').trim().toLocaleLowerCase('en');
  if (!normalized) throw new Error('Chronology query cannot be empty');
  const matches = reference.entries.filter(entry => entry.id === query || entry.aliases.some(alias => alias.normalize('NFKC').toLocaleLowerCase('en').includes(normalized)));
  return { registryDigest: reference.digest, completeCorpusTable: false, matches: matches.slice(0, 20).map(entry => ({ ...entry,
    sources: entry.sources.map(id => reference.sources.find(source => source.id === id)) })), totalMatches: matches.length,
    instruction: matches.length ? 'Check identity and reign period. Cite the exact reference ID on each supported draft claim with cite_chronology. Do not treat nearby narrative dates as a personal attestation.' : 'No reviewed mapping available. Use historical research and cite the acquired evidence. Report a blocker if the date remains unresolved; do not convert from memory.' };
}

export function westernDates(value) {
  return westernDateFields(value).map(entry => entry.date);
}

export function westernDateFields(value, prefix = 'value') {
  if (!value || typeof value !== 'object') return [];
  const dates = [];
  for (const [key, child] of Object.entries(value)) {
    const field = `${prefix}.${key}`;
    if (key === 'westernYear') dates.push({ field, date: child });
    else if (key === 'westernInterval') dates.push({ field: `${field}.start`, date: child.start }, { field: `${field}.end`, date: child.end });
    else if (key === 'westernBounds') dates.push(...Object.entries(child).map(([bound, date]) => ({ field: `${field}.${bound}`, date })));
    else dates.push(...westernDateFields(child, field));
  }
  return dates;
}

export function chronologyCitationErrors(state, reference) {
  const errors = [];
  for (const record of Object.values(state.records.claims)) {
    const dates = westernDates(record.value);
    if (!dates.length) continue;
    if (researchCitationValid(state, record)) continue;
    const binding = state.chronologyCitations?.[record.id];
    const entry = reference.entries.find(row => row.id === binding?.referenceId);
    if (!binding || binding.recordHash !== sha256(JSON.stringify(record)) || binding.registryDigest !== reference.digest || !entry) errors.push(`${record.id}: missing or stale chronology citation; use lookup_chronology and cite_chronology`);
    else if (dates.some(date => date.era !== entry.westernYear.era || date.year !== entry.westernYear.year)) errors.push(`${record.id}: cited chronology row does not support this Western date`);
  }
  return errors;
}
