import { IDENTITY_UNCERTAINTY_NOTE } from './people-chapter-identity.mjs';
import { chineseText, englishText, sourceUnitAt } from './people-content.mjs';
import { chapterPeopleContext } from './people-site.mjs';
import { assessEbookPeopleReadiness } from './ebook-people-readiness.mjs';
import { ebookSentenceHref } from './ebook-content-layout.mjs';
import { escapeXml, textContent, visibleTableText, formatList } from './ebook-text.mjs';
import { humanizePeopleValue, personDisplayName, personFullDisplayName, personLifeSummary,
  personPublicAliases, personPublicDescription } from './people-presentation.mjs';
const peopleGlossaryTitle = 'People Glossary';

export function ebookPersonAnchor(personId) {
  return `person-${personId}`;
}

export function buildEbookPeople(siteContext, product, { allowPreview = false } = {}) {
  const readiness = assessEbookPeopleReadiness(siteContext, product, {
    allowPreview,
  });
  if (!readiness.active) return readiness;
  const { chapterIds } = readiness;
  const people = readiness.people.sort((left, right) =>
    personDisplayName(left).localeCompare(personDisplayName(right), 'en') || left.id.localeCompare(right.id)
  );
  const peopleById = new Map(people.map((person) => [person.id, person]));
  const shards = [];
  const shardSize = 350;
  for (let index = 0; index < people.length; index += shardSize) {
    const number = shards.length + 1;
    shards.push({
      number,
      file: `glossary-${String(number).padStart(3, '0')}.xhtml`,
      people: people.slice(index, index + shardSize),
    });
  }
  const fileByPersonId = new Map();
  for (const shard of shards) {
    for (const person of shard.people) fileByPersonId.set(person.id, shard.file);
  }
  const chapterContexts = new Map(product.chapters.map((chapter) => {
    const chapterId = String(chapter).padStart(3, '0');
    return [chapterId, chapterPeopleContext(siteContext, product.book, chapterId)];
  }));
  const mentionSpanKeys = new Set();
  for (const [chapterId, context] of chapterContexts) {
    for (const mention of context?.record.mentions ?? []) {
      for (const span of mention.spans?.en ?? []) {
        mentionSpanKeys.add([
          chapterId,
          mention.unit.id,
          mention.personId,
          span.startCodePoint,
          span.endCodePoint,
        ].join(':'));
      }
    }
  }
  const backlinks = people.reduce((total, person) =>
    total + person.references.filter((reference) =>
      reference.book === product.book && chapterIds.has(reference.chapter)
    ).length, 0);
  return {
    active: true,
    ready: readiness.ready,
    preview: readiness.preview,
    reason: null,
    book: product.book,
    chapterIds,
    people,
    missingChapters: readiness.missingChapters,
    legacyChapters: readiness.legacyChapters,
    dateAuditChapters: readiness.dateAuditChapters,
    peopleNeedingReview: readiness.peopleNeedingReview,
    peopleById,
    familyPeopleById: siteContext.peopleById,
    certificate: siteContext.certificate ?? null,
    shards,
    fileByPersonId,
    chapterContexts,
    expectedMentionLinks: mentionSpanKeys.size,
    expectedBacklinks: backlinks,
  };
}

export function ebookPersonHref(ebookPeople, personId, from = 'chapter') {
  const file = ebookPeople?.fileByPersonId.get(personId);
  if (!file) throw new Error(`No EPUB glossary target for canonical person ${personId}`);
  const prefix = from === 'chapter' ? '../people/' : '';
  return `${prefix}${file}#${ebookPersonAnchor(personId)}`;
}

function ebookGlossaryReferences(person, ebookPeople) {
  return person.references.filter((reference) =>
    reference.book === ebookPeople.book && ebookPeople.chapterIds.has(reference.chapter)
  );
}

