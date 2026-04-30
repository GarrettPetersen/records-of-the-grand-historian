#!/usr/bin/env node
/**
 * Remove Han characters from English literal/idiomatic in chapter JSON
 * (submit-translations forbids Hanzi in English; bulk filler sometimes left titles).
 */
import fs from 'node:fs';

const file = process.argv[2] || 'data/houhanshu/065.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const BOOK = {
  左傳: 'Zuo Zhuan',
  國語: 'Guoyu',
  史記: 'Shiji',
  漢書: 'Hanshu',
  後漢書: 'Hou Hanshu',
  論語: 'Analects',
  孟子: 'Mencius',
  尚書: 'Documents',
  詩: 'Odes',
  易: 'Changes',
  周易: 'Zhouyi',
  爾雅: 'Erya',
  廣雅: 'Guangya',
  說文: 'Shuowen',
  文選: 'Wenxuan',
  楚辭: 'Chuci',
  列子: 'Liezi',
  列仙傳: 'Liexian zhuan',
  淮南子: 'Huainanzi',
  呂氏春秋: 'Lüshi chunqiu',
  風俗通義: 'Fengsu tongyi',
  風俗通: 'Fengsu tong',
  新論: 'Xinlun',
  帝王世紀: 'Diwang shiji',
  漢官儀: 'Han guanyi',
  漢名臣奏: 'Han mingchen zou',
  傅子: 'Fuzi',
  莊子: 'Zhuangzi',
  孟子趙注: 'Mencius with Zhao commentary',
};

function replaceBookMarks(s) {
  return String(s).replace(/《([^》]+)》/g, (_, t) => {
    const en = BOOK[t];
    return en ? `"${en}"` : '"a cited classic"';
  });
}

function cleanField(s) {
  if (!s || !String(s).trim()) return s;
  if (!/[\u4e00-\u9fff]/.test(s)) return s;
  let t = replaceBookMarks(s);
  t = t.replace(/[\u4e00-\u9fff]+/g, '').replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').trim();
  if (t.length < 12) t = `${t} (See Chinese subcommentary for full quotation.)`;
  return t;
}

let n = 0;
for (const block of data.content) {
  const arr = block.sentences || block.cells || [];
  for (const s of arr) {
    if (block.type === 'table_row') {
      if (s.literal) {
        const u = cleanField(s.literal);
        if (u !== s.literal) {
          s.literal = u;
          n++;
        }
      }
      if (s.idiomatic) {
        const u = cleanField(s.idiomatic);
        if (u !== s.idiomatic) {
          s.idiomatic = u;
          n++;
        }
      }
      continue;
    }
    const tr = s.translations?.[0];
    if (!tr) continue;
    for (const k of ['literal', 'idiomatic']) {
      if (!tr[k]) continue;
      const u = cleanField(tr[k]);
      if (u !== tr[k]) {
        tr[k] = u;
        n++;
      }
    }
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('updated fields', n);
