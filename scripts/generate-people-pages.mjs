#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  chapterPath,
  chineseText,
  englishText,
  readJson,
  REPO_ROOT,
  sourceUnitAt,
  writeJsonAtomic,
  writeTextAtomic,
} from './lib/people-content.mjs';
import { loadPeopleSiteContext } from './lib/people-site.mjs';
import {
  PERSON_PAGE_SHARD_COUNT,
  personPageShardName,
} from '../functions/lib/people-shards.js';
import {
  formatPersonWesternYear,
  humanizePeopleValue,
  personAlternateNames,
  personDisplayName,
  personFullDisplayName,
  personLifeSummary,
  representativePersonYear,
} from './lib/people-presentation.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const SITE_URL = (process.env.SITE_URL || 'https://24histories.com').replace(/\/$/u, '');
const SEARCH_PART_MAX_BYTES = 6 * 1024 * 1024;
const FEATURED_PEOPLE_COUNT = 12;
const FAMILY_TREE_MAX_PEOPLE = 36;
const PEOPLE_ASSET_VERSION = '20260814-people-publication-v2';
const PEOPLE_FAMILY_SOURCE = path.join(REPO_ROOT, 'scripts', 'assets', 'people-family.js');
const FAMILY_CHART_PACKAGE = path.join(REPO_ROOT, 'node_modules', 'family-chart', 'dist');
const D3_PACKAGE = path.join(REPO_ROOT, 'node_modules', 'd3', 'dist', 'd3.min.js');
const periodCache = new WeakMap();
const referenceStatsCache = new WeakMap();
const lifeSummaryCache = new WeakMap();

const HISTORICAL_PERIODS = [
  { slug: 'ancient-china', label: 'Ancient China', shortLabel: 'Before 221 BC', start: -10_000, end: -222 },
  { slug: 'qin-han', label: 'Qin and Han', shortLabel: '221 BC-AD 220', start: -221, end: 220 },
  { slug: 'three-kingdoms-six-dynasties', label: 'Three Kingdoms and Six Dynasties', shortLabel: 'AD 221-589', start: 221, end: 589 },
  { slug: 'sui-tang', label: 'Sui and Tang', shortLabel: 'AD 590-907', start: 590, end: 907 },
  { slug: 'five-dynasties', label: 'Five Dynasties', shortLabel: 'AD 908-960', start: 908, end: 960 },
  { slug: 'song-liao-jin', label: 'Song, Liao, and Jin', shortLabel: 'AD 961-1279', start: 961, end: 1279 },
  { slug: 'yuan', label: 'Yuan', shortLabel: 'AD 1280-1368', start: 1280, end: 1368 },
  { slug: 'ming', label: 'Ming', shortLabel: 'AD 1369-1644', start: 1369, end: 1644 },
  { slug: 'qing', label: 'Qing', shortLabel: 'AD 1645-1912', start: 1645, end: 1912 },
  { slug: 'uncertain', label: 'Dates uncertain', shortLabel: 'Unplaced in time', start: null, end: null },
];

const DIRECTORY_KEYS = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => ({ slug: letter.toLocaleLowerCase('en'), label: letter })),
  { slug: 'other', label: '#' },
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(String(value ?? '').replace(/\s+/gu, ' ').trim());
}

function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '') || 'other';
}

function periodForPerson(person) {
  if (periodCache.has(person)) return periodCache.get(person);
  let period;
  if (person.historicity === 'legendary') period = HISTORICAL_PERIODS[0];
  else if (person.historicity === 'literary') period = HISTORICAL_PERIODS.at(-1);
  else {
    const year = representativePersonYear(person);
    period = year === null
      ? HISTORICAL_PERIODS.at(-1)
      : HISTORICAL_PERIODS.find((item) => item.start !== null && year >= item.start && year <= item.end)
        ?? HISTORICAL_PERIODS.at(-1);
  }
  periodCache.set(person, period);
  return period;
}

function personReferenceStats(person) {
  if (referenceStatsCache.has(person)) return referenceStatsCache.get(person);
  const chapters = new Set(person.references.map((reference) => `${reference.book}:${reference.chapter}`));
  const books = new Set(person.references.map((reference) => reference.book));
  const stats = { passages: person.references.length, chapters: chapters.size, books: books.size };
  referenceStatsCache.set(person, stats);
  return stats;
}

function lifeSummaryForPerson(person) {
  if (!lifeSummaryCache.has(person)) lifeSummaryCache.set(person, personLifeSummary(person));
  return lifeSummaryCache.get(person);
}

function personDirectoryKey(person) {
  const first = personDisplayName(person).trim().charAt(0).toLocaleUpperCase('en');
  return /^[A-Z]$/u.test(first) ? first.toLocaleLowerCase('en') : 'other';
}

function plural(count, singular, pluralForm = `${singular}s`) {
  return `${count.toLocaleString('en-US')} ${count === 1 ? singular : pluralForm}`;
}

function naturalJoin(values) {
  if (values.length <= 1) return values[0] ?? '';
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
}

function withIndefiniteArticle(value) {
  return `${/^[aeiou]/iu.test(value) ? 'an' : 'a'} ${value}`;
}

