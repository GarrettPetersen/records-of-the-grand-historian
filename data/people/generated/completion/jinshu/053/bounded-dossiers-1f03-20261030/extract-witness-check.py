from pathlib import Path
j=Path(__file__).resolve().parent;p=j/'candidate/scripts/lib/people-identity-dossiers.mjs';s=p.read_text()
a=s.index('      if (person && !nameEvidence.has(witness.localId)) {');b=s.index('      requireValue(person && (caseMembers.has',a)
block=s[a:b];s=s[:a]+s[b:]
a=s.index("      requireValue(typeof text === 'string' && typeof quote === 'string'");b=s.index('      witnessedMembers.add',a)
check=s[a:b]
s=s[:a]+"      assertDossierPrimaryWitness(witness, person, sourceUnits, nameKeysForPerson, nameEvidence);\n"+s[b:]
s+=r'''
export function assertDossierPrimaryWitness(witness, person, sourceUnits, nameKeysForPerson, nameEvidence = new Map()) {
  requireValue(hasOnlyKeys(witness, ['localId', 'book', 'chapter', 'unitId', 'quote']), 'Unexpected witness fields');
  requireValue(person && person.localId === witness.localId, `Missing current primary witness person ${witness.localId}`);
  const sourceId = `${witness.book}:${witness.chapter}:${witness.unitId}`, quote = witness.quote, text = sourceUnits.get(sourceId);
'''+block+check.replace("'Witness does not support this person in the current primary source'", "`Witness does not support this person in the current primary source: ${witness.localId} ${sourceId} quote=${JSON.stringify(quote)}`")+"}\n"
p.write_text(s)
