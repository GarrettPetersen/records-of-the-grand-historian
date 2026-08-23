#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadHtml } from 'cheerio';
import { PEOPLE_DIR, readJson, REPO_ROOT } from './lib/people-content.mjs';
import {
  assertPeopleCatalogPublicationState,
  peopleCatalogIsPublishable,
} from './lib/people-publication.mjs';
import {
  PERSON_PAGE_SHARD_COUNT,
  personIdSlugSuffix,
  personPageShardName,
} from '../functions/lib/people-shards.js';
import {
  MAX_PUBLIC_PERSON_ALIASES,
  personPublicAliases,
} from './lib/people-presentation.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function parseArgs(argv) {
  const options = {
    outputRoot: path.join(REPO_ROOT, 'public'),
    allowPreview: false,
    skipChapterLinks: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--output-root') {
      const value = argv[++index];
      if (!value) throw new Error('--output-root requires a path');
      options.outputRoot = path.resolve(REPO_ROOT, value);
    } else if (arg === '--allow-preview') options.allowPreview = true;
    else if (arg === '--skip-chapter-links') options.skipChapterLinks = true;
    else throw new Error(`Unknown option ${arg}`);
  }
  return options;
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function loadSearchEntries(outputRoot, errors) {
  const indexPath = path.join(outputRoot, 'data', 'people', 'search', 'index.json');
  if (!fs.existsSync(indexPath)) {
    errors.push('Missing people search index');
    return [];
  }
  const index = readJson(indexPath);
  const entries = [];
  for (const part of index.parts ?? []) {
    const file = path.join(path.dirname(indexPath), part.file);
    if (!fs.existsSync(file)) {
      errors.push(`Missing people search part ${part.file}`);
      continue;
    }
    entries.push(...(readJson(file).entries ?? []));
  }
  assert(entries.length === index.people, `Search index expected ${index.people} entries, found ${entries.length}`, errors);
  return entries;
}

