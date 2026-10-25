import pathlib,json,subprocess,hashlib,datetime,time
start=time.perf_counter();R=pathlib.Path('data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025');P=R/'constraint-delta-renewals-7b6e4f-20261025/case114-corrected-basis-author-000d85-20261025';O=pathlib.Path(__file__).parent;read=lambda p:json.loads(pathlib.Path(p).read_text());h=lambda b:hashlib.sha256(b).hexdigest()
def pin(p):
 b=pathlib.Path(p).read_bytes();return dict(file=str(pathlib.Path(p).resolve()),bytes=len(b),sha256=h(b))
manifest=read(P/'sealed-corrected-source-proposal-manifest.json');assert pin(P/'sealed-corrected-source-proposal-manifest.json')['sha256']=='e824c039101de3e21fe9eeb12643462eac6c04b6b6b455ce8e449cb85627041e'
for q in manifest['files']:
 p=pin(q['file']);assert p['bytes']==q['bytes'] and p['sha256']==q['sha256']
proposal=read(P/'resolution.json');assert pin(P/'resolution.json')['sha256']=='83dd5f3760b22bc4998c2e0924994e3a2742b3cc7b589ab18772347ccf882863';basis=read(P/'source-basis-coverage.json');inputs=read(P/'current-input-pins.json');ref=manifest['canonicalRevision'];members={'jinshu:053:p023','jiutangshu:166:p127'};d=proposal['decisions'][0];assert len(proposal['decisions'])==1 and d['decision']=='keep-separate' and set(d['localPeople'])==members and proposal['authority']=='model' and not d.get('canonicalPersonId');assert basis['freshProposedWholeDecision']==d
proc=subprocess.Popen(['git','cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE);cache={}
def raw(ref,path):
 q=ref+':'+path
 if q not in cache:
  proc.stdin.write((q+'\n').encode());proc.stdin.flush();hdr=proc.stdout.readline().decode().split();assert hdr[1]=='blob';b=proc.stdout.read(int(hdr[2]));assert proc.stdout.read(1)==b'\n';cache[q]=b
 return cache[q]
verified=[]
for q in inputs['rawPins']:
 b=raw(q['gitRevision'],q['path']);assert len(b)==q['bytes'] and h(b)==q['sha256'];verified.append(q)
 if q['path'].startswith('data/people/extractions/') or q['path'] in ['data/jinshu/053.json','data/jiutangshu/166.json']:assert b==raw('7b6e4f15a7894c14d7a5ecb7023c85c9b6cd9691',q['path'])
units={}
for f in basis['completeCurrentPrimaryFrames']:
 source=json.loads(raw(ref,f['sourcePath']));assert source['content'][f['blockIndex']]==f['completeActualCurrentBlock']
 for u in f['completeActualCurrentBlock'].get('sentences',[]):units[':'.join(f['sourcePath'].split('/')[1:]).replace('.json','')+':'+u['id']]=u
assert len(units)==39
assert units['jiutangshu:166:s0359']['zh']=='諸群從登第者數人，而毅夫子祎最知名。';assert '張華息禕' in units['jinshu:053:s0205']['zh'];assert '兗海沂密' in units['jiutangshu:166:s0314']['zh'];assert set(basis['explicitlyExcludedForeignPersonEvidence'])=={'jiutangshu:166:s0314'}
# Independently select both complete7b6golden records; their raw chapters are unchanged at000d.
G=pathlib.Path('data/people/generated/independent-identity-recovery/jinshu053-source106-7b6e4f-20261025');gm=read(G/'closed-context-manifest.json');records={};goldpins=[]
for q in next(f for f in gm['fields'] if f['key']=='people')['parts']:
 p=G/q['file'];b=p.read_bytes();assert len(b)==q['bytes'] and h(b)==q['sha256']
 for k,v in json.loads(b)['entries']:
  if k in members:records[k]=v;goldpins.append(pin(p))
assert set(records)==members
for rec in records.values():
 for m in rec['mentions']:
  key=':'.join(m['person'].split(':')[:2])+':'+m['unit']['id'];u=units[key]
  for lang,ss in m['spans'].items():
   text=u['zh'] if lang=='zh' else u['translations'][0]['idiomatic']
   for sp in ss:assert text[sp['startCodePoint']:sp['endCodePoint']]==sp['exact'] and h(text.encode())==sp['unitTextHash'].replace('sha256:','')
# Current new merges cannot silently expand either singleton. Full touching decisions retained.
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',ref,'data/people/resolutions']).decode().splitlines();paths=[p for p in paths if p.endswith('.json')];assert len(paths)==283;touch=[]
for path in paths:
 b=raw(ref,path)
 for i,dec in enumerate(json.loads(b).get('decisions',[])):
  if members.intersection(dec.get('localPeople',[])):
   assert dec['decision']!='merge';touch.append(dict(file=path,index=i,documentSha256=h(b),wholeDecision=dec))
proc.stdin.close();proc.wait()
proof=dict(currentRef=ref,verifiedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),manifest=pin(P/'sealed-corrected-source-proposal-manifest.json'),exactProposal=pin(P/'resolution.json'),allManifestFiles=[pin(q['file']) for q in manifest['files']],rawPins=verified,fullCurrentGroups=basis['completeCurrentGroups'],completeOwnedCurrentRecords=records,currentGoldenManifest=pin(G/'closed-context-manifest.json'),selectedGoldenShardPins=goldpins,complete39CurrentSourceUnits=units,all283CurrentWholeTouchingDecisions=touch,verificationElapsedSeconds=round(time.perf_counter()-start,3));p=O/'exact-current-source-proof.json';p.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
receipt=dict(schemaVersion=1,artifactKind='independent-fresh-corrected-case114-exact-source-approval',reviewer='/root/jin053_full_owner_peer',reviewedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),currentRef=ref,decision='APPROVE-EXACT-CORRECTED-KEEP-SEPARATE-SOURCE-IDENTITY',exactProposal=pin(P/'resolution.json'),exactManifest=pin(P/'sealed-corrected-source-proposal-manifest.json'),exactProof=pin(p),completeCurrentGroups=basis['completeCurrentGroups'],actualWholeDecision=d,independentReason='Jin053s0203–s0205 explicitly makes 禕 the son of 太子少傅張華 and one of the companions of Hui’s Crown Prince Yu in the Yuankang Eastern Palace setting. The complete JiuTang166s0337–s0353 paragraph instead establishes Zhang Zhengfu’s family and ends 子毅夫; s0354–s0359 continues that family and explicitly identifies 毅夫子祎. The different stated father and independent Tang clan/court narrative establish two people, despite compatible 禕/祎 spellings and English Zhang Yi. No Western date conversion or inferred birth/death/family bridge is needed.',foreignOccurrenceAssessment=dict(unit='jiutangshu:166:s0314',sourceQuote='改華州刺史，遷兗海沂密都團練觀察等使。',completeContext='s0308–s0316 concerns Cui Rong’s Pei Du/Wang Chengzong service, Sichuan pacification and later Hua/Yan postings. The Yi of Yan/Hai/Yi/Mi translates the prefecture 沂, not Yifu’s son 祎.',currentBadLocators=['jiutangshu:166:c0253 evidence s0314','jiutangshu:166:m0545'],judgment='Explicitly excluded from corrected identity basis. No office, parent or career of Cui Rong, Zhang Zhengfu or Zhang Yifu is transferred to Yi. The actual child-of claim c0791/s0359 remains attached to Yifu; both full IDs retained.'),coverage=dict(cases=1,pairs=1,completeSingletons=2,fullPrimaryFrames=4,fullSourceUnits=39,fullFamilyUnits='0337–0359',fullForeignCareerFrame='0308–0316',fullTargetFrame='0199–0205',completeOwnedClaims=sum(len(r['claims']) for r in records.values()),completeOwnedMentions=sum(len(r['mentions']) for r in records.values()),currentWholeDecisionDocumentsScanned=283),provenanceBoundary='Fresh actual corrected proposal reviewed after reading complete current primary family/career context and both owned records. No prior held false-place-name basis or old approval reused/restored/edited.',outsideQA='The inherited foreign personal-name mention/citation at s0314 remains unqualified extraction debt. This source identity approval neither accepts that claim nor deletes it. No broader JiuTang completion, source/extraction repair or date certification is performed.',structuralBoundary='Author ordinary canonical schema PASS read as technical evidence only. Normal SDK/strict-core/current full constraints and host aggregate/CI/publication remain mandatory and are not claimed here.',findings=[],metrics=dict(verificationElapsedSeconds=proof['verificationElapsedSeconds'],totalReviewElapsedSeconds=None,actualTokens=None,paidOrSDKCalls=0),workspaceActions='Only independent artifact paths written; no primary/candidate/source/extraction/canonical/Git/index/branch/build/push/queue/lock mutations.')
p=O/'case114-exact-corrected-source-approval.json';p.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(pin(p));print('PROOF',pin(O/'exact-current-source-proof.json'))
