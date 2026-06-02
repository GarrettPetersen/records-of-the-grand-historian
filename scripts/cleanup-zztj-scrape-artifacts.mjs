#!/usr/bin/env node
/**
 * cleanup-zztj-scrape-artifacts.mjs
 *
 * Cleans scraper-induced HTML artifacts from Zizhi Tongjian data:
 * - Strips <ref>...</ref>, </ref>, <references/>, mangled <divclass=...references...>, <onlyinclude>, <motion.div>, <sub> etc from zh, literal, idiomatic.
 * - Merges sentences that were split across <ref> / </ref> tag boundaries.
 * - Drops pure-artifact sentences (empty after clean, only HTML tags, trailing mangled ref divs, single-CJK dynasty chars at chapter end, leading <onlyinclude> etc).
 * - Promotes ref note content (esp. the English translations of them) to proper "footnote" fields where possible, so they render with the project's footnote system.
 * - Recalcs per-chapter sentence counts in meta (final fix-translated-counts recommended after).
 *
 * Run:
 *   node scripts/cleanup-zztj-scrape-artifacts.mjs
 *
 * Then typically:
 *   node fix-translated-counts.js --book zizhitongjian
 *   node generate-static-pages.js --book zizhitongjian
 *   node generate-manifest.js
 *   make sync BOOK=zizhitongjian
 * or just: make update BOOK=zizhitongjian
 */

import fs from 'node:fs';
import path from 'node:path';

const BOOK = 'zizhitongjian';
const DATA_DIR = path.join('data', BOOK);

function cleanTags(text) {
  if (typeof text !== 'string') return '';
  let t = text;
  // remove common mangled/closing tags (order matters a bit)
  t = t.replace(/<\/?ref[^>]*>/gi, '');
  t = t.replace(/<ref[^>]*>/gi, '');
  t = t.replace(/<references[^>]*\/?>/gi, '');
  t = t.replace(/<\/?div[^>]*>/gi, '');
  t = t.replace(/<\/?motion\.?div[^>]*>/gi, '');
  t = t.replace(/<\/?onlyinclude[^>]*>/gi, '');
  t = t.replace(/<\/?sub[^>]*>/gi, '');
  // stray artifacts seen
  t = t.replace(/chapter\s*=\s*["'][^"']*["']/gi, '');
  t = t.replace(/\s+/g, ' ');
  // fix spacing around Chinese punctuation from merges
  t = t.replace(/\s+([，。、；：！？])/g, '$1');
  t = t.replace(/([，。、；：！？])\s+/g, '$1');
  return t.trim();
}

