#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadHtml } from 'cheerio';
import { listHtmlFilesRecursively, PEOPLE_DIR, readJson, REPO_ROOT } from './lib/people-content.mjs';
import { assertPeopleCatalogPublicationState } from './lib/people-publication.mjs';

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
    if (!catalog.complete && !options.allowPreview) {
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
    assert(status.extractedChapters === status.sourceChapters,
      'Published people site does not cover every source chapter', errors);
    assert(status.missingChapters === 0, 'Published people site reports missing chapters', errors);
  }
  if (status.preview && !options.allowPreview) errors.push('People site is a noindex preview, not a publication build');
  if (!status.preview && !status.published) errors.push('People site is not marked published');

  const peopleDir = path.join(options.outputRoot, 'people');
  assert(fs.existsSync(path.join(peopleDir, 'index.html')), 'Missing people index page', errors);
  const pageFiles = fs.existsSync(peopleDir)
    ? fs.readdirSync(peopleDir).filter((name) => name !== 'index.html' && name.endsWith('.html'))
    : [];
  assert(pageFiles.length === catalog.people.length,
    `Expected ${catalog.people.length} person pages, found ${pageFiles.length}`, errors);
  const allPeopleHtml = fs.existsSync(peopleDir) ? listHtmlFilesRecursively(peopleDir) : [];
  const browseFiles = allPeopleHtml.filter((name) => name.includes(path.sep));
  assert(browseFiles.length === status.browsePages,
    `Expected ${status.browsePages} people browse pages, found ${browseFiles.length}`, errors);

  const expectedSlugs = new Set(catalog.people.map((person) => person.slug));
  const peopleById = new Map(catalog.people.map((person) => [person.id, person]));
  const actualSlugs = new Set(pageFiles.map((file) => file.slice(0, -5)));
  for (const slug of expectedSlugs) assert(actualSlugs.has(slug), `Missing person page ${slug}.html`, errors);
  for (const slug of actualSlugs) assert(expectedSlugs.has(slug), `Unexpected person page ${slug}.html`, errors);

  for (const person of catalog.people) {
    const file = path.join(peopleDir, `${person.slug}.html`);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const document = loadHtml(html);
    assert(document('h1').length === 1, `${person.slug}.html must have one h1`, errors);
    assert(document('link[rel="canonical"]').length === 1, `${person.slug}.html has no canonical URL`, errors);
    assert(document('script[type="application/ld+json"]').length === 1, `${person.slug}.html has no Person JSON-LD`, errors);
    assert(document('.person-reference').length === person.references.length,
      `${person.slug}.html has ${document('.person-reference').length}/${person.references.length} reference snippets`, errors);
    for (const relationship of person.familyRelationships) {
      const target = peopleById.get(relationship.value.personId);
      assert(Boolean(target), `${person.slug}.html has a family link to an unknown person`, errors);
      if (target) assert(document(`a[href="${target.slug}.html"]`).length > 0,
        `${person.slug}.html does not link to family target ${target.slug}`, errors);
    }
  }

  const directorySlugs = new Set();
  for (const relativeFile of browseFiles) {
    const html = fs.readFileSync(path.join(peopleDir, relativeFile), 'utf8');
    const document = loadHtml(html);
    assert(document('h1').length === 1, `${relativeFile} must have one h1`, errors);
    assert(document('link[rel="canonical"]').length === 1, `${relativeFile} has no canonical URL`, errors);
    assert(document('script[type="application/ld+json"]').length === 1, `${relativeFile} has no collection JSON-LD`, errors);
    if (relativeFile.startsWith(`directory${path.sep}`)) {
      document('a[href^="../"][href$=".html"]').each((_, link) => {
        const href = document(link).attr('href');
        if (href && /^\.\.\/[^/]+\.html$/u.test(href) && href !== '../index.html') {
          directorySlugs.add(href.slice(3, -5));
        }
      });
    }
  }
  assert(directorySlugs.size === expectedSlugs.size,
    `A-Z directory links to ${directorySlugs.size}/${expectedSlugs.size} people`, errors);
  for (const slug of expectedSlugs) assert(directorySlugs.has(slug), `A-Z directory omits ${slug}`, errors);

  const searchEntries = loadSearchEntries(options.outputRoot, errors);
  const searchSlugs = new Set(searchEntries.map((entry) => entry[0]));
  assert(searchSlugs.size === expectedSlugs.size, 'People search contains duplicate or missing slugs', errors);
  for (const slug of expectedSlugs) assert(searchSlugs.has(slug), `Search data omits ${slug}`, errors);
  for (const entry of searchEntries) {
    assert(Array.isArray(entry) && entry.length >= 11, `Search entry ${entry?.[0] ?? '(unknown)'} is not version 2`, errors);
  }

  if (!options.skipChapterLinks) {
    for (const chapter of Object.values(siteIndex.chapters)) {
      const chapterFile = path.join(options.outputRoot, chapter.book, `${chapter.chapter}.html`);
      if (!fs.existsSync(chapterFile)) {
        errors.push(`Missing chapter page for people links: ${chapter.book}/${chapter.chapter}.html`);
        continue;
      }
      const document = loadHtml(fs.readFileSync(chapterFile, 'utf8'));
      for (const mention of chapter.mentions) {
        for (const language of ['zh', 'en']) {
          if (!(mention.spans[language] ?? []).length) continue;
          assert(document(`#${language}-${mention.unit.id} a[data-person-id="${mention.personId}"]`).length > 0,
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
    `people site verification passed: ${catalog.people.length} pages, ${searchEntries.length} search entries, ` +
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