function renderEbookGlossaryFamily(person, ebookPeople) {
  const rows = [];
  const seen = new Set();
  for (const relationship of person.familyRelationships) {
    const key = `${relationship.edgeId}:${relationship.value.relation}:${relationship.value.personId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const target = ebookPeople.familyPeopleById.get(relationship.value.personId);
    if (!target) throw new Error(`Missing EPUB family target ${relationship.value.personId}`);
    const label = `${humanizePeopleValue(relationship.value.relation)} ${personFullDisplayName(target)}`;
    const targetFile = ebookPeople.fileByPersonId.get(target.id);
    if (ebookPeople.certificate && !targetFile) throw new Error(`Certified family target ${target.id} has no glossary entry`);
    rows.push(targetFile
      ? `<li><a href="${escapeXml(targetFile)}#${ebookPersonAnchor(target.id)}">${escapeXml(label)}</a></li>`
      : `<li>${escapeXml(label)}</li>`);
  }
  return rows.length ? `<h3>Family</h3><ul class="glossary-family">${rows.join('')}</ul>` : '';
}

function renderEbookGlossaryReferences(person, ebookPeople, chapterTitles, contentLayout, chapterDataById) {
  const groups = new Map();
  for (const reference of ebookGlossaryReferences(person, ebookPeople)) {
    if (!groups.has(reference.chapter)) groups.set(reference.chapter, []);
    groups.get(reference.chapter).push(reference);
  }
  if (!groups.size) return '';
  const rows = [...groups.entries()].sort((left, right) => left[0].localeCompare(right[0])).map(([chapter, refs]) => {
    const title = chapterTitles.get(chapter) || `Chapter ${Number.parseInt(chapter, 10)}`;
    const chapterData = chapterDataById.get(chapter);
    if (!chapterData) throw new Error(`Missing EPUB source chapter ${ebookPeople.book}/${chapter} for glossary reference`);
    const snippets = refs.map((reference) => {
      const unit = sourceUnitAt(chapterData, {
        id: reference.unitId,
        kind: reference.unitKind,
        blockIndex: reference.blockIndex,
        collection: reference.collection,
        itemIndex: reference.itemIndex,
      });
      const href = `../${ebookSentenceHref(contentLayout, chapter, 'en', reference.unitId, 'text/')}`;
      const zh = visibleTableText(chineseText(unit));
      const en = visibleTableText(englishText(unit));
      if (!zh && !en) throw new Error(`Empty EPUB glossary reference ${ebookPeople.book}:${chapter}:${reference.unitId}`);
      return `<article class="glossary-mention-snippet">` +
        `${zh ? `<a class="glossary-mention-source" lang="zh-Hant" href="${escapeXml(href)}">${escapeXml(zh)}</a>` : ''}` +
        `${en ? `<a class="glossary-mention-link" href="${escapeXml(href)}">${escapeXml(en)}</a>` : ''}` +
        `</article>`;
    }).join('');
    return `<li><h4>${escapeXml(title)}</h4>${snippets}</li>`;
  });
  return `<h3>Mentions</h3><ul class="glossary-mentions">${rows.join('')}</ul>`;
}

function renderEbookAliasTable(person) {
  const aliases = personPublicAliases(person);
  if (!aliases.length) return '';
  const rows = aliases.map((name) => `<tr><th>${escapeXml(humanizePeopleValue(name.kind || 'name'))}</th>` +
    `<td>${escapeXml(name.en || '')}</td><td lang="zh-Hant">${escapeXml(name.zh || '')}</td>` +
    `<td>${escapeXml(name.pinyin || '')}</td></tr>`).join('');
  return `<h3>Other names</h3><div class="glossary-aliases"><table><thead><tr>` +
    `<th>Type</th><th>English</th><th>Chinese</th><th>Pinyin</th>` +
    `</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderEbookGlossaryEntry(person, ebookPeople, chapterTitles, contentLayout, chapterDataById) {
  const roles = person.roles.map((role) => role.label);
  const lifeSummary = personLifeSummary(person);
  return `<section class="glossary-entry" id="${ebookPersonAnchor(person.id)}">
  <h2>${escapeXml(personDisplayName(person))}${person.preferredName.zh ? ` <span lang="zh-Hant">${escapeXml(person.preferredName.zh)}</span>` : ''}</h2>
  <p class="glossary-description">${escapeXml(personPublicDescription(person))}</p>
  ${person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE) ? `<p class="glossary-identity-note">${escapeXml(IDENTITY_UNCERTAINTY_NOTE)}</p>` : ''}
  ${lifeSummary ? `<p class="glossary-dates">${escapeXml(lifeSummary)}</p>` : ''}
  ${roles.length ? `<p><strong>Roles:</strong> ${escapeXml(formatList(roles))}</p>` : ''}
  ${renderEbookAliasTable(person)}
  ${renderEbookGlossaryFamily(person, ebookPeople)}
  ${renderEbookGlossaryReferences(person, ebookPeople, chapterTitles, contentLayout, chapterDataById)}
</section>`;
}

export function renderEbookPeopleIndex(ebookPeople) {
  const items = ebookPeople.people.map((person) => {
    const file = ebookPeople.fileByPersonId.get(person.id);
    return `<li><a class="glossary-person-link" href="${escapeXml(file)}#${ebookPersonAnchor(person.id)}">` +
      `${escapeXml(personDisplayName(person))}${person.preferredName.zh ? ` <span lang="zh-Hant">${escapeXml(person.preferredName.zh)}</span>` : ''}` +
      `</a><span>${escapeXml(personPublicDescription(person))}</span></li>`;
  }).join('\n      ');
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${peopleGlossaryTitle}</title>
  <link rel="stylesheet" type="text/css" href="../styles/ebook.css" />
</head>
<body>
  <nav epub:type="glossary" class="people-glossary-index">
    <h1>${peopleGlossaryTitle}</h1>
    <ol>${items}</ol>
  </nav>
</body>
</html>`;
}

export function renderEbookGlossaryShard(shard, ebookPeople, chapterTitles, contentLayout, chapterDataById) {
  const entries = shard.people.map((person) =>
    renderEbookGlossaryEntry(person, ebookPeople, chapterTitles, contentLayout, chapterDataById)
  ).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${peopleGlossaryTitle} ${shard.number}</title>
  <link rel="stylesheet" type="text/css" href="../styles/ebook.css" />
</head>
<body>
  <section epub:type="glossary" class="people-glossary">
    <h1>${peopleGlossaryTitle}</h1>
    ${entries}
  </section>
</body>
</html>`;
}
