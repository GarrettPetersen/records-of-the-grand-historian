#!/usr/bin/env node
/**
 * Repair source-correspondence items that are only graph-form and punctuation
 * differences against the upstream witness.
 *
 * This edits source text only when the queued upstream span splits one-to-one
 * across the queued local IDs and every unit has the same Han/digit key under
 * the curated graph map. English translations are retained because these
 * changes do not alter meaning.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const DEFAULT_REVIEWER = 'repair-source-graph-variants';
const SENTENCE_RE = /[^。！？；]+[。！？；]?[」』”）)\]】〉》]*/gu;
const LEADING_CLOSE_RE = /^[」』”）)\]】〉》]+/u;
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const SEMANTIC_GRAPH_PAIRS = new Set([
  '云⇄雲',
  '雲⇄云',
  '后⇄後',
  '後⇄后',
  '谷⇄穀',
  '穀⇄谷',
  '里⇄裏',
  '裏⇄里',
  '里⇄裡',
  '裡⇄里',
  '干⇄幹',
  '幹⇄干',
  '乾⇄干',
  '干⇄乾',
  '余⇄餘',
  '餘⇄余',
  '發⇄髮',
  '髮⇄發',
  '復⇄覆',
  '覆⇄復',
  '復⇄複',
  '複⇄復',
  '舍⇄捨',
  '捨⇄舍',
  '禦⇄御',
  '御⇄禦',
  '采⇄採',
  '採⇄采',
  '臺⇄台',
  '台⇄臺',
  '制⇄製',
  '製⇄制',
  '斗⇄鬥',
  '鬥⇄斗',
  '著⇄着',
  '着⇄著',
  '願⇄愿',
  '愿⇄願',
  '沈⇄瀋',
  '瀋⇄沈',
]);

