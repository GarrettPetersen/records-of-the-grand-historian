import pathlib,subprocess,hashlib,json,difflib
ROOT=pathlib.Path('/Users/garrettpetersen/records-of-the-grand-historian');O=pathlib.Path(__file__).resolve().parent;REF='d1d2494017426c278606f323233ee335e33b6eeb'
def h(b):return hashlib.sha256(b).hexdigest()
def gitread(p):return subprocess.check_output(['git','show',REF+':'+p],cwd=ROOT)
def pin(p):
 b=p.read_bytes();return {'file':str(p),'bytes':len(b),'sha256':h(b)}
base=gitread('scripts/lib/people-resolution.mjs').decode();assert h(base.encode())=='100a97b979b2526d3a99cdbfd8a1b3a654fcc973c4dedaf82e63f2b6cea8848e';tests=gitread('scripts/test-people-resolution.mjs').decode()
old="""  const identityNameForms = bucket.names.every((name) =>
    name.kinds.some((kind) => IDENTITY_NAME_KINDS.has(kind))
  );
  if (!key.startsWith('en:') || !identityNameForms) return [members];
  const partitions = new Set(members.flatMap((member) =>
    [...(identityChineseByPerson.get(member) ?? [])]
  ));"""
new="""  if (!key.startsWith('en:')) return [members];
  const chineseNamesByMember = new Map(members.map((member) => [
    member,
    bucket.identityMembers.has(member)
      ? (identityChineseByPerson.get(member) ?? new Set())
      : new Set(),
  ]));
  const partitions = new Set([...chineseNamesByMember.values()].flatMap((names) => [...names]));"""
assert base.count(old)==1;candidate=base.replace(old,new).replace('const names = identityChineseByPerson.get(member) ?? new Set();','const names = chineseNamesByMember.get(member);').replace("buckets.set(key.key, { names: [], members: new Set() })","buckets.set(key.key, { names: [], members: new Set(), identityMembers: new Set() })");needle='      bucket.members.add(person.localId);';assert candidate.count(needle)==1;candidate=candidate.replace(needle,needle+"\n      if (key.kinds.some((kind) => IDENTITY_NAME_KINDS.has(kind))) {\n        bucket.identityMembers.add(person.localId);\n      }")
regression=r"""
{
  const known = [
    candidatePerson('pairwise-a', { en: 'Wang Yan', zh: '王衍' }, 'personal-name', { en: 'Wang Yan', zh: '王衍' }),
    candidatePerson('pairwise-b', { en: 'Wang Yan', zh: '王儼' }, 'personal-name', { en: 'Wang Yan', zh: '王儼' }),
  ];
  const reviewPairs = (entries) => [...new Set(buildResolutionCandidates(new Map(entries)).blocks.flatMap((block) =>
    block.localPeople.flatMap((left, index) => block.localPeople.slice(index + 1).map((right) =>
      [left, right].sort().join('\u0000')
    ))
  ))].sort();
  assert.deepEqual(reviewPairs(known), [], 'the existing strong disjoint-Chinese pair stays partitioned');

  const preferredOnly = candidatePerson('pairwise-c', { en: 'Wang Yan' }, 'personal-name', {});
  preferredOnly[1].claims = [];
  const chineseOnly = candidatePerson('pairwise-c', { en: 'Wang Yan' }, 'personal-name', { zh: '王玄' });
  const missingChinese = candidatePerson('pairwise-c', { en: 'Wang Yan' }, 'personal-name', { en: 'Wang Yan' });
  for (const unknown of [preferredOnly, chineseOnly, missingChinese]) {
    assert.deepEqual(
      reviewPairs([...known, unknown]),
      ['pairwise-a\u0000pairwise-c', 'pairwise-b\u0000pairwise-c'],
      'an unknown English or Chinese member keeps its comparisons without reactivating a strong disjoint pair',
    );
  }

  const bridge = candidatePerson('pairwise-c', { en: 'Wang Yan', zh: '王衍' }, 'personal-name', { en: 'Wang Yan', zh: '王衍' });
  bridge[1].claims.push({
    id: 'pairwise-c:other-name', predicate: 'name',
    value: { kind: 'personal-name', en: 'Wang Yan', zh: '王儼' },
  });
  assert.deepEqual(
    reviewPairs([...known, bridge]),
    ['pairwise-a\u0000pairwise-c', 'pairwise-b\u0000pairwise-c'],
    'multiple Chinese identity aliases preserve bridge comparisons without inventing transitivity',
  );
}
"""
marker="assert.equal(result.blocks.length, 0, 'conflicting Chinese identity names must partition Romanization collisions');\n}";assert tests.count(marker)==1;testCandidate=tests.replace(marker,marker+'\n'+regression)
(O/'people-resolution.pairwise-prototype.mjs').write_text(candidate);(O/'test-people-resolution.pairwise-regression.mjs').write_text(testCandidate)
patch=''.join(difflib.unified_diff(base.splitlines(True),candidate.splitlines(True),fromfile='a/scripts/lib/people-resolution.mjs',tofile='b/scripts/lib/people-resolution.mjs'))+''.join(difflib.unified_diff(tests.splitlines(True),testCandidate.splitlines(True),fromfile='a/scripts/test-people-resolution.mjs',tofile='b/scripts/test-people-resolution.mjs'));(O/'pairwise-guard-PROTOTYPE-NOT-ADOPTION.patch').write_text(patch)
(O/'input-pins.json').write_text(json.dumps({'canonicalRevision':REF,'canonicalModule':{'path':'scripts/lib/people-resolution.mjs','sha256':h(base.encode())},'canonicalTests':{'path':'scripts/test-people-resolution.mjs','sha256':h(tests.encode())},'candidates':[pin(O/'people-resolution.pairwise-prototype.mjs'),pin(O/'test-people-resolution.pairwise-regression.mjs')],'scope':'Pairwise criterion probe only. Orthographic-variant safety separately tested; not adoption-ready without conservative variant guard and independent review.','canonicalWrites':False},indent=2)+'\n');print(json.dumps({'module':pin(O/'people-resolution.pairwise-prototype.mjs'),'tests':pin(O/'test-people-resolution.pairwise-regression.mjs')}))