function extractAndStripRefs(text) {
  if (typeof text !== 'string') return { clean: '', refNotes: [] };
  let refNotes = [];
  let t = text.replace(/<ref[^>]*>([\s\S]*?)(?:<\/ref>|$)/gi, (_m, inner) => {
    const note = (inner || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (note) refNotes.push(note);
    return '';
  });
  t = t.replace(/<\/?ref[^>]*>/gi, '');
  t = cleanTags(t);
  return { clean: t, refNotes };
}

function cleanTransFields(trans) {
  if (!trans) return;
  if (trans.literal) {
    const info = extractAndStripRefs(trans.literal);
    trans.literal = info.clean;
    if (info.refNotes.length && !trans.footnote) {
      // may be used later
    }
  }
  if (trans.idiomatic) {
    const info = extractAndStripRefs(trans.idiomatic);
    trans.idiomatic = info.clean;
  }
  // also strip from other possible
  if (trans.en) trans.en = cleanTags(trans.en);
  if (trans.english) trans.english = cleanTags(trans.english);
}

function isPureArtifact(zh) {
  if (!zh) return true;
  const t = zh.trim();
  if (!t) return true;
  if (/^<[^>]+>$/.test(t.replace(/\s/g, ''))) return true;
  if (/^ces-small|references-small|references\/|onlyinclude/i.test(t)) return true;
  if (/^[\u4e00-\u9fff]$/.test(t)) return true; // single CJK (dynasty marker at end)
  if (/^[\d\s:：]+$/.test(t) && t.length < 5) return true; // stray numbers
  return false;
}

function processChapter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (!data.content || !Array.isArray(data.content)) return { changed: false };

  let totalSentencesBefore = 0;
  let totalSentencesAfter = 0;
  let merges = 0;
  let dropped = 0;
  let tagsStripped = 0;
  let contentImproved = 0;

  function countSents(blocks) {
    let c = 0;
    for (const b of blocks) {
      if (b.sentences) c += b.sentences.length;
      if (b.cells) for (const cell of b.cells) if (cell.sentences) c += cell.sentences.length;
    }
    return c;
  }

  totalSentencesBefore = countSents(data.content);

  const newContent = [];

  for (const block of data.content) {
    let sents = [];
    if (block.sentences) sents = block.sentences;
    else if (block.cells) {
      // zztj unlikely to have tables with sents, but handle
      for (const cell of block.cells) {
        if (cell.sentences) sents.push(...cell.sentences);
      }
    }

    const newSents = [];
    for (let i = 0; i < sents.length; i++) {
      let s = JSON.parse(JSON.stringify(sents[i])); // deep copy

      // extract/strip refs from zh
      const zhInfo = extractAndStripRefs(s.zh || s.content || '');
      s.zh = zhInfo.clean;
      if (s.content && typeof s.content === 'string') s.content = zhInfo.clean;

      if (s.translations && s.translations[0]) {
        cleanTransFields(s.translations[0]);
      }

      // detect split-ref merge with next
      let consumedNext = false;
      if (i + 1 < sents.length) {
        const nextRaw = sents[i + 1];
        const nextZhRaw = nextRaw.zh || nextRaw.content || '';
        const looksSplit = zhInfo.refNotes.length > 0 ||
                           /^<\/?ref/i.test(nextZhRaw.trim()) ||
                           /<ref[^>]*>[^<]*$/.test((s.zh || ''));
        if (looksSplit) {
          const next = JSON.parse(JSON.stringify(nextRaw));
          const nextInfo = extractAndStripRefs(nextZhRaw);
          let joiner = ' ';
          const nc = nextInfo.clean;
          if (!nc) joiner = '';
          else if (/^[，。、；：！？,.]/.test(nc)) joiner = '';
          const mergedZh = (s.zh + joiner + nc).replace(/\s+/g, ' ').trim();
          s.zh = mergedZh;
          if (next.translations && next.translations[0]) {
            cleanTransFields(next.translations[0]);
            const nt = next.translations[0];
            const nIdio = nt.idiomatic || '';
            const nLit = nt.literal || '';
            if (!s.translations || !s.translations[0]) {
              s.translations = [{ ...nt, literal: nLit, idiomatic: nIdio }];
            } else {
              const t = s.translations[0];
              const currIdio = (t.idiomatic || '').trim();
              const looksLikeNote = zhInfo.refNotes.length > 0 ||
                                    /Note:|supplemented|據|增補|章校|索隱|校/.test(currIdio);
              if (looksLikeNote && !t.footnote) {
                let fn = currIdio.replace(/^Note:\s*/i, '')
                  .replace(/^\d+[\.\s]+/, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .replace(/\s*[。.]?\s*$/, '')
                  .trim();
                t.footnote = fn;
                t.idiomatic = nIdio || t.idiomatic;
                t.literal = nLit || t.literal;
              } else {
                if (nIdio) t.idiomatic = (t.idiomatic || '').trim() + (t.idiomatic ? ' ' : '') + nIdio;
                if (nLit) t.literal = (t.literal || '').trim() + (t.literal ? ' ' : '') + nLit;
              }
            }
          }
          merges++;
          i++; // consume next
          consumedNext = true;
        }
      }

      // drop pure artifacts (after merge/strip)
      if (isPureArtifact(s.zh)) {
        // if this was a note-only sent (no zh now), try attach its trans as footnote to prev
        if (s.translations && s.translations[0]) {
          const t = s.translations[0];
          const noteCand = (t.footnote || t.idiomatic || t.literal || '').trim();
          if (noteCand && newSents.length > 0) {
            const prevT = newSents[newSents.length - 1].translations && newSents[newSents.length - 1].translations[0];
            if (prevT && !prevT.footnote) {
              let fn = noteCand.replace(/^Note:\s*/i, '')
                .replace(/^\d+[\.\s]+/, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/\s*[。.]?\s*$/, '')
                .trim();
              prevT.footnote = fn;
            }
          }
        }
        dropped++;
        continue;
      }

      // count a strip if original had tags
      if ((sents[i].zh || '').includes('<')) tagsStripped++;

      // final aggressive clean on all fields of this sent
      if (s.zh) {
        const b = s.zh;
        s.zh = cleanTags(s.zh);
        if (s.zh !== b) { tagsStripped++; contentImproved++; }
      }
      if (s.translations && s.translations[0]) {
        const t = s.translations[0];
        ['literal', 'idiomatic', 'en', 'english'].forEach(k => {
          if (typeof t[k] === 'string') {
            const b = t[k];
            t[k] = cleanTags(t[k]);
            if (t[k] !== b) { tagsStripped++; contentImproved++; }
          }
        });
      }

      newSents.push(s);
    }

    // only keep block if it still has sentences (or cells, but rare)
    if (newSents.length > 0) {
      const newBlock = { ...block, sentences: newSents };
      // if had cells, we didn't touch much, but for zztj ok
      if (block.cells) {
        // for completeness, could clean cells but skip for now
      }
      newContent.push(newBlock);
    }
  }

  data.content = newContent;

  const afterCount = countSents(data.content);
  totalSentencesAfter = afterCount;

  // update meta counts (fix-translated-counts will refine using the metrics fn)
  if (data.meta) {
    data.meta.sentenceCount = afterCount;
    // translatedCount will be re-counted by the metrics (counts those with actual trans)
    // leave it or set; the fix script will correct
  }

  const changed = totalSentencesBefore !== totalSentencesAfter || merges > 0 || dropped > 0 || tagsStripped > 0 || contentImproved > 0;

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  return {
    chapter: path.basename(filePath, '.json'),
    before: totalSentencesBefore,
    after: totalSentencesAfter,
    removed: totalSentencesBefore - totalSentencesAfter,
    merges,
    dropped,
    tagsStripped,
    contentImproved,
    changed
  };
}

function main() {
  console.log(`Cleaning Zizhi Tongjian scrape artifacts in ${DATA_DIR}...`);
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => /^\d{3}\.json$/.test(f))
    .sort();
  let grandRemoved = 0;
  let grandMerges = 0;
  let grandDropped = 0;
  let grandTags = 0;
  let filesChanged = 0;

  for (const f of files) {
    const fp = path.join(DATA_DIR, f);
    const res = processChapter(fp);
    if (res.changed) {
      filesChanged++;
      grandRemoved += res.removed;
      grandMerges += res.merges;
      grandDropped += res.dropped;
      grandTags += res.tagsStripped;
      console.log(`  ${res.chapter}: -${res.removed} sents (merges:${res.merges}, dropped:${res.dropped}, tags:${res.tagsStripped}, improved:${res.contentImproved||0})`);
    }
  }

  console.log(`\nDone. Files changed: ${filesChanged}`);
  console.log(`Total sentences removed: ${grandRemoved}`);
  console.log(`Total ref-splits merged: ${grandMerges}`);
  console.log(`Total pure artifacts dropped: ${grandDropped}`);
  console.log(`Total tag occurrences stripped (approx): ${grandTags}`);
  console.log(`\nNext: node fix-translated-counts.js --book ${BOOK}`);
  console.log(`Then: node generate-static-pages.js --book ${BOOK}`);
  console.log(`      make sync BOOK=${BOOK}   (or make update BOOK=${BOOK})`);
}

main();
