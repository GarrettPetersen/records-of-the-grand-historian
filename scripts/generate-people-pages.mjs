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
  formatPersonWesternYear,
  humanizePeopleValue,
  personAlternateNames,
  personDisplayName,
  personFullDisplayName,
  personLifeSummary,
} from './lib/people-presentation.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const SITE_URL = (process.env.SITE_URL || 'https://24histories.com').replace(/\/$/u, '');
const SEARCH_PART_MAX_BYTES = 6 * 1024 * 1024;

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

function section(title, body, className = '') {
  if (!body) return '';
  return `<section class="person-section ${escapeAttribute(className)}"><h2>${escapeHtml(title)}</h2>${body}</section>`;
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

function renderFamily(person, peopleById, familyEdgesById) {
  if (!person.familyRelationships.length && !person.familySummaries.length) return '';
  const relationships = person.familyRelationships.map((claim) => {
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
  return `${relationships ? `<ul class="person-family-list">${relationships}</ul>` : ''}${summaries}`;
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
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/people/${person.slug}.html#person`,
    name: personDisplayName(person),
    alternateName: personAlternateNames(person),
    description: person.description.en,
    url: `${SITE_URL}/people/${person.slug}.html`,
    mainEntityOfPage: `${SITE_URL}/people/${person.slug}.html`,
  };
}

function pageFooter() {
  return `<footer><p><a href="../index.html">Home</a> | <a href="index.html">People</a> | ` +
    `<a href="../about.html">About</a> | <a href="../progress.html">Progress</a> | ` +
    `<a href="../privacy.html">Privacy Policy</a></p>` +
    `<p class="site-copyright">English translations © 2026 Garrett M. Petersen. The original Chinese texts are in the public domain.</p></footer>`;
}

function pageHead({ title, description, canonicalPath, preview, jsonLd = null }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttribute(description)}">
  ${preview ? '<meta name="robots" content="noindex,nofollow">' : ''}
  <link rel="canonical" href="${escapeAttribute(canonical)}">
  <link rel="icon" type="image/x-icon" href="../favicon.ico">
  <link rel="stylesheet" href="../styles.css?v=20260811-people">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escapeAttribute(title)}">
  <meta property="og:description" content="${escapeAttribute(description)}">
  <meta property="og:url" content="${escapeAttribute(canonical)}">
  <meta property="og:image" content="${SITE_URL}/og/site.png">
  <meta name="twitter:card" content="summary_large_image">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</gu, '\\u003c')}</script>` : ''}`;
}

function generatePersonHtml(person, context) {
  const title = `${personFullDisplayName(person)} | 24 Histories`;
  const chronology = personLifeSummary(person);
  const description = `${personFullDisplayName(person)}: ${person.description.en}. ${chronology}. References across the Chinese histories.`;
  const lifeBody = [
    person.life.birth.length ? `<h3>Birth</h3>${renderClaimList(person.life.birth, context.peopleById)}` : '',
    person.life.death.length ? `<h3>Death</h3>${renderClaimList(person.life.death, context.peopleById)}` : '',
    person.life.ageClaims.length ? `<h3>Age</h3>${renderClaimList(person.life.ageClaims, context.peopleById)}` : '',
    person.life.attestedActivity.length ? `<h3>Attested activity</h3>${renderClaimList(person.life.attestedActivity, context.peopleById)}` : '',
  ].join('');
  const claimSections = CLAIM_SECTIONS.map(([label, keys]) => {
    const claims = keys.flatMap((key) => person[key] ?? []);
    return section(label, renderClaimList(claims, context.peopleById));
  }).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>${pageHead({
    title,
    description: description.slice(0, 220),
    canonicalPath: `/people/${person.slug}.html`,
    preview: context.preview,
    jsonLd: personJsonLd(person),
  })}</head>
<body class="person-page">
  <header class="person-header"><div class="person-header-inner">
    <a class="person-back" href="index.html">People</a>
    <h1>${escapeHtml(personDisplayName(person))}${person.preferredName.zh ? ` <span lang="zh-Hant">${escapeHtml(person.preferredName.zh)}</span>` : ''}</h1>
    ${person.preferredName.pinyin && person.preferredName.pinyin !== person.preferredName.en ? `<p class="person-pinyin">${escapeHtml(person.preferredName.pinyin)}</p>` : ''}
    <p class="person-description">${escapeHtml(person.description.en)}</p>
    <p class="person-chronology">${escapeHtml(chronology)}</p>
  </div></header>
  <main class="person-content">
    ${section('Names', renderNames(person))}
    ${section('Identity', renderIdentity(person, context.peopleById))}
    ${section('Roles', renderRoles(person))}
    ${section('Life', lifeBody)}
    ${section('Family', renderFamily(person, context.peopleById, context.familyEdgesById))}
    ${claimSections}
    ${section('External records', renderExternalData(person, context.peopleById))}
    ${section('References in the histories', renderReferences(person), 'person-references-section')}
  </main>
  ${pageFooter()}
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
    personLifeSummary(person),
    ...searchableKeys.flatMap((key) => flattenText(person[key])),
  ].filter(Boolean).join(' ');
  return [
    person.slug,
    personDisplayName(person),
    person.preferredName.zh ?? '',
    person.preferredName.pinyin ?? '',
    person.description.en,
    text,
  ];
}