const GRAPH_GROUPS = [
  '爲為为',
  '與与',
  '無无',
  '時时',
  '復複覆复',
  '將将',
  '軍军',
  '書书',
  '後后',
  '從从',
  '諸诸',
  '國国',
  '權权',
  '愛爱',
  '顯显',
  '舊旧',
  '並并竝幷併',
  '賢贤',
  '詩诗',
  '德徳惪',
  '專专',
  '長长',
  '間间',
  '親亲',
  '斃毙',
  '藝艺',
  '學学',
  '嚴严',
  '經经',
  '歷曆歴历',
  '屬属',
  '數数',
  '陽阳',
  '趙赵',
  '綱纲',
  '縣县',
  '塢坞',
  '繕缮',
  '設设',
  '饗飨',
  '謁谒',
  '劍剑',
  '餘余',
  '盜盗',
  '賊贼',
  '濫滥',
  '徵徴征',
  '獄狱',
  '歲歳岁',
  '實实',
  '論论',
  '會会',
  '習习',
  '馬马',
  '遷迁',
  '於于',
  '臨临',
  '視视',
  '尸屍',
  '對对',
  '麥麦',
  '車车',
  '傷伤',
  '賜赐',
  '綬绶',
  '嘗尝',
  '齊齐',
  '曄晔',
  '雲云',
  '臺台',
  '餽馈',
  '餌饵',
  '輿舆',
  '戲戏',
  '謝谢',
  '討讨',
  '樹树',
  '術术',
  '惡恶',
  '遺遗',
  '裝装',
  '涼凉',
  '貧贫',
  '寧宁甯',
  '見见',
  '廟庙',
  '譽誉',
  '黃黄',
  '樂乐',
  '講讲',
  '構构',
  '勝胜',
  '勞劳',
  '員员',
  '熲颎',
  '穉稚',
  '荊荆',
  '隷隸',
  '兾冀',
  '釋释',
  '陳陈',
  '閉闭',
  '縱纵',
  '謀谋',
  '圖图',
  '離离',
  '鷄雞鸡',
  '憮怃',
  '攜携',
  '優优',
  '劇剧',
  '喪丧',
  '錯错',
  '參参',
  '紀记纪',
  '冢塚',
  '說説说',
  '聖圣',
  '興兴',
  '殺杀',
  '須须',
  '發髮发',
  '頭头',
  '強强彊',
  '終终',
  '門门',
  '號号',
  '鳴鸣',
  '館馆',
  '體体',
  '點点',
  '罷罢',
  '擬拟',
  '選选',
  '補补',
  '糾纠',
  '斷断',
  '過过',
  '風风',
  '顧顾',
  '貴贵',
  '舉举',
  '雖虽',
  '義义',
  '況况',
  '懷怀',
  '狀状',
  '賓宾',
  '蟲虫',
  '蠻蛮',
  '黨党',
  '敵敌',
  '東东',
  '來来',
  '爾尔',
  '邊边',
  '靈灵',
  '廬庐',
  '獨独',
  '恥耻',
  '癡痴',
  '懼惧',
  '踴踊',
  '奮奋',
  '棄弃',
  '衛衞卫',
  '職职',
  '寶宝',
  '問问',
  '聞闻',
  '廣广',
  '議议',
  '紹绍',
  '劉刘',
  '孫孙',
  '漢汉',
  '吳呉吴',
  '萬万',
  '開开',
  '關关',
  '馳驰',
  '歸归',
  '覽覧览',
  '結结',
  '詳详',
  '監监',
  '顏颜',
  '斬斩',
  '帶带',
  '飲饮',
  '頃顷',
  '詣诣',
  '誅诛',
  '處处',
  '據据',
  '營营',
  '燒烧',
  '戰战',
  '獲获',
  '級级',
  '還还',
  '鳳凤',
  '龍龙',
  '葉叶',
  '鄭郑',
  '鄴邺',
  '鄧邓',
  '張张',
  '華华',
  '閎闳',
  '韋韦',
  '辟闢辟',
  '險险',
  '規规',
  '爭争',
  '資资',
  '搖摇',
  '眾衆众',
  '騁骋',
  '憑凭',
  '聽听',
  '歎嘆叹',
  '謙谦',
  '謹谨',
  '謬谬',
  '啟启',
  '塗涂',
  '羨羡',
  '樸朴',
  '盡尽',
  '沒没',
  '財财',
  '產産产',
  '徙徙',
  '節节',
  '緘缄',
  '淚泪',
  '擢擢',
  '鷹鹰',
  '願愿',
  '詔诏',
  '虜虏',
  '擊撃击',
  '讓让',
  '變变',
  '邊边',
  '達达',
  '遜逊',
  '肅肃',
  '總总',
  '題题',
  '領领',
  '顾顧',
  '饥飢',
  '馆館',
  '钟鐘鍾',
  '归歸',
  '赵趙',
  '钱錢',
  '孙孫',
  '刘劉',
  '陈陳',
  '张張',
  '郑鄭',
  '汉漢',
  '吴吳',
  '万萬',
  '齐齊',
  '国國',
  '门門',
  '问問',
  '闻聞',
  '风風',
  '马馬',
  '东東',
  '书書',
  '长長',
  '会會',
  '过過',
  '战戰',
  '开開',
  '见見',
  '学學',
  '体體',
  '点點',
  '声聲',
  '号號',
  '气氣',
  '处處',
  '处處',
  '举舉',
  '动動',
  '辞辭',
  '忧憂',
  '远遠',
  '选選',
  '圣聖',
  '怀懷',
  '礼禮',
  '庙廟',
  '毁毀',
  '邮郵',
  '输輸',
  '饰飾',
  '荐薦',
  '陆陸',
  '迈邁',
  '争爭',
  '则則',
  '赞贊讚',
  '几幾',
  '机機',
  '虽雖',
  '济濟',
  '宽寬',
  '伤傷',
  '赏賞',
  '详詳',
  '监監',
  '诫誡',
  '怜憐',
  '悯憫',
  '穷窮',
  '毕畢',
  '费費',
  '计計',
  '阴陰',
  '纲綱',
  '坞塢',
  '缮繕',
  '项項',
  '谢謝',
  '谒謁',
  '剑劍',
  '鸡雞鷄',
  '严嚴',
  '专專',
  '显顯',
  '贤賢',
  '诗詩',
  '艺藝',
  '属屬',
  '县縣',
  '盗盜',
  '贼賊',
  '岁歲歳',
  '实實',
  '论論',
  '临臨',
  '视視',
  '对對',
  '麦麥',
  '车車',
  '赐賜',
  '绶綬',
  '尝嘗',
  '云雲',
  '台臺',
  '舆輿',
  '戏戲',
  '树樹',
  '术術',
  '恶惡',
  '遗遺',
  '装裝',
  '凉涼',
  '贫貧',
  '宁寧甯',
  '黄黃',
  '乐樂',
  '讲講',
  '构構',
  '胜勝',
  '劳勞',
  '员員',
  '释釋',
  '闭閉',
  '纵縱',
  '谋謀',
  '图圖',
  '携攜',
  '优優',
  '剧劇',
  '丧喪',
  '错錯',
  '参參',
  '圣聖',
  '兴興',
  '杀殺',
  '须須',
  '发發髮',
  '头頭',
  '强強彊',
  '终終',
  '鸣鳴',
  '罢罷',
  '拟擬',
  '补補',
  '纠糾',
  '断斷',
  '贵貴',
  '义義',
  '况況',
  '状狀',
  '宾賓',
  '虫蟲',
  '蛮蠻',
  '党黨',
  '敌敵',
  '来來',
  '尔爾',
  '灵靈',
  '庐廬',
  '独獨',
  '痴癡',
  '惧懼',
  '踊踴',
  '奋奮',
  '弃棄',
  '职職',
  '宝寶',
  '广廣',
  '议議',
  '绍紹',
  '驰馳',
  '览覽覧',
  '结結',
  '颜顏',
  '斩斬',
  '带帶',
  '饮飲',
  '顷頃',
  '诣詣',
  '诛誅',
  '据據',
  '营營',
  '烧燒',
  '获獲',
  '级級',
  '还還',
  '凤鳳',
  '龙龍',
  '叶葉',
  '邓鄧',
  '华華',
  '韦韋',
  '险險',
  '规規',
  '资資',
  '摇搖',
  '骋騁',
  '凭憑',
  '听聽',
  '叹嘆歎',
  '谦謙',
  '谨謹',
  '谬謬',
  '启啟',
  '涂塗',
  '羡羨',
  '朴樸',
  '尽盡',
  '财財',
  '产產産',
  '节節',
  '缄緘',
  '泪淚',
  '鹰鷹',
  '愿願',
  '诏詔',
  '虏虜',
  '击擊撃',
];

