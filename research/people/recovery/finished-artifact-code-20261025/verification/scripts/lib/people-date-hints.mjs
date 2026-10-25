// Format existing Western chronology only; never derive a year from evidence.
export function normalizeWesternDateHint(hint) {
  if(typeof hint!=='string')throw new Error('Active-date hints must be strings');
  // Only an exact era/bound/year prefix is formatting-only. A trailing
  // parenthesis is retained byte-for-byte as explanatory source context.
  // Reject incomplete numbers, ranges, duplicate eras, and mixed trailing text
  // as a whole rather than letting the legacy suffix pass partially edit them.
  if (/^(?:AD|BC)\s+(?:onOrAfter|onOrBefore|before|after)\b/u.test(hint)) {
    const labels = { onOrAfter: 'on or after', onOrBefore: 'on or before', before: 'before', after: 'after' };
    // The sole leading era scopes both explicitly supplied bound years.
    // Check chronology in that era; never reorder endpoints or invent scope.
    const pair = /^(AD|BC)\s+(onOrAfter|after)\s+([1-9]\d{0,3})\s+(onOrBefore|before)\s+([1-9]\d{0,3})([ \t]+\([^()\r\n]+\))?$/u.exec(hint);
    if (pair) {
      if (/\b(?:AD|BC|BCE|CE)\b/iu.test(pair[6] ?? '')) return hint;
      const lower = Number(pair[3]), upper = Number(pair[5]);
      const reversed = pair[1] === 'AD' ? lower > upper : lower < upper;
      const lowerOrdinal = pair[1] === 'AD' ? lower : -lower;
      const upperOrdinal = pair[1] === 'AD' ? upper : -upper;
      const empty = lowerOrdinal + (pair[2] === 'after' ? 1 : 0) >
        upperOrdinal - (pair[4] === 'before' ? 1 : 0);
      if (reversed || empty) return hint;
      return `${labels[pair[2]]} ${pair[1]} ${pair[3]} and ${labels[pair[4]]} ${pair[1]} ${pair[5]}${pair[6] ?? ''}`;
    }
    const bound = /^(AD|BC)(\s+)(onOrAfter|onOrBefore|before|after)(\s+)([1-9]\d{0,3})([ \t]+\([^()\r\n]+\))?$/u.exec(hint);
    if (!bound || /\b(?:AD|BC|BCE|CE)\b/iu.test(bound[6] ?? '')) return hint;
    return `${labels[bound[3]]}${bound[2]}${bound[1]}${bound[4]}${bound[5]}${bound[6] ?? ''}`;
  }
  return hint.replace(/(?<![\p{L}\p{N}+])([1-9]\d{0,3})(\s*[-–—]\s*([1-9]\d{0,3}))?\s+(BC|AD)\b/gu,
    (match,first,separator,last,era,offset)=>{
      const prefix=hint.slice(0,offset);
      // A preceding number separated only by punctuation, symbols or space may
      // be part of an unsupported numeric form; never rewrite its trailing part.
      if(/\p{N}[\s\p{P}\p{S}]*$/u.test(prefix))return match;
      // In "Xinghe 3 AD 541", AD belongs to the following Western year,
      // not the preceding regnal-year number. Leave that context unchanged.
      if(/^\s+\d/u.test(hint.slice(offset+match.length)))return match;
      if(/[-+–—]\s*$/u.test(prefix)&&!/(?:\b(?:BC|AD)\s+[1-9]\d{0,3}|\b[1-9]\d{0,3}\s+(?:BC|AD))\s*[-–—]\s*$/u.test(prefix))return match; // negative/partial malformed range
      // An explicit first endpoint era wins over the shared trailing era:
      // BC 2–1 AD -> BC 2–AD 1, not BC AD 2–AD 1.
      const leadingEra=/\b(?:BC|AD)\s+$/u.test(prefix);
      if(leadingEra&&!last)return match; // conflicting duplicate era: leave for review
      if(last)return `${leadingEra?'':`${era} `}${first}${separator.slice(0,separator.length-last.length)}${era} ${last}`;
      return `${era} ${first}`;
    });
}

export function normalizeExtractionDateHints(extraction) {
  if(![1,2].includes(extraction.schemaVersion))throw new Error('Date-hint normalization requires extraction schema 1 or 2');
  if(!Array.isArray(extraction.people))throw new Error('Extraction people must be an array');
  const candidate=structuredClone(extraction),changes=[];
  for(const person of candidate.people){
    const compact=extraction.schemaVersion===2;
    const id=compact?person[0]:person.localId;
    const hints=compact?person[4]?.a:person.identityHints?.activeDateHints;
    const externalChronology=compact?person[4]?.e:person.identityHints?.externalPrimaryChronology;
    if(!Array.isArray(hints))throw new Error(`${id}: active-date hints must be an array`);
    hints.forEach((before,index)=>{
      const after=normalizeWesternDateHint(before);
      if(after!==before && externalChronology?.some(record=>record.hint===before)){
        throw new Error(`${id}: cannot normalize a hint linked to external-primary chronology without reconciling its sealed evidence`);
      }
      if(after!==before){hints[index]=after;changes.push({personId:id,index,before,after});}
    });
  }
  return {candidate,changes};
}
