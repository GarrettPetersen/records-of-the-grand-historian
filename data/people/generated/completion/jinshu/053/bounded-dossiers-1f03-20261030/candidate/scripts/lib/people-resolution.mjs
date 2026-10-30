import crypto from 'node:crypto';
import { chineseVariantComparisonKey } from './people-chinese-variants.mjs';

const CROCKFORD32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const WEAK_ENGLISH_NAMES = new Set([
  'emperor', 'empress', 'king', 'queen', 'prince', 'princess', 'duke', 'marquis',
  'lord', 'lady', 'master', 'minister', 'general', 'governor', 'official', 'ruler',
  'crown prince', 'crown princess', 'imperial prince', 'imperial princess',
  'imperial son', 'imperial daughter', 'heir apparent', 'empress dowager',
  'wife', 'husband', 'father', 'mother', 'son', 'daughter', 'brother', 'sister',
  'elder brother', 'younger brother', 'elder sister', 'younger sister',
  'eldest son', 'second son', 'youngest son', 'birth mother', 'stepmother',
  'grandfather', 'grandmother', 'paternal grandfather', 'maternal grandfather',
  'maternal uncle', 'imperial grandson', 'emperor s younger brother',
  'younger brother of the emperor',
  'his wife', 'her husband', 'his father', 'her father', 'his mother', 'her mother',
  'his son', 'her son', 'his daughter', 'her daughter',
]);
const WEAK_CHINESE_NAMES = new Set([
  '上', '主', '侯', '公', '后', '君', '國王', '国王', '天子', '太后', '太子', '夫人',
  '官', '帝', '王', '王后', '王子', '皇后', '皇子', '皇女', '皇太后', '皇太子', '皇帝', '相', '臣',
  '丞相', '刺史', '大臣', '太守', '宰相', '將軍', '将军', '巡撫', '巡抚', '陛下',
  '父', '母', '夫', '妻', '子', '女', '其父', '其母', '其夫', '其妻', '其子', '其女',
  '其兄', '其弟', '其姊', '其妹',
  '妻子', '公主', '皇弟', '皇考', '祖父', '曾祖', '繼母', '一子', '兄子', '祖母',
  '所生母', '後母', '父母', '皇妣', '叔父', '老母', '伯父', '女弟', '皇孫', '長女',
  '幼子', '從父', '第二子',
]);
const NON_BLOCKING_NAME_KINDS = new Set([
  'surname',
  'given',
  'title',
  'title-name',
  'title-reference',
  'regnal',
  'regnal-name',
  'temple',
  'temple-name',
  'posthumous',
  'posthumous-name',
]);
const IDENTITY_NAME_KINDS = new Set([
  'alternate',
  'alternate-name',
  'birth-name',
  'changed',
  'changed-name',
  'childhood',
  'childhood-name',
  'native-name',
  'personal',
  'personal-name',
  'religious',
  'religious-name',
]);
const KINSHIP_NAME_KINDS = new Set([
  'descriptive-kinship',
  'kinship',
  'kinship-reference',
]);
const WEAK_KINSHIP_CHINESE_NAMES = new Set([
  '長子', '次子', '少子', '幼子', '長女', '次女', '幼女', '第三子', '從子', '皇侄',
  '乳母', '皇祖', '外祖', '曾孫', '父子', '同母', '嫡母', '后父', '後父', '元子', '世子', '皇長子', '母后',
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

function genericChineseClanName(value) {
  const key = normalizeName('zh', value);
  return Boolean(key && /^.{1,2}氏$/u.test(key.slice(3)));
}

function weakChineseName(value, kinshipName) {
  return WEAK_CHINESE_NAMES.has(value) || /^.{1,2}氏$/u.test(value) ||
    (kinshipName && WEAK_KINSHIP_CHINESE_NAMES.has(value));
}

function weakEnglishName(value, pairedValue, kinshipName) {
  if (WEAK_ENGLISH_NAMES.has(value)) return true;
  if (
    genericChineseClanName(pairedValue) &&
    /^(?:consort|empress|lady|madam|mother|princess|queen|widow|wife) [a-z]+(?: [a-z]+)?$/u.test(value)
  ) return true;
  return kinshipName &&
    /^(?:(?:his|her|their) )?(?:(?:eldest|second|third|youngest|elder|younger|paternal|maternal|birth|step) )?(?:father|mother|son|daughter|brother|sister|uncle|aunt|grandfather|grandmother|grandson|granddaughter|nephew|niece)$/u.test(value);
}

export function localNameKeys(person) {
  const keys = new Map();
  const preferredNonBlockingClaimKeys = new Set();
  const preferredKinshipClaimKeys = new Set();
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
    if (matchingKinds.some((kind) => KINSHIP_NAME_KINDS.has(kind))) {
      preferredKinshipClaimKeys.add(preferredKey);
    }
  }
  const add = (language, value, pairedValue, kind, source) => {
    const preferred = source === 'preferred';
    const key = normalizeName(language, value);
    if (!key) return;
    const bare = key.slice(3);
    const kinshipName = KINSHIP_NAME_KINDS.has(kind) ||
      (preferred && preferredKinshipClaimKeys.has(key));
    const strongForm = language === 'zh'
      ? !weakChineseName(bare, kinshipName) && (preferred || Array.from(bare).length >= 2)
      : !weakEnglishName(bare, pairedValue, kinshipName) && (bare.includes(' ') || bare.length >= 4) &&
        !(pairedValue && !bare.includes(' '));
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
  add(
    'en',
    person.preferredNameSuggestion.en,
    person.preferredNameSuggestion.zh,
    'preferred',
    'preferred',
  );
  add(
    'zh',
    person.preferredNameSuggestion.zh,
    person.preferredNameSuggestion.en,
    'preferred',
    'preferred',
  );
  for (const claim of person.claims) {
    if (claim.predicate !== 'name') continue;
    add('en', claim.value?.en, claim.value?.zh, claim.value?.kind, claim.id);
    add('zh', claim.value?.zh, claim.value?.en, claim.value?.kind, claim.id);
  }
  return [...keys.values()].map((entry) => ({
    ...entry,
    kinds: [...entry.kinds].sort(),
    sources: [...entry.sources].sort(),
  }));
}

function identityChineseKeys(nameKeys) {
  return new Set(nameKeys
    .filter((name) => name.language === 'zh' && name.blocking)
    .filter((name) => name.kinds.some((kind) => IDENTITY_NAME_KINDS.has(kind)))
    .map((name) => chineseVariantComparisonKey(name.key)));
}

// A reusable view of the existing source-backed English/Chinese partition rule.
// The dossier index uses two inverted lists, never a cross-product of members.
export function identityNameKeyState(nameKeys) {
  return { chinese: identityChineseKeys(nameKeys), english: new Set(nameKeys
    .filter(name => name.language === 'en' && name.blocking && name.kinds.some(kind => IDENTITY_NAME_KINDS.has(kind)))
    .map(name => name.key)) };
}

function candidateMemberGroups(key, bucket, members, identityChineseByPerson) {
  if (!key.startsWith('en:')) return [members];
  const chineseNamesByMember = new Map(members.map((member) => [
    member,
    bucket.identityMembers.has(member)
      ? (identityChineseByPerson.get(member) ?? new Set())
      : new Set(),
  ]));
  const partitions = new Set([...chineseNamesByMember.values()].flatMap((names) => [...names]));
  if (partitions.size < 2) return [members];
  const groups = [...partitions].map((partition) => members.filter((member) => {
    const names = chineseNamesByMember.get(member);
    return names.size === 0 || names.has(partition);
  }));
  return [...new Map(groups
    .filter((group) => group.length >= 2)
    .map((group) => [group.join('\u0000'), group])).values()];
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
  const identityChineseByPerson = new Map();
  const people = {};
  for (const person of [...localPeople.values()].sort((a, b) => a.localId.localeCompare(b.localId))) {
    const nameKeys = localNameKeys(person);
    identityChineseByPerson.set(person.localId, identityChineseKeys(nameKeys));
    people[person.localId] = { ...localSummary(person), nameKeys };
    for (const key of nameKeys) {
      if (!key.blocking) continue;
      if (!buckets.has(key.key)) buckets.set(key.key, { names: [], members: new Set(), identityMembers: new Set() });
      const bucket = buckets.get(key.key);
      bucket.names.push({ value: key.value, language: key.language, kinds: key.kinds });
      bucket.members.add(person.localId);
      if (key.kinds.some((kind) => IDENTITY_NAME_KINDS.has(kind))) {
        bucket.identityMembers.add(person.localId);
      }
    }
  }

  const byMembers = new Map();
  for (const [key, bucket] of buckets) {
    if (bucket.members.size < 2) continue;
    const members = [...bucket.members].sort();
    for (const candidateMembers of candidateMemberGroups(key, bucket, members, identityChineseByPerson)) {
      const memberKey = candidateMembers.join('\u0000');
      const current = byMembers.get(memberKey) ?? { members: candidateMembers, sharedNames: [] };
      current.sharedNames.push({ key, forms: bucket.names });
      byMembers.set(memberKey, current);
    }
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

// Constraint groups store one branch label per member. They never expand a
// reviewed split or a merged cluster into its Cartesian product.
class ConstraintUnion {
  constructor(ids) {
    this.parent = new Map(ids.map(id => [id, id]));
    this.size = new Map(ids.map(id => [id, 1]));
    this.labels = new Map();
    this.labelVisits = 0;
  }
  find(id) {
    if (!this.parent.has(id)) throw new Error(`Unknown local person ${id}`);
    let root = id;
    while (this.parent.get(root) !== root) root = this.parent.get(root);
    while (id !== root) { const next = this.parent.get(id); this.parent.set(id, root); id = next; }
    return root;
  }
  add(id, constraint, branch) {
    const root = this.find(id);
    if (!this.labels.has(root)) this.labels.set(root, new Map());
    const labels = this.labels.get(root), old = labels.get(constraint);
    if (old !== undefined && old !== branch) throw new Error(`Resolution merges people explicitly kept separate: ${constraint}`);
    labels.set(constraint, branch);
  }
  conflict(left, right, kind = null) {
    const a = this.find(left), b = this.find(right);
    if (a === b) return false;
    let small = this.labels.get(a) ?? new Map(), large = this.labels.get(b) ?? new Map();
    if (small.size > large.size) [small, large] = [large, small];
    for (const [key, value] of small) {
      this.labelVisits += 1;
      if ((kind === null || key.startsWith(kind + ':')) && large.has(key) && large.get(key) !== value) return true;
    }
    return false;
  }
  union(left, right) {
    let keep = this.find(left), remove = this.find(right);
    if (keep === remove) return;
    if (this.conflict(keep, remove)) throw new Error(`Resolution merges people explicitly kept separate: ${left} and ${right}`);
    if (this.size.get(keep) < this.size.get(remove)) [keep, remove] = [remove, keep];
    this.parent.set(remove, keep); this.size.set(keep, this.size.get(keep) + this.size.get(remove)); this.size.delete(remove);
    let target = this.labels.get(keep) ?? new Map(), source = this.labels.get(remove) ?? new Map();
    if (target.size < source.size) [target, source] = [source, target];
    for (const [key, value] of source) { this.labelVisits += 1; target.set(key, value); }
    this.labels.set(keep, target); this.labels.delete(remove);
  }
}

// Used by dossier indexing and publication. Cost follows accepted evidence and
// constraint incidences, with union-by-size; no name buckets or pair graph.
export function resolveAcceptedPeopleClusters(localPeople, resolutionDocuments = []) {
  const ids = [...localPeople.keys()], explicit = explicitIdentityConstraints(localPeople);
  const modelMerges = [], curatedMerges = [], modelSplits = [], curatedSplits = [], possibleGroups = [], pins = new Map();
  for (const document of resolutionDocuments) for (const decision of document.decisions) {
    const members = [...new Set(decision.localPeople)];
    for (const id of members) if (!localPeople.has(id)) throw new Error(`${document.batch} refers to unknown local person ${id}`);
    const curated = document.authority === 'curated';
    if (decision.decision === 'merge') (curated ? curatedMerges : modelMerges).push({ batch: document.batch, members });
    else if (['keep-separate', 'split'].includes(decision.decision)) (curated ? curatedSplits : modelSplits).push(members);
    else if (decision.decision === 'possible-same-as') possibleGroups.push(members);
    else throw new Error(`Unknown identity decision ${decision.decision}`);
    if (decision.canonicalPersonId) for (const id of members) pins.set(id, decision.canonicalPersonId);
  }
  const intent = new ConstraintUnion(ids);
  for (const { members } of curatedMerges) for (const other of members.slice(1)) intent.union(members[0], other);
  const byIntent = new Map();
  for (const id of ids) { const root = intent.find(id); if (!byIntent.has(root)) byIntent.set(root, []); byIntent.get(root).push(id); }
  const union = new ConstraintUnion(ids), separationGroups = [];
  let incidences = 0;
  const addGroup = (kind, branches) => {
    const key = `${kind}:${separationGroups.length}`, group = { key, branches };
    separationGroups.push(group);
    for (const [id, branch] of branches) { union.add(id, key, branch); incidences += 1; }
  };
  for (const members of curatedSplits) {
    const roots = members.map(id => intent.find(id));
    if (new Set(roots).size !== roots.length) throw new Error('Curated merge joins people explicitly kept separate');
    addGroup('curated', roots.flatMap(root => byIntent.get(root).map(id => [id, root])));
  }
  for (const key of explicit.different) addGroup('explicit', key.split('\u0000').map(id => [id, id]));
  for (const key of explicit.same) {
    const [a, b] = key.split('\u0000');
    if (union.conflict(a, b, 'curated')) throw new Error(`Curated separation contradicts explicit same-person evidence for ${a} and ${b}`);
    union.union(a, b);
  }
  for (const { batch, members } of modelMerges) for (const other of members.slice(1)) {
    if (union.conflict(members[0], other, 'explicit')) throw new Error(`${batch} merges people explicitly identified as different`);
    if (!union.conflict(members[0], other, 'curated')) union.union(members[0], other);
  }
  const modelRoot = new Map(ids.map(id => [id, union.find(id)]));
  const override = new ConstraintUnion([...new Set(modelRoot.values())]), touched = new Set();
  for (const { members } of curatedMerges) {
    const roots = [...new Set(members.map(id => modelRoot.get(id)))];
    roots.forEach(root => touched.add(root));
    for (const other of roots.slice(1)) override.union(roots[0], other);
  }
  for (const members of modelSplits) addGroup('model', members.map(id => {
    const root = modelRoot.get(id);
    return [id, touched.has(root) ? `curated:${override.find(root)}` : `local:${id}`];
  }));
  for (const { members } of curatedMerges) for (const other of members.slice(1)) union.union(members[0], other);
  const byRoot = new Map();
  for (const id of ids) { const root = union.find(id); if (!byRoot.has(root)) byRoot.set(root, []); byRoot.get(root).push(id); }
  const clusters = [...byRoot.values()].map(members => {
    members.sort();
    const pinned = [...new Set(members.map(id => pins.get(id)).filter(Boolean))];
    if (pinned.length > 1) throw new Error(`Cluster has conflicting canonical IDs: ${pinned.join(', ')}`);
    const candidates = members.map(stableCanonicalPersonId).sort(), canonicalPersonId = pinned[0] ?? candidates[0];
    return { canonicalPersonId, localPeople: members, retiredIds: candidates.filter(id => id !== canonicalPersonId) };
  });
  const owners = new Map();
  for (const cluster of clusters) {
    if (owners.has(cluster.canonicalPersonId)) throw new Error(`Duplicate canonical person ID ${cluster.canonicalPersonId}`);
    owners.set(cluster.canonicalPersonId, cluster.localPeople[0]);
  }
  for (const cluster of clusters) cluster.retiredIds = cluster.retiredIds.filter(id => !owners.has(id));
  clusters.sort((a, b) => a.canonicalPersonId.localeCompare(b.canonicalPersonId));
  const canonicalByLocal = new Map(clusters.flatMap(cluster => cluster.localPeople.map(id => [id, cluster.canonicalPersonId])));
  return { clusters, separationGroups,
    possibleSameAsGroups: possibleGroups.map(members => [...new Set(members.map(id => canonicalByLocal.get(id)))]),
    metrics: { localPeople: ids.length, constraintIncidences: incidences, labelVisits: union.labelVisits, generatedPairs: 0 } };
}

// Historical pair consumers remain available only to drain retained assignments.
// New planning and publication use resolveAcceptedPeopleClusters directly.
export function resolvePeopleClusters(localPeople, resolutionDocuments = []) {
  const accepted = resolveAcceptedPeopleClusters(localPeople, resolutionDocuments), keepSeparate = new Set(), possibleSameAs = new Set();
  for (const { branches } of accepted.separationGroups) for (let a = 0; a < branches.length; a += 1) for (let b = a + 1; b < branches.length; b += 1) {
    if (branches[a][1] !== branches[b][1]) keepSeparate.add(pairKey(branches[a][0], branches[b][0]));
  }
  for (const members of accepted.possibleSameAsGroups) for (let a = 0; a < members.length; a += 1) for (let b = a + 1; b < members.length; b += 1) possibleSameAs.add(pairKey(members[a], members[b]));
  return { clusters: accepted.clusters, keepSeparate, possibleSameAs };
}