const GRAPH_CANONICAL = new Map();
for (const group of GRAPH_GROUPS) {
  const chars = [...group];
  const canonical = chars[0];
  for (const char of chars) {
    if (!GRAPH_CANONICAL.has(char)) GRAPH_CANONICAL.set(char, canonical);
  }
}

function usage() {
  console.error(`Usage:
  node scripts/repair-source-graph-variants.mjs [--apply]
    [--book BOOK] [--chapter CHAPTER] [--queue PATH] [--limit N]
    [--reviewer NAME] [--prefer-source] [--exclude-semantic]

Dry-run by default. Applies only one-to-one graph/punctuation source repairs.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Infinity,
    reviewer: DEFAULT_REVIEWER,
    preferSource: false,
    excludeSemantic: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--prefer-source') {
      opts.preferSource = true;
      continue;
    }
    if (arg === '--exclude-semantic') {
      opts.excludeSemantic = true;
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++i] || '');
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(String(argv[++i] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i] || '');
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  for (const book of [...opts.books]) if (!book) opts.books.delete(book);
  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues;
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .filter((entry) => opts.books.size === 0 || [...opts.books].some((book) => entry.includes(`-${book}.json`) || entry.includes(`-${book}-`)))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || item.appliedSummary || status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function splitSentences(text) {
  return (String(text || '').match(SENTENCE_RE) || [])
    .map((part) => part.trim())
    .filter(Boolean);
}

function hanKey(text) {
  let out = '';
  for (const char of String(text || '').replace(/\s+/gu, '').normalize('NFKC')) {
    if (!HAN_OR_DIGIT_RE.test(char)) continue;
    out += GRAPH_CANONICAL.get(char) || char;
  }
  return out;
}

function graphPairs(source, local) {
  const left = [...String(source || '').replace(/\s+/gu, '').normalize('NFKC')]
    .filter((char) => HAN_OR_DIGIT_RE.test(char));
  const right = [...String(local || '').replace(/\s+/gu, '').normalize('NFKC')]
    .filter((char) => HAN_OR_DIGIT_RE.test(char));
  if (left.length !== right.length) return [];

  const pairs = [];
  for (let i = 0; i < left.length; i += 1) {
    if (left[i] === right[i]) continue;
    if ((GRAPH_CANONICAL.get(left[i]) || left[i]) !== (GRAPH_CANONICAL.get(right[i]) || right[i])) return [];
    pairs.push(`${left[i]}⇄${right[i]}`);
  }
  return [...new Set(pairs)].sort();
}

function hasSemanticGraphPair(pairs) {
  return pairs.some((pair) => SEMANTIC_GRAPH_PAIRS.has(pair));
}

function graphDebt(text) {
  let debt = 0;
  for (const char of String(text || '').normalize('NFKC')) {
    if (GRAPH_CANONICAL.has(char) && GRAPH_CANONICAL.get(char) !== char) debt += 1;
  }
  return debt;
}

function itemFile(item) {
  return item.file || path.join(DATA_DIR, item.book, `${String(item.chapter).padStart(3, '0')}.json`);
}

function flattenUnits(chapter) {
  const units = [];
  for (const block of chapter.content || []) {
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (const unit of collection) {
        const field = sourceField(unit);
        if (!field) continue;
        units.push({ unit, field, id: unit.id || '' });
      }
    }
  }
  return units;
}

const chapterCache = new Map();

function loadChapter(file) {
  const abs = path.resolve(file);
  if (!chapterCache.has(abs)) {
    const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
    const units = flattenUnits(chapter);
    chapterCache.set(abs, {
      file: abs,
      chapter,
      byId: new Map(units.map((entry) => [entry.id, entry])),
      changed: false,
    });
  }
  return chapterCache.get(abs);
}

function classify(item, opts) {
  if (statusOf(item) !== 'pending') return null;
  if (!item.sourceRange?.text || !item.localRange?.text) return null;
  const chapter = String(item.chapter || '').padStart(3, '0');
  const ids = item.localRange?.ids || [];
  if (ids.length === 0) return null;
  if (item.sourceRange.text.match(LEADING_CLOSE_RE)) return null;

  const sourceParts = splitSentences(item.sourceRange.text);
  if (sourceParts.length !== ids.length) return null;

  const file = itemFile(item);
  if (!fs.existsSync(file)) return null;
  const record = loadChapter(file);
  const entries = ids.map((id) => record.byId.get(id));
  if (entries.some((entry) => !entry)) return null;

  const currentParts = entries.map((entry) => String(entry.unit[entry.field] || ''));
  if (currentParts.join('') !== item.localRange.text) return null;
  if (currentParts.every((part, index) => part === sourceParts[index])) return null;

  const pairs = [];
  for (let i = 0; i < sourceParts.length; i += 1) {
    const sourceKey = hanKey(sourceParts[i]);
    if (!sourceKey || sourceKey !== hanKey(currentParts[i])) return null;
    pairs.push(...graphPairs(sourceParts[i], currentParts[i]));
  }

  const uniquePairs = [...new Set(pairs)].sort();
  if (opts.excludeSemantic && hasSemanticGraphPair(uniquePairs)) return null;

  const sourceDebt = graphDebt(sourceParts.join(''));
  const localDebt = graphDebt(currentParts.join(''));
  if (!opts.preferSource && sourceDebt >= localDebt) return null;

  return {
    item,
    chapter,
    record,
    entries,
    sourceParts,
    currentParts,
    sourceDebt,
    localDebt,
    graphPairs: uniquePairs,
  };
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function applyRepair(repair, now, reviewer) {
  repair.entries.forEach((entry, index) => {
    entry.unit[entry.field] = repair.sourceParts[index];
  });
  repair.record.changed = true;
  repair.item.status = 'applied';
  repair.item.decision = 'included';
  repair.item.reviewedAt = repair.item.reviewedAt || now;
  repair.item.reviewer = repair.item.reviewer || reviewer;
  repair.item.appliedAt = now;
  repair.item.appliedSummary = {
    mode: 'graph-equivalent-source-repair',
    ids: repair.entries.map((entry) => entry.id),
    sourceGraphDebt: repair.sourceDebt,
    localGraphDebt: repair.localDebt,
    graphPairs: repair.graphPairs,
  };
  repair.item.notes = appendNote(
    repair.item.notes,
    'Applied source graph/punctuation repair: Han/digit text is equivalent under curated graph variants; English translation retained.',
  );
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    repaired: 0,
    touchedQueueFiles: 0,
    touchedChapterFiles: 0,
    byBook: {},
    byChapter: {},
    byDebt: {},
    samples: [],
    skippedAfterLimit: 0,
    preferSource: opts.preferSource,
    excludeSemantic: opts.excludeSemantic,
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changedQueue = false;
    for (const item of queue.items || []) {
      if (summary.repaired >= opts.limit) {
        summary.skippedAfterLimit += 1;
        continue;
      }
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      const chapter = String(item.chapter || '').padStart(3, '0');
      if (opts.chapters.size > 0 && !opts.chapters.has(chapter)) continue;
      const repair = classify(item, opts);
      if (!repair) continue;

      summary.repaired += 1;
      summary.byBook[item.book] = (summary.byBook[item.book] || 0) + 1;
      const chapterKey = `${item.book}/${chapter}`;
      summary.byChapter[chapterKey] = (summary.byChapter[chapterKey] || 0) + 1;
      const debtKey = `${repair.localDebt}->${repair.sourceDebt}`;
      summary.byDebt[debtKey] = (summary.byDebt[debtKey] || 0) + 1;
      if (summary.samples.length < 30) {
        summary.samples.push({
          id: item.id,
          chapter: chapterKey,
          ids: repair.entries.map((entry) => entry.id),
          sourceDebt: repair.sourceDebt,
          localDebt: repair.localDebt,
          graphPairs: repair.graphPairs,
          before: repair.currentParts.join('').slice(0, 240),
          after: repair.sourceParts.join('').slice(0, 240),
        });
      }

      if (!opts.apply) continue;
      applyRepair(repair, now, opts.reviewer);
      changedQueue = true;
    }

    if (opts.apply && changedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  if (opts.apply) {
    for (const record of chapterCache.values()) {
      if (!record.changed) continue;
      fs.writeFileSync(record.file, `${JSON.stringify(record.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
