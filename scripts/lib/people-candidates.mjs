import path from 'node:path';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  codePoints,
  occurrenceAt,
  readJson,
  sha256,
} from './people-content.mjs';

const GLOSSARY_FILE = path.join(REPO_ROOT, 'data', 'glossary.json');
const CONFIG_FILE = path.join(PEOPLE_DIR, 'config.json');

const ENGLISH_STOP_WORDS = new Set([
  'A', 'Accordingly', 'An', 'And', 'After', 'Although', 'As', 'At', 'Before', 'Because', 'Both', 'But', 'By',
  'Chapter', 'During', 'Earlier', 'For', 'From', 'Had', 'He', 'Her', 'Here', 'His', 'However',
  'I', 'If', 'In', 'It', 'Its', 'Later', 'Meanwhile', 'My', 'No', 'Now', 'On', 'One', 'Our',
  'Consequently', 'Hence', 'Proud', 'She', 'Since', 'So', 'Soon', 'Such', 'Talent', 'That', 'The',
  'Their', 'Then', 'There', 'Therefore', 'Thereupon', 'These', 'They', 'This', 'Those', 'Thus', 'To',
  'Treatise', 'Two', 'Volume', 'We', 'Whatever',
  'When', 'Where', 'While', 'Who', 'Why', 'With', 'Without', 'Yet', 'You', 'Your'
]);

const ENGLISH_NONPERSON_TITLE_WORDS = new Set([
  'Acting', 'Affairs', 'Army', 'Assistant', 'Attending', 'Barbarians', 'Center-Rank',
  'Chancellor', 'Chariots', 'Chief', 'Circuit', 'Clerk', 'Commandant', 'Commandery',
  'Commissioner', 'Commissioners', 'County', 'Court', 'Department', 'Director',
  'Excellencies', 'General', 'Governor', 'Grand', 'Hall', 'Headquarters', 'Left',
  'Library', 'Master', 'Minister', 'Officer', 'Palace', 'Prefecture', 'Province',
  'Records', 'Registrar', 'Right', 'Southern', 'Staff', 'State', 'Western'
]);

const ENGLISH_PERSON_TITLES = new Set([
  'Consort', 'Duke', 'Emperor', 'Empress', 'King', 'Lady', 'Marquis', 'Prince', 'Princess'
]);

function trieNode() {
  return { children: new Map(), entries: [] };
}

export function loadProperNounMatcher() {
  const root = trieNode();
  const glossary = Object.values(readJson(GLOSSARY_FILE));
  for (const entry of glossary) {
    if (!entry?.isProperNoun || codePoints(entry.text).length < 2) continue;
    let node = root;
    for (const point of codePoints(entry.text)) {
      if (!node.children.has(point)) node.children.set(point, trieNode());
      node = node.children.get(point);
    }
    node.entries.push(entry);
  }
  return root;
}

function matchProperNouns(text, matcher) {
  const points = codePoints(text);
  const matches = [];
  for (let start = 0; start < points.length; start += 1) {
    let node = matcher;
    for (let end = start; end < points.length; end += 1) {
      node = node.children.get(points[end]);
      if (!node) break;
      for (const entry of node.entries) {
        matches.push({ start, end: end + 1, exact: entry.text, entry });
      }
    }
  }
  return matches;
}

function codePointOffset(text, utf16Offset) {
  return codePoints(text.slice(0, utf16Offset)).length;
}

function regexGroupMatches(text, pattern, detectorKind) {
  const matches = [];
  for (const match of text.matchAll(pattern)) {
    const groupIndex = match.indices.findIndex((indices, index) => index > 0 && indices);
    if (groupIndex < 1) continue;
    const [startUtf16, endUtf16] = match.indices[groupIndex];
    const exact = match[groupIndex];
    matches.push({
      start: codePointOffset(text, startUtf16),
      end: codePointOffset(text, endUtf16),
      exact,
      detector: { kind: detectorKind },
    });
  }
  return matches;
}

function chineseFormulaMatches(text) {
  return [
    ...regexGroupMatches(
      text,
      /([\p{Script=Han}]{2,4})[，,](?:字|小字|諱)([\p{Script=Han}]{1,4})(?=[，。；、：:「」『』]|$)/dgu,
      'chinese-name-biography-formula',
    ),
    ...regexGroupMatches(
      text,
      /(?:字|小字|諱|賜名|改名|更名)([\p{Script=Han}]{1,4})(?=[，。；、：:「」『』]|$)/dgu,
      'chinese-name-formula',
    ),
    ...regexGroupMatches(
      text,
      /姓([\p{Script=Han}]{1,2})(?=[，。；、：:「」『』]|$)/dgu,
      'chinese-surname-formula',
    ),
  ];
}

function englishFormulaMatches(text) {
  return regexGroupMatches(
    text,
    /(?:courtesy|childhood|religious|posthumous|personal) name(?: was| is)? ([\p{Lu}][\p{L}\p{M}'’-]*(?: [\p{Lu}][\p{L}\p{M}'’-]*){0,3})/dgiu,
    'english-name-formula',
  );
}

