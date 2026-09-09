import crypto from 'node:crypto';

const CROCKFORD32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const WEAK_ENGLISH_NAMES = new Set([
  'emperor', 'empress', 'king', 'queen', 'prince', 'princess', 'duke', 'marquis',
  'lord', 'lady', 'master', 'minister', 'general', 'governor', 'official', 'ruler',
  'crown prince', 'crown princess', 'imperial prince', 'imperial princess',
  'imperial son', 'imperial daughter', 'heir apparent',
]);
const WEAK_CHINESE_NAMES = new Set([
  '上', '主', '侯', '公', '后', '君', '國王', '国王', '天子', '太后', '太子', '夫人',
  '官', '帝', '王', '王后', '王子', '皇后', '皇子', '皇女', '皇太后', '皇太子', '皇帝', '相', '臣',
  '丞相', '刺史', '大臣', '太守', '宰相', '將軍', '将军', '巡撫', '巡抚', '陛下',
]);
const NON_BLOCKING_NAME_KINDS = new Set([
  'surname',
  'given',
  'title',
  'regnal',
  'temple',
  'posthumous',
]);

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function base32Digest(value, length = 20) {
  const bytes = crypto.createHash('sha256').update(value).digest();
  let bits = 0;
  let buffer = 0;
  let output = '';
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5 && output.length < length) {
      bits -= 5;
      output += CROCKFORD32[(buffer >>> bits) & 31];
    }
    if (output.length === length) break;
  }
  return output;
}

export function stableCanonicalPersonId(localPersonId) {
  return `per_${base32Digest(`24histories-person:${localPersonId}`)}`;
}

export function personSlug(name, canonicalId) {
  const base = String(name ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '') || 'person';
  return `${base}-${canonicalId.slice(4, 12).toLocaleLowerCase('en')}`;
}

function normalizeName(language, value) {
  const text = String(value ?? '').normalize('NFKC').trim();
  if (!text) return null;
  if (language === 'zh') {
    const key = text.replace(/[\s\p{P}\p{S}]+/gu, '');
    return key ? `zh:${key}` : null;
  }
  const key = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim()
    .replace(/\s+/gu, ' ')
    .replace(/^the\s+/u, '');
  return key ? `en:${key}` : null;
}

function localNameKeys(person) {
  const keys = new Map();
  const preferredNonBlockingClaimKeys = new Set();
  for (const language of ['en', 'zh']) {
    const preferredKey = normalizeName(language, person.preferredNameSuggestion[language]);
    if (!preferredKey) continue;
    const matchingKinds = person.claims
      .filter((claim) => claim.predicate === 'name')
      .filter((claim) => normalizeName(language, claim.value?.[language]) === preferredKey)
      .map((claim) => claim.value?.kind)
      .filter(Boolean);
    if (
      matchingKinds.length > 0 &&
      matchingKinds.every((kind) => NON_BLOCKING_NAME_KINDS.has(kind))
    ) {
      preferredNonBlockingClaimKeys.add(preferredKey);
    }
  }
  const add = (language, value, kind, source) => {
    const preferred = source === 'preferred';
    const key = normalizeName(language, value);
    if (!key) return;
    const bare = key.slice(3);
    const strongForm = language === 'zh'
      ? !WEAK_CHINESE_NAMES.has(bare) && (preferred || Array.from(bare).length >= 2)
      : !WEAK_ENGLISH_NAMES.has(bare) && (bare.includes(' ') || bare.length >= 4);
    const nonBlockingPreferred = preferred && preferredNonBlockingClaimKeys.has(key);
    const blocking = strongForm && !nonBlockingPreferred &&
      (preferred || !NON_BLOCKING_NAME_KINDS.has(kind));
    const current = keys.get(key) ?? {
      key, language, value: String(value), kinds: new Set(), sources: new Set(), blocking: false,
    };
    current.blocking ||= blocking;
    if (kind) current.kinds.add(kind);
    current.sources.add(source);
    keys.set(key, current);
  };
  add('en', person.preferredNameSuggestion.en, 'preferred', 'preferred');
  add('zh', person.preferredNameSuggestion.zh, 'preferred', 'preferred');
  for (const claim of person.claims) {
    if (claim.predicate !== 'name') continue;
    add('en', claim.value?.en, claim.value?.kind, claim.id);
    add('zh', claim.value?.zh, claim.value?.kind, claim.id);
  }
  return [...keys.values()].map((entry) => ({
    ...entry,
    kinds: [...entry.kinds].sort(),
    sources: [...entry.sources].sort(),
  }));
}

function pairKey(left, right) {
  return [left, right].sort().join('\u0000');
}

function referencedPersonId(claim) {
  return claim.value?.personId ?? claim.value?.person ?? null;
}

