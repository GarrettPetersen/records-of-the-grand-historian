import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createIdentityJsonlWriter } from './people-identity-dossier-store.mjs';
import { memberContract } from './people-identity-dossiers.mjs';
import { localNameKeys } from './people-resolution.mjs';

const need = (value, message) => { if (!value) throw new Error(message); };

// Chapter validation remains the production validator. Only identity contracts
// are spooled: publication still loads and qualifies complete source records.
// Keep explicit same/different constraints in memory for native accepted replay;
// read other identity evidence directly by offset, one canonical dossier at a time.
export function writeValidatedIdentityMembers(directory, visitChapters) {
  fs.mkdirSync(directory, { recursive: false, mode: 0o700 });
  const file = path.join(directory, 'members.jsonl'), locations = new Map(), constraints = new Map();
  let writer, fd;
  try {
    writer = createIdentityJsonlWriter(file);
    const { coverage } = visitChapters(({ localPeople }) => {
      need(localPeople instanceof Map, 'Validated chapter people required');
      for (const [id, person] of localPeople) {
        need(id === person.localId && !locations.has(id), `Duplicate or invalid source member ${id}`);
        const contract = memberContract(person, localNameKeys(person));
        const compact = { localId: id, promptVersion: person.promptVersion,
          preferredNameSuggestion: person.preferredNameSuggestion, claims: contract.claims };
        locations.set(id, writer.row(compact));
        constraints.set(id, { localId: id, claims: person.claims.filter(claim =>
          claim.predicate === 'same-person' || claim.predicate === 'different-person') });
      }
    });
    const artifact = writer.finish();
    fs.writeFileSync(path.join(directory, 'receipt.json'), JSON.stringify({ schemaVersion: 1,
      kind: 'validated-identity-members', coverage, memberCount: locations.size, artifact }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    fd = fs.openSync(file, 'r');
    let closed = false;
    const people = { size: locations.size, get(id) {
      need(!closed, 'Validated identity member reader is closed');
      const location = locations.get(id);
      if (!location) return undefined;
      const bytes = Buffer.alloc(location.bytes);
      need(fs.readSync(fd, bytes, 0, bytes.length, location.offset) === bytes.length &&
        createHash('sha256').update(bytes).digest('hex') === location.sha256, `Changed identity member bytes ${id}`);
      const person = JSON.parse(bytes);
      need(person.localId === id, 'Identity member location mismatch');
      return person;
    } };
    return { people, constraints, coverage, close() {
      if (!closed) { fs.closeSync(fd); closed = true; }
    } };
  } catch (error) {
    if (fd !== undefined) fs.closeSync(fd);
    throw error;
  } finally { writer?.close(); }
}
