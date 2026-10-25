import pathlib,json,subprocess,hashlib,datetime,time
started=time.perf_counter();R=pathlib.Path('data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025');P=R/'renewals-v2/constraints028-fresh-author-20261025';B=R/'constraint-delta-renewals-7b6e4f-20261025/blind-current-028';O=pathlib.Path(__file__).parent;read=lambda p:json.loads(pathlib.Path(p).read_text());h=lambda b:hashlib.sha256(b).hexdigest()
def pin(p):
 b=pathlib.Path(p).read_bytes();return dict(file=str(pathlib.Path(p).resolve()),bytes=len(b),sha256=h(b))
def verify(q):
 p=pin(q['file']);assert p['bytes']==q['bytes'] and p['sha256']==q['sha256']
old='7b6e4f15a7894c14d7a5ecb7023c85c9b6cd9691';current='000d85cb53ca03bc88bf7399223587aee30e1892';scope=read(B/'blind-scope.json');proposal=read(P/'proposal.json');manifest=read(P/'sealed-manifest.json')
assert pin(P/'proposal.json')['sha256']=='b7ced5c26b7f72f8b3dd22d9cef21e7cbd100271f48239504be0909268bc0dc3';assert pin(P/'sealed-manifest.json')['sha256']=='f725daf4edad524683a4333aac17d29372bea5af612158f5df9911d0a4749906'
for q in manifest['files']:verify(q)
blindreceipt=R/'independent-current/constraints028-fresh-blind-peer-20261025/blind-current-028-source-assessment.json';assert pin(blindreceipt)['sha256']=='619916ad9e8e74e7eb41d68bebddd4f32067a54392bfd9c6326a6ea95c2c75b7'
jreceipt=R/'independent-current/source-batch-j-blind-20261025/021-exact-proposal-source-approval.json';assert pin(jreceipt)['sha256']=='167c7cbf54d3fb57d1990e9cd379ac4d152bac9912dd81bd20f099bf5e01a679';j=read(jreceipt)
freshfive=pathlib.Path('data/people/generated/independent-identity-recovery/zizhitongjian083-s0386-source-repair-20261025/independent-editorial-peer/next-five-current-input-delta-7b6-20261025/independent-fresh-five-current-input-delta-acceptance.json');assert pin(freshfive)['sha256']=='73c8cba4cea2e747a31e6073ff97d0607012a1314da7b243513086cf10721c21'
# Batched exact Git verification; no graph generation or normal host driver restart.
proc=subprocess.Popen(['git','cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE);cache={}
def raw(ref,path):
 q=ref+':'+path
 if q not in cache:
  proc.stdin.write((q+'\n').encode());proc.stdin.flush();hdr=proc.stdout.readline().decode().split();assert hdr[1]=='blob';b=proc.stdout.read(int(hdr[2]));assert proc.stdout.read(1)==b'\n';cache[q]=b
 return cache[q]
added=subprocess.check_output(['git','diff','--name-status',old,current,'--','data/people/resolutions']).decode().splitlines();assert len(added)==8 and all(x.startswith('A\t') for x in added)
newdocs=[]
for row in added:
 path=row.split('\t')[1];b=raw(current,path);newdocs.append(dict(file=path,bytes=len(b),sha256=h(b),document=json.loads(b)))
staged021=next(x for x in newdocs if x['file'].endswith('jinshu053-source-batch-j-renew-021-20261025.json'));assert staged021['sha256']==j['exactProposal']['sha256'];target=sorted(staged021['document']['decisions'][0]['localPeople']);assert len(target)==10 and 'jinshu:053:p001' in target
# The existing blind endpoint groups were complete singletons at7b6. Of the exact8new documents,
# only the already source-approved021merge intersects any of these15endpoint components.
originalIds=set(scope['ownedLocalIds']);intersect=[]
for d in newdocs:
 for i,dec in enumerate(d['document']['decisions']):
  if originalIds.intersection(dec['localPeople']):intersect.append(dict(file=d['file'],index=i,decision=dec))
assert len(intersect)==1 and intersect[0]['decision']['decision']=='merge' and sorted(intersect[0]['decision']['localPeople'])==target
fullgroups=[dict(blindCanonicalId=g['canonicalPersonId'],blindMembers=g['fullCurrentMemberIds'],actualCurrentFullMemberIds=target if g['fullCurrentMemberIds']==['jinshu:053:p001'] else g['fullCurrentMemberIds']) for g in scope['completeCurrentGroups']];assert len(fullgroups)==15 and len(set(x for g in fullgroups for x in g['actualCurrentFullMemberIds']))==24
paths={q['path']:q for q in scope['exactCurrentInputPins']}
for cp in j['fullOldSourceInputPins'].values():
 for field in ['source','extraction']:paths.setdefault(cp[field]['path'],cp[field])
currentpins=[]
for path,q in sorted(paths.items()):
 b=raw(old,path);c=raw(current,path);assert b==c
 if path in {q['path'] for q in scope['exactCurrentInputPins']}:assert h(c)==q['sha256'] and len(c)==q['bytes']
 currentpins.append(dict(file=path,oldRevision=old,currentRevision=current,bytes=len(c),sha256=h(c),unchanged=True))
# Verify actual14whole decisions/pairs/basis against the blind primary packet.
assert len(proposal['decisions'])==14 and proposal['authority']=='model' and 'canonicalPersonId' not in proposal
expected={tuple(sorted(['jinshu:053:p001',g['fullCurrentMemberIds'][0]])) for g in scope['completeCurrentGroups'] if g['fullCurrentMemberIds']!=['jinshu:053:p001']}
assert {tuple(sorted(d['localPeople'])) for d in proposal['decisions']}==expected
assert all(d['decision']=='keep-separate' and len(d['localPeople'])==2 and d['confidence']=='high' and not d.get('canonicalPersonId') for d in proposal['decisions'])
parts=sum([read(q['file'])['entries'] for q in scope['sourceParts']],[]);units={e['value']['chapter']+':'+u['id']:u for e in parts if e['kind']=='complete-current-governing-block' for u in e['value']['block'].get('sentences',[])}
import re
for d in proposal['decisions']:
 for note in d['notes']:
  if note.startswith('Primary source evidence:'):
   for uid in re.findall(r'(?:jinshu|weishu|zizhitongjian):\d{3}:s\d+[a-z]?',note):assert uid in units,uid
assert any(c['localPersonId']=='jinshu:053:p001' for c in j['independentMemberSourceJudgments'])
paths283=subprocess.check_output(['git','ls-tree','-r','--name-only',current,'data/people/resolutions']).decode().splitlines();paths283=[p for p in paths283 if p.endswith('.json')];assert len(paths283)==283
allmembers={x for g in fullgroups for x in g['actualCurrentFullMemberIds']};touch=[]
for path in paths283:
 b=raw(current,path)
 for i,d in enumerate(json.loads(b).get('decisions',[])):
  if allmembers.intersection(d.get('localPeople',[])):touch.append(dict(file=path,index=i,documentSha256=h(b),wholeDecision=d))
proc.stdin.close();proc.wait()
proof=dict(reviewer='/root/jin053_full_owner_peer',verifiedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),oldBlindRevision=old,currentRevision=current,exactProposal=pin(P/'proposal.json'),exactOriginalAuthorManifest=pin(P/'sealed-manifest.json'),originalBlindReceipt=pin(blindreceipt),priorComplete021SourceApproval=pin(jreceipt),genuinePrior021FreshCurrentInputApproval=pin(freshfive),exact8NewWholeDocuments=newdocs,onlyNewDecisionTouchingBlind15Components=intersect,completeCurrentGroups=fullgroups,currentUniqueLocalMembers=24,currentComponents=15,currentRawInputPins=currentpins,current283WholeTouchingDecisions=touch,priorSource021PerMemberJudgments=j['independentMemberSourceJudgments'],expandedGroupIdentityBasis='All10records remain the same Minhuai 遹: Guangling/Hui accession and tutors; Xie mother; Jia deposition/three sons/Xuchang murder; Minhuai restoration/burial; companion sons; later quoted moral examples. Source083 two foreign DuYu/XunYu ownership/citation debts excluded exactly as in prior genuine source/current-delta receipts. All currently proposed14opponents remain distinct from this same prince; no new evidence changes the separate family/name/career comparisons.',normalSDKStatus='Root driver90908 pending; no graph/resolver job started by peer. Canonical remap remains normal host responsibility; current full-member consequences independently verified from blind full groups plus exact checkpoint delta.',verificationElapsedSeconds=round(time.perf_counter()-started,3))
p=O/'exact000d-current-membership-source-proof.json';p.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print(pin(p));print('WHOLETOUCH',len(touch))
