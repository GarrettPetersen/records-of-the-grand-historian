import fs from 'node:fs';
import path from 'node:path';
import { exactSpanAt, PEOPLE_DIR, readJson } from './people-content.mjs';
import {
  assertPeopleCatalogPublicationState,
  peopleCatalogIsPublishable,
} from './people-publication.mjs';

const CATALOG_PATH = path.join(PEOPLE_DIR, 'generated', 'catalog.json');
const SITE_INDEX_PATH = path.join(PEOPLE_DIR, 'generated', 'site-index.json');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#039;');
}

function previewEnabled() {
  return process.env.PEOPLE_SITE_PREVIEW === '1';
}

export function loadPeopleSiteContext({ allowMissing = true, allowPreview = previewEnabled() } = {}) {
  const missing = [CATALOG_PATH, SITE_INDEX_PATH].filter((file) => !fs.existsSync(file));
  if (missing.length > 0) {
    if (!allowMissing) throw new Error(`Missing generated people data: ${missing.join(', ')}`);
    return { active: false, preview: false, reason: 'generated-data-missing' };
  }

  const catalog = readJson(CATALOG_PATH);
  const siteIndex = readJson(SITE_INDEX_PATH);
  assertPeopleCatalogPublicationState(catalog);
  if (siteIndex.schemaVersion !== 2) {
    throw new Error('Generated people site index is obsolete; rerun people:catalog');
  }
  if (catalog.complete !== siteIndex.complete || catalog.generatedAt !== siteIndex.generatedAt ||
      catalog.currentPromptVersion !== siteIndex.currentPromptVersion) {
    throw new Error('Generated people catalog and site index are out of sync; rerun people:catalog');
  }

  const publishable = peopleCatalogIsPublishable(catalog);
  const preview = !publishable && allowPreview;
  const active = publishable || preview;
  const peopleById = new Map(catalog.people.map((person) => [person.id, person]));
  const familyEdgesById = new Map((catalog.familyEdges ?? []).map((edge) => [edge.id, edge]));
  return {
    active,
    preview,
    reason: active ? null : 'catalog-not-publishable',
    catalog,
    siteIndex,
    peopleById,
    familyEdgesById,
  };
}

export function chapterPeopleContext(siteContext, book, chapter) {
  if (!siteContext?.active) return null;
  const chapterId = `${book}:${String(chapter).padStart(3, '0')}`;
  const record = siteContext.siteIndex.chapters[chapterId];
  if (!record) return null;
  const mentionsByUnit = new Map();
  for (const mention of record.mentions) {
    if (!mentionsByUnit.has(mention.unit.id)) mentionsByUnit.set(mention.unit.id, []);
    mentionsByUnit.get(mention.unit.id).push(mention);
  }
  return { chapterId, record, mentionsByUnit };
}

function linkedRanges(text, mentions, language) {
  const ranges = [];
  const seen = new Set();
  for (const mention of mentions ?? []) {
    for (const span of mention.spans?.[language] ?? []) {
      const located = exactSpanAt(text, span.exact, span.occurrence);
      const key = `${located.startCodePoint}:${located.endCodePoint}:${mention.personId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      ranges.push({
        ...located,
        personId: mention.personId,
        slug: mention.slug,
        mentionId: mention.mentionId,
      });
    }
  }
  ranges.sort((left, right) =>
    left.startCodePoint - right.startCodePoint || left.endCodePoint - right.endCodePoint ||
    left.personId.localeCompare(right.personId)
  );
  for (let index = 1; index < ranges.length; index += 1) {
    if (ranges[index].startCodePoint < ranges[index - 1].endCodePoint) {
      throw new Error(
        `Overlapping rendered person spans ${ranges[index - 1].mentionId} and ${ranges[index].mentionId}`,
      );
    }
  }
  return ranges;
}

function chineseWords(value) {
  return Array.from(value).filter((char) => char.trim()).map((char) =>
    `<span class="word" data-char="${escapeHtml(char)}">${escapeHtml(char)}</span>`
  ).join('');
}

export function renderPersonLinkedText({
  text,
  mentions = [],
  language,
  hrefPrefix = '../people/',
  hrefForPerson = null,
  chineseWordSpans = language === 'zh',
}) {
  if (!['zh', 'en'].includes(language)) throw new Error(`Unsupported people-link language ${language}`);
  const source = String(text ?? '');
  const ranges = linkedRanges(source, mentions, language);
  const points = Array.from(source);
  const renderFragment = chineseWordSpans ? chineseWords : escapeHtml;
  let cursor = 0;
  let html = '';
  for (const range of ranges) {
    html += renderFragment(points.slice(cursor, range.startCodePoint).join(''));
    const linkedText = renderFragment(points.slice(range.startCodePoint, range.endCodePoint).join(''));
    const href = hrefForPerson ? hrefForPerson(range) : `${hrefPrefix}${range.slug}.html`;
    if (!href) throw new Error(`No person-link target for ${range.personId}`);
    html += `<a class="person-link" href="${escapeHtml(href)}" ` +
      `data-person-id="${escapeHtml(range.personId)}">${linkedText}</a>`;
    cursor = range.endCodePoint;
  }
  html += renderFragment(points.slice(cursor).join(''));
  return html;
}

export function renderUnitWithPeople({
  unitId,
  text,
  language,
  chapterContext,
  hrefPrefix = '../people/',
  hrefForPerson = null,
  chineseWordSpans = language === 'zh',
}) {
  const mentions = chapterContext?.mentionsByUnit.get(unitId) ?? [];
  return renderPersonLinkedText({ text, mentions, language, hrefPrefix, hrefForPerson, chineseWordSpans });
}

export function peopleSentenceAnchor(language, unitId) {
  if (!['zh', 'en'].includes(language)) throw new Error(`Unsupported sentence-anchor language ${language}`);
  return `${language}-${unitId}`;
}

export function peopleSiteSelfTest() {
  const mentions = [{
    mentionId: 'fixture:001:m0001',
    personId: 'per_0123456789ABCDEFGHJK',
    slug: 'fan-ye-01234567',
    spans: {
      zh: [{ exact: '范曄', occurrence: 0 }],
      en: [{ exact: 'Fan Ye', occurrence: 1 }],
    },
  }];
  const en = renderPersonLinkedText({
    text: 'Fan Ye met Fan Ye.',
    mentions,
    language: 'en',
  });
  if (!en.includes('met <a class="person-link"') || en.startsWith('<a')) {
    throw new Error('English occurrence-aware person linking failed');
  }
  const zh = renderPersonLinkedText({ text: '范曄至。', mentions, language: 'zh' });
  if (!zh.includes('<a class="person-link"') || !zh.includes('<span class="word"')) {
    throw new Error('Chinese person linking did not preserve word spans');
  }
  const overlap = structuredClone(mentions);
  overlap.push({
    ...structuredClone(mentions[0]),
    mentionId: 'fixture:001:m0002',
    personId: 'per_1123456789ABCDEFGHJK',
    slug: 'fan-11234567',
    spans: { zh: [], en: [{ exact: 'Ye', occurrence: 1 }] },
  });
  try {
    renderPersonLinkedText({ text: 'Fan Ye met Fan Ye.', mentions: overlap, language: 'en' });
    throw new Error('Overlapping people spans unexpectedly rendered');
  } catch (error) {
    if (!String(error.message).includes('Overlapping rendered person spans')) throw error;
  }
  console.log('people-site self-test: ok');
}