function parseArgs(argv) {
  const options = {
    outputRoot: path.join(REPO_ROOT, 'public'),
    person: null,
    limit: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value) throw new Error(`${arg} requires a value`);
      return value;
    };
    if (arg === '--output-root') options.outputRoot = path.resolve(REPO_ROOT, next());
    else if (arg === '--person') options.person = next();
    else if (arg === '--limit') {
      options.limit = Number.parseInt(next(), 10);
      if (!Number.isInteger(options.limit) || options.limit < 1) throw new Error('--limit must be a positive integer');
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/generate-people-pages.mjs [options]

Options:
  --output-root PATH  Output root (default public/).
  --person ID_OR_SLUG Generate one person page, plus index and search data.
  --limit N           Generate the first N people for preview testing.`);
      process.exit(0);
    } else throw new Error(`Unknown option ${arg}`);
  }
  return options;
}

function cleanOwnedOutput(outputRoot) {
  fs.rmSync(path.join(outputRoot, 'people'), { recursive: true, force: true });
  fs.rmSync(path.join(outputRoot, 'data', 'people'), { recursive: true, force: true });
  fs.rmSync(path.join(outputRoot, 'vendor', 'family-chart'), { recursive: true, force: true });
  fs.rmSync(path.join(outputRoot, 'people-family.js'), { force: true });
}

function copyPeopleAssets(outputRoot) {
  const vendorDir = path.join(outputRoot, 'vendor', 'family-chart');
  fs.mkdirSync(vendorDir, { recursive: true });
  const assets = [
    [PEOPLE_FAMILY_SOURCE, path.join(outputRoot, 'people-family.js')],
    [D3_PACKAGE, path.join(vendorDir, 'd3.min.js')],
    [path.join(FAMILY_CHART_PACKAGE, 'family-chart.min.js'), path.join(vendorDir, 'family-chart.min.js')],
    [path.join(FAMILY_CHART_PACKAGE, 'styles', 'family-chart.css'), path.join(vendorDir, 'family-chart.css')],
  ];
  for (const [source, destination] of assets) {
    if (!fs.existsSync(source)) throw new Error(`Missing people-site asset ${path.relative(REPO_ROOT, source)}`);
    fs.copyFileSync(source, destination);
  }
}

function flattenText(value, found = []) {
  if (value === null || value === undefined) return found;
  if (typeof value === 'string' || typeof value === 'number') found.push(String(value));
  else if (Array.isArray(value)) value.forEach((item) => flattenText(item, found));
  else if (typeof value === 'object') Object.values(value).forEach((item) => flattenText(item, found));
  return found;
}

function chapterHrefFromEvidence(evidence, language = 'en') {
  const match = String(evidence).match(/^([a-z0-9_-]+):(\d{3}):(.+)$/u);
  if (!match) return null;
  return `../${match[1]}/${match[2]}.html#${language}-${match[3]}`;
}

function renderPersonRef(personId, peopleById) {
  const target = peopleById.get(personId);
  if (!target) return `<code>${escapeHtml(personId)}</code>`;
  return `<a href="${escapeAttribute(target.slug)}.html">${escapeHtml(personFullDisplayName(target))}</a>`;
}