export function explicitIdentityConstraints(localPeople) {
  const same = new Set();
  const different = new Set();
  for (const person of localPeople.values()) {
    for (const claim of person.claims) {
      if (!['same-person', 'different-person'].includes(claim.predicate)) continue;
      const other = referencedPersonId(claim);
      if (!localPeople.has(other) || other === person.localId) continue;
      const key = pairKey(person.localId, other);
      if (claim.predicate === 'same-person' && claim.certainty === 'explicit') same.add(key);
      if (claim.predicate === 'different-person') different.add(key);
    }
  }
  for (const key of same) {
    if (different.has(key)) throw new Error(`Contradictory explicit identity constraints for ${key.replace('\u0000', ' and ')}`);
  }
  return { same, different };
}

function localSummary(person) {
  const roleIds = person.claims
    .filter((claim) => claim.predicate === 'role')
    .map((claim) => claim.value?.roleId)
    .filter(Boolean);
  return {
    localId: person.localId,
    preferredName: person.preferredNameSuggestion,
    historicity: person.historicity,
    descriptor: person.descriptorSuggestion,
    nativePlaces: person.identityHints.nativePlaces,
    activeDateHints: person.identityHints.activeDateHints,
    polityHints: person.identityHints.polityHints ?? [],
    roles: [...new Set(roleIds)].sort(),
    familyRelationships: person.claims
      .filter((claim) => claim.predicate === 'family-relationship')
      .map((claim) => ({
        relation: claim.value?.relation,
        personId: claim.value?.personId,
        parentage: claim.value?.parentage ?? null,
        unionType: claim.value?.unionType ?? null,
        subjectRole: claim.value?.subjectRole ?? null,
        objectRole: claim.value?.objectRole ?? null,
        generationDistance: claim.value?.generationDistance ?? null,
        line: claim.value?.line ?? null,
        certainty: claim.certainty,
      })),
    mentions: person.mentions.length,
    promptVersion: person.promptVersion,
  };
}

