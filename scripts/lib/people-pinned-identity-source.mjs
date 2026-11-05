import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { peopleDigest } from './people-identity-seal.mjs';
import { REPO_ROOT, contentUnits, sha256 } from './people-content.mjs';
import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from '../validate-people-extraction.mjs';
import { isCompactPeopleExtraction } from './people-compact.mjs';
import { peopleForExtraction } from './people-validated-chapter.mjs';
import { dateAuditItems, validateDateAuditReport, DATE_AUDIT_VERSION } from './people-date-audit.mjs';

const need = (ok, message) => { if (!ok) throw new Error(message); };
const registryEntries = ['people-identity-registry-workflow', 'people-corpus', 'people-resolution', 'people-identity-dossiers', 'people-identity-member-store', 'people-identity-dossier-store'].map(n => `scripts/lib/${n}.mjs`);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const blobHash = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const packageContract = pkg => Object.fromEntries(Object.entries(pkg).filter(([key]) => key !== 'scripts'));
const dataInput = file => /^data\/(?!people\/)[^/]+\/\d{3}\.json$/u.test(file) ||
  /^data\/people\/(?:extractions|resolutions|curation|chronology|schema)\/.*\.json$/u.test(file) || ['data/people/config.json', 'data/glossary.json'].includes(file);
const legacyInput = file => dataInput(file) || /^scripts\/.*\.(?:mjs|js)$/u.test(file) || /^[^/]+\.(?:mjs|js)$/u.test(file) || file === 'package.json';

export function gitIdentitySnapshot(root, revision) {
  need(/^[a-f0-9]{40}$/u.test(revision ?? ''), 'Exact Git commit required for pinned identity evidence');
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { maxBuffer: 16 * 1024 * 1024 });
  need(git('rev-parse', `${revision}^{commit}`).toString().trim() === revision, 'Pinned identity revision is not a commit');
  const files = new Map();
  for (const entry of git('ls-tree', '-r', '-l', '-z', revision).toString().split('\0').filter(Boolean)) {
    const match = /^(\d+) (\w+) ([a-f0-9]{40})\s+(\d+|-)\t([\s\S]+)$/u.exec(entry);
    need(match, 'Invalid Git tree inventory');
    files.set(match[5], { mode: match[1], type: match[2], oid: match[3], bytes: Number(match[4]) });
  }
  const regular = file => { const row = files.get(file); need(row?.type === 'blob' && ['100644','100755'].includes(row.mode), `Missing/nonregular pinned identity input ${file}`); return row; };
  const read = file => { need(!file.split('/').includes('..') && !path.isAbsolute(file), 'Invalid pinned identity path'); return git('cat-file', 'blob', regular(file).oid); };
  const json = file => JSON.parse(read(file));
  // Match the original filesystem-based registry seal, including every original
  // script. Bound batch bytes; no corpus-sized string or checkout is created.
  const legacySeal = () => {
    const selected = [...files.keys()].filter(legacyInput).sort(), rows = [];
    for (let start = 0; start < selected.length;) {
      const batch = []; let bytes = 0;
      while (start < selected.length && (batch.length === 0 || bytes + regular(selected[start]).bytes < 16 * 1024 * 1024)) {
        const file = selected[start++], row = regular(file); need(row.bytes < 64 * 1024 * 1024, `Oversized pinned input ${file}`); batch.push(file); bytes += row.bytes;
      }
      const output = execFileSync('git', ['-C', root, 'cat-file', '--batch'], { input: batch.map(f => regular(f).oid).join('\n') + '\n', maxBuffer: bytes + batch.length * 128 + 1024 });
      let offset = 0;
      for (const file of batch) {
        const row = regular(file), end = output.indexOf(10, offset); need(end >= offset, 'Missing Git object header');
        need(output.subarray(offset, end).toString() === `${row.oid} blob ${row.bytes}`, 'Pinned Git object mismatch'); offset = end + 1;
        rows.push([file, hash(output.subarray(offset, offset + row.bytes))]); offset += row.bytes;
        need(output[offset++] === 10, 'Truncated pinned Git object');
      }
      need(offset === output.length, 'Unexpected pinned Git object bytes');
    }
    return peopleDigest(rows);
  };
  const codeDependencies = () => {
    const seen = new Set(), pending = [...registryEntries];
    while (pending.length) {
      const file = pending.pop(); if (seen.has(file)) continue; regular(file); seen.add(file);
      const text = read(file).toString();
      // Parse static imports with Node's own JavaScript parser without linking
      // or executing the module. Quoted import names and multiline declarations
      // must not silently hide a dependency. Computed loading stays unsupported.
      const gap = String.raw`(?:\s|/\*[\s\S]*?\*/|//[^\n]*(?:\n|$))*`;
      need(!new RegExp(String.raw`\b(?:import|require|eval)${gap}\(`, 'u').test(text) && !new RegExp(String.raw`\bnew${gap}Function${gap}\(`, 'u').test(text), `Computed index dependency in ${file}`);
      const parser = "import vm from 'node:vm';import fs from 'node:fs';const m=new vm.SourceTextModule(fs.readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(m.dependencySpecifiers));";
      const imports = JSON.parse(execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', parser], { input: text, maxBuffer: 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] }));
      for (const specifier of imports) {
        if (!specifier.startsWith('.')) continue;
        const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
        need(!dependency.startsWith('../') && /\.(?:mjs|js)$/u.test(dependency), `Unsupported index dependency ${specifier}`); pending.push(dependency);
      }
    }
    return [...seen].sort();
  };
  return { root, revision, files, regular, read, json, legacySeal, codeDependencies };
}

