import json,pathlib,hashlib
J=pathlib.Path(__file__).parent
read=lambda n:json.loads((J/n).read_text())
a=read('source-review-acceptance.json');units={}
for p in read('expansion-packets.json')['packets']:
 s=read(p['file'])
 for profile in s['people'].values():
  src=profile['source']
  for u in src['units']:units[(src['book'],src['chapter'],u['id'])]=u
approved={};pending={};rejected=[];claims=[]
for s in a['supplementalEditorialWork']:
 for i,r in enumerate(s['authorRepairs']):
  v=s['reviewedEnglish'][i];k=(r['book'],r['chapter'],r['unitId'],r['field']);u=units[k[:3]]
  assert r['before']==u[r['field']]
  if v['verdict']=='reject':rejected.append({'proposal':r,'review':v});continue
  if v['verdict']!='approve':pending[k]={'proposal':r,'review':v};continue
  assert v['after']==r['after']
  if not v.get('sourceWitnesses') or not all(w['quote'] in units[(w['book'],w['chapter'],w['unitId'])]['zh'] for w in v['sourceWitnesses']):
   pending[k]={'proposal':r,'review':v,'status':'peer-approved-but-exact-citation-check-held','sourceChinese':u['zh']};continue
  if k in approved:assert approved[k]['proposal']['after']==r['after']
  approved[k]={'proposal':r,'review':v,'part':s['part'],'sourceChinese':u['zh']}
 for r in s['reviewerAdditionalRepairs']:
  k=(r['book'],r['chapter'],r['unitId'],r['field']);assert r['before']==units[k[:3]][r['field']]
  if k not in approved:pending[k]={'proposal':r,'status':'reviewer-authored-requires-separate-review','sourceChinese':units[k[:3]]['zh']}
 for i,r in enumerate(s['authorClaims']):claims.append({'proposal':r,'review':s['reviewedClaims'][i]})
for k in list(pending):
 if k in approved:del pending[k]
out={'schemaVersion':1,'sourceRevision':'7f37bde2522f442330b4b7622c225ae664f53dbd','scope':'Supplemental complete English repairs discovered during bounded Jinshu053 identity work','independentlyApprovedCompleteFieldRepairs':list(approved.values()),'pendingSeparateReview':list(pending.values()),'rejectedOrUnprovenProposals':rejected,'claimCorrections':claims,'sourceApplied':False,'applicationInstructions':'Host-owned normal editorial application, check both fields and chapter-wide repetitions against current bytes, independently review reviewer-authored repairs, reconcile affected extraction/date/identity approvals; do not count proposals as applied. Preserve existing Grok14 repair job and avoid duplicate application.'}
(J/'editorial-application-work-order.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'approvedCompleteFieldRepairs':len(approved),'pendingSeparateReview':len(pending),'rejectedOrUnproven':len(rejected),'claimProposals':len(claims)}))
