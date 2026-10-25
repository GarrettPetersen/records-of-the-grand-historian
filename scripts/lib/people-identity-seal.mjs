import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './people-content.mjs';

export function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key =>
    `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function peopleDigest(value) {
  const hash = crypto.createHash('sha256');
  // Keep the legacy stableJson byte representation, without materializing a
  // catalog-sized string (V8 strings have a hard length limit independent of RAM).
  let pending = [];
  let pendingLength = 0;
  const flush = () => {
    if (pendingLength) hash.update(pending.join(''));
    pending = [];
    pendingLength = 0;
  };
  const emit = text => {
    if (text.length >= 65_536) {
      flush();
      hash.update(text);
    } else {
      pending.push(text);
      pendingLength += text.length;
      if (pendingLength >= 65_536) flush();
    }
  };
  const visit = (item, context = 'root') => {
    if (Array.isArray(item)) {
      emit('[');
      for (let index = 0; index < item.length; index += 1) {
        if (index) emit(',');
        visit(item[index], 'array');
      }
      emit(']');
    } else if (item && typeof item === 'object') {
      emit('{');
      const keys = Object.keys(item).sort();
      for (let index = 0; index < keys.length; index += 1) {
        if (index) emit(',');
        const key = keys[index];
        emit(JSON.stringify(key));
        emit(':');
        visit(item[key], 'object');
      }
      emit('}');
    } else {
      const text = JSON.stringify(item);
      // Preserve stableJson's historical interpolation/join behavior even for
      // non-JSON undefined entries. Root undefined still fails loudly.
      if (text !== undefined) emit(text);
      else if (context === 'object') emit('undefined');
      else if (context === 'root') hash.update(text);
    }
  };
  visit(value);
  flush();
  return `sha256:${hash.digest('hex')}`;
}

// A global identity generation is reusable only while every input that could
// change identity membership or candidate ambiguity is unchanged. Hash bytes,
// inventories and code; mtime and catalog.generatedAt are not evidence pins.
export function identityInputSeal(root = REPO_ROOT) {
  const files = [];
  const visit = (relative, select) => {
    const directory = path.join(root, relative);
    if (!fs.existsSync(directory)) throw new Error(`Missing identity input directory ${relative}`);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const item = path.join(relative, entry.name);
      if (entry.isDirectory()) visit(item, select);
      else if (entry.isFile() && select(item)) files.push(item);
      else if (entry.isSymbolicLink()) throw new Error(`Identity input must be a regular file: ${item}`);
    }
  };
  visit('scripts', file => /\.(?:mjs|js)$/u.test(file));
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isFile() && /\.(?:mjs|js)$/u.test(entry.name)) files.push(entry.name);
  }
  for (const entry of fs.readdirSync(path.join(root, 'data'), { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'people') continue;
    const relative = path.join('data', entry.name);
    for (const name of fs.readdirSync(path.join(root, relative))) {
      if (/^\d{3}\.json$/u.test(name)) files.push(path.join(relative, name));
    }
  }
  for (const directory of ['extractions', 'resolutions', 'curation', 'chronology', 'schema']) {
    visit(path.join('data', 'people', directory), file => file.endsWith('.json'));
  }
  files.push('data/people/config.json', 'data/glossary.json', 'package.json');
  return peopleDigest(files.sort().map(file => [file.split(path.sep).join('/'),
    crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
}

export function assertIdentitySeal(seal, catalog, siteIndex, currentInputs) {
  if (seal?.schemaVersion !== 1 || seal.kind !== 'people-global-identity-seal' ||
      seal.inputs !== currentInputs || seal.catalog !== peopleDigest(catalog) ||
      seal.siteIndex !== peopleDigest(siteIndex) ||
      !Array.isArray(seal.unresolvedCanonicalPeople) ||
      new Set(seal.unresolvedCanonicalPeople).size !== seal.unresolvedCanonicalPeople.length) {
    throw new Error('Missing, stale or invalid global identity seal; rerun people:catalog');
  }
  const ids = new Set(catalog.people.map(person => person.id));
  if (seal.unresolvedCanonicalPeople.some(id => !ids.has(id))) {
    throw new Error('Identity seal refers to an unknown canonical person');
  }
}
