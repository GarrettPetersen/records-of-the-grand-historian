#!/usr/bin/env node
/**
 * Select high-confidence source-correspondence repairs where the upstream and
 * local Han text differ only by graph form, and the local form is noncanonical
 * for this corpus (usually simplified characters left by early scraping).
 *
 * This script does not apply queue decisions. Pipe/write its ID list into
 * apply-source-correspondence.mjs with --approve-file and
 * --preserve-existing-translations.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.+\.json$/u;
const PUNCT_RE = /[\p{P}\p{S}\s]/gu;
const HAN_DIGIT_RE = /[\p{Script=Han}0-9]/gu;

const GRAPH_GROUPS = [
  '於于',
  '後后',
  '與与',
  '爲為为',
  '復复',
  '時时',
  '諸诸',
  '殺杀',
  '無无',
  '種种',
  '衆眾众',
  '發髮发',
  '曆歷历',
  '處处',
  '虜虏',
  '歲岁',
  '懷怀',
  '國国',
  '單单',
  '縣县',
  '間间',
  '問问',
  '門门',
  '聞闻',
  '漢汉',
  '東东',
  '風风',
  '見见',
  '將将',
  '書书',
  '學学',
  '歸归',
  '實实',
  '勞劳',
  '頭头',
  '還还',
  '廣广',
  '軍军',
  '靈灵',
  '遼辽',
  '陳陈',
  '設设',
  '齊齐',
  '樂乐',
  '諫谏',
  '臨临',
  '敗败',
  '聽听',
  '開开',
  '亂乱',
  '進进',
  '謝谢',
  '劉刘',
  '帥帅',
  '驚惊',
  '義义',
  '習习',
  '嚴严',
  '經经',
  '屬属',
  '數数',
  '陽阳',
  '趙赵',
  '塢坞',
  '繕缮',
  '劍剑',
  '遷迁',
  '獄狱',
  '馳驰',
  '狀状',
  '燒烧',
  '獲获',
  '餘余',
  '對对',
  '豈岂',
  '獨独',
  '蕭萧',
  '臺台',
  '納纳',
  '鉗钳',
  '賢贤',
  '顯显',
  '護护',
  '領领',
  '萬万',
  '綬绶',
  '賜赐',
  '馮冯',
  '陣阵',
  '廬庐',
  '沒没',
  '號号',
  '謀谋',
  '閣阁',
  '許许',
  '謁谒',
  '請请',
  '遊游',
  '齎赍',
  '鄰邻',
  '決决',
  '築筑',
  '澗涧',
  '衝冲',
  '簡简',
  '費费',
  '猶犹',
  '億亿',
  '貢贡',
  '圖图',
  '滎荥',
  '鑿凿',
  '溝沟',
  '穀谷',
  '販贩',
  '糴籴',
  '糧粮',
  '穢秽',
  '採采',
  '紀纪',
  '極极',
  '漸渐',
  '資资',
  '餓饿',
  '壯壮',
  '斂敛',
  '農农',
  '喪丧',
  '攜携',
  '優优',
  '術术',
  '鄉乡',
  '賓宾',
  '嘆叹',
  '衛衞卫',
  '牆墙',
  '陝陕',
  '苟茍',
  '並竝并',
  '德惪',
  '媯嬀',
  '棄弃',
  '僕仆',
  '歡欢',
  '雞鷄鸡',
  '專专',
  '權权',
  '愛爱',
  '顯显',
  '舊旧',
  '剝剥',
  '親亲',
  '斃毙',
  '賢贤',
  '詩诗',
  '婦妇',
  '拒拒',
  '諫谏',
  '縱纵',
  '謀谋',
  '離离',
  '貢贡',
  '圖图',
  '鑿凿',
  '溝沟',
  '澗涧',
  '衝冲',
  '決决',
  '簡简',
  '費费',
  '猶犹',
  '億亿',
  '計计',
  '練练',
  '語语',
  '訟讼',
  '遷迁',
  '陰阴',
  '陽阳',
  '趙赵',
  '綱纲',
  '塢坞',
  '繕缮',
  '餘余',
  '屬属',
  '習习',
  '遠远',
  '來来',
  '誡诫',
  '鄉乡',
  '恥耻',
  '畝亩',
  '別别',
  '勞劳',
  '順顺',
  '動动',
  '載载',
  '聖圣',
  '儀仪',
  '營营',
  '宮宫',
  '強强',
  '納纳',
  '報报',
  '爾尔',
  '護护',
  '牐闸',
  '穩稳',
  '楊杨',
  '獨独',
  '藝艺',
  '術术',
  '內内',
  '盜盗',
  '賑赈',
  '倉仓',
  '憐怜',
  '憫悯',
  '窮穷',
  '畢毕',
  '靈灵',
  '齎赍',
  '謁谒',
  '邊边',
  '陣阵',
  '跡迹',
  '黃黄',
  '禮礼',
  '獄狱',
  '寶宝',
  '廟庙',
  '燒烧',
  '喪丧',
  '敗败',
  '毀毁',
  '築筑',
  '傳传',
  '郵邮',
  '輸输',
  '盡尽',
  '詭诡',
  '魯鲁',
  '壽寿',
  '輟辍',
  '異异',
  '夢梦',
  '惡恶',
  '厲厉',
  '瑋玮',
  '師师',
  '稱称',
  '議议',
  '變变',
  '統统',
  '隸隶',
  '戶户',
  '諭谕',
  '關关',
  '貫贯',
  '賚赉',
  '張张',
  '調调',
  '災灾',
  '揮挥',
  '滿满',
  '幣币',
  '蘭兰',
  '尋寻',
  '視视',
  '達达',
  '羈羁',
  '晉晋',
  '澤泽',
  '買买',
  '詔诏',
  '騎骑',
  '敵敌',
  '肅肃',
  '參参',
  '僉佥',
  '當当',
  '譖谮',
  '貪贪',
  '禿秃',
  '備备',
  '誣诬',
  '驛驿',
  '貴贵',
  '勛勋',
  '奮奋',
  '龍龙',
  '禍祸',
  '碩硕',
  '貨货',
  '剛刚',
  '適适',
  '煩烦',
  '貧贫',
  '讀读',
  '繩绳',
  '兒儿',
  '繫系',
  '陞升',
  '朱硃',
  '踰逾',
  '藩籓',
  '產产',
  '飾饰',
  '緘缄',
  '滕滕',
  '閉闭',
  '薦荐',
  '陸陆',
  '邁迈',
  '辭辞',
  '憂忧',
  '穢秽',
  '築筑',
  '顧顾',
  '鴻鸿',
  '臘腊',
  '爭争',
  '則则',
  '贊赞',
  '幾几',
  '機机',
  '雖虽',
  '濟济',
  '寬宽',
  '薦荐',
  '處处',
  '氣气',
  '傷伤',
  '賞赏',
  '覽览',
  '鄰邻',
  '結结',
  '豈岂',
  '遊游',
  '請请',
  '留留',
  '詳详',
  '監监',
  '穩稳',
  '閘闸',
  '馬马',
  '從从',
  '饗飨',
  '會会',
  '帶带',
  '飲饮',
  '頃顷',
  '斬斩',
  '詣诣',
  '擊击',
  '誅诛',
  '賊贼',
  '過过',
  '濫滥',
  '徵征',
  '長长',
  '興兴',
  '據据',
  '討讨',
  '級级',
  '論论',
  '譯译',
  '連连',
  '斷断',
  '續续',
  '條条',
  '脅胁',
  '盜盗',
  '帥帅',
  '脫脱',
  '職职',
  '戰战',
  '獻献',
  '赦赦',
  '寵宠',
  '讓让',
  '節节',
  '語语',
  '邊边',
  '傳传',
  '陽阳',
  '雲云',
  '禮礼',
  '賦赋',
  '頌颂',
  '銘铭',
  '誄诔',
  '箋笺',
  '謁谒',
  '辯辩',
  '尙尚',
  '難难',
  '潛潜',
  '應应',
  '邊边',
  '賣卖',
  '鹽盐',
  '錢钱',
  '領领',
  '曉晓',
  '寶宝',
];

const LOCAL_REPAIR_CHARS = new Set([
  '于', '后', '与', '为', '复', '时', '诸', '杀', '无', '种',
  '众', '发', '历', '处', '虏', '岁', '怀', '国', '单', '县',
  '间', '问', '门', '闻', '汉', '东', '风', '见', '将', '书',
  '学', '归', '实', '劳', '头', '还', '广', '军', '灵', '辽',
  '陈', '设', '齐', '乐', '谏', '临', '败', '听', '开', '乱',
  '进', '谢', '刘', '帅', '惊', '义', '习', '严', '经', '属',
  '数', '阳', '赵', '坞', '缮', '剑', '迁', '狱', '驰', '状',
  '烧', '获', '余', '对', '岂', '独', '萧', '台', '纳', '钳',
  '贤', '显', '护', '领', '万', '绶', '赐', '冯', '阵', '庐',
  '没', '号', '谋', '阁', '许', '谒', '请', '游', '赍', '邻',
  '决', '筑', '涧', '冲', '简', '费', '犹', '亿', '贡', '图',
  '荥', '凿', '沟', '谷', '贩', '籴', '粮', '秽', '采', '纪',
  '极', '渐', '资', '饿', '壮', '敛', '农', '丧', '携', '优',
  '术', '乡', '宾', '叹', '卫', '墙', '陕',
  '欢', '鸡', '专', '权', '爱', '显', '旧', '剥', '亲',
  '毙', '贤', '诗', '妇', '谏', '纵', '谋', '离', '贡',
  '图', '荥', '凿', '沟', '涧', '冲', '决', '简', '费',
  '犹', '亿', '计', '练', '语', '讼', '迁', '阴', '纲',
  '坞', '缮', '属', '习', '远', '来', '诫', '耻', '亩',
  '别', '动', '载', '圣', '仪', '营', '宫', '强', '纳',
  '报', '尔', '护', '闸', '稳', '杨', '独', '艺', '盗',
  '赈', '仓', '怜', '悯', '穷', '毕', '赍', '谒', '边',
  '迹', '黄', '礼', '狱', '宝', '庙', '毁', '传', '邮',
  '输', '尽', '产', '饰', '缄', '闭', '荐', '陆', '迈',
  '辞', '忧', '秽', '顾', '鸿', '争', '则', '赞', '机',
  '虽', '济', '宽', '气', '伤', '赏', '览', '邻', '结',
  '岂', '详', '监',
]);

const graphMap = new Map();
for (const group of GRAPH_GROUPS) {
  const chars = [...group];
  const canonical = chars[0];
  for (const char of chars) graphMap.set(char, canonical);
}

function usage() {
  console.error(`Usage:
  node scripts/select-source-orthographic-repairs.mjs [--queue PATH] [--book BOOK]
    [--limit N] [--sample N] [--out PATH] [--json] [--allow-punctuation-drift]
    [--allow-multiunit]

The --out file is a newline-delimited list of queue item IDs.`);
}

function parseArgs(argv) {
  const opts = {
    queues: [],
    books: new Set(),
    limit: 0,
    sample: 12,
    out: '',
    json: false,
    allowPunctuationDrift: false,
    allowMultiunit: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i] || 0);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length) || 0);
      continue;
    }
    if (arg === '--sample') {
      opts.sample = Number(argv[++i] || opts.sample);
      continue;
    }
    if (arg.startsWith('--sample=')) {
      opts.sample = Number(arg.slice('--sample='.length) || opts.sample);
      continue;
    }
    if (arg === '--out') {
      opts.out = argv[++i] || '';
      continue;
    }
    if (arg.startsWith('--out=')) {
      opts.out = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--allow-punctuation-drift') {
      opts.allowPunctuationDrift = true;
      continue;
    }
    if (arg === '--allow-multiunit') {
      opts.allowMultiunit = true;
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.queues.push(arg);
  }

  return opts;
}

function defaultQueues() {
  return fs.readdirSync(QUALITY_DIR)
    .filter((filename) => QUEUE_RE.test(filename))
    .map((filename) => path.join(QUALITY_DIR, filename))
    .sort();
}

function pending(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  return ![
    status,
    decision,
  ].some((value) => [
    'applied',
    'approved',
    'included',
    'denied',
    'rejected',
    'declined',
    'false-positive',
    'false_positive',
  ].includes(value));
}

function normalizeText(text) {
  const chars = String(text || '').match(HAN_DIGIT_RE) || [];
  return chars.join('');
}

function graphKey(text) {
  return [...normalizeText(text)].map((char) => graphMap.get(char) || char).join('');
}

function punctuationKey(text) {
  return String(text || '')
    .replace(/[﹑、]/gu, '，')
    .replace(/[﹔;]/gu, '；')
    .replace(/[﹕:]/gu, '：')
    .replace(/[﹗!]/gu, '！')
    .replace(/[﹖?]/gu, '？')
    .replace(/[“”]/gu, '「')
    .replace(/[‘’]/gu, '」')
    .replace(/[〈《]/gu, '《')
    .replace(/[〉》]/gu, '》')
    .replace(/[（]/gu, '(')
    .replace(/[）]/gu, ')')
    .replace(/[^\p{P}\p{S}]/gu, '');
}

function hasLocalRepairDifference(source, local) {
  const sourceChars = [...normalizeText(source)];
  const localChars = [...normalizeText(local)];
  if (sourceChars.length !== localChars.length) return false;

  let repairable = false;
  for (let i = 0; i < sourceChars.length; i += 1) {
    if (sourceChars[i] === localChars[i]) continue;
    const sourceCanonical = graphMap.get(sourceChars[i]) || sourceChars[i];
    const localCanonical = graphMap.get(localChars[i]) || localChars[i];
    if (sourceCanonical !== localCanonical) {
      return false;
    }
    if (sourceCanonical !== sourceChars[i]) return false;
    if (LOCAL_REPAIR_CHARS.has(localChars[i]) || localCanonical !== localChars[i]) {
      repairable = true;
    }
  }
  return repairable;
}

function itemMatches(item, opts) {
  if (!pending(item)) return false;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type || '')) return false;
  if (!item.sourceRange?.text || !item.localRange?.text) return false;
  if (!opts.allowMultiunit && (item.sourceRange.count || 0) !== (item.localRange.ids || []).length) return false;

  const source = item.sourceRange.text;
  const local = item.localRange.text;
  if (source === local) return false;
  if (normalizeText(source) === normalizeText(local)) return false;
  if (graphKey(source) !== graphKey(local)) return false;
  if (!opts.allowPunctuationDrift && punctuationKey(source) !== punctuationKey(local)) return false;
  return hasLocalRepairDifference(source, local);
}

function summarizeCandidates(candidates, sampleLimit) {
  const byQueue = {};
  const byBook = {};
  for (const candidate of candidates) {
    byQueue[candidate.queue] = (byQueue[candidate.queue] || 0) + 1;
    byBook[candidate.book] = (byBook[candidate.book] || 0) + 1;
  }

  return {
    total: candidates.length,
    byQueue,
    byBook,
    ids: candidates.map((candidate) => candidate.id),
    samples: candidates.slice(0, sampleLimit).map((candidate) => ({
      id: candidate.id,
      book: candidate.book,
      chapter: candidate.chapter,
      source: candidate.source,
      local: candidate.local,
    })),
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const queuePaths = opts.queues.length > 0 ? opts.queues : defaultQueues();
  const candidates = [];

  for (const queuePath of queuePaths) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    for (const item of queue.items || []) {
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (!itemMatches(item, opts)) continue;
      candidates.push({
        id: item.id,
        queue: queuePath,
        book: item.book,
        chapter: item.chapter,
        source: item.sourceRange.text,
        local: item.localRange.text,
      });
      if (opts.limit > 0 && candidates.length >= opts.limit) break;
    }
    if (opts.limit > 0 && candidates.length >= opts.limit) break;
  }

  if (opts.out) {
    fs.writeFileSync(opts.out, `${candidates.map((candidate) => candidate.id).join('\n')}\n`, 'utf8');
  }

  const summary = summarizeCandidates(candidates, opts.sample);
  if (opts.json) console.log(JSON.stringify(summary, null, 2));
  else {
    console.log(`Selected ${summary.total} orthographic source repair candidate(s).`);
    if (opts.out) console.log(`Wrote IDs to ${opts.out}`);
    for (const [book, count] of Object.entries(summary.byBook)) console.log(`${book}: ${count}`);
    for (const sample of summary.samples) {
      console.log(`\n${sample.id} (${sample.book}/${sample.chapter})`);
      console.log(`  source: ${sample.source}`);
      console.log(`  local:  ${sample.local}`);
    }
  }
}

main();