function writeSearchData(outputRoot, people, context) {
  const searchDir = path.join(outputRoot, 'data', 'people', 'search');
  fs.mkdirSync(searchDir, { recursive: true });
  const entries = people.map(searchEntry);
  const parts = [];
  let current = [];
  for (const entry of entries) {
    const next = [...current, entry];
    if (Buffer.byteLength(JSON.stringify({ v: 1, entries: next }), 'utf8') > SEARCH_PART_MAX_BYTES && current.length) {
      parts.push(current);
      current = [entry];
    } else current = next;
  }
  if (current.length) parts.push(current);
  const files = parts.map((part, index) => {
    const file = `part-${String(index + 1).padStart(3, '0')}.json`;
    writeJsonAtomic(path.join(searchDir, file), { v: 1, entries: part });
    return { file, entries: part.length };
  });
  writeJsonAtomic(path.join(searchDir, 'index.json'), {
    v: 1,
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
  });
}

function generateIndexHtml(people, context) {
  const directory = people.slice(0, 250).map((person) => `<li data-person-row>` +
    `<a href="${escapeAttribute(person.slug)}.html"><span>${escapeHtml(personDisplayName(person))}</span>` +
    `${person.preferredName.zh ? `<span lang="zh-Hant">${escapeHtml(person.preferredName.zh)}</span>` : ''}` +
    `<span>${escapeHtml(person.description.en)}</span></a></li>`).join('');
  const description = 'Search people named in the Twenty-Four Histories by personal name, alternate name, title, role, date, office, place, or work.';
  return `<!DOCTYPE html>
<html lang="en">
<head>${pageHead({
    title: 'People in the Chinese Histories | 24 Histories',
    description,
    canonicalPath: '/people/',
    preview: context.preview,
  })}</head>
<body class="people-index-page">
  <header class="people-index-header"><div>
    <a class="person-back" href="../index.html">24 Histories</a>
    <h1>People in the Chinese Histories</h1>
    <p>${people.length.toLocaleString('en-US')} individuals</p>
  </div></header>
  <main class="people-index-content">
    <section class="people-search" aria-labelledby="people-search-label">
      <label id="people-search-label" for="people-search-input">Search people</label>
      <input id="people-search-input" type="search" autocomplete="off" placeholder="Name, title, office, place, work, or year">
      <p id="people-search-status" class="people-search-status" aria-live="polite"></p>
      <ol id="people-search-results" class="people-search-results">${directory}</ol>
    </section>
  </main>
  ${pageFooter()}
  <script type="module" src="../people.js?v=20260811-people"></script>
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
  const peopleDir = path.join(options.outputRoot, 'people');
  fs.mkdirSync(peopleDir, { recursive: true });
  const allPeople = [...context.catalog.people].sort((left, right) =>
    personDisplayName(left).localeCompare(personDisplayName(right), 'en') || left.id.localeCompare(right.id)
  );
  let selected = allPeople;
  if (options.person) {
    selected = allPeople.filter((person) => person.id === options.person || person.slug === options.person);
    if (selected.length !== 1) throw new Error(`Could not find person ${options.person}`);
  }
  if (options.limit) selected = selected.slice(0, options.limit);

  for (const person of selected) {
    writeTextAtomic(path.join(peopleDir, `${person.slug}.html`), generatePersonHtml(person, context));
  }
  writeTextAtomic(path.join(peopleDir, 'index.html'), generateIndexHtml(allPeople, context));
  writeSearchData(options.outputRoot, allPeople, context);
  console.log(
    `people pages: ${selected.length} person page(s), ${allPeople.length} search entries ` +
    `(${context.preview ? 'preview' : 'publication'} mode)`,
  );
  return { generated: selected.length, active: true, preview: context.preview, people: allPeople.length };
}

if (isMain) {
  try {
    generatePeoplePages(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