export function provePinnedDossierReuse(registryProvenance, current, { runtimeRoot = REPO_ROOT } = {}) {
  const retained = gitIdentitySnapshot(current.root, registryProvenance.revision);
  need(retained.legacySeal() === registryProvenance.identityInputs, 'Retained registry does not match its original Git source seal');
  const beforeData = [...retained.files.keys()].filter(dataInput).sort(), afterData = [...current.files.keys()].filter(dataInput).sort();
  need(peopleDigest(beforeData) === peopleDigest(afterData) && beforeData.every(f => retained.regular(f).oid === current.regular(f).oid), 'Dossier data changed; update affected dossiers before preparing new work');
  const beforeCode = retained.codeDependencies(), afterCode = current.codeDependencies();
  need(peopleDigest(beforeCode) === peopleDigest(afterCode) && beforeCode.every(f => retained.regular(f).oid === current.regular(f).oid), 'Dossier construction code changed; refresh the immutable registry');
  need(peopleDigest(packageContract(retained.json('package.json'))) === peopleDigest(packageContract(current.json('package.json'))), 'Registry package contract changed');
  assertPinnedIdentityRuntime(current, runtimeRoot);
  return { schemaVersion: 1, kind: 'pinned-unchanged-dossier-input-proof', retainedRevision: retained.revision, sourceRevision: current.revision,
    retainedOriginalSeal: registryProvenance.identityInputs, dataFiles: afterData.length, constructionCodeFiles: afterCode.length,
    dataInventory: peopleDigest(afterData.map(f => [f, current.regular(f).oid])), constructionCode: peopleDigest(afterCode.map(f => [f, current.regular(f).oid])),
    registryBytesChanged: false, generatedPairs: 0, chapterApproval: false };
}