export function buildResolutionCandidates(localPeople) {
  const buckets = new Map();
  const people = {};
  for (const person of [...localPeople.values()].sort((a, b) => a.localId.localeCompare(b.localId))) {
    const nameKeys = localNameKeys(person);
    people[person.localId] = { ...localSummary(person), nameKeys };
    for (const key of nameKeys) {
      if (!key.blocking) continue;
      if (!buckets.has(key.key)) buckets.set(key.key, { names: [], members: new Set() });
      const bucket = buckets.get(key.key);
      bucket.names.push({ value: key.value, language: key.language, kinds: key.kinds });
      bucket.members.add(person.localId);
    }
  }

  const byMembers = new Map();
  for (const [key, bucket] of buckets) {
    if (bucket.members.size < 2) continue;
    const members = [...bucket.members].sort();
    const memberKey = members.join('\u0000');
    const current = byMembers.get(memberKey) ?? { members, sharedNames: [] };
    current.sharedNames.push({ key, forms: bucket.names });
    byMembers.set(memberKey, current);
  }

  const blocks = [...byMembers.values()]
    .map((block) => ({
      id: `block_${base32Digest(canonicalJson(block.members), 16)}`,
      localPeople: block.members,
      sharedNames: block.sharedNames.sort((a, b) => a.key.localeCompare(b.key)),
      ambiguity: block.members.length > 50 ? 'very-high' : block.members.length > 12 ? 'high' : 'normal',
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const constraints = explicitIdentityConstraints(localPeople);
  return {
    schemaVersion: 1,
    people,
    blocks,
    explicitSamePerson: [...constraints.same].map((key) => key.split('\u0000')),
    explicitDifferentPerson: [...constraints.different].map((key) => key.split('\u0000')),
  };
}

class UnionFind {
  constructor(values, { trackMembers = false } = {}) {
    this.parent = new Map([...values].map((value) => [value, value]));
    this.membersByRoot = trackMembers
      ? new Map([...values].map((value) => [value, new Set([value])]))
      : null;
  }

  find(value) {
    if (!this.parent.has(value)) throw new Error(`Unknown local person ${value}`);
    const parent = this.parent.get(value);
    if (parent === value) return value;
    const root = this.find(parent);
    this.parent.set(value, root);
    return root;
  }

  union(left, right) {
    const leftRoot = this.find(left);
    const rightRoot = this.find(right);
    if (leftRoot === rightRoot) return;
    const [keep, merge] = [leftRoot, rightRoot].sort();
    this.parent.set(merge, keep);
    if (this.membersByRoot) {
      const keepMembers = this.membersByRoot.get(keep);
      const mergeMembers = this.membersByRoot.get(merge);
      for (const member of mergeMembers) keepMembers.add(member);
      this.membersByRoot.delete(merge);
    }
  }

  members(value) {
    if (!this.membersByRoot) throw new Error('UnionFind member tracking is not enabled');
    return this.membersByRoot.get(this.find(value));
  }
}

function separationIndex(separations) {
  const byPerson = new Map();
  for (const key of separations) {
    const [left, right] = key.split('\u0000');
    if (!byPerson.has(left)) byPerson.set(left, new Set());
    if (!byPerson.has(right)) byPerson.set(right, new Set());
    byPerson.get(left).add(right);
    byPerson.get(right).add(left);
  }
  return byPerson;
}

function wouldJoinSeparatedPeople(union, left, right, indexedSeparations) {
  const leftRoot = union.find(left);
  const rightRoot = union.find(right);
  if (leftRoot === rightRoot) return false;
  const leftMembers = union.members(leftRoot);
  const rightMembers = union.members(rightRoot);
  const [scanMembers, targetRoot] = leftMembers.size <= rightMembers.size
    ? [leftMembers, rightRoot]
    : [rightMembers, leftRoot];
  for (const member of scanMembers) {
    for (const separatedPerson of indexedSeparations.get(member) ?? []) {
      if (union.find(separatedPerson) === targetRoot) return true;
    }
  }
  return false;
}

export function connectedBlockComponents(blocks, canonicalByLocal) {
  const groupIds = new Set(blocks.flatMap((block) =>
    block.localPeople.map((localId) => canonicalByLocal.get(localId) ?? localId)
  ));
  const union = new UnionFind(groupIds);
  for (const block of blocks) {
    const groups = [...new Set(block.localPeople.map((localId) =>
      canonicalByLocal.get(localId) ?? localId
    ))];
    for (let index = 1; index < groups.length; index += 1) union.union(groups[0], groups[index]);
  }
  const byRoot = new Map();
  for (const block of blocks) {
    const root = union.find(canonicalByLocal.get(block.localPeople[0]) ?? block.localPeople[0]);
    if (!byRoot.has(root)) byRoot.set(root, []);
    byRoot.get(root).push(block);
  }
  return [...byRoot.values()].sort((left, right) =>
    right.length - left.length || left[0].id.localeCompare(right[0].id)
  );
}

export function resolvePeopleClusters(localPeople, resolutionDocuments = []) {
  const ids = [...localPeople.keys()];
  const constraints = explicitIdentityConstraints(localPeople);
  const modelMerges = [];
  const modelKeepSeparate = new Set();
  const curatedKeepSeparate = new Set();
  const curatedMerges = [];
  const pins = new Map();
  for (const document of resolutionDocuments) {
    const curated = document.authority === 'curated';
    for (const decision of document.decisions) {
      const decisionLocalPeople = [...new Set(decision.localPeople)];
      for (const localId of decisionLocalPeople) {
        if (!localPeople.has(localId)) throw new Error(`${document.batch} refers to unknown local person ${localId}`);
      }
      if (decision.decision === 'merge') {
        if (curated) {
          curatedMerges.push(decisionLocalPeople);
        } else {
          modelMerges.push({ batch: document.batch, localPeople: decisionLocalPeople });
        }
      } else if (['keep-separate', 'split'].includes(decision.decision)) {
        const target = curated ? curatedKeepSeparate : modelKeepSeparate;
        for (let left = 0; left < decisionLocalPeople.length; left += 1) {
          for (let right = left + 1; right < decisionLocalPeople.length; right += 1) {
            target.add(pairKey(decisionLocalPeople[left], decisionLocalPeople[right]));
          }
        }
      }
      if (decision.canonicalPersonId) {
        for (const localId of decisionLocalPeople) pins.set(localId, decision.canonicalPersonId);
      }
    }
  }

  const curatedIntentUnion = new UnionFind(ids);
  for (const localPeopleGroup of curatedMerges) {
    const [first, ...rest] = localPeopleGroup;
    for (const other of rest) curatedIntentUnion.union(first, other);
  }
  const curatedMembersByRoot = new Map();
  for (const localId of ids) {
    const root = curatedIntentUnion.find(localId);
    if (!curatedMembersByRoot.has(root)) curatedMembersByRoot.set(root, []);
    curatedMembersByRoot.get(root).push(localId);
  }
  const expandedCuratedKeepSeparate = new Set();
  for (const key of curatedKeepSeparate) {
    const [left, right] = key.split('\u0000');
    const leftRoot = curatedIntentUnion.find(left);
    const rightRoot = curatedIntentUnion.find(right);
    if (leftRoot === rightRoot) {
      throw new Error(`Curated merge joins people explicitly kept separate: ${left} and ${right}`);
    }
    for (const leftMember of curatedMembersByRoot.get(leftRoot)) {
      for (const rightMember of curatedMembersByRoot.get(rightRoot)) {
        expandedCuratedKeepSeparate.add(pairKey(leftMember, rightMember));
      }
    }
  }

  const expandedCuratedSeparationIndex = separationIndex(expandedCuratedKeepSeparate);
  const explicitDifferentIndex = separationIndex(constraints.different);
  const modelUnion = new UnionFind(ids, { trackMembers: true });
  for (const key of constraints.same) {
    const [left, right] = key.split('\u0000');
    if (wouldJoinSeparatedPeople(modelUnion, left, right, expandedCuratedSeparationIndex)) {
      throw new Error(`Curated separation contradicts explicit same-person evidence for ${left} and ${right}`);
    }
    modelUnion.union(left, right);
  }
  for (const modelMerge of modelMerges) {
    const [first, ...rest] = modelMerge.localPeople;
    for (const other of rest) {
      if (wouldJoinSeparatedPeople(modelUnion, first, other, explicitDifferentIndex)) {
        throw new Error(`${modelMerge.batch} merges people explicitly identified as different: ${first} and ${other}`);
      }
      if (wouldJoinSeparatedPeople(modelUnion, first, other, expandedCuratedSeparationIndex)) continue;
      modelUnion.union(first, other);
    }
  }

  const modelRoots = new Set(ids.map((localId) => modelUnion.find(localId)));
  const curatedRootUnion = new UnionFind(modelRoots);
  const curatedRootsTouched = new Set();
  for (const localPeopleGroup of curatedMerges) {
    const roots = [...new Set(localPeopleGroup.map((localId) => modelUnion.find(localId)))];
    for (const root of roots) curatedRootsTouched.add(root);
    const [first, ...rest] = roots;
    for (const other of rest) curatedRootUnion.union(first, other);
  }

  const keepSeparate = new Set([...constraints.different, ...expandedCuratedKeepSeparate]);
  for (const key of modelKeepSeparate) {
    const [left, right] = key.split('\u0000');
    const leftRoot = modelUnion.find(left);
    const rightRoot = modelUnion.find(right);
    const overriddenByCuration = curatedRootsTouched.has(leftRoot)
      && curatedRootsTouched.has(rightRoot)
      && curatedRootUnion.find(leftRoot) === curatedRootUnion.find(rightRoot);
    if (!overriddenByCuration) keepSeparate.add(key);
  }

  const union = modelUnion;
  const keepSeparateIndex = separationIndex(keepSeparate);
  for (const localPeopleGroup of curatedMerges) {
    const [first, ...rest] = localPeopleGroup;
    for (const other of rest) {
      if (wouldJoinSeparatedPeople(union, first, other, keepSeparateIndex)) {
        throw new Error(`Curated merge joins people explicitly kept separate: ${first} and ${other}`);
      }
      union.union(first, other);
    }
  }

  const clustersByRoot = new Map();
  for (const localId of ids) {
    const root = union.find(localId);
    if (!clustersByRoot.has(root)) clustersByRoot.set(root, []);
    clustersByRoot.get(root).push(localId);
  }
  const clusters = [];
  for (const members of clustersByRoot.values()) {
    members.sort();
    for (let left = 0; left < members.length; left += 1) {
      for (let right = left + 1; right < members.length; right += 1) {
        if (keepSeparate.has(pairKey(members[left], members[right]))) {
          throw new Error(`Resolution merges people explicitly kept separate: ${members[left]} and ${members[right]}`);
        }
      }
    }
    const pinned = [...new Set(members.map((member) => pins.get(member)).filter(Boolean))];
    if (pinned.length > 1) throw new Error(`Cluster has conflicting canonical IDs: ${pinned.join(', ')}`);
    const candidateIds = members.map(stableCanonicalPersonId).sort();
    clusters.push({
      canonicalPersonId: pinned[0] ?? candidateIds[0],
      localPeople: members,
      retiredIds: candidateIds.filter((id) => id !== (pinned[0] ?? candidateIds[0])),
    });
  }
  const canonicalOwners = new Map();
  for (const cluster of clusters) {
    const owner = canonicalOwners.get(cluster.canonicalPersonId);
    if (owner) {
      throw new Error(
        `Duplicate canonical person ID ${cluster.canonicalPersonId} for ${owner} and ${cluster.localPeople[0]}`
      );
    }
    canonicalOwners.set(cluster.canonicalPersonId, cluster.localPeople[0]);
  }
  for (const cluster of clusters) {
    cluster.retiredIds = cluster.retiredIds.filter((id) => !canonicalOwners.has(id));
  }
  clusters.sort((a, b) => a.canonicalPersonId.localeCompare(b.canonicalPersonId));
  return { clusters, keepSeparate };
}
