const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const text = { type: 'string' };
const list = items => ({ type: 'array', items });
const certainty = { enum: ['explicit', 'explicit-event-contextual-date', 'strongly-inferred', 'uncertain', 'derived', 'textual-variant'] };
const evidence = { type: 'array', minItems: 1, items: text };
const fact = value => object({ value, certainty, evidence });
const nullableText = { type: ['string', 'null'] };
const sections = {
  people: object({ id: { type: 'string', pattern: '^p[0-9]{3,}$' },
    preferredEnglish: nullableText, preferredChinese: nullableText, pinyin: nullableText,
    historicity: { enum: ['historical', 'legendary', 'uncertain', 'literary'] }, descriptor: text,
    hints: object({ n: list(text), r: list(text), a: list(text), p: list(text), x: nullableText }),
    names: { type: 'array', minItems: 1, items: fact({ type: 'object' }) },
    roles: { type: 'array', minItems: 1, items: fact(text) } }),
  surfaces: object({ id: text, person: text,
    kind: { enum: ['personal-name', 'courtesy-name', 'childhood-name', 'religious-name', 'temple-name', 'posthumous-name', 'alternate-name', 'title-reference', 'kinship-reference'] },
    language: { enum: ['zh', 'en'] }, exact: text,
    locations: { type: 'array', minItems: 1, items: object({ unit: text, occurrences: { type: 'array', minItems: 1, items: { type: 'integer', minimum: 0 } } }) } }),
  claims: object({ id: text, person: text, kind: text, value: { type: 'object' }, certainty, evidence }),
  candidateDispositions: object({ id: text, disposition: { enum: ['not-a-person', 'not-a-name', 'covered-by-mention', 'unresolved'] }, reason: text, note: nullableText }),
  translationRepairs: object({ id: text, unit: text, field: { enum: ['literal', 'idiomatic'] }, oldText: text, newText: text, rationale: text, confidence: { enum: ['high', 'medium', 'low'] } }),
};
const names = { people: 'write_people', surfaces: 'write_surfaces', claims: 'write_claims',
  candidateDispositions: 'write_dispositions', translationRepairs: 'write_translation_repairs' };
const byName = new Map(Object.entries(names).map(([section, name]) => [name, section]));

export function namedPeopleRecordTools(tools, compactSchema, candidates = []) {
  const shaped = structuredClone(sections);
  shaped.claims.properties.kind = compactSchema.$defs.claim.prefixItems[1];
  // The canonical schema owns these enums; do not invent model-facing aliases.
  shaped.candidateDispositions.properties.disposition = compactSchema.$defs.dispositionGroup.prefixItems[0];
  shaped.candidateDispositions.properties.reason = compactSchema.$defs.dispositionGroup.prefixItems[1];
  shaped.translationRepairs.properties.confidence = compactSchema.$defs.repair.prefixItems[5];
  const candidateTools = candidates.length ? [{type:'function',function:{name:'link_candidates',
    description:'Link actual sealed candidate occurrences to a saved person. The host supplies exact text, source unit and occurrence, preventing invented spans. Use only candidates that really denote this individual; longer full-name links already cover overlapping shorter hints.',
    parameters:object({person:text,kind:shaped.surfaces.properties.kind,candidateIds:{type:'array',minItems:1,maxItems:10,items:{enum:candidates.map(row=>row[0])}}})}}] : [];
  return [...tools.filter(tool => tool.function.name !== 'write_records'), ...candidateTools, ...Object.entries(names).map(([section, name]) => ({
    type: 'function', function: { name,
      description: `Save up to ten ${section} records using named fields. Use exact source surfaces and owned evidence IDs. Existing IDs replace only that record; other saved work remains.`,
      parameters: object({ records: { type: 'array', minItems: 1, maxItems: 10, items: shaped[section] } }) },
  }))];
}

export function normalizePeopleRecordCalls(response, candidates = []) {
  const normalized = structuredClone(response);
  for (const call of normalized.choices?.[0]?.message?.tool_calls ?? []) {
    if (call.function.name === 'link_candidates') {
      try {
        const args = JSON.parse(call.function.arguments);
        if (!Array.isArray(args.candidateIds) || !args.candidateIds.length || args.candidateIds.length > 10) throw new Error('Invalid candidate batch');
        const records = args.candidateIds.map(id => {
          const row = candidates.find(candidate=>candidate[0]===id);
          if(!row)throw new Error('Unknown candidate');
          return {id:`m_${id}`,person:args.person,kind:args.kind,language:row[2],exact:row[3],locations:[{unit:row[1],occurrences:[row[4]]}]};
        });
        call.function.name='write_records';call.function.arguments=JSON.stringify({section:'surfaces',records});
      } catch {
        // Unknown/malformed candidate calls fail loudly in the executor.
      }
      continue;
    }
    const section = byName.get(call.function.name);
    if (!section) continue;
    call.function.name = 'write_records';
    try {
      const { records } = JSON.parse(call.function.arguments);
      call.function.arguments = JSON.stringify({ section, records });
    } catch {
      // Leave malformed arguments for the tool executor's explicit diagnostic.
    }
  }
  return normalized;
}