export function assertPinnedIdentityRuntime(current, runtimeRoot = REPO_ROOT) {
  const code = current.codeDependencies(), data = [...current.files.keys()].filter(dataInput).sort();
  const runtimeBytes = file => { const full = path.join(runtimeRoot, file), stat = fs.lstatSync(full); need(stat.isFile() && !stat.isSymbolicLink(), `Runtime input must be a regular file: ${file}`); return fs.readFileSync(full); };
  for (const file of code) need(blobHash(runtimeBytes(file)) === current.regular(file).oid, `Runtime index dependency differs from pinned revision: ${file}`);
  const runtimeData = data.filter(f => !/^data\/(?!people\/)[^/]+\/\d{3}\.json$/u.test(f) && !/^data\/people\/(?:extractions|resolutions)\//u.test(f));
  for (const directory of ['data/people/curation', 'data/people/schema', 'data/people/chronology']) {
    const actual = [], visit = relative => { const full = path.join(runtimeRoot, relative); if (!fs.existsSync(full)) return; const stat = fs.lstatSync(full); need(!stat.isSymbolicLink(), `Runtime inventory must not use symlinks: ${relative}`); if (stat.isDirectory()) for (const name of fs.readdirSync(full)) visit(`${relative}/${name}`); else if (relative.endsWith('.json')) actual.push(relative); };
    visit(directory); need(peopleDigest(actual.sort()) === peopleDigest(runtimeData.filter(f => f.startsWith(directory + '/'))), `Runtime index configuration inventory differs: ${directory}`);
  }
  for (const file of runtimeData) need(blobHash(runtimeBytes(file)) === current.regular(file).oid, `Runtime index configuration differs: ${file}`);
  need(peopleDigest(packageContract(JSON.parse(runtimeBytes('package.json')))) === peopleDigest(packageContract(current.json('package.json'))), 'Runtime package contract differs');
}

export function pinnedIdentityChapterContext(root, revision) {
  const snapshot = gitIdentitySnapshot(root, revision);
  const scope = (book, chapter) => need(/^[a-z0-9_-]+$/u.test(book) && /^\d{3}$/u.test(chapter), 'Invalid pinned chapter scope');
  const optional = file => snapshot.files.has(file) ? snapshot.json(file) : null;
  const inputs = (book, chapter) => { scope(book, chapter); const source = `data/${book}/${chapter}.json`, extraction = `data/people/extractions/${book}/${chapter}.json`, editorial = `data/people/editorial-decisions/${book}/${chapter}.json`, date = `data/people/date-audits/${book}/${chapter}.json`;
    return { source: sha256(snapshot.read(source)), extraction: sha256(snapshot.read(extraction)), editorial: sha256(snapshot.files.has(editorial) ? snapshot.read(editorial) : Buffer.from('null')), dateAudit: sha256(snapshot.read(date)) }; };
  const load = (book, chapter, { properNounMatcher, strictAliasDispositions = true }) => {
    scope(book, chapter); const raw = snapshot.json(`data/people/extractions/${book}/${chapter}.json`), source = snapshot.json(`data/${book}/${chapter}.json`);
    need(raw.book === book && raw.chapter === chapter, 'Pinned extraction scope mismatch');
    const packet = buildPeopleExtractionPacket(book, chapter, { chapterData: source, chapterFile: path.join(root, `data/${book}/${chapter}.json`), properNounMatcher });
    const { normalized: extraction } = isCompactPeopleExtraction(raw) ? validateCompactPeopleExtraction(raw, packet, { strictAliasDispositions }) : validatePeopleExtraction(raw, packet, { strictAliasDispositions });
    return { raw, packet, extraction, localPeople: peopleForExtraction(extraction) };
  };
  const editorial = (book, chapter) => optional(`data/people/editorial-decisions/${book}/${chapter}.json`);
  const dates = (book, chapter) => {
    scope(book, chapter); const source = snapshot.json(`data/${book}/${chapter}.json`), raw = snapshot.json(`data/people/extractions/${book}/${chapter}.json`), report = snapshot.json(`data/people/date-audits/${book}/${chapter}.json`);
    const units = contentUnits(source).map(({ id, zh, en, literal, blockIndex }) => ({ id, zh, en, literal, blockIndex }));
    const packet = { schemaVersion: 1, auditVersion: DATE_AUDIT_VERSION, book, chapter, units, sourceHash: sha256(JSON.stringify(units)), extractionHash: sha256(JSON.stringify(raw)), extractor: raw.run, ...dateAuditItems(raw) };
    validateDateAuditReport(report, packet);
    for (const reference of report.references) {
      if (reference.kind === 'external') need(reference.sourceHash === sha256(reference.quote), 'Pinned external date reference changed');
      else { const unit = contentUnits(snapshot.json(`data/${reference.book}/${reference.chapter}.json`)).find(u => u.id === reference.unit); need(unit && sha256(unit.zh) === reference.sourceHash && unit.zh.includes(reference.quote), 'Pinned chapter date reference changed'); }
    }
    return { status: report.status, auditVersion: DATE_AUDIT_VERSION, reviewedAt: report.reviewedAt, findings: report.findings.length };
  };
  return { snapshot, inputs, load, editorial, dates, config: snapshot.json('data/people/config.json') };
}
