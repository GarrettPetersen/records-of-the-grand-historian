import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { writePreparedIdentityReviewArtifacts, collectChapterIdentityPrimaryUnits } from './prepare-people-chapter-identity.mjs';
import { identityArtifactHash } from './lib/people-identity-artifacts.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'identity-preparation-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const plan = { scope: { book: 'fixture', chapter: '001' }, cases: [] };
  const packet = { kind: 'source-chapter-dossier-review-packet', units: [{ id: 's0001', zh: '王偉𠀀至。', en: 'Wang Wei arrived.' }] };
  const transport = { kind: 'bounded-dossier-source-review-transport', rows: [['s0001', '王偉𠀀至。', 'Wang Wei arrived.']] };
  const sourceBytes = Buffer.from(JSON.stringify(packet, null, 2) + '\n');
  const transportBytes = Buffer.from(JSON.stringify(transport) + '\n');
  const receipt = { packetBytes: sourceBytes.length, sourcePacketSha256: identityArtifactHash(sourceBytes),
    transportBytes: transportBytes.length, transportSha256: identityArtifactHash(transportBytes) };
  return { root, out: path.join(root, 'prepared'), value: { plan, packet, transport, receipt }, sourceBytes, transportBytes };
}

test('prepared transport and primary source files match their sealed UTF-8 bytes exactly', t => {
  const f = fixture(t);
  writePreparedIdentityReviewArtifacts(f.out, f.value);
  const bytes = fs.readFileSync(path.join(f.out, 'transport-packet.json'));
  const receipt = JSON.parse(fs.readFileSync(path.join(f.out, 'preparation-receipt.json')));
  assert.deepEqual(bytes, f.transportBytes);
  assert.deepEqual(fs.readFileSync(path.join(f.out, 'source-review-packet.json')), f.sourceBytes);
  assert.equal(bytes.length, receipt.transportBytes);
  assert.equal(identityArtifactHash(bytes), receipt.transportSha256);
  assert.notEqual(bytes.length, Buffer.byteLength(JSON.stringify(f.value.transport, null, 2) + '\n'));
});

test('changed source or transport seals fail before creating an output directory', t => {
  for (const field of ['packetBytes', 'sourcePacketSha256', 'transportBytes', 'transportSha256']) {
    const f = fixture(t);
    f.value.receipt[field] = typeof f.value.receipt[field] === 'number' ? 0 : 'altered';
    assert.throws(() => writePreparedIdentityReviewArtifacts(f.out, f.value), /bytes do not match preparation receipt/);
    assert.equal(fs.existsSync(f.out), false);
  }
});

test('oversized transport stays rejected and existing immutable output is never replaced', t => {
  const f = fixture(t), transport = { text: 'x'.repeat(768 * 1024) };
  const bytes = Buffer.from(JSON.stringify(transport) + '\n');
  const oversized = { ...f.value, transport, receipt: { ...f.value.receipt,
    transportBytes: bytes.length, transportSha256: identityArtifactHash(bytes) } };
  assert.throws(() => writePreparedIdentityReviewArtifacts(f.out, oversized), /inspected bound/);
  assert.equal(fs.existsSync(f.out), false);
  writePreparedIdentityReviewArtifacts(f.out, f.value);
  const before = fs.readFileSync(path.join(f.out, 'transport-packet.json'));
  assert.throws(() => writePreparedIdentityReviewArtifacts(f.out, f.value), /EEXIST/);
  assert.deepEqual(fs.readFileSync(path.join(f.out, 'transport-packet.json')), before);
});


test('primary packet includes complete target chapter and all anchor claim and mention units',()=>{
 const own={extraction:{book:'fixture',chapter:'001'},packet:{units:[{id:'s0001',zh:'王至。'},{id:'s0002',zh:'後事。'}]}};
 const anchor={packet:{units:[{id:'s0001',zh:'王生。'},{id:'s0002',zh:'王仕。'}]}};
 const sources=new Map([['fixture:001',own],['fixture:002',anchor]]),person={localId:'fixture:002:p001',claims:[{evidence:['fixture:002:s0001']}],mentions:[{unit:{id:'s0002'}}]};
 const units=collectChapterIdentityPrimaryUnits(own,sources,new Map([[person.localId,person]]));assert.deepEqual([...units.keys()],['fixture:001:s0001','fixture:001:s0002','fixture:002:s0001','fixture:002:s0002']);
 person.mentions[0].unit.id='s0003';assert.throws(()=>collectChapterIdentityPrimaryUnits(own,sources,new Map([[person.localId,person]])),/Missing current primary unit/);
});
