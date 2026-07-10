#!/usr/bin/env node
/**
 * Scan English translations for formulaic artifacts that are grammatical enough
 * to evade LanguageTool but still read like raw table glosses.
 *
 * This is intentionally heuristic. It should prioritize review, not replace it.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasDisallowedChineseCharacters } from '../score-translations.js';

const DATA_DIR = path.join(process.cwd(), 'data');

const CHECK_FIELDS = new Set([
  'en',
  'english',
  'idiomatic',
  'translation',
]);

const RULE_ALLOWLIST = new Map([
  ['FUSED_LOWER_UPPER_BOUNDARY', new Set(['MacDonald'])],
]);

const CYCLICAL_STEMS = [
  'jiazi', 'yichou', 'bingyin', 'dingmao', 'wuchen', 'jisi',
  'gengwu', 'xinwei', 'renshen', 'guiyou', 'jiaxu', 'yihai',
  'bingzi', 'dingchou', 'wuyin', 'jimao', 'gengchen', 'xinsi',
  'renwu', 'guiwei', 'jiashen', 'yiyou', 'bingxu', 'dinghai',
  'wuzi', 'jichou', 'gengyin', 'xinmao', 'renchen', 'guisi',
  'jiawu', 'yiwei', 'bingshen', 'dingyou', 'wuxu', 'jihai',
  'gengzi', 'xinchou', 'renyin', 'guimao', 'jiachen', 'yisi',
  'bingwu', 'dingwei', 'wushen', 'jiyou', 'gengxu', 'xinhai',
  'renzi', 'guichou', 'jiayin', 'yimao', 'bingchen', 'dingsi',
  'wuwu', 'jiwei', 'gengshen', 'xinyou', 'renxu', 'guihai',
  'yiwu',
];

const CYCLICAL_CONTEXT_RE = new RegExp(
  `\\b(?:${CYCLICAL_STEMS.join('|')})(?:\\b[^.);:]{0,60}\\b(?:day|year)|(?:,\\s*(?:${CYCLICAL_STEMS.join('|')}))+)`,
  'i',
);

function isAllowedArtifactHit(ruleId, found, text, index) {
  if (RULE_ALLOWLIST.get(ruleId)?.has(found)) return true;
  if (ruleId === 'LOWERCASE_ROMANIZED_MARQUIS_NAME') {
    const window = text.slice(Math.max(0, index - 80), Math.min(text.length, index + 100));
    return CYCLICAL_CONTEXT_RE.test(window);
  }
  return false;
}

export const TRANSLATION_ARTIFACT_RULES = [
  {
    id: 'QUOTE_OPENER_ATTACHED_TO_ATTRIBUTION',
    severity: 3,
    description: 'Opening quote is attached to narrator/attribution text instead of the quoted speech',
    check(text, opts = {}) {
      const source = String(opts.sourceText || '').trim();
      const value = String(text || '').trim();
      if (!/^[^」』]*[曰云謂告報問對奏稱詔令敕諭語][^」』]*[：「]$/u.test(source)) return [];
      if (!/^[“"]/.test(value)) return [];
      const withoutOpen = value.replace(/^[“"]\s*/, '');
      if (/[”"]\s*$/.test(withoutOpen) && /[.!?。！？][”"]\s*$/.test(withoutOpen)) return [];
      if (!/\b(?:said|says|asked|replied|answered|reported|told|proclaimed|announced|declared|ordered|cried|urged|advised|wrote|sent|rose|went out)\b/i.test(withoutOpen)) return [];
      if (/\b(?:go|come|attack|kill|enter|leave|return|hear|listen|look|wait|do|take|give|make|send|tell me|let|may|must|should|shall|will|would|cannot|dare|fear|hope|wish|please)\b/i.test(withoutOpen)
        && /[.!?][”"]?$/.test(withoutOpen)) {
        return [];
      }
      return [{
        found: value.slice(0, Math.min(value.length, 120)),
        index: 0,
      }];
    },
  },
  {
    id: 'RAW_TABLE_ATTRIBUTE',
    severity: 3,
    description: 'Raw table markup attribute left in English translation text',
    pattern: /\b(?:rowspan|colspan|valign|align|style|width|height)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s|]+)\s*\|?/gi,
  },
  {
    id: 'RAW_MARKDOWN_EMPHASIS',
    severity: 3,
    description: 'Raw Markdown emphasis marker left in published translation text',
    pattern: /\*/g,
  },
  {
    id: 'EDITORIAL_NOTE_BOILERPLATE',
    severity: 3,
    description: 'Editorial note boilerplate left in English translation text',
    pattern: /\b(?:See editorial note|Editorial footnote marker)(?:\s+\d+|\s+\[\d+\])?\b\.?/gi,
  },
  {
    id: 'MARQUIS_YEAR_ONE',
    severity: 2,
    description: 'Succession formula left as "Marquis X year 1"',
    pattern: /\bMarquis [A-Z][A-Za-z' -]{1,80} year 1\b/g,
  },
  {
    id: 'RAW_DATE_FORMULA',
    severity: 2,
    description: 'Date formula left as "Year N month M ... day"',
    pattern: /\bYear \d{1,2} (?:(?:month \d{1,2})|(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) month)(?: [A-Z]?[a-z]+){0,2} day\b/g,
  },
  {
    id: 'RAW_NUMERIC_MONTH_DATE',
    severity: 1,
    description: 'Date formula left with numeric month such as "year 6, month 12"',
    pattern: /\b(?:In )?[Yy]ear \d{1,2},? month \d{1,2}\b|\b(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|Former|Later|Jing|Zhong) year \d{1,2},? month \d{1,2}\b/g,
  },
  {
    id: 'RAW_WORD_MONTH_DATE',
    severity: 1,
    description: 'Date formula left as "year 6, twelfth month"',
    pattern: /\b(?:In )?[Yy]ear \d{1,2},? (?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) month\b/g,
  },
  {
    id: 'RAW_AFTER_MONTH_DATE',
    severity: 1,
    description: 'Intercalary month date left as "after month 9"',
    pattern: /\bafter month \d{1,2}\b|\bHouyuan month \d{1,2}\b/g,
  },
  {
    id: 'RAW_REIGN_YEAR',
    severity: 1,
    description: 'Reign-year phrase left as "Yuanguang year 5" style prose',
    pattern: /\b(?:Jianyuan|Yuanguang|Yuanshuo|Yuanshou|Yuanding|Yuanfeng|Taichu|Tianyuan|Zhong|Houyuan|Shenjue|Ganlu|Diji) year \d{1,2}\b/g,
  },
  {
    id: 'RELATIVE_YEAR_BCE',
    severity: 3,
    description: 'Relative pre-Han year rendered as an absolute BCE date',
    pattern: /\byear \d{1,2} BCE\b/g,
  },
  {
    id: 'KING_OF_HAN_YEAR_FORMULA',
    severity: 2,
    description: 'King of Han reign year left as raw "King of Han year N"',
    pattern: /\bKing of Han year \d{1,2}\b/g,
  },
  {
    id: 'RAW_KING_BEGINNING_FORMULA',
    severity: 2,
    description: 'Table succession formula left as "King X beginning"',
    pattern: /\b(?:King|king) (?![A-Z][A-Za-z'’ -]{0,80}\bas the beginning\b)[A-Z][A-Za-z'’ -]{1,80} beginning\b/g,
  },
  {
    id: 'RAW_BEGINNING_FORMER_OFFICE',
    severity: 2,
    description: 'Table succession formula left as "beginning, former ..."',
    pattern: /\bbeginning, former [A-Za-z'’ -]+\b/gi,
  },
  {
    id: 'RAW_WORLD_MAIN_FATE',
    severity: 3,
    description: '主命 formula left as "world main fate"',
    pattern: /\bworld main fate\b/gi,
  },
  {
    id: 'BECAME_MARQUIS_HOUSEHOLDS',
    severity: 2,
    description: 'Marquisate formula left as "became a marquis, N households"',
    pattern: /\bbecame a marquis, \d[\d,]* households\b/g,
  },
  {
    id: 'TRIBUTE_GOLD',
    severity: 1,
    description: 'Tribute-gold offense may need idiomatic handling',
    pattern: /\bconvicted of tribute gold\b/g,
  },
  {
    id: 'RAW_CONVICTED_OVER_TRIBUTE_GOLD',
    severity: 1,
    description: '酎金 formula left as "convicted over deficient tribute gold"',
    pattern: /\bconvicted over deficient tribute gold(?: deficiency)?\b/g,
  },
  {
    id: 'EXTINCT_LINE',
    severity: 2,
    description: 'Lineage formula left as bare "extinct"',
    pattern: /\b(?:deprived, extinct|convicted of disrespect, extinct|Committed crime, extinct|committed crime, extinct|crime extinct)\b/g,
  },
  {
    id: 'RAW_AS_FORMULA',
    severity: 2,
    description: 'Merit-entry formula starts with raw "As ..." syntax',
    pattern: /\bAs (?:soldier|attendant|cavalry|chariot|Commandery Captain|former|colonel|army soldier|guest|retainer|general|palace attendant cavalry(?: general)?|shield detachment scribe)(?!,|\sof\b)(?: [A-Za-z'’]+){0,5} (?:followed|year|King|Han|rose|became|attacked|entered)\b/g,
  },
  {
    id: 'CAME_SURRENDERED',
    severity: 3,
    description: 'Broken surrender formula',
    pattern: /\bcame surrendered\b/g,
  },
  {
    id: 'RAW_CANNOT_NOT',
    severity: 2,
    description: 'Classical Chinese necessity formula left as "cannot not"',
    pattern: /\bcannot not\b/gi,
  },
  {
    id: 'RAW_CANNOT_BUT',
    severity: 1,
    description: 'Classical Chinese necessity formula left as stiff "cannot but"',
    pattern: /\bcannot but\b/gi,
  },
  {
    id: 'RAW_NONE_DID_NOT',
    severity: 2,
    description: 'Double-negative universal formula left as "none did not"',
    pattern: /\bnone (?:did )?not\b/gi,
  },
  {
    id: 'RAW_CANNOT_REFUSE',
    severity: 1,
    description: 'Necessity formula left as stiff "cannot refuse to"',
    pattern: /\bcannot refuse to\b/gi,
  },
  {
    id: 'REPEATED_LOWERCASE_WORD',
    severity: 2,
    description: 'Likely accidental repeated English word in prose',
    pattern: /\b(?!(?:had|that)\b)([a-z][a-z'-]{2,})\s+\1\b/g,
  },
  {
    id: 'REPEATED_INITIAL_ARTICLE',
    severity: 2,
    description: 'Likely accidental repeated article with sentence-initial capitalization',
    pattern: /\b(?:The the|A a|An an)\b/g,
  },
  {
    id: 'FUSED_COMMON_WORD_BOUNDARY',
    severity: 3,
    description: 'Likely missing space before a common English clause word',
    pattern: /\b(?:alarmonly|chaptersworks|warare|sawyou|sectyou|mudwho|anywayhardly|rearwhat|handwhere|strengthwhat|kinthat|sorcererall|plansis|victoryis|succeededbut|gloryhow|obscuritythough|elsejust|earswar|themthat|fledwhere|rolesremain|precedentslike|modestythey|countinsufficient|stateno|thatnot|sealsnone)\b/g,
  },
  {
    id: 'FUSED_LOWER_UPPER_BOUNDARY',
    severity: 3,
    description: 'Likely missing space where a lowercase word runs into a capitalized word',
    pattern: /\b[A-Za-z’'-]*[a-z][A-Z][A-Za-z’'-]*\b/g,
  },
  {
    id: 'MISSPELLED_MORE_SO',
    severity: 2,
    description: 'Use "more so" rather than the nonstandard closed spelling "moreso"',
    pattern: /\bmoreso\b/gi,
  },
  {
    id: 'RAW_ROMANIZATION_PLACEHOLDER',
    severity: 3,
    description: 'Placeholder romanization left in place of an English translation',
    pattern: /\b(?:Technical sentence in .*?;\s*romanization|Same passage read aloud as):/gi,
  },
  {
    id: 'GENERIC_ANNOTATION_PLACEHOLDER',
    severity: 3,
    description: 'Generic annotation placeholder left instead of translating the source note',
    pattern: /\b(?:The subcomment links Records, Zuo, and Masters texts|The subcomment names Han offices, titles, or ritual gear|The editors align this line with received Wenxuan lemmata|The note defines a rare graph or gives fanqie reading|The critical apparatus marks \(\)|Subcommentary: scholastic gloss citing canonical parallels|Subcomment: parallel diction from the Wenxuan tradition|Commentary note: exegetical expansion with historical exempla|Gloss: Han-school citation cluster supporting the main text|Gloss: moral-philosophical tag from the Analects or Mencius|Editorial gloss: etymology and phonological aside|Commentary: bureaucratic or institutional clarification|The annotation supplies Warring States anecdotes|The scholia explain omens, asterisms, or ritual vocabulary|The note grounds a rhetorical turn|Li Xian strings quotations from the classics|The collation compares early gazetteers, commentaries, and editions|Commentators treat the extra graphs as a copyist[’']s interpolation)\b|(?:^|[〈\"“])Collation \(s\d{4}\):/gim,
  },
  {
    id: 'DUPLICATE_PRONOUN_AFTER_TITLE',
    severity: 3,
    description: 'Service formula accidentally duplicated a pronoun, as in "As general he, he..."',
    pattern: /\bAs [A-Z]?[a-z][A-Za-z'’ -]{1,60} (he|she|it|they), \1\b/gi,
  },
  {
    id: 'RAW_INTERCALARY_MONTH_DATE',
    severity: 2,
    description: 'Intercalary month formula left as "after bingyin day" or similar',
    pattern: /\bafter (?:jiazi|yichou|bingyin|dingmao|wuchen|jisi|gengwu|xinwei|renshen|guiyou|jiaxu|yihai|bingzi|dingchou|wuyin|jimao|gengchen|xinsi|renwu|guiwei|jiashen|yiyou|bingxu|dinghai|wuzi|jichou|gengyin|xinmao|renchen|guisi|jiawu|yiwei|bingshen|dingyou|wuxu|jihai|gengzi|xinchou|renyin|guimao|jiachen|yisi|bingwu|dingwei|wushen|jiyou|gengxu|xinhai|renzi|guichou|jiayin|yimao|bingchen|dingsi|wuwu|jiwei|gengshen|xinyou|renxu|guihai) day\b/gi,
  },
  {
    id: 'RAW_MARQUIS_HOUSEHOLDS_CLIFF',
    severity: 2,
    description: 'Marquisate formula left as clipped prose ending ", Marquis, N households"',
    pattern: /\b[A-Z][A-Za-z'’ -]{0,80}, Marquis, (?:one|two|three|four|five|six|seven|eight|nine|ten|\d)[A-Za-z\d, -]* households\b/g,
  },
  {
    id: 'RAW_USED_AS_MARQUIS',
    severity: 2,
    description: 'Appointment/enfeoffment formula left as "used as [office], Marquis"',
    pattern: /\bused as [A-Z][A-Za-z'’ -]{1,80}, Marquis\b/g,
  },
  {
    id: 'RAW_AS_SURRENDERED_MARQUIS',
    severity: 2,
    description: 'Surrender/enfeoffment formula left as "As [group/person] surrendered, Marquis"',
    pattern: /\bAs [A-Z][A-Za-z'’ -]{1,100} surrendered, Marquis\b/g,
  },
  {
    id: 'RAW_SON_MARQUIS',
    severity: 2,
    description: 'Hereditary enfeoffment formula left as clipped "son Marquis"',
    pattern: /\bson Marquis(?:[,.]|$)/g,
  },
  {
    id: 'RAW_LED_MULTITUDE_SURRENDERED',
    severity: 2,
    description: 'Collective surrender formula left as "led multitude surrendered"',
    pattern: /\bled multitude surrendered\b/gi,
  },
  {
    id: 'RAW_SPEAKS_OF_TEN_THOUSAND_THINGS',
    severity: 1,
    description: 'Etymology gloss left as "speaks of the ten thousand things" instead of natural "refers to"',
    pattern: /\bspeaks of the ten thousand things\b/gi,
  },
  {
    id: 'RAW_DRAGON_INSECT',
    severity: 2,
    description: '龍之為蟲 left as the literal calque "dragon as an insect"',
    pattern: /\bdragon as an insect\b/gi,
  },
  {
    id: 'RAW_FAMILIARLY_RIDDEN',
    severity: 2,
    description: 'Dragon-taming phrase left as "familiarly ridden"',
    pattern: /\bfamiliarly ridden\b/gi,
  },
  {
    id: 'RAW_THEREFORE_CALLED_EMPEROR',
    severity: 2,
    description: 'Imperial-title formula left as "therefore called emperor"',
    pattern: /\btherefore called emperor\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_SUMMONED',
    severity: 2,
    description: '悉召 left as the awkward calque "completely summoned"',
    pattern: /\bcompletely summoned\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_TOOK_DWELLERS',
    severity: 2,
    description: '盡取...居人 left as "completely took the dwellers"',
    pattern: /\bcompletely took the dwellers\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_OFFER_RITES',
    severity: 2,
    description: 'Ritual-performance formula left as "completely offer rites"',
    pattern: /\bcompletely offer rites\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_USED_MUSIC',
    severity: 2,
    description: 'Music-performance formula left as "completely used music"',
    pattern: /\bcompletely used music\b/gi,
  },
  {
    id: 'RAW_PERSONALLY_BOWED_SAW',
    severity: 2,
    description: '禮見 formula left as "personally bowed and saw"',
    pattern: /\bpersonally bowed and saw\b/gi,
  },
  {
    id: 'RAW_TO_COFFIN_HIM',
    severity: 3,
    description: '殯/棺 burial formula left as "to coffin him"',
    pattern: /\bto coffin him\b/gi,
  },
  {
    id: 'RAW_MUTUALLY_IRRIGATE_INPUT',
    severity: 3,
    description: 'Economic transfer formula left as "mutually irrigate and input"',
    pattern: /\bmutually irrigate and input\b/gi,
  },
  {
    id: 'RAW_GOODS_LEAPED_JUMPED',
    severity: 2,
    description: 'Price fluctuation formula left as "goods leaped and jumped"',
    pattern: /\bgoods (?:therefore )?leaped and jumped\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_INVITED',
    severity: 2,
    description: '盡召/悉召 invitation formula left as "completely invited"',
    pattern: /\bcompletely invited\b/gi,
  },
  {
    id: 'RAW_CENTRAL_GRAND_MASTER',
    severity: 2,
    description: 'Central-administration title left as "central grand master"',
    pattern: /\bcentral grand master\b/gi,
  },
  {
    id: 'RAW_WHY_COMPLETELY',
    severity: 2,
    description: '盡/悉 formula left as "Why completely..."',
    pattern: /\bWhy completely [a-z]/g,
  },
  {
    id: 'RAW_NOT_COMPATIBLE',
    severity: 1,
    description: 'Personal enmity formula left as "were not compatible"',
    pattern: /\bwere not compatible\b/gi,
  },
  {
    id: 'RAW_FIND_RESCUE',
    severity: 2,
    description: '救援 formula left as "find rescue"',
    pattern: /\bfind rescue\b/gi,
  },
  {
    id: 'RAW_GRASPED_SPEAR_SHIELD',
    severity: 2,
    description: 'Weapon-taking formula left as "grasped spear and shield"',
    pattern: /\bgrasped spear and shield\b/gi,
  },
  {
    id: 'RAW_NOT_DISCOVERED_MUTUALLY_KILLED',
    severity: 3,
    description: 'Mutual-killing formula left as "not discovered and mutually killed"',
    pattern: /\bnot discovered and mutually killed\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_EXECUTE_TAKE',
    severity: 3,
    description: 'Legal confiscation formula left as "completely execute and take"',
    pattern: /\bcompletely execute and take\b/gi,
  },
  {
    id: 'RAW_BRACKETED_EMENDATION_LEFT',
    severity: 2,
    description: 'Textual emendation marker leaked into English prose',
    pattern: /\([A-Za-z]+\)\s*\[[A-Za-z]+\]/g,
  },
  {
    id: 'RAW_CAME_OUT_THEMSELVES',
    severity: 2,
    description: 'Voluntary-surrender formula left as "came out themselves"',
    pattern: /\bcame out themselves\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_REPLACED_PERSON',
    severity: 1,
    description: 'Administrative succession formula left as "completely replaced [Name]"',
    pattern: /\bcompletely replaced [A-Z][a-z]+\b/g,
  },
  {
    id: 'RAW_COMPLETELY_RAISED_TROOPS',
    severity: 2,
    description: '盡起兵 formula left as "completely raised troops"',
    pattern: /\bcompletely raised troops\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_RECOVERED_CITIES',
    severity: 2,
    description: '盡復城邑 formula left as "completely recovered ... cities"',
    pattern: /\bcompletely recovered [A-Z][A-Za-z'’ -]* cities\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_DIVIDED_TERRITORIES',
    severity: 1,
    description: '盡分地 formula left as "completely divided ... territories"',
    pattern: /\bcompletely divided (?:the )?(?:former )?territor(?:y|ies)\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_SCATTERED_WEALTH',
    severity: 2,
    description: '散財 formula left as "completely scattered his wealth"',
    pattern: /\bcompletely scattered (?:his|her|their) wealth\b/gi,
  },
  {
    id: 'RAW_COMPLETELY_OBTAINED_LANDS',
    severity: 1,
    description: '盡得地 formula left as "completely obtained ... lands"',
    pattern: /\bcompletely obtained (?:the )?(?:lands|territory) of\b/gi,
  },
  {
    id: 'RAW_BROUGHT_LIVING',
    severity: 3,
    description: '致生 formula left as "brought living"',
    pattern: /\bbrought living\b/gi,
  },
  {
    id: 'RAW_AUTUMN_DOWN',
    severity: 2,
    description: '秋毫 fine-detail idiom left as "autumn down"',
    pattern: /\bautumn down\b/gi,
  },
  {
    id: 'RAW_FLOATING_EATING',
    severity: 3,
    description: '浮食 formula left as "floating eating"',
    pattern: /\bfloating eating\b/gi,
  },
  {
    id: 'RAW_ASSIST_TAXES',
    severity: 2,
    description: '佐賦 formula left as "assist taxes"',
    pattern: /\bassist taxes\b/gi,
  },
  {
    id: 'RAW_COULD_NOT_COMPLETELY_HEARD',
    severity: 2,
    description: '不可勝聽 left as "could not be completely heard"',
    pattern: /\bcould not be completely heard\b/gi,
  },
  {
    id: 'RAW_COULD_NOT_BE_COUNTED',
    severity: 1,
    description: '不可勝數 formula left as "could not be counted"',
    pattern: /\bcould not be (?:completely )?counted\b/gi,
  },
  {
    id: 'RAW_WORLD_SALT_IRON',
    severity: 1,
    description: '天下鹽鐵 formula left as "world/world’s salt and iron"',
    pattern: /\bworld'?s salt and iron\b|\bworld salt iron\b/gi,
  },
  {
    id: 'RAW_CAST_MAKE_TOOLS',
    severity: 2,
    description: '鑄作器 left as "cast and make tools"',
    pattern: /\bcast and make tools\b|\bcast make tools\b/gi,
  },
  {
    id: 'RAW_LEVEL_STANDARD',
    severity: 2,
    description: '平準 office/policy left as "level standard"',
    pattern: /\blevel standard\b/gi,
  },
  {
    id: 'RAW_THE_SUPERIOR_FOR_RULER',
    severity: 1,
    description: '上/ruler formula left as stiff "the superior"',
    pattern: /\b(?:the superior (?:said|was|values)|urged the superior)\b/gi,
  },
  {
    id: 'RAW_UPPER_LAW',
    severity: 2,
    description: '上法 formula left as "upper law"',
    pattern: /\bupper law\b/gi,
  },
  {
    id: 'RAW_ENTRUSTED_TRANSPORTS',
    severity: 2,
    description: '委輸 formula left as "entrusted transports"',
    pattern: /\bentrusted transports\b/gi,
  },
  {
    id: 'RAW_LEAP_AND_JUMP',
    severity: 2,
    description: '騰踴 price surge formula left as "leap and jump"',
    pattern: /\bleap(?:ed)? and jump(?:ed)?\b/gi,
  },
  {
    id: 'RAW_OLD_CLERKS',
    severity: 1,
    description: '故吏 formula left as "old clerks"',
    pattern: /\bold clerks\b/gi,
  },
  {
    id: 'RAW_WAYS_OF_CLERKS',
    severity: 2,
    description: '吏道 formula left as "ways of clerks"',
    pattern: /\bways of clerks\b/gi,
  },
  {
    id: 'RAW_MONEY_WAS_FEW',
    severity: 2,
    description: '財政 scarcity formula left as "money was few"',
    pattern: /\bmoney was few\b/gi,
  },
  {
    id: 'RAW_BY_DIFFERENCES',
    severity: 2,
    description: '差等 formula left as "by differences"',
    pattern: /\bby differences\b/gi,
  },
  {
    id: 'RAW_WORLDS_PAVILIONS',
    severity: 2,
    description: '天下亭 formula left as "world’s pavilions"',
    pattern: /\bworld'?s pavilions\b/gi,
  },
  {
    id: 'RAW_ALL_NONE_SOUGHT',
    severity: 2,
    description: '無人請從 formula left as "all none sought"',
    pattern: /\ball none sought\b/gi,
  },
  {
    id: 'RAW_IRON_TOOLS_BITTER',
    severity: 3,
    description: '苦惡 quality complaint left as "iron tools were bitter"',
    pattern: /\biron tools were bitter\b/gi,
  },
  {
    id: 'RAW_MERCHANTS_EXPENSIVE',
    severity: 2,
    description: '價貴 formula left as "merchants were expensive"',
    pattern: /\bmerchants were expensive\b/gi,
  },
  {
    id: 'RAW_CONVICT_LABOR_AGAIN',
    severity: 2,
    description: '徒復作 formula left as "convict labor again"',
    pattern: /\bconvict labor again\b/gi,
  },
  {
    id: 'RAW_REMOVE_CRIMES',
    severity: 2,
    description: '除罪 formula left as "remove crimes"',
    pattern: /\bremove (?:their )?crimes\b/gi,
  },
  {
    id: 'RAW_GARDEN_HORSES',
    severity: 1,
    description: '苑馬 formula left as "garden horses"',
    pattern: /\bgarden horses\b/gi,
  },
  {
    id: 'RAW_NOT_ALL_RESCUED',
    severity: 1,
    description: '相救 relief formula left as "not all be rescued"',
    pattern: /\bnot all be rescued\b|\bcould not all be rescued\b/gi,
  },
  {
    id: 'RAW_OPENED_FIELD_OFFICIALS',
    severity: 2,
    description: '開田官 left as "opened field officials"',
    pattern: /\bopened field officials\b/gi,
  },
  {
    id: 'RAW_GARRISONED_FARMED',
    severity: 2,
    description: '戍田 formula left as "garrisoned and farmed"',
    pattern: /\bgarrisoned and farmed\b/gi,
  },
  {
    id: 'RAW_MARTIAL_STOREHOUSE',
    severity: 2,
    description: '武庫 formula left as "martial storehouse"',
    pattern: /\bmartial storehouse\b/gi,
  },
  {
    id: 'RAW_FATHER_SON_DIE_FOR_IT',
    severity: 1,
    description: '父子死之 formula left as "father/son die for it"',
    pattern: /\b(?:father and son|he and his son|my father and son)[^.]{0,80}\bdie for it\b/gi,
  },
  {
    id: 'RAW_RIGHTEOUSNESS_SHAPED',
    severity: 2,
    description: '義形於內 left as "righteousness shaped within"',
    pattern: /\brighteousness shaped within\b/gi,
  },
  {
    id: 'RAW_BOAT_TAX_AFFAIRS',
    severity: 2,
    description: '船算事 left as "boat tax affairs"',
    pattern: /\bboat tax affairs\b/gi,
  },
  {
    id: 'RAW_RANKED_AS_FEUDAL_LORDS',
    severity: 2,
    description: '諸侯 rank formula left as "ranked as feudal lords"',
    pattern: /\branked as feudal lords\b|\bbegan to be ranked as feudal lords\b|\bfirst ranked as feudal lords\b/gi,
  },
  {
    id: 'RAW_WITH_CALCULATIONS',
    severity: 1,
    description: '心計/calculation ability left as "with calculations"',
    pattern: /\bwith calculations\b/gi,
  },
  {
    id: 'RAW_DIVIDE_WEALTH',
    severity: 1,
    description: '輸財/助費 formula left as "divide their wealth"',
    pattern: /\bdivide their wealth\b/gi,
  },
  {
    id: 'RAW_GENERALLY_ALL',
    severity: 2,
    description: '大抵皆 formula left as "generally all"',
    pattern: /\bgenerally all\b/gi,
  },
  {
    id: 'RAW_OFFICIAL_HATS_CANOPIES',
    severity: 1,
    description: '冠蓋 idiom left as "official hats and canopies"',
    pattern: /\bofficial hats and canopies\b/gi,
  },
  {
    id: 'RAW_CASH_REGISTRATION_ACCUSATIONS',
    severity: 1,
    description: '告緡 system left as "cash-registration accusations"',
    pattern: /\bcash-registration accusations\b/gi,
  },
  {
    id: 'RAW_SPREAD_MANY',
    severity: 2,
    description: 'Proliferation formula left as "spread many"',
    pattern: /\bspread many\b/gi,
  },
  {
    id: 'RAW_PREVENT_SHORTAGES',
    severity: 1,
    description: '毋乏 formula left blandly as "prevent shortages"',
    pattern: /\bprevent shortages\b/gi,
  },
  {
    id: 'RAW_FORMER_CUSTOMS',
    severity: 1,
    description: '故俗 formula may need "local/customary" rather than "former customs"',
    pattern: /\bformer customs\b/gi,
  },
  {
    id: 'RAW_ALTERNATING_YEARS',
    severity: 1,
    description: '閒歲 formula left as "alternating years"',
    pattern: /\balternating years\b/gi,
  },
  {
    id: 'RAW_DEFICIENT_TRIBUTE_GOLD_CONVICTED_FOR',
    severity: 2,
    description: '酎金 formula left as "convicted for deficient tribute gold"',
    pattern: /\bconvicted for deficient tribute gold\b/gi,
  },
  {
    id: 'RAW_DEPRIVED_OF_MARQUISATE',
    severity: 2,
    description: '奪侯/免侯 formula left as "deprived of marquisate"',
    pattern: /\bdeprived of marquisate\b/gi,
  },
  {
    id: 'RAW_STRIPPED_OF_MARQUISATE_NO_PRONOUN',
    severity: 1,
    description: 'Marquisate loss formula missing determiner/pronoun',
    pattern: /\bstripped of marquisate\b/gi,
  },
  {
    id: 'RAW_DISMISSED_TO_COMMONER',
    severity: 1,
    description: '免為庶人 formula left as "dismissed to commoner"',
    pattern: /\bdismissed to commoner\b/gi,
  },
  {
    id: 'RAW_COULD_NOT_ESTABLISH_HEIR',
    severity: 2,
    description: '不得立嗣 formula left as "could not establish heir"',
    pattern: /\bcould not establish heir\b/gi,
  },
  {
    id: 'RAW_WAS_NOT_SON_STATE_ABOLISHED',
    severity: 2,
    description: 'Non-paternity formula left as "was not X son, state abolished"',
    pattern: /\bwas not [A-Z][A-Za-z' -]+(?:'s)? son, the state was abolished\b/gi,
  },
  {
    id: 'RAW_BEGAN_FIRST_YEAR',
    severity: 2,
    description: '元年 succession formula left as "began his first year"',
    pattern: /\bbegan (?:the|his|her|their) first year\b|\bbeginning (?:the|his|her|their) first year\b/gi,
  },
  {
    id: 'RAW_DAY_OF_CYCLICAL_DAY',
    severity: 1,
    description: 'Cyclical-day formula left as "on the day of Renzi"',
    pattern: /\bon the day of (?:Jiazi|Yichou|Bingyin|Dingmao|Wuchen|Jisi|Gengwu|Xinwei|Renshen|Guiyou|Jiaxu|Yihai|Bingzi|Dingchou|Wuyin|Jimao|Gengchen|Xinsi|Renwu|Guiwei|Jiashen|Yiyou|Bingxu|Dinghai|Wuzi|Jichou|Gengyin|Xinmao|Renchen|Guisi|Jiawu|Yiwei|Bingshen|Dingyou|Wuxu|Jihai|Gengzi|Xinchou|Renyin|Guimao|Jiachen|Yisi|Bingwu|Dingwei|Wushen|Jiyou|Gengxu|Xinhai|Renzi|Guichou|Jiayin|Yimao|Bingchen|Dingsi|Wuwu|Jiwei|Gengshen|Xinyou|Renxu|Guihai)\b/g,
  },
  {
    id: 'RAW_YEAR_OF_CYCLICAL_DAY',
    severity: 2,
    description: 'Cyclical-day formula left as "in the year/month of Bingyin"',
    pattern: /\bIn the (?:year|month) of (?:Jiazi|Yichou|Bingyin|Dingmao|Wuchen|Jisi|Gengwu|Xinwei|Renshen|Guiyou|Jiaxu|Yihai|Bingzi|Dingchou|Wuyin|Jimao|Gengchen|Xinsi|Renwu|Guiwei|Jiashen|Yiyou|Bingxu|Dinghai|Wuzi|Jichou|Gengyin|Xinmao|Renchen|Guisi|Jiawu|Yiwei|Bingshen|Dingyou|Wuxu|Jihai|Gengzi|Xinchou|Renyin|Guimao|Jiachen|Yisi|Bingwu|Dingwei|Wushen|Jiyou|Gengxu|Xinhai|Renzi|Guichou|Jiayin|Yimao|Bingchen|Dingsi|Wuwu|Jiwei|Gengshen|Xinyou|Renxu|Guihai)\b/g,
  },
  {
    id: 'RAW_INITIAL_ESTABLISHED_STATE',
    severity: 1,
    description: 'Table founding formula left as "Initially established the State..."',
    pattern: /\b(?:Initially established|The inaugural establishment of) the State of\b/g,
  },
  {
    id: 'RAW_REESTABLISH_STATE',
    severity: 1,
    description: 'Table restoration formula left as imperative "Reestablish the State..."',
    pattern: /\bReestablish(?:ed)? the State of\b/g,
  },
  {
    id: 'RAW_CAPITAL_OF_DUCHY',
    severity: 2,
    description: 'Capital-place formula left as "the capital of the Duchy"',
    pattern: /\bthe capital of the Duchy\b/g,
  },
  {
    id: 'RAW_REIGN_AFTER',
    severity: 2,
    description: 'Succession table formula left as "first year of ... reign after..."',
    pattern: /\bfirst year of [^.]{1,80} reign after\b/gi,
  },
  {
    id: 'RAW_PRESENT_MARQUIS',
    severity: 1,
    description: 'Current-holder formula left as "present Marquis"',
    pattern: /\bpresent Marquis\b|\bpresent marquis\b/g,
  },
  {
    id: 'RAW_MARQUIS_POSSESSIVE_FIRST_YEAR',
    severity: 2,
    description: '元年 table formula left as "Marquis X\'s first year"',
    pattern: /\bMarquis [A-Z][A-Za-z'’ -]*?'s first year\b/g,
  },
  {
    id: 'RAW_INITIAL_AND_SUBJECT',
    severity: 2,
    description: 'Sentence begins with a raw connective before its subject',
    pattern: /\bIn the (?:spring|summer|autumn|winter|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)[^.]{0,80}, and the [A-Z][A-Za-z]+ (?:planned|sent|entered|attacked|killed|rebelled|died|was|were)\b/g,
  },
  {
    id: 'RAW_DAY_FORMULA',
    severity: 2,
    description: 'Cyclical-day formula left as "in the X day"',
    pattern: /\bIn the (?:jiazi|yichou|bingyin|dingmao|wuchen|jisi|gengwu|xinwei|renshen|guiyou|jiaxu|yihai|bingzi|dingchou|wuyin|jimao|gengchen|xinsi|renwu|guiwei|jiashen|yiyou|bingxu|dinghai|wuzi|jichou|gengyin|xinmao|renchen|guisi|jiawu|yiwei|bingshen|dingyou|wuxu|jihai|gengzi|xinchou|renyin|guimao|jiachen|yisi|bingwu|dingwei|wushen|jiyou|gengxu|xinhai|renzi|guichou|jiayin|yimao|bingchen|dingsi|wuwu|jiwei|gengshen|xinyou|renxu|guihai) day\b/g,
  },
  {
    id: 'RAW_ALL_SHALL',
    severity: 2,
    description: 'Raw decree formula left as "and all shall"',
    pattern: /\band all shall (?:conduct|handle|do|proceed)\b/g,
  },
  {
    id: 'RAW_NOT_FOR',
    severity: 2,
    description: 'Raw prohibition formula starts with "Not for..."',
    pattern: /\bNot for [a-z]/g,
  },
  {
    id: 'RAW_WITH_NO_CHANGES',
    severity: 1,
    description: 'Raw final phrase left as "and with no changes"',
    pattern: /\band with no changes\b/g,
  },
  {
    id: 'RAW_BENEFITS_PROFIT',
    severity: 3,
    description: 'Raw 利 formula left as "benefits the profit"',
    pattern: /\bbenefits the profit\b/g,
  },
  {
    id: 'RAW_TOGETHER_FORMULA',
    severity: 3,
    description: 'Raw 偕/俱 formula left as "together" syntax',
    pattern: /\b(?:personally with me together|goes together to)\b/g,
  },
  {
    id: 'RAW_MANY_MOREOVER',
    severity: 3,
    description: 'Raw 更/多 formula left as "many moreover"',
    pattern: /\bmany moreover\b/gi,
  },
  {
    id: 'RAW_GOD_MATTERS',
    severity: 2,
    description: '神事 formula left as "god matters"',
    pattern: /\bgod matters\b/gi,
  },
  {
    id: 'RAW_GODS_OBTAINED',
    severity: 2,
    description: '致/得神 formula left as "gods/spirits can be obtained"',
    pattern: /\b(?:gods|spirits) can be obtained\b/gi,
  },
  {
    id: 'RAW_PENGLAI_OBTAINED',
    severity: 2,
    description: 'Penglai immortality formula left as "Penglai ... can be obtained"',
    pattern: /\b(?:Penglai [^.]{0,80}|medicines of Penglai) can be obtained\b/gi,
  },
  {
    id: 'RAW_ELIXIR_OBTAINED',
    severity: 2,
    description: 'Immortality-elixir formula left as "elixir ... can be obtained"',
    pattern: /\belixir of immortality can be obtained\b/gi,
  },
  {
    id: 'RAW_THEREFORE_CANNOT_REACH',
    severity: 1,
    description: 'Obstruction formula left as "therefore cannot reach"',
    pattern: /\btherefore cannot reach\b/gi,
  },
  {
    id: 'RAW_WHEN_SEEN_SHOOT',
    severity: 2,
    description: 'Raw 見則...射 formula left as "when seen, shoot"',
    pattern: /\bwhen seen, shoot\b/gi,
  },
  {
    id: 'RAW_EXPENSES_MANY',
    severity: 2,
    description: 'Raw 費眾/費多 formula left as "expenses were many"',
    pattern: /\bexpenses were many\b/gi,
  },
  {
    id: 'RAW_MALE_POWER',
    severity: 3,
    description: '雄 formula mistranslated as "male power"',
    pattern: /\bmale power\b/gi,
  },
  {
    id: 'RAW_OBTAINED_AND_POSSESSED',
    severity: 2,
    description: '可得而有 formula left as "obtained and possessed"',
    pattern: /\bobtained and possessed\b/gi,
  },
  {
    id: 'RAW_DID_NOT_OBTAIN_PRONOUN',
    severity: 1,
    description: 'Search/failure formula left as "did not obtain it/them"',
    pattern: /\bdid not obtain (?:it|them|him|her)\b/gi,
  },
  {
    id: 'RAW_GOT_ESCAPE',
    severity: 2,
    description: 'Escape formula left as "got escape/got to escape"',
    pattern: /\bgot (?:escape|to escape)\b/gi,
  },
  {
    id: 'RAW_HEGEMON_NAME',
    severity: 3,
    description: '霸名 formula left as "became a hegemon name"',
    pattern: /\bbecame a hegemon name\b/gi,
  },
  {
    id: 'RAW_STYLED_AS_BO',
    severity: 2,
    description: '霸 formula left as romanized "styled as bo"',
    pattern: /\bstyled as bo\b/gi,
  },
  {
    id: 'RAW_WITH_NAME_OF_IMMORTALITY',
    severity: 2,
    description: 'Immortality/fengshan phrase left as "with the name of immortality"',
    pattern: /\bwith the name of immortality\b/gi,
  },
  {
    id: 'RAW_NAMED_WITH_THE_NAME',
    severity: 1,
    description: 'Naming formula left as "named him/her with the name"',
    pattern: /\bnamed (?:him|her|them) with the name\b/gi,
  },
  {
    id: 'RAW_LIGHT_HEAVY_NO_CONSTANT',
    severity: 2,
    description: '輕重 formula left as "light and heavy had no constant"',
    pattern: /\blight and heavy had no constant\b/gi,
  },
  {
    id: 'RAW_WITHIN_SEAS_SCHOLARS',
    severity: 2,
    description: '海內之士 literalized as "scholars within the seas"',
    pattern: /\bscholars within the seas\b/gi,
  },
  {
    id: 'RAW_SUFFICIENT_TO_BE_STRANGE',
    severity: 2,
    description: '曷足怪 formula left as "sufficient to be strange"',
    pattern: /\bsufficient to be strange\b/gi,
  },
  {
    id: 'RAW_NOT_SUFFICIENT_TO_RELY',
    severity: 2,
    description: '不足恃/不足賴 formula left as "not sufficient to rely on"',
    pattern: /\bnot sufficient to rely on\b/gi,
  },
  {
    id: 'RAW_CANNOT_BE_COUNTED',
    severity: 1,
    description: '不可勝數 formula left as "cannot be counted"',
    pattern: /\bcannot be counted(?! among)\b/gi,
  },
  {
    id: 'RAW_HUGE_TEN_THOUSANDS',
    severity: 2,
    description: '巨萬 formula left as "huge ten thousands"',
    pattern: /\bhuge ten thousands\b/gi,
  },
  {
    id: 'RAW_TEN_THOUSAND_ONE_THOUSAND',
    severity: 2,
    description: 'Large number left as "ten thousand one thousand" instead of an Arabic numeral or natural English',
    pattern: /\bten thousand one thousand\b/gi,
  },
  {
    id: 'RAW_ENTER_GRAIN',
    severity: 2,
    description: '入粟 formula left as "enter grain"',
    pattern: /\benter grain\b/gi,
  },
  {
    id: 'RAW_STRING_MONEY',
    severity: 2,
    description: '緡 formula left as "string money"',
    pattern: /\bstring money\b/gi,
  },
  {
    id: 'RAW_GAZED_TO_AWAIT_FAVOR',
    severity: 3,
    description: '望以待幸 formula left as "gazed to await favor"',
    pattern: /\bgazed to await favor\b/gi,
  },
  {
    id: 'RAW_GALLOP_ROADS',
    severity: 2,
    description: '馳道 left as "gallop roads"',
    pattern: /\bgallop roads\b/gi,
  },
  {
    id: 'RAW_DUPLICATE_WAS',
    severity: 3,
    description: 'Duplicate auxiliary left as "was was"',
    pattern: /\bwas was\b/gi,
  },
  {
    id: 'RAW_ACTUALLY_NOT_SON',
    severity: 3,
    description: 'Non-paternity formula left as "actually not son"',
    pattern: /\bactually not son\b/gi,
  },
  {
    id: 'RAW_STATE_ABOLISHED_EXTINCT',
    severity: 2,
    description: 'Extinction formula left as "state was abolished, extinct"',
    pattern: /\bstate was abolished, extinct\b/gi,
  },
  {
    id: 'RAW_GREAT_WAY_WITHOUT_WAY',
    severity: 3,
    description: '大逆無道 formula left as "great way without way"',
    pattern: /\bgreat way without way\b/gi,
  },
  {
    id: 'RAW_CROWN_PRINCE_AFFAIR',
    severity: 2,
    description: '太子事 formula left as "crown prince affair"',
    pattern: /\bcrown prince affair\b/gi,
  },
  {
    id: 'RAW_MOTHER_ELDEST_PRINCESS',
    severity: 2,
    description: 'Kinship/mourning formula left as "mother eldest princess"',
    pattern: /\bmother eldest princess\b/gi,
  },
  {
    id: 'RAW_FALSE_EDICT_DISCUSSING_CRIME',
    severity: 3,
    description: 'False-edict legal formula left as "carrying false edict discussed crime"',
    pattern: /\bcarrying false edict discussed crime\b/gi,
  },
  {
    id: 'RAW_RELAY_GALLOP_AWAY',
    severity: 3,
    description: 'Relay-station offense left as "galloping in relay station calling out gallop away"',
    pattern: /\bgalloping in relay station calling out gallop away\b/gi,
  },
  {
    id: 'RAW_DEPRIVED_RANK_ONE_LEVEL',
    severity: 2,
    description: 'Rank reduction formula left as "deprived of rank one level"',
    pattern: /\bdeprived of rank one level\b/gi,
  },
  {
    id: 'RAW_KILLED_BY_SOMEONE',
    severity: 2,
    description: '為人所殺 formula left as "killed by someone"',
    pattern: /\bkilled by someone\b/gi,
  },
  {
    id: 'RAW_SENTENCED_DIED_STATE',
    severity: 2,
    description: 'Death-sentence formula left as "sentenced to death, died of illness, the state..."',
    pattern: /\bsentenced to death, died of illness, the state\b/gi,
  },
  {
    id: 'RAW_PERSON_ENDED',
    severity: 2,
    description: 'Ritual table/prose formula left as "when the person ended"',
    pattern: /\bwhen the person ended\b/gi,
  },
  {
    id: 'RAW_TRUE_ONES',
    severity: 1,
    description: 'Likely literal 真 formula left as vague "the true ones"',
    pattern: /\bthe true ones\b/gi,
  },
  {
    id: 'WEIYANG_LOWERCASE',
    severity: 1,
    description: 'Weiyang Palace lowercased',
    pattern: /\bweiyang Palace\b/g,
  },
  {
    id: 'ATTACKED_TEA',
    severity: 3,
    description: 'Likely Zang Tu romanization error left as Tea',
    pattern: /\b(?:attacked|Yan King) Tea\b/g,
  },
  {
    id: 'RAW_TABLE_TITLE_ORDER',
    severity: 2,
    description: 'Table cell appears to preserve raw Chinese title order such as "Cao You Bo"',
    pattern: /\b(?:Chu|Qi|Zhao|Yan|Han|Wei|Qin|Jin|Lu|Song|Cai|Cao|Zheng|Wu|Yue|Dai|Liang|Hengshan|Huainan|Changsha|Jibei|Langya|Lujiang|Hejian|Chengyang|Jinan|Jiaoxi|Jiaodong|Changshan|Linjiang|Huaiyang) [A-Z][A-Za-z'’]+ (?:Wang|Hou|Gong|Bo|Zi)(?: [A-Z][A-Za-z'’]+){0,2}(?= (?:first year|died|established|ruled|re-entered|was|assassinated|killed)|'s mother)/g,
  },
  {
    id: 'RAW_MARQUIS_FIRST_YEAR',
    severity: 2,
    description: 'Table succession formula left as "Marquis X first year"',
    pattern: /\bMarquis (?!of\b)\p{Lu}[\p{L}’]*(?: \p{Lu}[\p{L}’]*){0,5} first year\b/gu,
  },
  {
    id: 'RAW_MARQUIS_OF_FIRST_YEAR',
    severity: 2,
    description: 'Table succession formula left as "Marquis of X first year"',
    pattern: /\bMarquis of \p{Lu}[\p{L}’]*(?: \p{Lu}[\p{L}’]*){0,5} first year\b/gu,
  },
  {
    id: 'RAW_CURRENT_MARQUIS_FIRST_YEAR',
    severity: 1,
    description: 'Table succession formula left as "current Marquis X\'s first year"',
    pattern: /\bcurrent Marquis \p{Lu}[\p{L}’]*(?: \p{Lu}[\p{L}’]*){0,5}'s first year\b/gu,
  },
  {
    id: 'RAW_AFTER_YEAR_FORMULA',
    severity: 1,
    description: '後N年 table formula left as "After year N" instead of "N years later"',
    pattern: /\bAfter year (?:\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/gi,
  },
  {
    id: 'RAW_YEAR_MIDDLE_FORMULA',
    severity: 1,
    description: '年中 table formula left as "Year N middle"',
    pattern: /\bYear \d{1,2} middle\b/g,
  },
  {
    id: 'RAW_TABLE_NAME_YEAR_ONE',
    severity: 2,
    description: 'Succession table cell left as "[Name] year 1"',
    pattern: /(?:^|[.;:]\s+|day,?\s+|month,?\s+)(?:Marquis(?: of)? \p{Lu}[\p{L}’]*(?: \p{Lu}[\p{L}’]*){0,5}|\p{Lu}[\p{L}’]*(?: \p{Lu}[\p{L}’]*){1,5}) year 1\b/gu,
  },
  {
    id: 'RAW_ENFEOFFED_NAME_YEAR_ONE',
    severity: 2,
    description: 'Enfeoffment formula left as "enfeoffed [Name] year 1"',
    pattern: /\benfeoffed [A-Z][^.,;]{0,80} year 1\b/g,
  },
  {
    id: 'RAW_SPACED_CYCLICAL_DAY',
    severity: 1,
    description: 'Cyclical day name split as "xin mao" instead of "xinmao day"',
    pattern: /\b(?:jia|yi|bing|ding|wu|ji|geng|xin|ren|gui) (?:zi|chou|yin|mao|chen|si|wu|wei|shen|you|xu|hai)\b/g,
  },
  {
    id: 'RAW_DIED_NO_HEIR_STATE',
    severity: 1,
    description: 'Table extinction formula left as "Died, no heir, the state was abolished"',
    pattern: /\bDied, no heir, the state was abolished\b/g,
  },
  {
    id: 'RAW_DIED_LEFT_NO_HEIR',
    severity: 1,
    description: 'Table extinction formula left as "Died, left no heir"',
    pattern: /\bDied, left no heir\b/g,
  },
  {
    id: 'RAW_EXECUTED_STATE',
    severity: 1,
    description: 'Execution formula left as "executed, and the state was abolished"',
    pattern: /(?<!\bwas )(?<!\band )\bexecuted, and the state was abolished\b/g,
  },
  {
    id: 'RAW_DIED_NO_HEIR_EXTINCT',
    severity: 2,
    description: 'Table extinction formula left as "Died, no heir, extinct"',
    pattern: /\bDied, no heir, extinct\b/g,
  },
  {
    id: 'RAW_MOTHER_MARQUIS',
    severity: 3,
    description: 'Posthumous title 穆 left as "Mother Marquis"',
    pattern: /\bMother Marquis\b/g,
  },
  {
    id: 'RAW_NOT_MARKET_PERSON_SON',
    severity: 3,
    description: '非其人子 formula left as "not market person\'s son"',
    pattern: /\bnot market person's son\b/g,
  },
  {
    id: 'RAW_SAT_CONVICTED',
    severity: 2,
    description: '坐 conviction formula left as "sat" or "sitting"',
    pattern: /\b(?:sat and encroached|Sitting birds and beasts|sat and died for)\b/g,
  },
  {
    id: 'RAW_STATE_ENDED',
    severity: 2,
    description: 'Marquisate extinction formula left as "state ended"',
    pattern: /\bstate ended\b/g,
  },
  {
    id: 'RAW_COULD_NOT_ESTABLISH_POSTERITY',
    severity: 2,
    description: 'Succession formula left as "could not establish posterity"',
    pattern: /\bcould not establish posterity\b/gi,
  },
  {
    id: 'RAW_BECAME_COMMON_SOLDIER',
    severity: 2,
    description: 'Status-reduction formula left as "became common soldier"',
    pattern: /\bbecame common soldier\b/gi,
  },
  {
    id: 'RAW_CONVICTED_THAT_FATHER',
    severity: 2,
    description: 'Non-paternity/legal formula left as "convicted that father..."',
    pattern: /\bconvicted that father\b/gi,
  },
  {
    id: 'RAW_CONVICTED_VIOLATING_LAWS',
    severity: 2,
    description: '坐...過律 formula left as "convicted of ... violating laws"',
    pattern: /\bconvicted of [a-z][a-z -]{0,60} violating laws\b/gi,
  },
  {
    id: 'RAW_CITY_WALL_LABORER',
    severity: 2,
    description: 'Punishment 城旦 left as raw "city wall laborer"',
    pattern: /\bcity wall laborer\b/g,
  },
  {
    id: 'RAW_NOT_ACCORDING_TO_REGULATIONS',
    severity: 1,
    description: '不如令 formula left as "not according to regulations"',
    pattern: /\bnot according to regulations\b/g,
  },
  {
    id: 'RAW_CHANCELLOR_FOR_EMPEROR',
    severity: 2,
    description: 'Chancellor service formula left as "Chancellor for Emperor..."',
    pattern: /\bChancellor for Emperor\b/g,
  },
  {
    id: 'RAW_SUBJECTLESS_CONVICTED',
    severity: 2,
    description: 'Table note starts a sentence with subjectless "Was convicted"',
    pattern: /(?:^|[.!?]\s+)Was convicted of a crime\b/g,
  },
  {
    id: 'RAW_CONVICTED_OF_AS',
    severity: 2,
    description: '坐...為 formula left as "convicted of as..."',
    pattern: /\bconvicted of as\b/g,
  },
  {
    id: 'RAW_DIED_WITHOUT_HEIR_STATE',
    severity: 1,
    description: 'Table extinction formula needs a conjunction after "died without an heir"',
    pattern: /\bdied without an heir, the state was abolished\b/gi,
  },
  {
    id: 'RAW_ENFEOFFED_BEGAN_FIRST_YEAR',
    severity: 1,
    description: 'Succession formula left as "enfeoffed X began his first year"',
    pattern: /\benfeoffed [A-Z][^.,;]{0,80} began (?:his|her|its) first year\b/g,
  },
  {
    id: 'RAW_AS_GRAND_TUTOR_OF',
    severity: 2,
    description: 'Merit formula starts with raw "As Grand Tutor of..." syntax',
    pattern: /\bAs Grand Tutor of\b/g,
  },
  {
    id: 'RAW_DISRESPECTFUL_STATE',
    severity: 1,
    description: '不敬 offense left as clipped "disrespectful, the state was abolished"',
    pattern: /\bdisrespectful, the state was abolished\b/g,
  },
  {
    id: 'RAW_CONVICTED_AS_OFFICE',
    severity: 2,
    description: '坐為 formula left as "convicted as [office]..."',
    pattern: /\bconvicted as (?:Grand|general|Chancellor|Superintendent|Commandant|Marquis|King|Palace|Imperial|Administrator|Master|Colonel|Director|Minister)\b/gi,
  },
  {
    id: 'RAW_CONVICTED_CRIMES_AS_OFFICE',
    severity: 2,
    description: '坐為...有罪 formula left as "convicted of crimes as [office]"',
    pattern: /\bconvicted of crimes as\b/g,
  },
  {
    id: 'RAW_PLOTTING_BUT_NOT_KILLING',
    severity: 2,
    description: '謀殺人未殺 formula left as "plotting murder but not killing"',
    pattern: /\bplotting murder but not killing\b/g,
  },
  {
    id: 'RAW_REQUESTING_OFFICIALS_CRIMES',
    severity: 2,
    description: '請求吏罪 formula left as "requesting officials\' crimes"',
    pattern: /\brequesting officials' crimes\b/g,
  },
  {
    id: 'RAW_ENTERING_WITH_SLAVES',
    severity: 2,
    description: '闌入 formula left as "entering ... with slaves"',
    pattern: /\bentering Shanglin Park with slaves\b/g,
  },
  {
    id: 'RAW_REBELLED_AS_NAME',
    severity: 3,
    description: '反 rebellion formula mistranslated as a name before "committed suicide"',
    pattern: /\b(?:Fan|Zou), committed suicide\b/g,
  },
  {
    id: 'REIGN_ERA_TYPO_JIANYU',
    severity: 3,
    description: 'Jianyuan reign era misspelled as Jianyu',
    pattern: /\bJianyu\b/g,
  },
  {
    id: 'RAW_REIGN_YEAR_NUMERAL',
    severity: 1,
    description: 'Reign year left as "Yuanshuo 2" instead of prose',
    pattern: /\b(?:Jianyuan|Yuanguang|Yuanshuo|Yuanshou|Yuanding|Yuanfeng|Taichu|Taishi) \d+\b/g,
  },
  {
    id: 'RAW_REIGN_YEAR_WORD_ORDER',
    severity: 1,
    description: 'Reign year left as "Yuanshuo year five" or "Yuanshuo fifth year"',
    pattern: /\b(?:Jianyuan|Yuanguang|Yuanshuo|Yuanshou|Yuanding|Yuanfeng|Taichu|Taishi|Zhenghe) (?:year )?(?:one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) year\b/gi,
  },
  {
    id: 'RAW_LATER_YEAR_FORMULA',
    severity: 1,
    description: 'Houyuan formula left as "Later year three"',
    pattern: /\b(?:In )?Later year (?:one|two|three|four|five|six|seven|eight|nine|ten)\b/gi,
  },
  {
    id: 'RAW_CURRENT_MARQUIS',
    severity: 1,
    description: '今侯 formula left as "current Marquis"',
    pattern: /\bcurrent Marquis\b/g,
  },
  {
    id: 'LOWERCASE_ROMANIZED_MARQUIS_NAME',
    severity: 1,
    description: 'Known romanized personal name lowercased in marquis table formula',
    pattern: /\b(?:Marquis )?(?:yiwu|jixu|wuhai)\b/g,
  },
  {
    id: 'RAW_POSTHUMOUS_TITLE_ORDER',
    severity: 2,
    description: 'Posthumous title appears before rank, such as "Gong Marquis"',
    pattern: /\b(?:Ai|An|Cheng|Ci|Dai|Dao|Ding|Gong|Hui|Jian|Jie|Jing|Kang|Li|Lie|Qing|Su|Wen|Wu|Xian|Xiao|Xin|Yi|Yuan|Zhao|Zhen|Zhuang) Marquis [A-Z][A-Za-z'’]+\b/g,
  },
  {
    id: 'RAW_BARE_EVENT_VERB',
    severity: 2,
    description: 'Table note uses a clipped event verb such as "Four. Abolish."',
    pattern: /\b(?:One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty|Thirty)(?:-[a-z]+)?\. (?:Abolish|Death)\b/g,
  },
  {
    id: 'RAW_DIRECTIONAL_VERB',
    severity: 2,
    description: 'Directional phrase left as raw "south he defeated" syntax',
    pattern: /(?:^|[,;]\s+)(?:north|south|east|west) he (?:attacked|defeated|crushed|annexed|took|entered|went|returned|subjugated)\b/g,
  },
  {
    id: 'RAW_MATTERS_PHRASE',
    severity: 2,
    description: 'Planning phrase left as "attacking X matters"',
    pattern: /\b(?:attack|attacking|strike|striking) [A-Z][A-Za-z]+ matters\b/g,
  },
  {
    id: 'RAW_CAUSAL_THIS',
    severity: 2,
    description: 'Causal phrase left as "because of this the army..."',
    pattern: /\bbecause of this (?:the army|army|generals|Qi|state)\b/g,
  },
  {
    id: 'RAW_NOT_KNOW_ANYONE',
    severity: 2,
    description: 'Unconsciousness left as "did not know anyone"',
    pattern: /\bFor five days he did not know anyone\b/g,
  },
  {
    id: 'RAW_MUST_REST',
    severity: 2,
    description: 'Illness formula left as "illness must rest"',
    pattern: /\billness must rest\b|\bWhen it rests, there must be words\b/g,
  },
  {
    id: 'RAW_FAMOUS_CALLED',
    severity: 2,
    description: 'Reputation phrase left as "was famous in X, called..."',
    pattern: /\bwas famous in [A-Z][a-z]+, called\b/g,
  },
  {
    id: 'RAW_NOT_KNOWING_ORIGIN',
    severity: 2,
    description: 'Source formula left as "not knowing his origin"',
    pattern: /\bnot knowing (?:his|her|its) origin\b/g,
  },
  {
    id: 'RAW_CONTENDED_TO',
    severity: 2,
    description: 'Raw 爭 formula left as "all contended to..."',
    pattern: /\ball contended to (?:hide|form|die|serve|seek|compete)\b/g,
  },
  {
    id: 'RAW_ASSIST_EXPENSES',
    severity: 2,
    description: 'Finance phrase left as "assist expenses"',
    pattern: /\bassist expenses\b/g,
  },
  {
    id: 'RAW_FIVE_GRAND_MASTERS',
    severity: 2,
    description: 'Rank 五大夫 mistranslated as "five grand masters"',
    pattern: /\bfive grand masters\b/g,
  },
  {
    id: 'RAW_GRAND_MASTERS',
    severity: 1,
    description: 'Lowercase "grand masters" is usually an awkward rendering of 大夫',
    pattern: /\bgrand masters\b/gi,
  },
  {
    id: 'RAW_TAKE_FAVOR',
    severity: 2,
    description: 'Favor-seeking phrase left as "take favor"',
    pattern: /\btake favor\b/g,
  },
  {
    id: 'CAME_FLEEING',
    severity: 1,
    description: '來奔 formula left as awkward "came fleeing"',
    pattern: /\bcame fleeing\b/g,
  },
  {
    id: 'RAW_NO_CONDUCT',
    severity: 2,
    description: 'Character judgment left as "no conduct"',
    pattern: /\b(?:had|has) no conduct\b/g,
  },
  {
    id: 'RAW_OUTSIDE_DRIVER',
    severity: 2,
    description: 'Chariot role left as raw "outside driver"',
    pattern: /\boutside driver\b/g,
  },
  {
    id: 'RAW_KNOCKED_HEAD',
    severity: 2,
    description: 'Kowtow formula left as "knocked his head"',
    pattern: /\bknocked (?:his|her|their) heads?\b/g,
  },
  {
    id: 'RAW_WITH_GRANDEES_WITH_TROOPS',
    severity: 2,
    description: 'Troop phrase duplicated as "with the grandees with troops"',
    pattern: /\bwith the grandees with troops\b/g,
  },
  {
    id: 'RAW_MADE_REBELLION',
    severity: 2,
    description: '作亂 formula left as awkward "made rebellion"',
    pattern: /\bmade (?:a )?rebellion\b/g,
  },
  {
    id: 'RAW_MAKE_CHAOS',
    severity: 2,
    description: '作亂/為亂 formula left as awkward "make chaos"',
    pattern: /\b(?:make|made|cause|causes|caused|causing|would cause|will cause|to cause) chaos\b/gi,
  },
  {
    id: 'RAW_WITH_TOGETHER',
    severity: 2,
    description: 'Raw 偕/俱/并 formula left as "with ... together"',
    pattern: /\bwith (?:him|her|them|it|[A-Z][A-Za-z'’]+(?: [A-Z][A-Za-z'’]+){0,8}) together\b|\b(?:to|wishing to) together (?:attack|strike|destroy|serve|establish|enter|perform|make|flee|return)\b/g,
  },
  {
    id: 'RAW_ALREADY_THEN',
    severity: 1,
    description: '已而 formula left as "already then"',
    pattern: /\balready then\b/gi,
  },
  {
    id: 'RAW_MOREOVER_SAID',
    severity: 1,
    description: '又曰 formula left as stiff "moreover said"',
    pattern: /\bmoreover said\b/gi,
  },
  {
    id: 'RAW_TOGETHER_ESTABLISHED',
    severity: 1,
    description: 'Succession formula left as "together established"',
    pattern: /\btogether established\b/g,
  },
  {
    id: 'RAW_DOUBLE_CONNECTIVE',
    severity: 2,
    description: 'Duplicated connective left as "therefore then" or similar',
    pattern: /\b(?:therefore then|thereupon then|then therefore|then thereupon)\b/gi,
  },
  {
    id: 'RAW_BECAUSE_REASON',
    severity: 2,
    description: 'Causal phrase left as "because of X reason"',
    pattern: /\bbecause of [A-Z][A-Za-z'’]+(?: [A-Z][A-Za-z'’]+){0,6}'?s? reason\b/g,
  },
  {
    id: 'RAW_CONSEQUENTLY_MADE',
    severity: 1,
    description: 'Formula left as "Consequently, made it..."',
    pattern: /\bConsequently, made it\b/g,
  },
  {
    id: 'RAW_USED_AFFAIRS',
    severity: 2,
    description: '用事 formula left as "used affairs"',
    pattern: /\bused affairs\b/g,
  },
  {
    id: 'RAW_DIRECT_FINGER',
    severity: 2,
    description: '直指 official title left as "direct finger"',
    pattern: /\bdirect finger\b/g,
  },
  {
    id: 'RAW_LOOKED_UP_SUPPLIED',
    severity: 2,
    description: 'Supply formula left as "looked up to and were supplied"',
    pattern: /\blooked up to and (?:were )?supplied by\b|\ball looked up to the county officials\b/g,
  },
  {
    id: 'RAW_NO_STORED',
    severity: 2,
    description: 'Poverty phrase left as "no stored or accumulated goods"',
    pattern: /\bno stored or accumulated goods\b/g,
  },
  {
    id: 'RAW_INITIAL_COMMANDERIES',
    severity: 1,
    description: 'New commanderies formula left as "initial commanderies"',
    pattern: /\binitial commanderies\b/g,
  },
  {
    id: 'RAW_MONOPOLIZED_TAX',
    severity: 2,
    description: '擅賦 formula left as "monopolized tax laws"',
    pattern: /\bmonopolized tax laws\b/g,
  },
  {
    id: 'RAW_WEI_WEY_COLLAPSE',
    severity: 3,
    description: '衛/魏 distinction collapsed into repeated "Wei"',
    pattern: /\b(?:Wei endures as Wei|Wei exists as Wei|Wei will surely [^.]{0,40}submit to Wei|annex Wei to Wei)\b/g,
  },
  {
    id: 'RAW_LOST_THIS_MARQUIS',
    severity: 3,
    description: 'Missing-record table note left as "Lost this marquis..."',
    pattern: /\bLost this marquis\b/g,
  },
  {
    id: 'RAW_ZHONG_EXTINCT',
    severity: 2,
    description: '中絕 formula left as "Zhong extinct"',
    pattern: /\bZhong extinct\b/g,
  },
  {
    id: 'RAW_PASS_AWAY_IMPERATIVE',
    severity: 2,
    description: '薨 formula left as imperative/base-form "Pass away"',
    pattern: /\bPass away\b/g,
  },
  {
    id: 'RAW_FOLLOWED_UPRISING',
    severity: 2,
    description: 'Merit-table service formula left as "followed uprising"',
    pattern: /\bfollowed uprising\b/g,
  },
  {
    id: 'RAW_FOLLOWED_PACIFYING',
    severity: 2,
    description: 'Merit-table service formula left as "followed pacifying"',
    pattern: /\bfollowed (?:pacifying|attacking)\b/g,
  },
  {
    id: 'RAW_FOLLOWED_GENERAL_IN_ATTACKING',
    severity: 1,
    description: 'Military service formula left as "followed [general] in attacking" instead of "served under"',
    pattern: /\bfollowed [A-Z][A-Za-z'’ -]{1,80} in attacking\b/g,
  },
  {
    id: 'RAW_PACIFIED_THREE_QINS',
    severity: 2,
    description: '三秦 formula missing article: "pacified Three Qins"',
    pattern: /\bpacified Three Qins\b/g,
  },
  {
    id: 'RAW_MERITORIOUS_SERVICE_COMPARABLE',
    severity: 2,
    description: 'Merit-table comparison left as "meritorious service comparable"',
    pattern: /\bmeritorious service (?:comparable to|led to)\b/g,
  },
  {
    id: 'RAW_ENTERED_HAN_AS',
    severity: 1,
    description: 'Merit-table sequence left as comma splice "entered Han, as..."',
    pattern: /\bentered Han, as\b/g,
  },
];

let includeLiteral = false;

function usage() {
  console.error(`Usage:
  node scripts/scan-translation-artifacts.mjs [--book BOOK] [--json] [--summary] [--fail] [--include-literal] [path ...]

Options:
  --book BOOK       Scan data/BOOK
  --json            Emit machine-readable JSON
  --summary         Emit per-book and per-rule counts only
  --fail            Exit 1 when candidates are found
  --include-literal Also scan literal fields, useful for cleanup but noisier`);
}

function parseArgs(argv) {
  const opts = { inputs: [], book: null, json: false, summary: false, fail: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--summary') {
      opts.summary = true;
      continue;
    }
    if (arg === '--fail') {
      opts.fail = true;
      continue;
    }
    if (arg === '--include-literal') {
      includeLiteral = true;
      continue;
    }
    if (arg === '--book') {
      opts.book = argv[++i];
      if (!opts.book) {
        usage();
        process.exit(2);
      }
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.book = arg.slice('--book='.length);
      continue;
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(2);
    }
    opts.inputs.push(arg);
  }
  if (opts.book && opts.inputs.length > 0) {
    console.error('Use either --book or explicit paths, not both.');
    process.exit(2);
  }
  return opts;
}

function chapterFiles(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
      return;
    }
    if (/^\d{3}\.json$/.test(path.basename(entry))) files.push(entry);
  };

  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}

function isTranslationField(keyPath) {
  const key = keyPath[keyPath.length - 1] || '';
  if (key === 'literal') return includeLiteral;
  if (CHECK_FIELDS.has(key)) return true;
  return keyPath.includes('translations') && key === 'idiomatic';
}

function nearestContext(keyPath) {
  const sentenceIndex = keyPath.lastIndexOf('sentences');
  if (sentenceIndex >= 0 && keyPath.length > sentenceIndex + 1) {
    return `sentences.${keyPath[sentenceIndex + 1]}.${keyPath.slice(sentenceIndex + 2).join('.')}`;
  }
  const cellIndex = keyPath.lastIndexOf('cells');
  if (cellIndex >= 0 && keyPath.length > cellIndex + 1) {
    return `cells.${keyPath[cellIndex + 1]}.${keyPath.slice(cellIndex + 2).join('.')}`;
  }
  return keyPath.join('.');
}

function excerpt(text, index, width = 56) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function hasHan(text) {
  return /[\u4e00-\u9fff]/u.test(String(text || ''));
}

function englishWordCount(text) {
  return (String(text || '').match(/\b[A-Za-z][A-Za-z'’-]*\b/g) || []).length;
}

function isNarrowChineseException(text, reason) {
  const normalizedReason = String(reason || '').toLowerCase();
  if (/(?:title|tune|hymn|aria|melody|song)/u.test(normalizedReason) && /《[^》]*[\u4e00-\u9fff][^》]*》/u.test(String(text || ''))) {
    return true;
  }
  if (/(?:proper[-\s]?name|personal[-\s]?name|office[-\s]?table|table[-\s]?cell)/u.test(normalizedReason)) {
    const value = String(text || '');
    if (/(?:Officeholder|officeholder|Minister|Vice Minister|Censor|General|Grand Secretary|served|transferred|appointed|relieved|removed|died|declined|did not take|concurrently|granted leave|went on|mourning)[^。]*[\u4e00-\u9fff]/u.test(value)) {
      return true;
    }
    if (/[\u4e00-\u9fff]{2,}(?:[、，][\u4e00-\u9fff]{2,})*[:：]/u.test(value)) {
      return true;
    }
  }
  if (!/(?:character|written[-\s]?form|graph|glyph|philological|orthograph|source[-\s]?character)/u.test(normalizedReason)) {
    return false;
  }
  return /\b(?:character|graph|glyph|written|write|writes|wrote|pronounced|read|reads|reading|quotes|says|has|have|appears|adds|add|omits|omitting|following|matching|mistake|mistakes|interchangeable|means|meaning|gives|resembles|resembled|becomes|changed to|replace|replaces|replaced|written as|printed|corrected|edition|witness|called|same as|corrupt|corruption|dropped|drop|lacks|lack|missing|repeat|before|superfluous|supplied|amended|suspected)\b/iu.test(String(text || ''))
    || /[\u4e00-\u9fff]+(?:["”']?\s*(?:means|is pronounced|was pronounced|resembles|resembled|becomes|is written|was written|changed to|is replaced|replaces|replace with|gives|as|is the same as|is corrupt|is supplied)\s*|[，、]\s*)/u.test(String(text || ''));
}

export function scanArtifactText(text, opts = {}) {
  const hits = [];
  const containsHan = hasHan(text);
  if (!opts.allowChineseCharacters && hasDisallowedChineseCharacters(text)) {
    const match = /[\u4e00-\u9fff]+/u.exec(text);
    hits.push({
      ruleId: 'CHINESE_CHARACTERS_IN_ENGLISH',
      severity: 3,
      description: 'Chinese characters left in English translation text',
      found: match?.[0] || '',
      index: match?.index || 0,
      excerpt: excerpt(text, match?.index || 0),
    });
  }
  if (opts.allowChineseCharacters && containsHan) {
    const match = /[\u4e00-\u9fff]+/u.exec(text);
    if (!opts.allowChineseCharactersReason) {
      hits.push({
        ruleId: 'CHINESE_CHARACTERS_EXCEPTION_WITHOUT_REASON',
        severity: 2,
        description: 'Chinese-character translation exception is missing allowChineseCharactersReason',
        found: match?.[0] || '',
        index: match?.index || 0,
        excerpt: excerpt(text, match?.index || 0),
      });
    } else if (!isNarrowChineseException(text, opts.allowChineseCharactersReason) && englishWordCount(text) >= 6) {
      hits.push({
        ruleId: 'BROAD_CHINESE_CHARACTERS_EXCEPTION',
        severity: 2,
        description: 'Chinese-character exception appears to suppress mixed English/Chinese translation prose',
        found: match?.[0] || '',
        index: match?.index || 0,
        excerpt: excerpt(text, match?.index || 0),
      });
    }
  }
  for (const rule of TRANSLATION_ARTIFACT_RULES) {
    if (typeof rule.check === 'function') {
      for (const hit of rule.check(text, opts)) {
        hits.push({
          ruleId: rule.id,
          severity: rule.severity,
          description: rule.description,
          found: hit.found || '',
          index: hit.index || 0,
          excerpt: hit.excerpt || excerpt(text, hit.index || 0),
        });
      }
      continue;
    }
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(text)) !== null) {
      if (isAllowedArtifactHit(rule.id, match[0], text, match.index)) continue;
      hits.push({
        ruleId: rule.id,
        severity: rule.severity,
        description: rule.description,
        found: match[0],
        index: match.index,
        excerpt: excerpt(text, match.index),
      });
    }
  }
  return hits.sort((a, b) => b.severity - a.severity || a.index - b.index || a.ruleId.localeCompare(b.ruleId));
}

function* walk(value, keyPath = [], sentenceId = '', allowChineseCharacters = false, allowChineseCharactersReason = '', sourceText = '') {
  if (typeof value === 'string') {
    if (keyPath.includes('translations') && keyPath[keyPath.length - 1] === 'text') {
      yield {
        path: nearestContext(keyPath),
        sentenceId,
        ruleId: 'TRANSLATION_TEXT_FIELD',
        severity: 3,
        description: 'Deprecated translations[].text field is present; remove it and use literal/idiomatic only',
        found: value,
        index: 0,
        excerpt: excerpt(value, 0),
      };
      return;
    }
    if (!isTranslationField(keyPath)) return;
    for (const hit of scanArtifactText(value, { allowChineseCharacters, allowChineseCharactersReason, sourceText })) {
      yield {
        path: nearestContext(keyPath),
        sentenceId,
        ...hit,
      };
    }
    return;
  }

  if (!value || typeof value !== 'object') return;
  const nextSentenceId = typeof value.id === 'string' ? value.id : sentenceId;
  const nextSourceText = typeof value.zh === 'string' ? value.zh : sourceText;
  const nextAllowChineseCharacters = allowChineseCharacters || value.allowChineseCharacters === true;
  const nextAllowChineseCharactersReason = typeof value.allowChineseCharactersReason === 'string' && value.allowChineseCharactersReason.trim()
    ? value.allowChineseCharactersReason.trim()
    : allowChineseCharactersReason;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      yield* walk(value[i], [...keyPath, String(i)], nextSentenceId, nextAllowChineseCharacters, nextAllowChineseCharactersReason, nextSourceText);
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    yield* walk(child, [...keyPath, key], nextSentenceId, nextAllowChineseCharacters, nextAllowChineseCharactersReason, nextSourceText);
  }
}

function bookIdFor(file) {
  return path.basename(path.dirname(file));
}

function chapterIdFor(file) {
  return path.basename(file, '.json');
}

function scanFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hits = [...walk(data)].map((hit) => ({
    file,
    book: bookIdFor(file),
    chapter: chapterIdFor(file),
    ...hit,
  }));
  return hits;
}

function printSummary(hits) {
  const byBook = new Map();
  const byRule = new Map();
  for (const hit of hits) {
    const book = byBook.get(hit.book) || { chapters: new Set(), hits: 0 };
    book.chapters.add(hit.chapter);
    book.hits += 1;
    byBook.set(hit.book, book);

    const rule = byRule.get(hit.ruleId) || { severity: hit.severity, hits: 0 };
    rule.hits += 1;
    byRule.set(hit.ruleId, rule);
  }

  console.log('\nbook\tchapters\thits');
  for (const [book, info] of [...byBook.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`${book}\t${info.chapters.size}\t${info.hits}`);
  }

  console.log('\nrule\tseverity\thits');
  for (const [ruleId, info] of [...byRule.entries()].sort((a, b) => b[1].hits - a[1].hits || a[0].localeCompare(b[0]))) {
    console.log(`${ruleId}\t${info.severity}\t${info.hits}`);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  let inputs = opts.inputs;
  if (opts.book) inputs = [path.join(DATA_DIR, opts.book)];
  if (inputs.length === 0) {
    inputs = fs.readdirSync(DATA_DIR)
      .map((entry) => path.join(DATA_DIR, entry))
      .filter((entry) => fs.statSync(entry).isDirectory() && path.basename(entry) !== 'quality');
  }

  const files = chapterFiles(inputs);
  const hits = files.flatMap(scanFile);

  if (opts.json) {
    console.log(JSON.stringify({ count: hits.length, hits }, null, 2));
  } else {
    console.log(`Translation artifact candidates: ${hits.length} hit(s) in ${new Set(hits.map((hit) => `${hit.book}/${hit.chapter}`)).size} chapter(s)`);
    if (opts.summary) {
      printSummary(hits);
    } else {
      for (const hit of hits.slice(0, 200)) {
        console.log(`${hit.file}:${hit.sentenceId || hit.path}: ${hit.ruleId} (${hit.severity}) ${hit.excerpt}`);
      }
      if (hits.length > 200) console.log(`... ${hits.length - 200} more hit(s). Use --json or --summary for full output.`);
    }
  }

  if (opts.fail && hits.length > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