function renderStructuredValue(value, peopleById, key = null) {
  if (value === null || value === undefined || value === '') return '<span class="person-fact-empty">Unknown</span>';
  if (typeof value === 'string') {
    if (/^per_[0-9A-HJKMNP-TV-Z]{20,}$/u.test(value)) return renderPersonRef(value, peopleById);
    return escapeHtml(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return escapeHtml(String(value));
  if (Array.isArray(value)) {
    return value.map((item) => renderStructuredValue(item, peopleById, key)).join(', ');
  }
  const western = formatPersonWesternYear(value);
  if (western) return escapeHtml(western);
  if (value.en || value.zh || value.pinyin) {
    const bits = [value.en, value.zh, value.pinyin].filter(Boolean);
    const unique = [...new Set(bits)];
    return unique.map(escapeHtml).join(' / ');
  }
  return Object.entries(value).map(([field, item]) =>
    `<span class="person-fact-field"><span class="person-fact-key">${escapeHtml(humanizePeopleValue(field))}:</span> ` +
    `${renderStructuredValue(item, peopleById, field)}</span>`
  ).join(' · ');
}

function renderClaimList(claims, peopleById) {
  if (!claims?.length) return '';
  return `<ul class="person-fact-list">${claims.map((claim) => {
    const evidence = (claim.evidence ?? []).map((item) => {
      const href = chapterHrefFromEvidence(item);
      return href ? `<a href="${escapeAttribute(href)}">${escapeHtml(item)}</a>` : escapeHtml(item);
    }).join(', ');
    return `<li><div>${renderStructuredValue(claim.value, peopleById)}</div>` +
      `<div class="person-fact-source">${escapeHtml(humanizePeopleValue(claim.certainty))}${evidence ? ` · ${evidence}` : ''}</div></li>`;
  }).join('')}</ul>`;
}

function section(title, body, className = '', id = slugify(title)) {
  if (!body) return '';
  return `<section id="${escapeAttribute(id)}" class="person-section ${escapeAttribute(className)}"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function renderNames(person) {
  const rows = person.names.map((name) => `<tr>
    <th>${escapeHtml(humanizePeopleValue(name.kind || 'name'))}</th>
    <td>${escapeHtml(name.en || '')}</td>
    <td lang="zh-Hant">${escapeHtml(name.zh || '')}</td>
    <td>${escapeHtml(name.pinyin || '')}</td>
  </tr>`).join('');
  return rows ? `<div class="person-table-wrap"><table class="person-table"><thead><tr><th>Type</th><th>English</th><th>Chinese</th><th>Pinyin</th></tr></thead><tbody>${rows}</tbody></table></div>` : '';
}

function renderRoles(person) {
  if (!person.roles.length) return '';
  return `<ul class="person-role-list">${person.roles.map((role) => `<li>${escapeHtml(role.label)}</li>`).join('')}</ul>`;
}

function renderIdentity(person, peopleById) {
  const rows = [
    ['Historicity', humanizePeopleValue(person.historicity)],
    ['Identification', humanizePeopleValue(person.identificationStatus)],
    ['Sex', person.sex ? humanizePeopleValue(person.sex) : 'Uncertain'],
  ];
  return `<dl class="person-identity-list">${rows.map(([term, value]) =>
    `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd></div>`
  ).join('')}</dl>${renderClaimList(person.sexClaims, peopleById)}`;
}

function renderExternalData(person, peopleById) {
  const identifiers = Object.keys(person.externalIds ?? {}).length
    ? `<h3>Identifiers</h3>${renderStructuredValue(person.externalIds, peopleById)}`
    : '';
  const media = person.media?.length
    ? `<h3>Media</h3>${renderStructuredValue(person.media, peopleById)}`
    : '';
  return `${identifiers}${media}`;
}

function uniqueFamilyRelationships(person) {
  const found = new Map();
  for (const claim of person.familyRelationships) {
    const key = `${claim.value.relation}:${claim.value.personId}`;
    if (!found.has(key)) found.set(key, claim);
  }
  return [...found.values()];
}

function familyTreeData(person, peopleById) {
  const chartRelations = new Set(['parent-of', 'child-of', 'spouse-of']);
  const directRelationships = uniqueFamilyRelationships(person)
    .filter((claim) => chartRelations.has(claim.value.relation) && peopleById.has(claim.value.personId))
    .sort((left, right) => {
      const leftPerson = peopleById.get(left.value.personId);
      const rightPerson = peopleById.get(right.value.personId);
      return personReferenceStats(rightPerson).passages - personReferenceStats(leftPerson).passages ||
        personDisplayName(leftPerson).localeCompare(personDisplayName(rightPerson), 'en');
    })
    .slice(0, FAMILY_TREE_MAX_PEOPLE - 1);
  if (!directRelationships.length) return [];

  const selected = new Map([[person.id, person]]);
  for (const relationship of directRelationships) {
    selected.set(relationship.value.personId, peopleById.get(relationship.value.personId));
  }
  const records = new Map([...selected.values()].map((relative) => [relative.id, {
    id: relative.id,
    data: {
      gender: relative.sex === 'male' ? 'M' : relative.sex === 'female' ? 'F' : 'U',
      name: personDisplayName(relative),
      zh: relative.preferredName.zh ?? '',
      life: lifeSummaryForPerson(relative),
      role: relative.description.en,
      href: `${relative.slug}.html`,
      current: relative.id === person.id,
    },
    rels: { parents: [], spouses: [], children: [] },
  }]));
  const add = (record, key, id) => {
    if (!record.rels[key].includes(id)) record.rels[key].push(id);
  };
  for (const relationship of directRelationships) {
    const root = records.get(person.id);
    const relative = records.get(relationship.value.personId);
    if (relationship.value.relation === 'parent-of') {
      add(root, 'children', relative.id);
      add(relative, 'parents', root.id);
    } else if (relationship.value.relation === 'child-of') {
      add(root, 'parents', relative.id);
      add(relative, 'children', root.id);
    } else {
      add(root, 'spouses', relative.id);
      add(relative, 'spouses', root.id);
    }
  }
  return [records.get(person.id), ...[...records.values()].filter((record) => record.id !== person.id)];
}

function renderFamily(person, peopleById, familyEdgesById, treeData) {
  if (!person.familyRelationships.length && !person.familySummaries.length) return '';
  const relationships = uniqueFamilyRelationships(person).map((claim) => {
    const target = peopleById.get(claim.value.personId);
    if (!target) throw new Error(`${person.id} family relationship targets missing person ${claim.value.personId}`);
    const edge = familyEdgesById.get(claim.edgeId);
    if (!edge) throw new Error(`${person.id} family relationship targets missing edge ${claim.edgeId}`);
    const assertions = edge.assertions.map((assertion) => renderStructuredValue(assertion.details, peopleById)).filter(Boolean);
    return `<li><span class="person-family-relation">${escapeHtml(humanizePeopleValue(claim.value.relation))}</span> ` +
      `<a href="${escapeAttribute(target.slug)}.html">${escapeHtml(personFullDisplayName(target))}</a>` +
      `${assertions.length ? `<div class="person-family-details">${assertions.join('<br>')}</div>` : ''}</li>`;
  }).join('');
  const summaries = renderClaimList(person.familySummaries, peopleById);
  const chart = treeData.length > 1 ? `<div class="person-family-tree-shell">
    <div id="person-family-chart" class="f3 person-family-chart" aria-label="Interactive family tree for ${escapeAttribute(personDisplayName(person))}"></div>
    <p class="person-family-tree-note">Immediate source-linked family. Drag to pan, scroll or pinch to zoom, and select a person to open their record.</p>
    <script id="person-family-data" type="application/json">${JSON.stringify(treeData).replace(/</gu, '\\u003c')}</script>
  </div>` : '';
  return `${chart}${relationships ? `<ul class="person-family-list">${relationships}</ul>` : ''}${summaries}`;
}

const CLAIM_SECTIONS = [
  ['Origins and identity', ['ethnicities', 'lineages']],
  ['Career and standing', ['occupations', 'offices', 'titlesAndHonors', 'statuses', 'legalActions', 'rulershipEvents']],
  ['Places and affiliations', ['polityAssociations', 'placeAssociations', 'organizationAssociations']],
  ['Learning and skills', ['education', 'credentials', 'beliefs', 'skills']],
  ['Works and attributed material', ['works', 'attributions']],
  ['Events and relationships', ['events', 'relationships']],
  ['Assessments and attributes', ['assessments', 'attributes', 'materialAssociations']],
  ['Source notes', ['sourceIssues', 'otherClaims']],
];

const chapterCache = new Map();

function chapterRecord(book, chapter) {
  const key = `${book}:${chapter}`;
  if (chapterCache.has(key)) return chapterCache.get(key);
  const data = readJson(chapterPath(book, chapter));
  const record = {
    data,
    label: data.meta?.title?.en || data.meta?.title?.zh || `Chapter ${Number.parseInt(chapter, 10)}`,
    bookLabel: data.meta?.bookInfo?.name || data.meta?.bookInfo?.chinese || book,
  };
  chapterCache.set(key, record);
  return record;
}

function sourceLabel(book, people = []) {
  const reference = people.flatMap((person) => person.references).find((item) => item.book === book);
  if (!reference) return book;
  const record = chapterRecord(book, reference.chapter);
  return record.bookLabel || book;
}

function sourceChineseLabel(book, people = []) {
  const reference = people.flatMap((person) => person.references).find((item) => item.book === book);
  if (!reference) return '';
  const data = chapterRecord(book, reference.chapter).data;
  return data.meta?.bookInfo?.chinese || data.meta?.bookInfo?.nameZh || '';
}

function visibleTableText(value) {
  return String(value ?? '').replace(/^((?:(?:rowspan|colspan|valign|align|style|class)\s*=\s*"[^"]*"\s*)+)\|\s*/iu, '');
}

function renderReferences(person) {
  if (!person.references.length) return '';
  const groups = new Map();
  for (const reference of person.references) {
    const key = `${reference.book}:${reference.chapter}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(reference);
  }
  return [...groups.entries()].map(([key, references], groupIndex) => {
    const [book, chapter] = key.split(':');
    const chapterInfo = chapterRecord(book, chapter);
    const snippets = references.map((reference) => {
      const unit = sourceUnitAt(chapterInfo.data, {
        id: reference.unitId,
        kind: reference.unitKind,
        blockIndex: reference.blockIndex,
        collection: reference.collection,
        itemIndex: reference.itemIndex,
      });
      const zh = visibleTableText(chineseText(unit));
      const en = visibleTableText(englishText(unit));
      const chapterBase = `../${book}/${chapter}.html`;
      return `<article class="person-reference">
        ${zh ? `<a class="person-reference-zh" lang="zh-Hant" href="${chapterBase}#zh-${escapeAttribute(reference.unitId)}">${escapeHtml(zh)}</a>` : ''}
        ${en ? `<a class="person-reference-en" href="${chapterBase}#en-${escapeAttribute(reference.unitId)}">${escapeHtml(en)}</a>` : ''}
      </article>`;
    }).join('');
    const chapterBase = `../${book}/${chapter}.html`;
    return `<details class="person-reference-group"${groupIndex === 0 ? ' open' : ''}>
      <summary><span>${escapeHtml(chapterInfo.bookLabel)}, Chapter ${Number.parseInt(chapter, 10)}</span>` +
      `<span>${escapeHtml(chapterInfo.label)} · ${references.length} passage${references.length === 1 ? '' : 's'}</span></summary>
      <div class="person-reference-actions"><a href="${chapterBase}">Open chapter</a></div>
      <div class="person-reference-list">${snippets}</div>
    </details>`;
  }).join('');
}

function personJsonLd(person) {
  const personUrl = `${SITE_URL}/people/${person.slug}.html`;
  const roles = person.roles.map((role) => role.label).filter(Boolean);
  const sameAs = Object.values(person.externalIds ?? {}).flatMap((value) => {
    if (typeof value === 'string' && /^https?:\/\//u.test(value)) return [value];
    if (Array.isArray(value)) return value.filter((item) => typeof item === 'string' && /^https?:\/\//u.test(item));
    return [];
  });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${personUrl}#page`,
        url: personUrl,
        name: `${personFullDisplayName(person)} | 24 Histories`,
        mainEntity: { '@id': `${personUrl}#person` },
        isPartOf: { '@id': `${SITE_URL}/people/#collection` },
      },
      {
        '@type': 'Person',
        '@id': `${personUrl}#person`,
        name: personDisplayName(person),
        alternateName: personAlternateNames(person),
        description: `${person.description.en}. ${lifeSummaryForPerson(person)}. ${plural(person.references.length, 'source passage')}.`,
        url: personUrl,
        mainEntityOfPage: { '@id': `${personUrl}#page` },
        ...(person.sex && ['male', 'female'].includes(person.sex) ? { gender: humanizePeopleValue(person.sex) } : {}),
        ...(roles.length ? { hasOccupation: roles.map((name) => ({ '@type': 'Occupation', name })) } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      breadcrumbJsonLd([
        ['24 Histories', '/'],
        ['People', '/people/'],
        [personDisplayName(person), `/people/${person.slug}.html`],
      ]),
    ],
  };
}

function breadcrumbJsonLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${SITE_URL}${url}`,
    })),
  };
}

function collectionJsonLd({ name, description, canonicalPath, people = [] }) {
  const url = `${SITE_URL}${canonicalPath}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        name,
        description,
        isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: '24 Histories', url: `${SITE_URL}/` },
        ...(canonicalPath === '/people/' ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/people/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        } : {}),
        ...(people.length ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: people.slice(0, 24).map((person, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${SITE_URL}/people/${person.slug}.html`,
              name: personDisplayName(person),
            })),
          },
        } : {}),
      },
      breadcrumbJsonLd(canonicalPath === '/people/'
        ? [['24 Histories', '/'], ['People', '/people/']]
        : [['24 Histories', '/'], ['People', '/people/'], [name, canonicalPath]]),
    ],
  };
}

function pageFooter(prefix = '../') {
  return `<footer><p><a href="${prefix}index.html">Home</a> | <a href="${prefix}people/index.html">People</a> | ` +
    `<a href="${prefix}about.html">About</a> | <a href="${prefix}progress.html">Progress</a> | ` +
    `<a href="${prefix}privacy.html">Privacy Policy</a></p>` +
    `<p class="site-copyright">English translations © 2026 Garrett M. Petersen. The original Chinese texts are in the public domain.</p></footer>`;
}

function pageHead({ title, description, canonicalPath, preview, jsonLd = null, assetPrefix = '../', ogType = 'website', extraHead = '' }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttribute(description)}">
  ${preview ? '<meta name="robots" content="noindex,nofollow">' : ''}
  <link rel="canonical" href="${escapeAttribute(canonical)}">
  <link rel="icon" type="image/x-icon" href="${assetPrefix}favicon.ico">
  <link rel="stylesheet" href="${assetPrefix}styles.css?v=${PEOPLE_ASSET_VERSION}">
  <meta property="og:type" content="${escapeAttribute(ogType)}">
  <meta property="og:title" content="${escapeAttribute(title)}">
  <meta property="og:description" content="${escapeAttribute(description)}">
  <meta property="og:url" content="${escapeAttribute(canonical)}">
  <meta property="og:image" content="${SITE_URL}/og/site.png">
  <meta name="twitter:card" content="summary_large_image">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</gu, '\\u003c')}</script>` : ''}
  ${extraHead}`;
}

function renderBreadcrumbs(items) {
  return `<nav class="people-breadcrumbs" aria-label="Breadcrumb"><ol>${items.map(([label, href], index) =>
    `<li>${index === items.length - 1 ? `<span aria-current="page">${escapeHtml(label)}</span>` : `<a href="${escapeAttribute(href)}">${escapeHtml(label)}</a>`}</li>`
  ).join('')}</ol></nav>`;
}

function renderPersonCard(person, hrefPrefix = '') {
  const stats = personReferenceStats(person);
  const period = periodForPerson(person);
  return `<li class="people-card">
    <a href="${escapeAttribute(hrefPrefix)}${escapeAttribute(person.slug)}.html">
      <span class="people-card-name">${escapeHtml(personDisplayName(person))}</span>
      ${person.preferredName.zh ? `<span class="people-card-zh" lang="zh-Hant">${escapeHtml(person.preferredName.zh)}</span>` : ''}
      <span class="people-card-life">${escapeHtml(lifeSummaryForPerson(person))}</span>
      <span class="people-card-description">${escapeHtml(person.description.en)}</span>
      <span class="people-card-meta">${escapeHtml(period.label)} · ${plural(stats.passages, 'passage')}</span>
    </a>
  </li>`;
}

function personOverview(person) {
  const stats = personReferenceStats(person);
  const roles = person.roles.map((role) => role.label).filter(Boolean);
  const selectedRoles = (roles.length ? roles.slice(0, 4) : [person.description.en]).map((role) => role.toLocaleLowerCase('en'));
  const roleText = naturalJoin([withIndefiniteArticle(selectedRoles[0]), ...selectedRoles.slice(1)]);
  return `<p class="person-lede">The translated histories identify ${escapeHtml(personDisplayName(person))} as ${escapeHtml(roleText)}. ` +
    `This record brings together ${plural(stats.passages, 'passage')} from ${plural(stats.chapters, 'chapter')} ` +
    `across ${plural(stats.books, 'history', 'histories')}, with names, dates, relationships, offices, and events preserved as source-backed claims.</p>`;
}

function renderPersonFacets(person) {
  const period = periodForPerson(person);
  const roles = person.roles.slice(0, 6).map((role) =>
    `<a href="index.html?role=${encodeURIComponent(role.roleId)}#find-a-person">${escapeHtml(role.label)}</a>`
  );
  const books = [...new Set(person.references.map((reference) => reference.book))].slice(0, 6).map((book) =>
    `<a href="index.html?source=${encodeURIComponent(book)}#find-a-person">${escapeHtml(sourceLabel(book, [person]))}</a>`
  );
  return `<div class="person-facets">
    <div><span>Period</span><a href="index.html?period=${encodeURIComponent(period.slug)}#find-a-person">${escapeHtml(period.label)}</a></div>
    ${roles.length ? `<div><span>Roles</span><span class="person-facet-links">${roles.join('')}</span></div>` : ''}
    ${books.length ? `<div><span>Found in</span><span class="person-facet-links">${books.join('')}</span></div>` : ''}
  </div>`;
}

function renderPersonLocalNav(items) {
  return `<nav class="person-local-nav" aria-label="On this page">
    <p>On this page</p>
    <ol>${items.map(([id, label]) => `<li><a href="#${escapeAttribute(id)}">${escapeHtml(label)}</a></li>`).join('')}</ol>
  </nav>`;
}

function generatePersonHtml(person, context) {
  const title = `${personFullDisplayName(person)} | 24 Histories`;
  const chronology = lifeSummaryForPerson(person);
  const stats = personReferenceStats(person);
  const description = `${personFullDisplayName(person)} — ${person.description.en}. ${chronology}; ${stats.passages} cited passages across the Chinese histories.`;
  const lifeBody = [
    person.life.birth.length ? `<h3>Birth</h3>${renderClaimList(person.life.birth, context.peopleById)}` : '',
    person.life.death.length ? `<h3>Death</h3>${renderClaimList(person.life.death, context.peopleById)}` : '',
    person.life.ageClaims.length ? `<h3>Age</h3>${renderClaimList(person.life.ageClaims, context.peopleById)}` : '',
    person.life.attestedActivity.length ? `<h3>Attested activity</h3>${renderClaimList(person.life.attestedActivity, context.peopleById)}` : '',
  ].join('');
  const contentSections = [];
  const treeData = familyTreeData(person, context.peopleById);
  const addSection = (label, body, className = '', id = slugify(label)) => {
    if (body) contentSections.push({ label, id, html: section(label, body, className, id) });
  };
  addSection('Overview', `${personOverview(person)}${renderPersonFacets(person)}`, 'person-overview-section');
  addSection('Names', renderNames(person));
  addSection('Identity', renderIdentity(person, context.peopleById));
  addSection('Roles', renderRoles(person));
  addSection('Life and dates', lifeBody, 'person-chronicle-section', 'life-and-dates');
  addSection('Family', renderFamily(person, context.peopleById, context.familyEdgesById, treeData));
  for (const [label, keys] of CLAIM_SECTIONS) {
    const claims = keys.flatMap((key) => person[key] ?? []);
    addSection(label, renderClaimList(claims, context.peopleById));
  }
  addSection('External records', renderExternalData(person, context.peopleById));
  addSection(
    'References in the histories',
    `<p class="person-section-intro">Open any source group to read the Chinese and English passage in context.</p>${renderReferences(person)}`,
    'person-references-section',
    'references',
  );
  const period = periodForPerson(person);
  return `<!DOCTYPE html>
<html lang="en">
<head>${pageHead({
    title,
    description: description.slice(0, 220),
    canonicalPath: `/people/${person.slug}.html`,
    preview: context.preview,
    jsonLd: personJsonLd(person),
    ogType: 'profile',
    extraHead: treeData.length > 1
      ? `<link rel="stylesheet" href="../vendor/family-chart/family-chart.css?v=${PEOPLE_ASSET_VERSION}">`
      : '',
  })}</head>
<body class="person-page">
  <header class="person-header"><div class="person-header-inner">
    ${renderBreadcrumbs([['People', 'index.html'], [personDisplayName(person), `${person.slug}.html`]])}
    <div class="person-title-lockup">
      <div class="person-title-copy">
        <p class="people-eyebrow">${escapeHtml(period.label)} · ${escapeHtml(person.description.en)}</p>
        <h1>${escapeHtml(personDisplayName(person))}${person.preferredName.zh ? ` <span lang="zh-Hant">${escapeHtml(person.preferredName.zh)}</span>` : ''}</h1>
        ${person.preferredName.pinyin && person.preferredName.pinyin !== person.preferredName.en ? `<p class="person-pinyin">${escapeHtml(person.preferredName.pinyin)}</p>` : ''}
        <p class="person-chronology">${escapeHtml(chronology)}</p>
      </div>
      <dl class="person-record-counts">
        <div><dt>Passages</dt><dd>${stats.passages.toLocaleString('en-US')}</dd></div>
        <div><dt>Chapters</dt><dd>${stats.chapters.toLocaleString('en-US')}</dd></div>
        <div><dt>Histories</dt><dd>${stats.books.toLocaleString('en-US')}</dd></div>
      </dl>
    </div>
  </div></header>
  <main class="person-content"><div class="person-content-grid">
    ${renderPersonLocalNav(contentSections.map(({ id, label }) => [id, label]))}
    <div class="person-record">${contentSections.map(({ html }) => html).join('')}</div>
  </div></main>
  ${pageFooter()}
  ${treeData.length > 1 ? `<script src="../vendor/family-chart/d3.min.js?v=${PEOPLE_ASSET_VERSION}"></script>
  <script src="../vendor/family-chart/family-chart.min.js?v=${PEOPLE_ASSET_VERSION}"></script>
  <script src="../people-family.js?v=${PEOPLE_ASSET_VERSION}"></script>` : ''}
</body>
</html>`;
}

function searchEntry(person) {
  const searchableKeys = [
    'ethnicities', 'lineages', 'occupations', 'polityAssociations', 'placeAssociations',
    'organizationAssociations', 'offices', 'titlesAndHonors', 'statuses', 'education',
    'credentials', 'beliefs', 'skills', 'works',
  ];
  const text = [
    ...person.names.flatMap((name) => [name.en, name.zh, name.pinyin, name.kind]),
    ...person.roles.flatMap((role) => [role.label, role.roleId]),
    lifeSummaryForPerson(person),
    ...searchableKeys.flatMap((key) => flattenText(person[key])),
  ].filter(Boolean).join(' ');
  const stats = personReferenceStats(person);
  return [
    person.slug,
    personDisplayName(person),
    person.preferredName.zh ?? '',
    person.preferredName.pinyin ?? '',
    person.description.en,
    text,
    lifeSummaryForPerson(person),
    person.roles.map((role) => role.roleId),
    [...new Set(person.references.map((reference) => reference.book))],
    stats.passages,
    periodForPerson(person).slug,
    personDirectoryKey(person),
  ];
}

function writePersonPageShards(outputRoot, people, context) {
  const pagesDir = path.join(outputRoot, 'data', 'people', 'pages');
  fs.mkdirSync(pagesDir, { recursive: true });
  const buckets = Array.from({ length: PERSON_PAGE_SHARD_COUNT }, () => []);
  for (const person of people) {
    buckets[Number.parseInt(personPageShardName(person.slug), 10)].push(person);
  }
  let written = 0;
  for (let index = 0; index < buckets.length; index += 1) {
    if (!buckets[index].length) continue;
    const pages = Object.fromEntries(buckets[index].map((person) => [person.slug, generatePersonHtml(person, context)]));
    writeTextAtomic(
      path.join(pagesDir, `${String(index).padStart(4, '0')}.json`),
      `${JSON.stringify({ v: 1, pages })}\n`,
    );
    written += 1;
  }
  return written;
}

function writeSearchData(outputRoot, people, context) {
  const searchDir = path.join(outputRoot, 'data', 'people', 'search');
  fs.mkdirSync(searchDir, { recursive: true });
  const entries = people.map(searchEntry);
  const parts = [];
  let current = [];
  let currentBytes = Buffer.byteLength('{"v":2,"entries":[]}\n', 'utf8');
  for (const entry of entries) {
    const entryBytes = Buffer.byteLength(JSON.stringify(entry), 'utf8') + (current.length ? 1 : 0);
    if (currentBytes + entryBytes > SEARCH_PART_MAX_BYTES && current.length) {
      parts.push(current);
      current = [entry];
      currentBytes = Buffer.byteLength('{"v":2,"entries":[]}\n', 'utf8') + entryBytes;
    } else {
      current.push(entry);
      currentBytes += entryBytes;
    }
  }
  if (current.length) parts.push(current);
  const files = parts.map((part, index) => {
    const file = `part-${String(index + 1).padStart(3, '0')}.json`;
    writeTextAtomic(path.join(searchDir, file), `${JSON.stringify({ v: 3, entries: part })}\n`);
    return { file, entries: part.length };
  });
  writeJsonAtomic(path.join(searchDir, 'index.json'), {
    v: 3,
    generatedAt: context.catalog.generatedAt,
    complete: context.catalog.complete,
    people: people.length,
    parts: files,
  });
  writeJsonAtomic(path.join(outputRoot, 'data', 'people', 'site-status.json'), {
    generatedAt: context.catalog.generatedAt,
    complete: context.catalog.complete,
    preview: context.preview,
    published: context.active && !context.preview,
    people: people.length,
    pageShards: context.pageShards ?? 0,
    sourceChapters: context.catalog.stats.sourceChapters,
    extractedChapters: context.catalog.stats.extractedChapters,
    missingChapters: context.catalog.stats.missingChapters,
  });
}

function rankedPeople(people) {
  return [...people].sort((left, right) => {
    const leftStats = personReferenceStats(left);
    const rightStats = personReferenceStats(right);
    return rightStats.passages - leftStats.passages || rightStats.chapters - leftStats.chapters ||
      rightStats.books - leftStats.books ||
      personDisplayName(left).localeCompare(personDisplayName(right), 'en');
  });
}

function sortPeopleAlphabetically(people) {
  return [...people].sort((left, right) =>
    personDisplayName(left).localeCompare(personDisplayName(right), 'en') || left.id.localeCompare(right.id)
  );
}

function buildBrowseCollections(people) {
  const periods = HISTORICAL_PERIODS.map((period) => ({
    ...period,
    people: people.filter((person) => periodForPerson(person).slug === period.slug),
  }));
  const roleMap = new Map();
  for (const person of people) {
    for (const role of person.roles) {
      if (!roleMap.has(role.roleId)) roleMap.set(role.roleId, { slug: role.roleId, label: role.label, people: [] });
      roleMap.get(role.roleId).people.push(person);
    }
  }
  const roles = [...roleMap.values()]
    .map((role) => ({ ...role }))
    .sort((left, right) => right.people.length - left.people.length || left.label.localeCompare(right.label, 'en'));
  const sourceMap = new Map();
  for (const person of people) {
    for (const book of new Set(person.references.map((reference) => reference.book))) {
      if (!sourceMap.has(book)) sourceMap.set(book, []);
      sourceMap.get(book).push(person);
    }
  }
  const sources = [...sourceMap.entries()].map(([book, sourcePeople]) => ({
    slug: book,
    label: sourceLabel(book, people),
    zh: sourceChineseLabel(book, people),
    people: sourcePeople,
  })).sort((left, right) => right.people.length - left.people.length || left.label.localeCompare(right.label, 'en'));
  const directory = DIRECTORY_KEYS.map((entry) => ({
    ...entry,
    people: sortPeopleAlphabetically(people.filter((person) => personDirectoryKey(person) === entry.slug)),
  }));
  return { periods, roles, sources, directory };
}

function renderBrowseStrip(items, kind, limit = items.length) {
  return `<div class="people-browse-strip">${items.filter((item) => item.people.length).slice(0, limit).map((item) =>
    `<a href="index.html?${kind}=${encodeURIComponent(item.slug)}#find-a-person"><span>${escapeHtml(item.label)}</span>` +
    `${item.shortLabel ? `<small>${escapeHtml(item.shortLabel)}</small>` : item.zh ? `<small lang="zh-Hant">${escapeHtml(item.zh)}</small>` : ''}` +
    `<strong>${item.people.length.toLocaleString('en-US')}</strong></a>`
  ).join('')}</div>`;
}

function generateIndexHtml(people, context, collections) {
  const featured = rankedPeople(people)
    .filter((person) => person.preferredName.en && person.preferredName.zh && person.references.length > 1)
    .slice(0, FEATURED_PEOPLE_COUNT);
  const initialResults = featured.slice(0, 8).map((person) => renderPersonCard(person)).join('');
  const sourceCount = collections.sources.length;
  const chapterCount = context.catalog.stats?.chapters ?? new Set(people.flatMap((person) =>
    person.references.map((reference) => `${reference.book}:${reference.chapter}`)
  )).size;
  const description = 'Discover people in Chinese history through bilingual, source-linked records. Search names, titles, offices, places, dates, works, and references across the Twenty-Four Histories.';
  return `<!DOCTYPE html>
<html lang="en">
<head>${pageHead({
    title: 'People in Chinese History | 24 Histories',
    description,
    canonicalPath: '/people/',
    preview: context.preview,
    jsonLd: collectionJsonLd({
      name: 'People in Chinese History',
      description,
      canonicalPath: '/people/',
      people: featured,
    }),
  })}</head>
<body class="people-index-page">
  <header class="people-index-header"><div>
    ${renderBreadcrumbs([['24 Histories', '../index.html'], ['People', 'index.html']])}
    <div class="people-index-title">
      <div>
        <p class="people-eyebrow">A source-linked biographical index</p>
        <h1>People in Chinese History</h1>
        <p class="people-index-deck">Follow rulers, generals, officials, scholars, writers, rebels, and families through the passages that preserve their lives.</p>
      </div>
      <div class="people-index-seal" aria-hidden="true"><span lang="zh-Hant">人物</span></div>
    </div>
    <dl class="people-index-stats">
      <div><dt>People</dt><dd>${people.length.toLocaleString('en-US')}</dd></div>
      <div><dt>Source histories</dt><dd>${sourceCount.toLocaleString('en-US')}</dd></div>
      <div><dt>Chapters indexed</dt><dd>${chapterCount.toLocaleString('en-US')}</dd></div>
    </dl>
    <p class="people-coverage-note">This growing index currently covers ${chapterCount.toLocaleString('en-US')} of ${context.catalog.stats.sourceChapters.toLocaleString('en-US')} chapters. Person records and cross-book identifications will continue to expand as the remaining chapters are reviewed.</p>
  </div></header>
  <main class="people-index-content">
    <section id="find-a-person" class="people-search" aria-labelledby="people-search-heading">
      <div class="people-section-heading">
        <p class="people-eyebrow">Find a person</p>
        <h2 id="people-search-heading">Search the record</h2>
        <p>Search English, Chinese, or pinyin names—or look for a title, office, place, work, or year.</p>
      </div>
      <div class="people-search-box">
        <label class="visually-hidden" for="people-search-input">Search people</label>
        <input id="people-search-input" type="search" autocomplete="off" placeholder="Try Sima Qian, 司馬遷, emperor, historian, Chang'an…">
        <button id="people-search-clear" type="button" hidden>Clear</button>
      </div>
      <div class="people-search-filters" aria-label="Filter people">
        <label>Period<select id="people-period-filter"><option value="">All periods</option>${collections.periods.filter((item) => item.people.length).map((item) => `<option value="${escapeAttribute(item.slug)}">${escapeHtml(item.label)}</option>`).join('')}</select></label>
        <label>Role<select id="people-role-filter"><option value="">All roles</option>${collections.roles.map((item) => `<option value="${escapeAttribute(item.slug)}">${escapeHtml(item.label)}</option>`).join('')}</select></label>
        <label>History<select id="people-source-filter"><option value="">All histories</option>${collections.sources.map((item) => `<option value="${escapeAttribute(item.slug)}">${escapeHtml(item.label)}</option>`).join('')}</select></label>
        <label>Order<select id="people-sort"><option value="relevance">Best match</option><option value="documented">Most passages</option><option value="az">A-Z</option></select></label>
      </div>
      <p id="people-search-status" class="people-search-status" aria-live="polite">Loading the people index…</p>
      <ol id="people-search-results" class="people-card-grid people-search-results">${initialResults}</ol>
    </section>

    <section class="people-discovery-section" aria-labelledby="period-heading">
      <div class="people-section-heading"><p class="people-eyebrow">Browse by period</p><h2 id="period-heading">Move through the dynasties</h2><p>Dates reflect the period in which each person is most strongly attested, not the date of a later retrospective mention.</p></div>
      ${renderBrowseStrip(collections.periods, 'period')}
    </section>

    <section class="people-discovery-section" aria-labelledby="documented-heading">
      <div class="people-section-heading"><p class="people-eyebrow">A place to begin</p><h2 id="documented-heading">Most mentioned in the translated histories</h2><p>These people have the most indexed source passages. The ordering reflects the surviving text, not a judgment of historical importance.</p></div>
      <ol class="people-card-grid people-featured-grid">${featured.map((person) => renderPersonCard(person)).join('')}</ol>
    </section>

    <section class="people-discovery-section" aria-labelledby="role-heading">
      <div class="people-section-heading"><p class="people-eyebrow">Browse by role</p><h2 id="role-heading">Courts, armies, schools, and temples</h2><p>Explore how the histories describe what people did and the worlds they inhabited.</p></div>
      ${renderBrowseStrip(collections.roles, 'role', 16)}
      ${collections.roles.length > 16 ? `<details class="people-more-facets"><summary>Show all ${collections.roles.length} roles</summary>${renderBrowseStrip(collections.roles.slice(16), 'role')}</details>` : ''}
    </section>

    <section class="people-discovery-section" aria-labelledby="source-heading">
      <div class="people-section-heading"><p class="people-eyebrow">Browse by source</p><h2 id="source-heading">Enter through a history</h2><p>See every indexed person who appears in a particular dynastic history or related chronicle.</p></div>
      ${renderBrowseStrip(collections.sources, 'source')}
    </section>

    <section class="people-discovery-section people-directory-section" aria-labelledby="directory-heading">
      <div class="people-section-heading"><p class="people-eyebrow">Complete directory</p><h2 id="directory-heading">Browse A-Z</h2><p>Every person page is linked through this directory, including records with uncertain dates or sparse evidence.</p></div>
      <nav class="people-alphabet" aria-label="People directory">${collections.directory.map((item) => item.people.length
        ? `<a href="index.html?letter=${encodeURIComponent(item.slug)}&sort=az#find-a-person"><span>${escapeHtml(item.label)}</span><small>${item.people.length.toLocaleString('en-US')}</small></a>`
        : `<span aria-disabled="true"><span>${escapeHtml(item.label)}</span><small>0</small></span>`).join('')}</nav>
    </section>
  </main>
  ${pageFooter()}
  <script type="module" src="../people.js?v=${PEOPLE_ASSET_VERSION}"></script>
</body>
</html>`;
}

export function generatePeoplePages(options = parseArgs([])) {
  const context = loadPeopleSiteContext({ allowMissing: true });
  if (!context.active) {
    cleanOwnedOutput(options.outputRoot);
    console.log(`people pages: skipped (${context.reason})`);
    return { generated: 0, active: false, reason: context.reason };
  }

  cleanOwnedOutput(options.outputRoot);
  copyPeopleAssets(options.outputRoot);
  const peopleDir = path.join(options.outputRoot, 'people');
  fs.mkdirSync(peopleDir, { recursive: true });
  const allPeople = sortPeopleAlphabetically(context.catalog.people);
  const collections = buildBrowseCollections(allPeople);
  let selected = allPeople;
  if (options.person) {
    selected = allPeople.filter((person) => person.id === options.person || person.slug === options.person);
    if (selected.length !== 1) throw new Error(`Could not find person ${options.person}`);
  }
  if (options.limit) selected = selected.slice(0, options.limit);

  if (options.person || options.limit) {
    for (const person of selected) {
      writeTextAtomic(path.join(peopleDir, `${person.slug}.html`), generatePersonHtml(person, context));
    }
    context.pageShards = 0;
  } else {
    context.pageShards = writePersonPageShards(options.outputRoot, allPeople, context);
  }
  writeTextAtomic(path.join(peopleDir, 'index.html'), generateIndexHtml(allPeople, context, collections));
  writeSearchData(options.outputRoot, allPeople, context);
  console.log(
    `people pages: ${selected.length} person record(s), ${context.pageShards} page shard(s), ` +
    `${allPeople.length} search entries ` +
    `(${context.preview ? 'preview' : 'publication'} mode)`,
  );
  return {
    generated: selected.length,
    pageShards: context.pageShards,
    active: true,
    preview: context.preview,
    people: allPeople.length,
  };
}

if (isMain) {
  try {
    generatePeoplePages(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
