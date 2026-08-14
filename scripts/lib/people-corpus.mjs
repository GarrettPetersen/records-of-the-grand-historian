import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from '../build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from '../validate-people-extraction.mjs';
import { loadProperNounMatcher } from './people-candidates.mjs';
import { isCompactPeopleExtraction } from './people-compact.mjs';
import { DATA_DIR, PEOPLE_DIR, REPO_ROOT, readJson } from './people-content.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './people-schema.mjs';

export function peopleExtractionFiles() {
  const root = path.join(PEOPLE_DIR, 'extractions');
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const book of fs.readdirSync(root).sort()) {
    const directory = path.join(root, book);
    if (!fs.statSync(directory).isDirectory()) continue;
    for (const name of fs.readdirSync(directory).filter((file) => /^\d{3}\.json$/u.test(file)).sort()) {
      files.push(path.join(directory, name));
    }
  }
  return files;
}

export function sourceChapterIds() {
  const chapterIds = [];
  for (const entry of fs.readdirSync(DATA_DIR, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(DATA_DIR, entry.name);
    for (const name of fs.readdirSync(directory).filter((file) => /^\d{3}\.json$/u.test(file)).sort()) {
      chapterIds.push(`${entry.name}:${name.slice(0, -5)}`);
    }
  }
  return chapterIds;
}

export function peopleResolutionFiles() {
  const root = path.join(PEOPLE_DIR, 'resolutions');
  if (!fs.existsSync(root)) return [];
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && entry.name.endsWith('.json')) files.push(file);
    }
  };
  visit(root);
  return files;
}

export function loadValidatedResolutionDocuments(localPeople) {
  const ajv = createPeopleSchemaValidator();
  const validate = ajv.getSchema('https://24histories.com/schema/people/resolution-v1.json');
  const documents = [];
  const batches = new Set();
  for (const file of peopleResolutionFiles()) {
    const document = readJson(file);
    if (!validate(document)) {
      throw new Error(
        `${path.relative(REPO_ROOT, file)} failed resolution schema validation:\n` +
        formatSchemaErrors(validate.errors).map((item) => `- ${item}`).join('\n'),
      );
    }
    if (batches.has(document.batch)) throw new Error(`Duplicate resolution batch ${document.batch}`);
    batches.add(document.batch);
    for (const decision of document.decisions) {
      for (const localId of decision.localPeople) {
        if (!localPeople.has(localId)) {
          throw new Error(`${path.relative(REPO_ROOT, file)} refers to unknown local person ${localId}`);
        }
      }
    }
    documents.push(document);
  }
  return documents;
}

export function loadValidatedPeopleCorpus() {
  const files = peopleExtractionFiles();
  const expectedChapterIds = sourceChapterIds();
  const expectedChapterSet = new Set(expectedChapterIds);
  const matcher = files.length > 0 ? loadProperNounMatcher() : null;
  const chapters = [];
  const localPeople = new Map();
  const extractedChapterIds = new Set();

  for (const file of files) {
    const raw = readJson(file);
    const packet = buildPeopleExtractionPacket(raw.book, raw.chapter, { properNounMatcher: matcher });
    const result = isCompactPeopleExtraction(raw)
      ? validateCompactPeopleExtraction(raw, packet)
      : validatePeopleExtraction(raw, packet);
    const extraction = result.normalized;
    const chapterId = `${extraction.book}:${extraction.chapter}`;
    if (!expectedChapterSet.has(chapterId)) {
      throw new Error(`${path.relative(REPO_ROOT, file)} does not correspond to a source chapter`);
    }
    if (extractedChapterIds.has(chapterId)) throw new Error(`Duplicate people extraction scope ${chapterId}`);
    extractedChapterIds.add(chapterId);
    const claimsByPerson = new Map();
    const mentionsByPerson = new Map();
    for (const claim of extraction.claims) {
      if (!claimsByPerson.has(claim.subject)) claimsByPerson.set(claim.subject, []);
      claimsByPerson.get(claim.subject).push(claim);
    }
    for (const mention of extraction.mentions) {
      if (!mentionsByPerson.has(mention.person)) mentionsByPerson.set(mention.person, []);
      mentionsByPerson.get(mention.person).push(mention);
    }
    for (const person of extraction.people) {
      if (localPeople.has(person.localId)) throw new Error(`Duplicate local person ID ${person.localId}`);
      localPeople.set(person.localId, {
        ...person,
        book: extraction.book,
        chapter: extraction.chapter,
        promptVersion: extraction.run.promptVersion,
        claims: claimsByPerson.get(person.localId) ?? [],
        mentions: mentionsByPerson.get(person.localId) ?? [],
      });
    }
    chapters.push({ file, packet, extraction });
  }

  return {
    chapters,
    localPeople,
    coverage: {
      sourceChapters: expectedChapterIds.length,
      extractedChapters: extractedChapterIds.size,
      missingChapterIds: expectedChapterIds.filter((chapterId) => !extractedChapterIds.has(chapterId)),
    },
  };
}
