import json,sys,collections
from pathlib import Path
R=Path('data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025');E=[]
for n in ['020','021']:
 s=json.loads((R/f'renewals-v2/renew-merge-{n}/blind-source-scope.json').read_text())
 for f in s['sourceParts']:E+=json.loads((R/f['file']).read_text())['entries']
U={};owned=set();blocks={}
for e in E:
 if e['kind']=='source-unit':
  if e['key'] in U:assert U[e['key']]==e['value']
  U[e['key']]=e['value']
 if e['kind']=='complete-governing-block-structure':
  if e['key'] in blocks:assert blocks[e['key']]==e['value']
  blocks[e['key']]=e['value']
 if e['kind'] in ['person-claims','person-inboundClaims']:owned.update(e['value']['evidence'])
 if e['kind']=='person-mentions':owned.add(':'.join(e['key'].split(':')[:2])+':'+e['value']['unit']['id'])
mode=sys.argv[1]
if mode=='units':
 keys=sorted(U);a,b=map(int,sys.argv[2:4])
 for i in range(a,min(b,len(keys))):
  k=keys[i];u=U[k];print(i,k,'block',u['blockIndex'],u['zh'])
  if k in owned:print(' EN',u['en'],' LIT',u.get('literal'))
elif mode=='records':
 es=[e for e in E if e['kind']=='person-record'];a,b=map(int,sys.argv[2:4])
 for e in es[a:b]:print(e['key'],json.dumps(e['value'],ensure_ascii=False,separators=(',',':')))
elif mode=='claims':
 es=[e for e in E if e['kind'] in ['person-claims','person-inboundClaims']];a,b=map(int,sys.argv[2:4])
 for i in range(a,min(b,len(es))):
  e=es[i];print(i,e['kind'],e['key'],json.dumps(e['value'],ensure_ascii=False,separators=(',',':')))
elif mode=='mentions':
 es=[e for e in E if e['kind']=='person-mentions'];a,b=map(int,sys.argv[2:4])
 for i in range(a,min(b,len(es))):
  e=es[i];v=e['value'];print(i,e['key'],v['id'],v['unit'],v['kind'],[(lang,s['exact'],s['occurrence'],s['startCodePoint'],s['endCodePoint']) for lang,ss in v['spans'].items() for s in ss])
