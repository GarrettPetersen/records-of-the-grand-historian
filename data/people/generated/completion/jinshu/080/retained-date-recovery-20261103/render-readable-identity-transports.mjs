import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { identityReviewTransportMaxBytes } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-identity-review-transport.mjs';
const dir = process.argv[2];
if (process.argv.length !== 3 || !path.isAbsolute(dir ?? '')) throw Error('Absolute owned packet directory required');
const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'preparation-receipt.json')));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const limit = identityReviewTransportMaxBytes(receipt.transportPolicy), parts = [];
for (const part of receipt.reviewParts) {
  const original = fs.readFileSync(path.join(dir, part.file));
  if (hash(original) !== part.sha256 || original.length !== part.bytes) throw Error('Sealed canonical transport changed');
  const text = original.toString('utf8'), chunks = [];
  let quoted = false, escaped = false, start = 0, lineStart = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) { if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === '"') quoted = false; }
    else if (char === '"') quoted = true;
    else if (i - lineStart >= 2048 && [',', '}', ']'].includes(char)) {
      chunks.push(text.slice(start, i + 1), '\n'); start = i + 1; lineStart = start;
    }
  }
  chunks.push(text.slice(start));
  const bytes = Buffer.from(chunks.join(''));
  // Retain the exact canonical file. This is an auxiliary display, never a new
  // source packet or a retagged transport. Every value/order is identical.
  if (!Buffer.from(JSON.stringify(JSON.parse(bytes)) + '\n').equals(original)) throw Error('Readable display changed canonical JSON evidence');
  const maxLineCharacters = Math.max(...bytes.toString('utf8').split('\n').map(line => line.length));
  if (bytes.length > limit || maxLineCharacters >= 100_000) throw Error('Readable display exceeds the inspected reader/transport bound');
  const file = 'readable-' + part.file, full = path.join(dir, file);
  if (fs.existsSync(full)) { if (!fs.readFileSync(full).equals(bytes)) throw Error('Retained display changed'); }
  else fs.writeFileSync(full, bytes, { flag: 'wx' });
  parts.push({ canonicalFile: part.file, canonicalSha256: part.sha256, canonicalBytes: original.length,
    readableFile: file, readableSha256: hash(bytes), readableBytes: bytes.length, maxLineCharacters,
    canonicalReserializationByteEquality: true, sourcePacketSha256: receipt.sourcePacketSha256 });
}
const result = { schemaVersion: 1, kind: 'lossless-identity-transport-display-receipt', sourcePacketSha256: receipt.sourcePacketSha256,
  planFingerprint: receipt.planFingerprint, originalsRewritten: false, approvalsRetagged: false, parts };
const target = path.join(dir, 'readable-transports.json'), bytes = Buffer.from(JSON.stringify(result, null, 2) + '\n');
if (fs.existsSync(target)) { if (!fs.readFileSync(target).equals(bytes)) throw Error('Retained display receipt changed'); }
else fs.writeFileSync(target, bytes, { flag: 'wx' });
console.log(JSON.stringify({ parts: parts.length, maxBytes: Math.max(...parts.map(p => p.readableBytes)),
  maxLineCharacters: Math.max(...parts.map(p => p.maxLineCharacters)), originalsRewritten: false, approvalsRetagged: false }));