export function verifyPeopleSite(options = parseArgs([])) {
  const errors = [];
  const catalog = readJson(path.join(PEOPLE_DIR, 'generated', 'catalog.json'));
  assertPeopleCatalogPublicationState(catalog);
  const siteIndex = readJson(path.join(PEOPLE_DIR, 'generated', 'site-index.json'));
  const statusPath = path.join(options.outputRoot, 'data', 'people', 'site-status.json');
  if (!fs.existsSync(statusPath)) {
    if (!peopleCatalogIsPublishable(catalog) && !options.allowPreview) {
      const staleIndex = path.join(options.outputRoot, 'people', 'index.html');
      if (fs.existsSync(staleIndex)) throw new Error('Incomplete catalog left stale published people pages');
      console.log('people site verification: publication correctly gated while catalog is incomplete');
      return { people: 0, searchEntries: 0, gated: true };
    }
    throw new Error('Missing generated people site status');
  }
  const status = readJson(statusPath);
  assert(status.generatedAt === catalog.generatedAt, 'People site status is stale relative to catalog', errors);
  assert(status.people === catalog.people.length, 'People site status count differs from catalog', errors);
  assert(status.sourceChapters === catalog.stats.sourceChapters,
    'People site status source-chapter count differs from catalog', errors);
  assert(status.extractedChapters === catalog.stats.extractedChapters,
    'People site status extracted-chapter count differs from catalog', errors);
  assert(status.missingChapters === catalog.stats.missingChapters,
    'People site status missing-chapter count differs from catalog', errors);
  if (status.published) {
    assert(peopleCatalogIsPublishable(catalog), 'Published people site is not publishable', errors);
  }
  if (status.preview && !options.allowPreview) errors.push('People site is a noindex preview, not a publication build');
  if (!status.preview && !status.published) errors.push('People site is not marked published');

  const peopleDir = path.join(options.outputRoot, 'people');
  assert(fs.existsSync(path.join(peopleDir, 'index.html')), 'Missing people index page', errors);
  assert(fs.existsSync(path.join(options.outputRoot, 'people-record.js')), 'Missing person record runtime', errors);
  const expectedSlugs = new Set(catalog.people.map((person) => person.slug));
  const peopleById = new Map(catalog.people.map((person) => [person.id, person]));
  const peopleBySlug = new Map(catalog.people.map((person) => [person.slug, person]));
  const pagesDir = path.join(options.outputRoot, 'data', 'people', 'pages');
  const shardFiles = fs.existsSync(pagesDir)
    ? fs.readdirSync(pagesDir).filter((name) => /^\d{4}\.json$/u.test(name)).sort()
    : [];
  assert(shardFiles.length === status.pageShards,
    `Expected ${status.pageShards} person-page shards, found ${shardFiles.length}`, errors);
  assert(shardFiles.length <= PERSON_PAGE_SHARD_COUNT,
    `Person-page shard count exceeds ${PERSON_PAGE_SHARD_COUNT}`, errors);
  const actualSlugs = new Set();
  for (const file of shardFiles) {
    const fullPath = path.join(pagesDir, file);
    assert(fs.statSync(fullPath).size < 25 * 1024 * 1024, `${file} exceeds Cloudflare's 25 MiB asset limit`, errors);
    const shard = readJson(fullPath);
    assert(shard.v === 1 && shard.pages && typeof shard.pages === 'object', `${file} is not a v1 page shard`, errors);
    for (const [slug, html] of Object.entries(shard.pages ?? {})) {
      const person = peopleBySlug.get(slug);
      assert(Boolean(person), `${file} contains unknown person ${slug}`, errors);
      assert(personPageShardName(slug) === file.slice(0, -5), `${slug} is stored in the wrong shard`, errors);
      assert(!actualSlugs.has(slug), `${slug} appears in more than one page shard`, errors);
      actualSlugs.add(slug);
      if (!person || typeof html !== 'string') continue;
      assert((html.match(/<h1(?:\s|>)/gu) ?? []).length === 1, `${slug} must have one h1`, errors);
      assert(html.includes(`href="https://24histories.com/people/${slug}.html"`), `${slug} has no canonical URL`, errors);
      assert(html.includes('type="application/ld+json"'), `${slug} has no Person JSON-LD`, errors);
      assert(!html.includes('>Date Context<'), `${slug} exposes the internal date-context field`, errors);
      assert(!html.includes('Subject Role'), `${slug} exposes the internal family subject role`, errors);
      assert(!html.includes('Object Role'), `${slug} exposes the internal family object role`, errors);
      const publicAliases = personPublicAliases(person);
      assert(publicAliases.length <= MAX_PUBLIC_PERSON_ALIASES,
        `${slug} exposes more than ${MAX_PUBLIC_PERSON_ALIASES} public aliases`, errors);
      const otherNamesSection = html.match(/<section id="other-names"[\s\S]*?<\/section>/u)?.[0] ?? '';
      const renderedAliasRows = (otherNamesSection.match(/<tbody>[\s\S]*<\/tbody>/u)?.[0].match(/<tr>/gu) ?? []).length;
      assert(renderedAliasRows === publicAliases.length,
        `${slug} renders ${renderedAliasRows} alias rows for ${publicAliases.length} public aliases`, errors);
      assert((html.match(/class="person-reference"/gu) ?? []).length === person.references.length,
        `${slug} has the wrong number of reference snippets`, errors);
      if (person.references.length >= 8) {
        assert(html.includes('data-person-reference-tools'), `${slug} omits reference filters`, errors);
        assert(html.includes('../people-record.js'), `${slug} omits the person record runtime`, errors);
      }
      const referenceChapters = new Set(person.references.map((reference) => `${reference.book}:${reference.chapter}`));
      if (referenceChapters.size >= 2) {
        assert(html.includes('id="key-source-chapters"'), `${slug} omits key source chapters`, errors);
      }
      const uniqueFamily = new Set();
      let chartExpected = false;
      const positiveChartTargets = new Set();
      const negatedChartTargets = new Set();
      for (const relationship of person.familyRelationships) {
        const target = peopleById.get(relationship.value.personId);
        const key = `${relationship.value.relation}:${relationship.value.personId}`;
        if (uniqueFamily.has(key)) continue;
        uniqueFamily.add(key);
        assert(Boolean(target), `${slug} has a family link to an unknown person`, errors);
        if (target) assert(html.includes(`href="${target.slug}.html"`),
          `${slug} does not link to family target ${target.slug}`, errors);
        if (['parent-of', 'child-of', 'spouse-of'].includes(relationship.value.relation)) {
          if (relationship.value.negated) negatedChartTargets.add(relationship.value.personId);
          else {
            chartExpected = true;
            positiveChartTargets.add(relationship.value.personId);
          }
        }
      }
      if (chartExpected) {
        assert(html.includes('id="person-family-chart"'), `${slug} omits its family chart`, errors);
        assert(html.includes('../people-family.js'), `${slug} omits the family-chart runtime`, errors);
      }
      const treeJson = html
        .match(/<script id="person-family-data" type="application\/json">([\s\S]*?)<\/script>/u)?.[1];
      const treeIds = new Set(treeJson ? JSON.parse(treeJson).map((record) => record.id) : []);
      for (const targetId of negatedChartTargets) {
        if (!positiveChartTargets.has(targetId)) {
          assert(!treeIds.has(targetId), `${slug} renders a negated family relationship in its chart`, errors);
        }
      }
    }
  }
  for (const slug of expectedSlugs) assert(actualSlugs.has(slug), `Missing person page ${slug}.html`, errors);
  for (const slug of actualSlugs) assert(expectedSlugs.has(slug), `Unexpected person page ${slug}.html`, errors);

  const expectedRedirects = new Map();
  const addExpectedRedirect = (personId, targetSlug) => {
    const suffix = personIdSlugSuffix(personId);
    const existing = expectedRedirects.get(suffix);
    assert(!existing || existing === targetSlug,
      `Person ID suffix ${suffix} has conflicting targets ${existing} and ${targetSlug}`, errors);
    expectedRedirects.set(suffix, targetSlug);
  };
  for (const person of catalog.people) {
    addExpectedRedirect(person.id, person.slug);
    for (const retiredId of person.retiredIds) addExpectedRedirect(retiredId, person.slug);
  }
  assert(status.personIdRedirects === expectedRedirects.size,
    `Expected ${expectedRedirects.size} person-ID redirects, status reports ${status.personIdRedirects}`, errors);
  const redirectsDir = path.join(options.outputRoot, 'data', 'people', 'redirects');
  const redirectShardFiles = fs.existsSync(redirectsDir)
    ? fs.readdirSync(redirectsDir).filter((name) => /^\d{4}\.json$/u.test(name)).sort()
    : [];
  assert(redirectShardFiles.length === status.redirectShards,
    `Expected ${status.redirectShards} redirect shards, found ${redirectShardFiles.length}`, errors);
  assert(redirectShardFiles.length <= PERSON_PAGE_SHARD_COUNT,
    `Person redirect shard count exceeds ${PERSON_PAGE_SHARD_COUNT}`, errors);
  const actualRedirects = new Map();
  for (const file of redirectShardFiles) {
    const fullPath = path.join(redirectsDir, file);
    assert(fs.statSync(fullPath).size < 25 * 1024 * 1024, `${file} redirect shard exceeds 25 MiB`, errors);
    const shard = readJson(fullPath);
    assert(shard.v === 1 && shard.redirects && typeof shard.redirects === 'object',
      `${file} is not a v1 redirect shard`, errors);
    for (const [suffix, targetSlug] of Object.entries(shard.redirects ?? {})) {
      assert(/^[0-9a-hjkmnp-tv-z]{8}$/u.test(suffix), `${file} has invalid person-ID suffix ${suffix}`, errors);
      assert(personPageShardName(suffix) === file.slice(0, -5), `${suffix} is stored in the wrong redirect shard`, errors);
      assert(!actualRedirects.has(suffix), `${suffix} appears in more than one redirect shard`, errors);
      assert(expectedSlugs.has(targetSlug), `${suffix} redirects to unknown person ${targetSlug}`, errors);
      actualRedirects.set(suffix, targetSlug);
    }
  }
  for (const [suffix, targetSlug] of expectedRedirects) {
    assert(actualRedirects.get(suffix) === targetSlug,
      `Missing person-ID redirect ${suffix} -> ${targetSlug}`, errors);
  }
  for (const suffix of actualRedirects.keys()) {
    assert(expectedRedirects.has(suffix), `Unexpected person-ID redirect ${suffix}`, errors);
  }

  const indexDocument = loadHtml(fs.readFileSync(path.join(peopleDir, 'index.html'), 'utf8'));
  assert(indexDocument('h1').length === 1, 'People index must have one h1', errors);
  assert(indexDocument('link[rel="canonical"]').length === 1, 'People index has no canonical URL', errors);

  const searchEntries = loadSearchEntries(options.outputRoot, errors);
  const searchSlugs = new Set(searchEntries.map((entry) => entry[0]));
  assert(searchSlugs.size === expectedSlugs.size, 'People search contains duplicate or missing slugs', errors);
  for (const slug of expectedSlugs) assert(searchSlugs.has(slug), `Search data omits ${slug}`, errors);
  for (const entry of searchEntries) {
    assert(Array.isArray(entry) && entry.length >= 12, `Search entry ${entry?.[0] ?? '(unknown)'} is not version 3`, errors);
  }

  if (!options.skipChapterLinks) {
    for (const chapter of Object.values(siteIndex.chapters)) {
      const chapterFile = path.join(options.outputRoot, chapter.book, `${chapter.chapter}.html`);
      if (!fs.existsSync(chapterFile)) {
        errors.push(`Missing chapter page for people links: ${chapter.book}/${chapter.chapter}.html`);
        continue;
      }
      const document = loadHtml(fs.readFileSync(chapterFile, 'utf8'));
      const renderedLinks = new Set();
      document('a[data-person-id]').each((_, link) => {
        const personId = document(link).attr('data-person-id');
        const sentenceId = document(link).closest('[id^="zh-"], [id^="en-"]').attr('id');
        if (personId && sentenceId) renderedLinks.add(`${sentenceId}:${personId}`);
      });
      for (const mention of chapter.mentions) {
        for (const language of ['zh', 'en']) {
          if (!(mention.spans[language] ?? []).length) continue;
          assert(renderedLinks.has(`${language}-${mention.unit.id}:${mention.personId}`),
            `${chapter.book}/${chapter.chapter} omits ${language} link ${mention.mentionId}`, errors);
        }
      }
    }
  }

  if (errors.length) {
    const shown = errors.slice(0, 100).map((error) => `- ${error}`).join('\n');
    throw new Error(`People site verification failed (${errors.length} error(s)):\n${shown}`);
  }
  console.log(
    `people site verification passed: ${catalog.people.length} edge-rendered records, ${searchEntries.length} search entries, ` +
    `${Object.keys(siteIndex.chapters).length} annotated chapters${options.skipChapterLinks ? ' (chapter links skipped)' : ''}`,
  );
  return { people: catalog.people.length, searchEntries: searchEntries.length };
}

if (isMain) {
  try {
    verifyPeopleSite(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