function englishCapitalizedMatches(text) {
  const matches = [];
  const pattern = /\b[\p{Lu}][\p{L}\p{M}'’-]*(?:[ \t]+[\p{Lu}][\p{L}\p{M}'’-]*){0,3}\b/dgu;
  for (const match of text.matchAll(pattern)) {
    let exact = match[0].replace(/[ \t]+/gu, ' ').replace(/[’']s$/u, '');
    let startUtf16 = match.indices[0][0];
    let tokens = exact.split(' ');
    while (tokens.length > 1 && ENGLISH_STOP_WORDS.has(tokens[0])) {
      startUtf16 += tokens.shift().length + 1;
      exact = tokens.join(' ');
    }
    if (tokens.length === 1 && ENGLISH_STOP_WORDS.has(tokens[0])) continue;

    const firstNonpersonTitle = tokens.findIndex((token) => ENGLISH_NONPERSON_TITLE_WORDS.has(token));
    if (firstNonpersonTitle === 0 && !ENGLISH_PERSON_TITLES.has(tokens[0])) continue;
    if (firstNonpersonTitle > 0) {
      tokens = tokens.slice(0, firstNonpersonTitle);
      exact = tokens.join(' ');
    }
    if (!exact) continue;
    matches.push({
      start: codePointOffset(text, startUtf16),
      end: codePointOffset(text, startUtf16 + exact.length),
      exact,
      detector: { kind: 'english-capitalized-expression' },
    });
  }
  return matches;
}

function detectorKey(detector) {
  return JSON.stringify(detector);
}

export function scanPeopleCandidates({ book, chapter, units, properNounMatcher = null }) {
  const matcher = properNounMatcher ?? loadProperNounMatcher();
  const collected = new Map();
  const capitalizedByUnit = new Map();
  const capitalizedFrequency = new Map();

  for (const unit of units) {
    const matches = englishCapitalizedMatches(unit.en);
    capitalizedByUnit.set(unit.id, matches);
    for (const match of matches) {
      capitalizedFrequency.set(match.exact, (capitalizedFrequency.get(match.exact) ?? 0) + 1);
    }
  }

  const add = (unit, language, text, start, end, exact, detector) => {
    if (!exact || start < 0 || end <= start) return;
    const key = `${unit.id}\u0000${language}\u0000${start}\u0000${end}\u0000${exact}`;
    let candidate = collected.get(key);
    if (!candidate) {
      candidate = {
        unit: unit.id,
        unitOrder: unit.order,
        language,
        exact,
        occurrence: occurrenceAt(text, exact, start),
        startCodePoint: start,
        endCodePoint: end,
        detectors: [],
      };
      collected.set(key, candidate);
    }
    if (!candidate.detectors.some((item) => detectorKey(item) === detectorKey(detector))) {
      candidate.detectors.push(detector);
    }
  };

  for (const unit of units) {
    for (const match of matchProperNouns(unit.zh, matcher)) {
      add(unit, 'zh', unit.zh, match.start, match.end, match.exact, {
        kind: 'chinese-notes-proper-noun',
        glossaryId: match.entry.id,
        pinyin: match.entry.pinyin ?? null,
        definitions: (match.entry.definitions ?? []).slice(0, 5),
      });
      for (const definition of new Set(match.entry.definitions ?? [])) {
        if (!/^[\p{Lu}]/u.test(definition) || codePoints(definition).length > 80) continue;
        let start = 0;
        const textPoints = codePoints(unit.en);
        const definitionPoints = codePoints(definition);
        while (start <= textPoints.length - definitionPoints.length) {
          const found = textPoints.findIndex((point, index) =>
            index >= start && definitionPoints.every((wanted, offset) => textPoints[index + offset] === wanted)
          );
          if (found < 0) break;
          add(unit, 'en', unit.en, found, found + definitionPoints.length, definition, {
            kind: 'chinese-notes-english-definition',
            glossaryId: match.entry.id,
            pinyin: match.entry.pinyin ?? null,
            definitions: [definition],
          });
          start = found + definitionPoints.length;
        }
      }
    }
    for (const match of chineseFormulaMatches(unit.zh)) {
      add(unit, 'zh', unit.zh, match.start, match.end, match.exact, match.detector);
    }
    for (const match of englishFormulaMatches(unit.en)) {
      add(unit, 'en', unit.en, match.start, match.end, match.exact, match.detector);
    }
    for (const match of capitalizedByUnit.get(unit.id) ?? []) {
      const tokenCount = match.exact.split(' ').length;
      const repeated = (capitalizedFrequency.get(match.exact) ?? 0) >= 2;
      const titled = ENGLISH_PERSON_TITLES.has(match.exact.split(' ')[0]);
      if (tokenCount === 1 && !repeated && !titled) continue;
      add(unit, 'en', unit.en, match.start, match.end, match.exact, match.detector);
    }
  }

  const candidates = [...collected.values()].sort((left, right) =>
    left.unitOrder - right.unitOrder ||
    left.language.localeCompare(right.language) ||
    left.startCodePoint - right.startCodePoint ||
    right.endCodePoint - left.endCodePoint ||
    left.exact.localeCompare(right.exact)
  );
  return candidates.map(({ unitOrder: _unitOrder, ...candidate }) => {
    const stableKey = [candidate.unit, candidate.language, candidate.exact, candidate.occurrence].join('\u0000');
    const suffix = sha256(stableKey).slice('sha256:'.length, 'sha256:'.length + 16);
    return { id: `${book}:${chapter}:cand_${suffix}`, ...candidate };
  });
}

export function candidateScannerVersion() {
  return readJson(CONFIG_FILE).candidateScannerVersion;
}
