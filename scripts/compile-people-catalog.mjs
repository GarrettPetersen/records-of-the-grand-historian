#!/usr/bin/env node

import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleResolutionCandidateDocument } from './build-people-resolution-candidates.mjs';
import { loadValidatedPeopleCorpus, loadValidatedResolutionDocuments } from './lib/people-corpus.mjs';
import { PEOPLE_DIR, REPO_ROOT, readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './lib/people-schema.mjs';
import {
  assertPeopleCatalogPublicationState,
  peopleCatalogIsComplete,
} from './lib/people-publication.mjs';
import { personSlug, resolvePeopleClusters } from './lib/people-resolution.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const CANONICAL_SCHEMA_ID = 'https://24histories.com/schema/people/canonical-person-v1.json';
const CATALOG_SCHEMA_ID = 'https://24histories.com/schema/people/catalog-v1.json';
const SITE_INDEX_SCHEMA_ID = 'https://24histories.com/schema/people/site-index-v2.json';

const CLAIM_TARGETS = new Map([
  ['ethnicity', 'ethnicities'],
  ['lineage', 'lineages'],
  ['family-relationship', 'familyRelationships'],
  ['family-summary', 'familySummaries'],
  ['occupation', 'occupations'],
  ['polity-association', 'polityAssociations'],
  ['native-place', 'placeAssociations'],
  ['place-association', 'placeAssociations'],
  ['organization-association', 'organizationAssociations'],
  ['education', 'education'],
  ['credential', 'credentials'],
  ['belief-association', 'beliefs'],
  ['skill', 'skills'],
  ['office', 'offices'],
  ['noble-title', 'titlesAndHonors'],
  ['enfeoffment', 'titlesAndHonors'],
  ['honor', 'titlesAndHonors'],
  ['status', 'statuses'],
  ['legal-action', 'legalActions'],
  ['relationship', 'relationships'],
  ['authorship', 'works'],
  ['work-association', 'works'],
  ['attribution', 'attributions'],
  ['event-participation', 'events'],
  ['assessment', 'assessments'],
  ['material-association', 'materialAssociations'],
  ['biographical-attribute', 'attributes'],
  ['textual-variant', 'sourceIssues'],
  ['conflict', 'sourceIssues'],
  ['accession', 'rulershipEvents'],
  ['deposition', 'rulershipEvents'],
]);
const FAMILY_RELATION_INVERSES = new Map([
  ['parent-of', 'child-of'],
  ['child-of', 'parent-of'],
  ['sibling-of', 'sibling-of'],
  ['spouse-of', 'spouse-of'],
  ['betrothed-to', 'betrothed-to'],
  ['ancestor-of', 'descendant-of'],
  ['descendant-of', 'ancestor-of'],
  ['kin-of', 'kin-of'],
]);
const SYMMETRIC_FAMILY_RELATIONS = new Set(['sibling-of', 'spouse-of', 'betrothed-to', 'kin-of']);

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function parseArgs(argv) {
  const options = {
    out: path.join(PEOPLE_DIR, 'generated', 'catalog.json'),
    candidatesOut: path.join(PEOPLE_DIR, 'generated', 'resolution-candidates.json'),
    siteIndexOut: path.join(PEOPLE_DIR, 'generated', 'site-index.json'),
    requireResolved: false,
    selfTest: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const nextPath = () => {
      const value = argv[++index];
      if (!value) throw new Error(`${arg} requires a path`);
      return path.resolve(REPO_ROOT, value);
    };
    if (arg === '--out') options.out = nextPath();
    else if (arg === '--candidates-out') options.candidatesOut = nextPath();
    else if (arg === '--site-index-out') options.siteIndexOut = nextPath();
    else if (arg === '--require-resolved') options.requireResolved = true;
    else if (arg === '--self-test') options.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/compile-people-catalog.mjs [options]

Options:
  --out PATH             Generated catalog path.
  --candidates-out PATH  Generated identity-candidate dossier path.
  --site-index-out PATH  Generated chapter mention-link index path.
  --require-resolved     Fail unless every extraction is prompt-current and every name block is resolved.
  --self-test            Run compiler fixtures.`);
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function rewriteLocalPersonRefs(value, localMap) {
  if (Array.isArray(value)) return value.map((item) => rewriteLocalPersonRefs(item, localMap));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteLocalPersonRefs(item, localMap)]),
    );
  }
  return typeof value === 'string' && localMap.has(value) ? localMap.get(value) : value;
}

function claimView(claim, localMap) {
  return {
    predicate: claim.predicate,
    value: rewriteLocalPersonRefs(claim.value, localMap),
    certainty: claim.certainty,
    evidence: [...claim.evidence],
    claimRefs: [claim.id],
  };
}

function dedupeClaimViews(values) {
  const byFact = new Map();
  for (const value of values) {
    const key = canonicalJson([value.predicate, value.value, value.certainty]);
    const current = byFact.get(key);
    if (!current) {
      byFact.set(key, structuredClone(value));
      continue;
    }
    current.evidence = [...new Set([...current.evidence, ...value.evidence])].sort();
    current.claimRefs = [...new Set([...current.claimRefs, ...value.claimRefs])].sort();
  }
  return [...byFact.values()].sort((left, right) =>
    left.predicate.localeCompare(right.predicate) || canonicalJson(left.value).localeCompare(canonicalJson(right.value))
  );
}

function frequencyChoice(values) {
  const counts = new Map();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0]?.[0] ?? null;
}

const GENERIC_DESCRIPTOR_WORDS = new Set([
  'administrator', 'and', 'aristocrat', 'attendant', 'consort', 'court', 'emperor', 'empress',
  'envoy', 'eunuch', 'family', 'figure', 'general', 'historian', 'individual', 'king', 'lady',
  'leader', 'man', 'member', 'military', 'minister', 'named', 'officer', 'official', 'palace',
  'person', 'prince', 'princess', 'queen', 'rebel', 'royal', 'ruler', 'scholar', 'statesman',
  'the', 'tribal', 'woman', 'warlord',
]);

function normalizeDescriptor(value) {
  return String(value ?? '').trim().replace(/\s+/gu, ' ');
}

function descriptorIsGeneric(value, roles) {
  const normalized = normalizeDescriptor(value).toLocaleLowerCase('en').replace(/[^a-z0-9]+/gu, ' ').trim();
  if (!normalized) return true;
  const roleLabels = new Set(roles.flatMap((role) => [role.label, role.roleId])
    .map((label) => normalizeDescriptor(label).toLocaleLowerCase('en').replace(/[^a-z0-9]+/gu, ' ').trim()));
  if (roleLabels.has(normalized)) return true;
  return normalized.split(' ').every((word) => GENERIC_DESCRIPTOR_WORDS.has(word));
}

function preferredDescriptor(values, roles) {
  const counts = new Map();
  for (const raw of values) {
    const value = normalizeDescriptor(raw);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const entries = [...counts.entries()];
  const specific = entries.filter(([value]) => !descriptorIsGeneric(value, roles));
  const pool = specific.length ? specific : entries;
  return pool.sort((left, right) =>
    right[1] - left[1] ||
    Math.min(right[0].split(' ').length, 16) - Math.min(left[0].split(' ').length, 16) ||
    left[0].length - right[0].length ||
    left[0].localeCompare(right[0])
  )[0]?.[0] ?? null;
}

function sourcePreferredNameSuggestion(members) {
  return members.map((member, order) => ({
    value: member.preferredNameSuggestion,
    order,
    score: Number(Boolean(member.preferredNameSuggestion.en)) * 4 +
      Number(Boolean(member.preferredNameSuggestion.zh)) * 4 +
      Number(Boolean(member.preferredNameSuggestion.pinyin)),
  })).sort((left, right) => right.score - left.score || left.order - right.order)[0]?.value ?? {};
}

function preferredName(members, override = null, clusterId = null) {
  const nameClaims = members.flatMap((member) => member.claims).filter((claim) => claim.predicate === 'name');
  if (override?.preferredName) {
    const selected = override.preferredName;
    const claimRefs = nameClaims.filter((claim) =>
      (!selected.en || claim.value?.en === selected.en) &&
      (!selected.zh || claim.value?.zh === selected.zh)
    ).map((claim) => claim.id);
    if (!claimRefs.length) {
      const cluster = clusterId
        ? ` for ${clusterId} (${members.map((member) => member.localId).join(', ')})`
        : '';
      throw new Error(
        `Preferred-name override ${JSON.stringify(selected)}${cluster} is not supported by a source name claim`,
      );
    }
    return {
      kind: selected.kind,
      en: selected.en ?? null,
      zh: selected.zh ?? null,
      pinyin: selected.pinyin ?? null,
      preferred: true,
      claimRefs: [...new Set(claimRefs)].sort(),
    };
  }
  const selected = sourcePreferredNameSuggestion(members);
  const claimRefs = nameClaims
    .filter((claim) =>
      (selected.en && claim.value?.en === selected.en) || (selected.zh && claim.value?.zh === selected.zh)
    )
    .map((claim) => claim.id);
  return {
    kind: 'personal',
    en: selected.en ?? null,
    zh: selected.zh ?? null,
    pinyin: selected.pinyin ?? null,
    preferred: true,
    claimRefs: [...new Set(claimRefs)].sort(),
  };
}

function canonicalNames(members, preferred) {
  const byName = new Map();
  for (const claim of members.flatMap((member) => member.claims).filter((item) => item.predicate === 'name')) {
    const value = {
      kind: claim.value?.kind ?? 'alternate',
      en: claim.value?.en ?? null,
      zh: claim.value?.zh ?? null,
      pinyin: claim.value?.pinyin ?? null,
    };
    const key = canonicalJson(value);
    const current = byName.get(key) ?? { ...value, preferred: false, claimRefs: [] };
    current.claimRefs.push(claim.id);
    byName.set(key, current);
  }
  const preferredKey = canonicalJson({
    kind: preferred.kind,
    en: preferred.en,
    zh: preferred.zh,
    pinyin: preferred.pinyin,
  });
  if (!byName.has(preferredKey)) byName.set(preferredKey, { ...preferred, preferred: true });
  for (const [key, value] of byName) {
    value.preferred = key === preferredKey;
    value.claimRefs = [...new Set(value.claimRefs)].sort();
  }
  return [...byName.values()].sort((left, right) =>
    Number(right.preferred) - Number(left.preferred) ||
    String(left.en ?? left.zh ?? '').localeCompare(String(right.en ?? right.zh ?? ''))
  );
}

function canonicalRoles(members, roleLabels) {
  const byRole = new Map();
  for (const claim of members.flatMap((member) => member.claims).filter((item) => item.predicate === 'role')) {
    const roleId = claim.value?.roleId;
    if (!roleId) continue;
    const current = byRole.get(roleId) ?? {
      roleId,
      label: roleLabels.get(roleId) ?? roleId,
      certainty: claim.certainty,
      claimRefs: [],
    };
    current.claimRefs.push(claim.id);
    byRole.set(roleId, current);
  }
  for (const role of byRole.values()) role.claimRefs = [...new Set(role.claimRefs)].sort();
  return [...byRole.values()].sort((left, right) => left.label.localeCompare(right.label));
}

function sexValue(members) {
  const values = members.flatMap((member) => member.claims)
    .filter((claim) => claim.predicate === 'sex')
    .map((claim) => claim.value?.sex ?? claim.value?.gender ?? claim.value?.value)
    .filter((value) => typeof value === 'string' && value.trim());
  return new Set(values).size === 1 ? values[0] : null;
}

function identificationStatus(members) {
  const kinds = members.flatMap((member) => member.claims)
    .filter((claim) => claim.predicate === 'name')
    .map((claim) => claim.value?.kind)
    .filter(Boolean);
  if (kinds.length === 0) return 'uncertain';
  if (kinds.every((kind) => kind === 'descriptive-kinship')) return 'anonymous-individuated';
  if (kinds.every((kind) => kind === 'title')) return 'title-only';
  return 'named';
}

function swapValueFields(value, left, right) {
  const leftValue = value[left];
  const rightValue = value[right];
  if (rightValue === undefined) delete value[left];
  else value[left] = rightValue;
  if (leftValue === undefined) delete value[right];
  else value[right] = leftValue;
}

function normalizedFamilyStructure(subjectPersonId, relation, objectPersonId) {
  let fromPersonId = subjectPersonId;
  let normalizedRelation = relation;
  let toPersonId = objectPersonId;
  if (relation === 'child-of') {
    fromPersonId = objectPersonId;
    normalizedRelation = 'parent-of';
    toPersonId = subjectPersonId;
  } else if (relation === 'descendant-of') {
    fromPersonId = objectPersonId;
    normalizedRelation = 'ancestor-of';
    toPersonId = subjectPersonId;
  } else if (SYMMETRIC_FAMILY_RELATIONS.has(relation) && fromPersonId.localeCompare(toPersonId) > 0) {
    [fromPersonId, toPersonId] = [toPersonId, fromPersonId];
  }
  return { fromPersonId, relation: normalizedRelation, toPersonId };
}

function familyStructureKey(subjectPersonId, relation, objectPersonId) {
  return canonicalJson(normalizedFamilyStructure(subjectPersonId, relation, objectPersonId));
}

function familyEdgeId(structure) {
  const digest = crypto.createHash('sha256')
    .update(`24histories-family-edge:${canonicalJson(structure)}`)
    .digest('hex')
    .slice(0, 24);
  return `fam_${digest}`;
}

function buildCanonicalFamilyEdges(people) {
  const personIds = new Set(people.map((person) => person.id));
  const byStructure = new Map();
  for (const source of people) {
    for (const relationship of source.familyRelationships) {
      const objectPersonId = relationship.value?.personId;
      if (!personIds.has(objectPersonId)) {
        throw new Error(`${source.id} family relationship refers to unknown canonical person ${objectPersonId}`);
      }
      if (objectPersonId === source.id) {
        throw new Error(`${source.id} has a self-referential family relationship; identity resolution likely made a false merge`);
      }
      if (!FAMILY_RELATION_INVERSES.has(relationship.value?.relation)) {
        throw new Error(`${source.id} uses unknown family relation ${JSON.stringify(relationship.value?.relation)}`);
      }
      const structure = normalizedFamilyStructure(source.id, relationship.value.relation, objectPersonId);
      const key = canonicalJson(structure);
      const edge = byStructure.get(key) ?? {
        id: familyEdgeId(structure),
        ...structure,
        assertions: [],
      };
      const details = structuredClone(relationship.value);
      delete details.relation;
      delete details.personId;
      const assertionKey = canonicalJson([
        source.id,
        relationship.value.relation,
        objectPersonId,
        details,
        relationship.certainty,
      ]);
      const existing = edge.assertions.find((assertion) => assertion._key === assertionKey);
      if (existing) {
        existing.evidence = [...new Set([...existing.evidence, ...relationship.evidence])].sort();
        existing.claimRefs = [...new Set([...existing.claimRefs, ...relationship.claimRefs])].sort();
      } else {
        edge.assertions.push({
          _key: assertionKey,
          subjectPersonId: source.id,
          relation: relationship.value.relation,
          objectPersonId,
          details,
          certainty: relationship.certainty,
          evidence: [...relationship.evidence],
          claimRefs: [...relationship.claimRefs],
        });
      }
      byStructure.set(key, edge);
    }
  }
  return [...byStructure.values()].map((edge) => ({
    ...edge,
    assertions: edge.assertions
      .map(({ _key, ...assertion }) => assertion)
      .sort((left, right) =>
        left.subjectPersonId.localeCompare(right.subjectPersonId) ||
        left.relation.localeCompare(right.relation) ||
        canonicalJson(left.details).localeCompare(canonicalJson(right.details))
      ),
  })).sort((left, right) => left.id.localeCompare(right.id));
}

function addInverseFamilyRelationships(people) {
  const byId = new Map(people.map((person) => [person.id, person]));
  const additions = new Map();
  for (const source of people) {
    for (const relationship of source.familyRelationships) {
      const targetId = relationship.value?.personId;
      const target = byId.get(targetId);
      if (!target) throw new Error(`${source.id} family relationship refers to unknown canonical person ${targetId}`);
      if (targetId === source.id) {
        throw new Error(`${source.id} has a self-referential family relationship; identity resolution likely made a false merge`);
      }
      const inverseRelation = FAMILY_RELATION_INVERSES.get(relationship.value?.relation);
      if (!inverseRelation) {
        throw new Error(`${source.id} uses unknown family relation ${JSON.stringify(relationship.value?.relation)}`);
      }
      const value = structuredClone(relationship.value);
      value.personId = source.id;
      value.relation = inverseRelation;
      swapValueFields(value, 'subjectRole', 'objectRole');
      swapValueFields(value, 'subjectBirthOrder', 'objectBirthOrder');
      if (value.subjectRelativeAge === 'elder') value.subjectRelativeAge = 'younger';
      else if (value.subjectRelativeAge === 'younger') value.subjectRelativeAge = 'elder';
      const inverse = { ...structuredClone(relationship), derivedInverse: true, value };
      if (!additions.has(targetId)) additions.set(targetId, []);
      additions.get(targetId).push(inverse);
    }
  }
  for (const [targetId, inverseRelationships] of additions) {
    const target = byId.get(targetId);
    target.familyRelationships = dedupeClaimViews([...target.familyRelationships, ...inverseRelationships]);
  }
}

function attachFamilyEdgeIds(people, familyEdges) {
  const edgeByStructure = new Map(familyEdges.map((edge) => [
    familyStructureKey(edge.fromPersonId, edge.relation, edge.toPersonId),
    edge.id,
  ]));
  for (const source of people) {
    for (const relationship of source.familyRelationships) {
      const key = familyStructureKey(source.id, relationship.value.relation, relationship.value.personId);
      const edgeId = edgeByStructure.get(key);
      if (!edgeId) throw new Error(`No family graph edge for ${source.id} ${relationship.value.relation}`);
      relationship.edgeId = edgeId;
    }
  }
}

function validateCanonicalFamilyGraph(people, familyEdges) {
  const peopleById = new Map(people.map((person) => [person.id, person]));
  const edgesById = new Map();
  for (const edge of familyEdges) {
    if (edgesById.has(edge.id)) throw new Error(`Duplicate canonical family edge ${edge.id}`);
    edgesById.set(edge.id, edge);
    if (!peopleById.has(edge.fromPersonId) || !peopleById.has(edge.toPersonId)) {
      throw new Error(`${edge.id} refers to an unknown canonical person`);
    }
    if (edge.fromPersonId === edge.toPersonId) throw new Error(`${edge.id} is self-referential`);
    const edgeKey = familyStructureKey(edge.fromPersonId, edge.relation, edge.toPersonId);
    for (const assertion of edge.assertions) {
      const assertionKey = familyStructureKey(
        assertion.subjectPersonId,
        assertion.relation,
        assertion.objectPersonId,
      );
      if (assertionKey !== edgeKey) {
        throw new Error(`${edge.id} contains an assertion for a different structural relationship`);
      }
    }
    for (const [personId, otherPersonId] of [
      [edge.fromPersonId, edge.toPersonId],
      [edge.toPersonId, edge.fromPersonId],
    ]) {
      const linked = peopleById.get(personId).familyRelationships.some((relationship) =>
        relationship.edgeId === edge.id && relationship.value.personId === otherPersonId
      );
      if (!linked) throw new Error(`${edge.id} is missing reciprocal adjacency on ${personId}`);
    }
  }
  for (const person of people) {
    for (const relationship of person.familyRelationships) {
      const edge = edgesById.get(relationship.edgeId);
      if (!edge) throw new Error(`${person.id} refers to unknown family edge ${relationship.edgeId}`);
      const relationshipKey = familyStructureKey(
        person.id,
        relationship.value.relation,
        relationship.value.personId,
      );
      const edgeKey = familyStructureKey(edge.fromPersonId, edge.relation, edge.toPersonId);
      if (relationshipKey !== edgeKey) {
        throw new Error(`${person.id} adjacency ${relationship.edgeId} does not match its family edge`);
      }
    }
  }
}

function canonicalReferences(members) {
  const byUnit = new Map();
  for (const member of members) {
    for (const mention of member.mentions) {
      const key = `${member.book}:${member.chapter}:${mention.unit.id}`;
      const current = byUnit.get(key) ?? {
        book: member.book,
        chapter: member.chapter,
        unitId: mention.unit.id,
        blockIndex: mention.unit.blockIndex,
        collection: mention.unit.collection,
        itemIndex: mention.unit.itemIndex,
        unitKind: mention.unit.kind,
        kinds: new Set(),
        languages: new Set(),
        mentionRefs: [],
      };
      current.kinds.add(mention.kind);
      current.mentionRefs.push(mention.id);
      for (const language of ['zh', 'en']) {
        if (mention.spans[language].length > 0) current.languages.add(language);
      }
      byUnit.set(key, current);
    }
  }
  return [...byUnit.values()].map((reference) => ({
    ...reference,
    kinds: [...reference.kinds].sort(),
    languages: [...reference.languages].sort(),
    mentionRefs: [...new Set(reference.mentionRefs)].sort(),
  })).sort((left, right) =>
    left.book.localeCompare(right.book) || left.chapter.localeCompare(right.chapter) ||
    left.blockIndex - right.blockIndex || left.unitId.localeCompare(right.unitId)
  );
}

function buildPeopleSiteIndex(corpus, catalog) {
  const personById = new Map(catalog.people.map((person) => [person.id, person]));
  const chapters = {};
  for (const chapter of corpus.chapters) {
    const extraction = chapter.extraction;
    if (!extraction) continue;
    const key = `${extraction.book}:${extraction.chapter}`;
    chapters[key] = {
      book: extraction.book,
      chapter: extraction.chapter,
      promptVersion: extraction.run.promptVersion,
      mentions: extraction.mentions.map((mention) => {
        const personId = catalog.localPersonMap[mention.person];
        const person = personById.get(personId);
        if (!person) throw new Error(`${mention.id} has no compiled canonical person`);
        return {
          mentionId: mention.id,
          personId,
          slug: person.slug,
          kind: mention.kind,
          unit: structuredClone(mention.unit),
          spans: structuredClone(mention.spans),
        };
      }),
    };
  }
  const siteIndex = {
    schemaVersion: 2,
    generatedAt: catalog.generatedAt,
    complete: catalog.complete,
    currentPromptVersion: catalog.currentPromptVersion,
    chapters,
  };
  const ajv = createPeopleSchemaValidator();
  const validate = ajv.getSchema(SITE_INDEX_SCHEMA_ID);
  if (!validate(siteIndex)) {
    throw new Error(
      `People site index validation failed:\n${formatSchemaErrors(validate.errors).map((item) => `- ${item}`).join('\n')}`,
    );
  }
  return siteIndex;
}

function canonicalRecord(cluster, corpus, localMap, roleLabels, unresolvedLocalPeople, currentPromptVersion, override) {
  const members = cluster.localPeople.map((localId) => corpus.localPeople.get(localId));
  const preferred = preferredName(members, override, cluster.canonicalPersonId);
  const slugName = sourcePreferredNameSuggestion(members);
  const roles = canonicalRoles(members, roleLabels);
  const descriptors = members.map((member) => member.descriptorSuggestion);
  const descriptor = override?.preferredDescription ?? preferredDescriptor(descriptors, roles) ?? frequencyChoice(descriptors) ??
    (roles.map((role) => role.label).slice(0, 3).join(' and ') || 'Named Individual');
  const roleClaimRefs = roles.flatMap((role) => role.claimRefs);
  const historicities = new Set(members.map((member) => member.historicity));
  const historicity = historicities.size === 1 ? members[0].historicity : 'uncertain';
  const buckets = {
    ethnicities: [], lineages: [], occupations: [], rulershipEvents: [], polityAssociations: [],
    placeAssociations: [], organizationAssociations: [], offices: [], titlesAndHonors: [],
    statuses: [], legalActions: [], familyRelationships: [], familySummaries: [], relationships: [],
    education: [], credentials: [], beliefs: [],
    skills: [], works: [], attributions: [], events: [], assessments: [], materialAssociations: [], attributes: [],
    sourceIssues: [], otherClaims: [],
  };
  const life = { birth: [], death: [], ageClaims: [], attestedActivity: [] };

  for (const claim of members.flatMap((member) => member.claims)) {
    if (['name', 'role', 'sex', 'same-person', 'different-person'].includes(claim.predicate)) continue;
    const view = claimView(claim, localMap);
    if (claim.predicate === 'birth') life.birth.push(view);
    else if (claim.predicate === 'death') life.death.push(view);
    else if (claim.predicate === 'age') life.ageClaims.push(view);
    else if (claim.predicate === 'attestation') life.attestedActivity.push(view);
    else {
      const target = CLAIM_TARGETS.get(claim.predicate) ?? 'otherClaims';
      buckets[target].push(view);
    }
  }
  for (const key of Object.keys(buckets)) buckets[key] = dedupeClaimViews(buckets[key]);
  for (const key of Object.keys(life)) life[key] = dedupeClaimViews(life[key]);

  const hasUnresolvedIdentity = cluster.localPeople.some((localId) => unresolvedLocalPeople.has(localId));
  const promptVersions = [...new Set(members.map((member) => member.promptVersion))].sort((a, b) => a - b);
  const legacy = promptVersions.some((version) => version < currentPromptVersion);
  const notes = [];
  if (hasUnresolvedIdentity) notes.push('Unresolved same-name identity candidate');
  if (legacy) notes.push(`Requires prompt-v${currentPromptVersion} source reread; current prompt versions: ${promptVersions.join(', ')}`);

  return {
    id: cluster.canonicalPersonId,
    // Explicit curation preserves a live URL when a later merge changes the earliest source name.
    slug: override?.preferredSlug ?? personSlug(slugName.en ?? slugName.pinyin ?? slugName.zh, cluster.canonicalPersonId),
    preferredName: preferred,
    description: { en: descriptor, claimRefs: [...new Set(roleClaimRefs)].sort() },
    historicity,
    identificationStatus: identificationStatus(members),
    sex: sexValue(members),
    sexClaims: dedupeClaimViews(members.flatMap((member) => member.claims)
      .filter((claim) => claim.predicate === 'sex')
      .map((claim) => claimView(claim, localMap))),
    names: canonicalNames(members, preferred),
    roles,
    ethnicities: buckets.ethnicities,
    lineages: buckets.lineages,
    occupations: buckets.occupations,
    life,
    rulershipEvents: buckets.rulershipEvents,
    polityAssociations: buckets.polityAssociations,
    placeAssociations: buckets.placeAssociations,
    organizationAssociations: buckets.organizationAssociations,
    offices: buckets.offices,
    titlesAndHonors: buckets.titlesAndHonors,
    statuses: buckets.statuses,
    legalActions: buckets.legalActions,
    familyRelationships: buckets.familyRelationships,
    familySummaries: buckets.familySummaries,
    relationships: buckets.relationships,
    education: buckets.education,
    credentials: buckets.credentials,
    beliefs: buckets.beliefs,
    skills: buckets.skills,
    works: buckets.works,
    attributions: buckets.attributions,
    events: buckets.events,
    assessments: buckets.assessments,
    materialAssociations: buckets.materialAssociations,
    attributes: buckets.attributes,
    sourceIssues: buckets.sourceIssues,
    otherClaims: buckets.otherClaims,
    references: canonicalReferences(members),
    externalIds: {},
    media: [],
    localPeople: cluster.localPeople,
    retiredIds: cluster.retiredIds,
    curation: {
      status: notes.length > 0 ? 'needs-review' : 'machine-reviewed',
      notes,
    },
  };
}

export function unresolvedCandidateState(candidateDocument, localMap, keepSeparate) {
  const blocks = [];
  const localPeople = new Set();
  for (const block of candidateDocument.blocks) {
    const roots = new Map();
    for (const localId of block.localPeople) {
      const canonicalId = localMap.get(localId);
      if (!roots.has(canonicalId)) roots.set(canonicalId, []);
      roots.get(canonicalId).push(localId);
    }
    if (roots.size <= 1) continue;
    const groups = [...roots.values()];
    let blockUnresolved = false;
    for (let left = 0; left < groups.length; left += 1) {
      for (let right = left + 1; right < groups.length; right += 1) {
        const separated = groups[left].some((a) => groups[right].some((b) => keepSeparate.has([a, b].sort().join('\u0000'))));
        if (separated) continue;
        blockUnresolved = true;
        for (const localId of groups[left]) localPeople.add(localId);
        for (const localId of groups[right]) localPeople.add(localId);
      }
    }
    if (blockUnresolved) blocks.push(block);
  }
  return { blocks, localPeople };
}

export function compilePeopleCatalog(corpus, resolutionDocuments = [], curationOverrides = {}) {
  if (!corpus.coverage || !Number.isInteger(corpus.coverage.sourceChapters) ||
      !Number.isInteger(corpus.coverage.extractedChapters) || !Array.isArray(corpus.coverage.missingChapterIds)) {
    throw new Error('People corpus is missing authoritative chapter coverage metadata');
  }
  if (corpus.coverage.extractedChapters !== corpus.chapters.length ||
      corpus.coverage.sourceChapters !== corpus.coverage.extractedChapters + corpus.coverage.missingChapterIds.length) {
    throw new Error('People corpus chapter coverage metadata is internally inconsistent');
  }
  const candidateDocument = buildPeopleResolutionCandidateDocument(corpus);
  const resolved = resolvePeopleClusters(corpus.localPeople, resolutionDocuments);
  const currentPromptVersion = readJson(path.join(PEOPLE_DIR, 'config.json')).promptVersion;
  const localMap = new Map();
  for (const cluster of resolved.clusters) {
    for (const localId of cluster.localPeople) localMap.set(localId, cluster.canonicalPersonId);
  }
  const unresolvedState = unresolvedCandidateState(candidateDocument, localMap, resolved.keepSeparate);
  const unresolvedBlocks = unresolvedState.blocks;
  const unresolvedLocalPeople = unresolvedState.localPeople;
  const roleData = readJson(path.join(PEOPLE_DIR, 'curation', 'role-vocabulary.json'));
  const roleLabels = new Map(roleData.roles.map((role) => [role.id, role.label]));
  const canonicalByKnownId = new Map();
  for (const cluster of resolved.clusters) {
    canonicalByKnownId.set(cluster.canonicalPersonId, cluster.canonicalPersonId);
    for (const retiredId of cluster.retiredIds) {
      canonicalByKnownId.set(retiredId, cluster.canonicalPersonId);
    }
  }
  const resolvedCurationOverrides = {};
  const unknownOverrides = [];
  for (const [personId, override] of Object.entries(curationOverrides)) {
    const canonicalPersonId = canonicalByKnownId.get(personId);
    if (!canonicalPersonId) {
      unknownOverrides.push(personId);
      continue;
    }
    if (resolvedCurationOverrides[canonicalPersonId]) {
      throw new Error(`Multiple people curation entries resolve to ${canonicalPersonId}`);
    }
    resolvedCurationOverrides[canonicalPersonId] = override;
  }
  if (unknownOverrides.length) {
    throw new Error(`People curation contains unknown canonical IDs: ${unknownOverrides.join(', ')}`);
  }
  const people = resolved.clusters.map((cluster) =>
    canonicalRecord(
      cluster,
      corpus,
      localMap,
      roleLabels,
      unresolvedLocalPeople,
      currentPromptVersion,
      resolvedCurationOverrides[cluster.canonicalPersonId] ?? null,
    )
  );
  const peopleBySlug = new Map();
  for (const person of people) {
    const existing = peopleBySlug.get(person.slug);
    if (existing) throw new Error(`People ${existing} and ${person.id} share public slug ${person.slug}`);
    peopleBySlug.set(person.slug, person.id);
  }
  for (const person of people) {
    for (const relationship of person.familyRelationships) relationship.derivedInverse = false;
  }
  const familyEdges = buildCanonicalFamilyEdges(people);
  addInverseFamilyRelationships(people);
  attachFamilyEdgeIds(people, familyEdges);
  validateCanonicalFamilyGraph(people, familyEdges);

  const ajv = createPeopleSchemaValidator();
  const validate = ajv.getSchema(CANONICAL_SCHEMA_ID);
  const errors = [];
  for (const person of people) {
    if (!validate(person)) {
      errors.push(...formatSchemaErrors(validate.errors).map((item) => `${person.id}: ${item}`));
    }
  }
  if (errors.length > 0) throw new Error(`Canonical person validation failed:\n${errors.map((item) => `- ${item}`).join('\n')}`);

  const legacyLocalPeople = [...corpus.localPeople.values()].filter((person) => person.promptVersion < currentPromptVersion).length;
  const legacyChapters = corpus.chapters.filter(({ extraction }) =>
    extraction.run.promptVersion < currentPromptVersion
  ).length;
  const pendingTranslationRepairs = corpus.chapters.reduce((count, { extraction }) =>
    count + extraction.translationRepairs.filter((repair) => repair.status === 'proposed').length, 0);
  const missingChapterIds = [...corpus.coverage.missingChapterIds];
  const localPersonMap = Object.fromEntries([...localMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  const stats = {
    chapters: corpus.chapters.length,
    sourceChapters: corpus.coverage.sourceChapters,
    extractedChapters: corpus.coverage.extractedChapters,
    missingChapters: missingChapterIds.length,
    localPeople: corpus.localPeople.size,
    canonicalPeople: people.length,
    mergedLocalPeople: corpus.localPeople.size - people.length,
    legacyLocalPeople,
    legacyChapters,
    pendingTranslationRepairs,
    unresolvedCandidateBlocks: unresolvedBlocks.length,
    familyEdges: familyEdges.length,
    peopleWithFamily: people.filter((person) => person.familyRelationships.length > 0).length,
  };
  const catalog = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      complete: peopleCatalogIsComplete(stats),
      currentPromptVersion,
      stats,
      people,
      familyEdges,
      localPersonMap,
      unresolvedCandidateBlockIds: unresolvedBlocks.map((block) => block.id),
      missingChapterIds,
  };
  assertPeopleCatalogPublicationState(catalog);
  const validateCatalog = ajv.getSchema(CATALOG_SCHEMA_ID);
  if (!validateCatalog(catalog)) {
    throw new Error(
      `People catalog validation failed:\n${formatSchemaErrors(validateCatalog.errors).map((item) => `- ${item}`).join('\n')}`,
    );
  }
  return {
    catalog,
    candidates: candidateDocument,
    siteIndex: buildPeopleSiteIndex(corpus, catalog),
  };
}

function selfTest() {
  const makePerson = (id, en, zh) => ({
    localId: id,
    book: 'fixture',
    chapter: id.split(':')[1],
    promptVersion: 7,
    preferredNameSuggestion: { en, zh, pinyin: en },
    historicity: 'historical',
    descriptorSuggestion: 'Official',
    identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['AD 1'], polityHints: [] },
    claims: [
      { id: `${id}:c0001`, subject: id, predicate: 'name', value: { kind: 'personal', en, zh }, certainty: 'explicit', evidence: [`${id.split(':').slice(0, 2).join(':')}:s0001`] },
      { id: `${id}:c0002`, subject: id, predicate: 'role', value: { roleId: 'official' }, certainty: 'explicit', evidence: [`${id.split(':').slice(0, 2).join(':')}:s0001`] },
      { id: `${id}:c0003`, subject: id, predicate: 'attestation', value: { sourceDate: { text: 'first year' }, westernYear: { era: 'AD', year: 1, precision: 'year' } }, certainty: 'explicit', evidence: [`${id.split(':').slice(0, 2).join(':')}:s0001`] },
    ],
    mentions: [{
      id: `${id}:m0001`, person: id,
      unit: { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 },
      kind: 'personal-name', spans: { zh: [{ exact: zh }], en: [{ exact: en }] }, candidateRefs: [],
    }],
  });
  const left = makePerson('fixture:001:p001', 'Fan Ye', '范曄');
  const right = makePerson('fixture:002:p001', 'Fan Ye', '范曄');
  right.descriptorSuggestion = 'Historian and compiler of the Book of Later Han';
  const child = makePerson('fixture:003:p001', 'Fan Child', '范子');
  const emperorWu = makePerson('fixture:004:p001', 'Che', '徹');
  emperorWu.claims.push({
    id: 'fixture:004:c0004',
    subject: emperorWu.localId,
    predicate: 'name',
    value: { kind: 'personal-name', en: 'Liu Che', zh: '劉徹', pinyin: 'Liu Che' },
    certainty: 'explicit',
    evidence: ['fixture:004:s0001'],
  });
  emperorWu.claims.push({
    id: 'fixture:004:c0005',
    subject: emperorWu.localId,
    predicate: 'name',
    value: { kind: 'posthumous-name', en: 'Emperor Wu of Han', zh: '漢武帝', pinyin: 'Han Wudi' },
    certainty: 'explicit',
    evidence: ['fixture:004:s0001'],
  });
  const emperorOverride = {
    preferredName: {
      kind: 'posthumous-name',
      en: 'Emperor Wu of Han',
      zh: '漢武帝',
      pinyin: 'Hàn Wǔdì',
    },
    reason: 'Standard English name',
  };
  const curatedEmperorName = preferredName([emperorWu], emperorOverride);
  if (curatedEmperorName.en !== 'Emperor Wu of Han' || curatedEmperorName.zh !== '漢武帝') {
    throw new Error('A source-backed preferred-name override was not applied');
  }
  if (sourcePreferredNameSuggestion([emperorWu]).en !== 'Che') {
    throw new Error('An improved public identity changed an established person URL');
  }
  const caoCao1 = makePerson('fixture:009:p001', 'Cao Cao', '曹操');
  const caoCao2 = makePerson('fixture:010:p001', 'Cao Cao', '曹操');
  caoCao1.claims.push({
    id: 'fixture:009:c0004',
    subject: caoCao1.localId,
    predicate: 'name',
    value: { kind: 'posthumous-name', en: 'Emperor Wu of Wei', zh: '魏武帝', pinyin: 'Wei Wudi' },
    certainty: 'explicit',
    evidence: ['fixture:009:s0001'],
  });
  if (preferredName([caoCao1, caoCao2]).en !== 'Cao Cao') {
    throw new Error('A rarely used posthumous title displaced a commonly attested personal name');
  }
  const confucius = makePerson('fixture:005:p001', 'Confucius', '孔子');
  confucius.claims.push({
    id: 'fixture:005:c0004',
    subject: confucius.localId,
    predicate: 'name',
    value: { kind: 'personal-name', en: 'Kong Qiu', zh: '孔丘', pinyin: 'Kong Qiu' },
    certainty: 'explicit',
    evidence: ['fixture:005:s0001'],
  });
  if (preferredName([confucius]).en !== 'Confucius') {
    throw new Error('An unrelated alternate form replaced an established primary name');
  }
  left.claims.push({
    id: 'fixture:001:c0004',
    subject: left.localId,
    predicate: 'family-relationship',
    value: { relation: 'parent-of', personId: child.localId, parentage: 'biological' },
    certainty: 'explicit',
    evidence: ['fixture:001:s0001'],
  });
  const corpus = {
    chapters: ['001', '002', '003'].map((chapter) => ({
      extraction: {
        book: 'fixture',
        chapter,
        run: { promptVersion: 7 },
        mentions: [],
        translationRepairs: [],
      },
    })),
    localPeople: new Map([[left.localId, left], [right.localId, right], [child.localId, child]]),
    coverage: { sourceChapters: 3, extractedChapters: 3, missingChapterIds: [] },
  };
  const resolution = [{
    schemaVersion: 1,
    batch: 'fixture',
    decisions: [{
      decision: 'merge', localPeople: [left.localId, right.localId], basis: ['fixture'], confidence: 'high',
    }],
  }];
  const result = compilePeopleCatalog(corpus, resolution).catalog;
  const fan = result.people.find((person) => person.preferredName.en === 'Fan Ye');
  const compiledChild = result.people.find((person) => person.preferredName.en === 'Fan Child');
  if (result.people.length !== 2 || fan.references.length !== 2) {
    throw new Error('Canonical merge or reference aggregation failed');
  }
  if (fan.description.en !== 'Historian and compiler of the Book of Later Han') {
    throw new Error('Specific canonical description did not outrank a generic role label');
  }
  if (!compiledChild.familyRelationships.some((claim) =>
    claim.value.relation === 'child-of' && claim.value.personId === fan.id && claim.edgeId && claim.derivedInverse
  )) {
    throw new Error('Inverse canonical family relationship was not materialized');
  }
  const familyEdge = result.familyEdges[0];
  if (result.familyEdges.length !== 1 || familyEdge.relation !== 'parent-of' ||
      familyEdge.fromPersonId !== fan.id || familyEdge.toPersonId !== compiledChild.id ||
      familyEdge.assertions.length !== 1) {
    throw new Error('Canonical family graph edge was not compiled correctly');
  }
  if (!fan.familyRelationships.some((claim) => claim.edgeId === familyEdge.id && !claim.derivedInverse) ||
      !compiledChild.familyRelationships.some((claim) => claim.edgeId === familyEdge.id)) {
    throw new Error('Canonical family edge is not shared by both reciprocal adjacencies');
  }
  const resolvedHomonym = makePerson('fixture:011:p001', 'Shared Title', '同名');
  const ambiguousHomonymA = makePerson('fixture:012:p001', 'Shared Title', '同名');
  const ambiguousHomonymB = makePerson('fixture:013:p001', 'Shared Title', '同名');
  const homonymCorpus = {
    chapters: ['011', '012', '013'].map((chapter) => ({
      extraction: {
        book: 'fixture', chapter, run: { promptVersion: 7 }, mentions: [], translationRepairs: [],
      },
    })),
    localPeople: new Map([
      [resolvedHomonym.localId, resolvedHomonym],
      [ambiguousHomonymA.localId, ambiguousHomonymA],
      [ambiguousHomonymB.localId, ambiguousHomonymB],
    ]),
    coverage: { sourceChapters: 3, extractedChapters: 3, missingChapterIds: [] },
  };
  const homonymResolution = [{
    schemaVersion: 1,
    batch: 'homonym-fixture',
    authority: 'curated',
    decisions: [ambiguousHomonymA, ambiguousHomonymB].map((other) => ({
      decision: 'keep-separate',
      localPeople: [resolvedHomonym.localId, other.localId],
      basis: ['fixture'],
      confidence: 'high',
    })),
  }];
  const homonymCatalog = compilePeopleCatalog(homonymCorpus, homonymResolution).catalog;
  const resolvedPage = homonymCatalog.people.find((person) => person.localPeople.includes(resolvedHomonym.localId));
  const ambiguousPages = homonymCatalog.people.filter((person) =>
    person.localPeople.includes(ambiguousHomonymA.localId) ||
    person.localPeople.includes(ambiguousHomonymB.localId)
  );
  if (resolvedPage.curation.status !== 'machine-reviewed' ||
      ambiguousPages.some((person) => person.curation.status !== 'needs-review')) {
    throw new Error('An unresolved pair contaminated a separately resolved participant in the same candidate block');
  }
  if (!/^per_[0-9A-HJKMNP-TV-Z]{20}$/u.test(fan.id)) throw new Error('Stable canonical ID is invalid');
  const retiredOverrideResult = compilePeopleCatalog(corpus, resolution, {
    [fan.retiredIds[0]]: {
      preferredName: {
        kind: 'personal', en: 'Fan Ye', zh: '范曄', pinyin: 'Fàn Yè',
      },
      preferredDescription: 'Later Han historian',
      preferredSlug: 'fan-ye-stable',
      reason: 'Retired-ID fixture',
    },
  }).catalog;
  const curatedFan = retiredOverrideResult.people.find((person) => person.id === fan.id);
  if (curatedFan.preferredName.pinyin !== 'Fàn Yè' || curatedFan.description.en !== 'Later Han historian' ||
      curatedFan.slug !== 'fan-ye-stable') {
    throw new Error('Curation keyed by a retired canonical ID did not follow the surviving cluster');
  }
  if (!result.complete) throw new Error('Fully covered fixture catalog was not marked complete');
  const incompleteCorpus = structuredClone(corpus);
  incompleteCorpus.coverage = { sourceChapters: 4, extractedChapters: 3, missingChapterIds: ['fixture:004'] };
  const incomplete = compilePeopleCatalog(incompleteCorpus, resolution).catalog;
  if (incomplete.complete || incomplete.stats.missingChapters !== 1 ||
      incomplete.missingChapterIds[0] !== 'fixture:004') {
    throw new Error('Missing chapter coverage did not keep the catalog gated');
  }
  const pendingRepairCorpus = structuredClone(corpus);
  pendingRepairCorpus.chapters[0].extraction.translationRepairs.push({ status: 'proposed' });
  const pendingRepair = compilePeopleCatalog(pendingRepairCorpus, resolution).catalog;
  if (pendingRepair.complete || pendingRepair.stats.pendingTranslationRepairs !== 1) {
    throw new Error('Pending translation repair did not keep the catalog gated');
  }
  const contradictory = structuredClone(incomplete);
  contradictory.complete = true;
  try {
    assertPeopleCatalogPublicationState(contradictory);
    throw new Error('Contradictory publication state unexpectedly passed');
  } catch (error) {
    if (!String(error.message).includes('contradicts')) throw error;
  }
  console.log('compile-people-catalog self-test: ok');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.selfTest) return selfTest();
  const corpus = loadValidatedPeopleCorpus();
  const resolutions = loadValidatedResolutionDocuments(corpus.localPeople);
  const curation = readJson(path.join(PEOPLE_DIR, 'curation', 'overrides.json'));
  if (curation.schemaVersion !== 1 || !curation.people || Array.isArray(curation.people) ||
      typeof curation.people !== 'object') {
    throw new Error('People curation overrides must contain schemaVersion 1 and a people object');
  }
  for (const [personId, override] of Object.entries(curation.people)) {
    const name = override?.preferredName;
    const description = override?.preferredDescription;
    const preferredSlug = override?.preferredSlug;
    const keys = Object.keys(override ?? {});
    const validName = !name || (typeof name.kind === 'string' &&
      [name.en, name.zh, name.pinyin].some((value) => typeof value === 'string' && value.trim()));
    const validDescription = description === undefined ||
      (typeof description === 'string' && description.trim() && description.length <= 200);
    const validSlug = preferredSlug === undefined ||
      (typeof preferredSlug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(preferredSlug));
    if (!/^per_[0-9A-HJKMNP-TV-Z]{20}$/u.test(personId) ||
        (!name && description === undefined && preferredSlug === undefined) ||
        !validName || !validDescription || !validSlug ||
        keys.some((key) => !['preferredName', 'preferredDescription', 'preferredSlug', 'reason'].includes(key)) ||
        typeof override.reason !== 'string' || !override.reason.trim()) {
      throw new Error(`Invalid people curation override for ${personId}`);
    }
  }
  const result = compilePeopleCatalog(corpus, resolutions, curation.people);
  writeJsonAtomic(options.out, result.catalog);
  writeJsonAtomic(options.candidatesOut, result.candidates);
  writeJsonAtomic(options.siteIndexOut, result.siteIndex);
  if (options.requireResolved && !result.catalog.complete) {
    throw new Error(
      `People catalog is incomplete: ${result.catalog.stats.legacyLocalPeople} legacy local people and ` +
      `${result.catalog.stats.legacyChapters} legacy chapter(s), ` +
      `${result.catalog.stats.missingChapters} missing chapter(s), ` +
      `${result.catalog.stats.pendingTranslationRepairs} pending translation repair(s), and ` +
      `${result.catalog.stats.unresolvedCandidateBlocks} unresolved identity block(s)`,
    );
  }
  console.log(
    `people catalog: ${result.catalog.stats.canonicalPeople} canonical from ` +
    `${result.catalog.stats.localPeople} local people; ${result.catalog.stats.unresolvedCandidateBlocks} ` +
    `unresolved block(s); ${result.catalog.stats.familyEdges} family edge(s) -> ` +
    `${path.relative(REPO_ROOT, options.out)}`,
  );
}

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
