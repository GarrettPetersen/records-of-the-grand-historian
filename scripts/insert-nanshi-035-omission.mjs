#!/usr/bin/env node
import fs from 'node:fs';

const CHAPTER_PATH = 'data/nanshi/035.json';
const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-nanshi.json';
const ITEM_ID = 'source-nanshi-035-wikisource-6fc21e31307e';
const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'GPT-5 Codex';

const rows = [
  {
    zh: '子仲遠，初爲宋明帝府佐。',
    literal: 'His son Zhongyuan initially served on the staff of Emperor Ming of Song.',
    idiomatic: 'His son Zhongyuan initially served on Emperor Ming of Song’s staff.',
  },
  {
    zh: '廢帝景和中，明帝疑防，賓客故人無到門者，唯仲遠朝謁不替。',
    literal: 'During the Jinghe reign of the Deposed Emperor, Emperor Ming was under suspicion and guard, and none of his guests or old friends came to his gate; only Zhongyuan did not cease his court visits.',
    idiomatic: 'During the Deposed Emperor’s Jinghe reign, Emperor Ming was watched with suspicion, and none of his guests or old friends dared come to his gate; only Zhongyuan continued his visits without interruption.',
  },
  {
    zh: '明帝即位，謂曰：「卿所謂疾風知勁草。',
    literal: 'When Emperor Ming ascended the throne, he said to him: “You are what is meant by saying that in a fierce wind one knows the strong grass.',
    idiomatic: 'When Emperor Ming took the throne, he told him: “You are what they mean by knowing the strong grass in a fierce wind.',
  },
  {
    zh: '」自軍錄事參軍擢拜太子中庶子，卒于豫章太守。',
    literal: '” From Army Recording Clerk and Adjutant he was promoted and appointed Palace Attendant to the Crown Prince, and died as Administrator of Yuzhang.',
    idiomatic: '” From army recording clerk and adjutant he was promoted to Palace Attendant to the Crown Prince, and he died while serving as Administrator of Yuzhang.',
  },
  {
    zh: '贈侍中。',
    literal: 'He was posthumously granted the title Palace Attendant.',
    idiomatic: 'He was posthumously granted the title Palace Attendant.',
  },
  {
    zh: '登之弟仲文。',
    literal: 'Dengzhi’s younger brother was Zhongwen.',
    idiomatic: 'Dengzhi’s younger brother was Zhongwen.',
  },
];

function sentenceUnit(row, idNumber) {
  return {
    id: `s${String(idNumber).padStart(4, '0')}`,
    zh: row.zh,
    translations: [
      {
        lang: 'en',
        literal: row.literal,
        idiomatic: row.idiomatic,
        translator: TRANSLATOR,
        model: MODEL,
        reviewed: true,
      },
    ],
  };
}

function walkSentences(chapter, fn) {
  for (const block of chapter.content || []) {
    if (block.type !== 'paragraph' || !Array.isArray(block.sentences)) continue;
    for (const sentence of block.sentences) fn(sentence);
  }
}

function renumberIds(chapter, shiftFrom, delta) {
  walkSentences(chapter, (sentence) => {
    const match = String(sentence.id || '').match(/^s(\d+)$/u);
    if (match && Number(match[1]) >= shiftFrom) {
      sentence.id = `s${String(Number(match[1]) + delta).padStart(4, '0')}`;
    }
  });
}

function updateMeta(chapter) {
  let count = 0;
  walkSentences(chapter, () => {
    count += 1;
  });
  chapter.meta.sentenceCount = count;
  chapter.meta.translatedCount = count;
}

function shiftQueueLocations(queue, shiftFromId, delta) {
  const items = Array.isArray(queue) ? queue : queue.items;
  const now = new Date().toISOString();
  for (const item of items) {
    if (item.book !== 'nanshi' || String(item.chapter).padStart(3, '0') !== '035') continue;
    if (item.id === ITEM_ID) {
      item.status = 'applied';
      item.decision = 'included';
      item.notes = 'Inserted the omitted Zhongyuan paragraph after s0114 and added manual English translations for every restored sentence.';
      item.reviewer = 'manual-repair';
      item.reviewedAt = now;
      item.appliedAt = now;
      item.appliedSummary = {
        mode: 'manual-source-omission-insert',
        inserted: rows.length,
        afterId: 's0114',
      };
      continue;
    }

    const range = item.localRange;
    if (!range) continue;
    if (Array.isArray(range.ids)) {
      range.ids = range.ids.map((id) => {
        const match = String(id).match(/^s(\d+)$/u);
        if (!match || Number(match[1]) < shiftFromId) return id;
        return `s${String(Number(match[1]) + delta).padStart(4, '0')}`;
      });
    }
    if (Array.isArray(range.locations)) {
      for (const loc of range.locations) {
        const match = String(loc.id || '').match(/^s(\d+)$/u);
        if (match && Number(match[1]) >= shiftFromId) {
          loc.id = `s${String(Number(match[1]) + delta).padStart(4, '0')}`;
        }
      }
    }
  }
}

const chapter = JSON.parse(fs.readFileSync(CHAPTER_PATH, 'utf8'));
const anchorIndex = chapter.content.findIndex((block) =>
  block.type === 'paragraph' && block.sentences?.some((sentence) => sentence.id === 's0114'),
);
if (anchorIndex < 0) throw new Error('Could not find s0114 anchor.');
if (chapter.content.some((block) => block.sentences?.some((sentence) => sentence.zh === rows[0].zh))) {
  throw new Error('nanshi/035 omission already appears to be inserted.');
}

renumberIds(chapter, 115, rows.length);
chapter.content.splice(anchorIndex + 1, 0, {
  type: 'paragraph',
  sentences: rows.map((row, index) => sentenceUnit(row, 115 + index)),
});
updateMeta(chapter);
fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
shiftQueueLocations(queue, 115, rows.length);
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

console.log(`Inserted ${rows.length} omitted nanshi/035 sentences after s0114.`);
