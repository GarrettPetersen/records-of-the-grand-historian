from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import quote,urlsplit,urlunsplit
from urllib.error import HTTPError
from bs4 import BeautifulSoup
import json,hashlib,datetime,re,concurrent.futures,subprocess
out=Path(__file__).resolve().parent
specs=[('jin086','https://zh.wikisource.org/wiki/晉書/卷086'),('tongjian091','https://zh.wikisource.org/wiki/資治通鑑/卷091'),('tongjian092','https://zh.wikisource.org/wiki/資治通鑑/卷092'),('jin006','https://zh.wikisource.org/wiki/晉書/卷006'),('moe','https://dict.revised.moe.edu.tw/appendix.jsp?ID=3&page=2&ver=0'),('cas','http://agri-history.ihns.ac.cn/history/historic%20table.htm'),('chinesenotes-original','https://chinesenotes.com/jinshu/jinshu086.html'),('sixteen-kingdoms-071','https://ctext.org/wiki.pl?chapter=906290&if=gb&remap=gb')]
def run(spec):
 key,url=spec
 u=urlsplit(url);encoded=urlunsplit((u.scheme,u.netloc,quote(u.path,safe='/%'),u.query,u.fragment))
 result={'id':key,'requestedUrl':url,'accessedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  proc=subprocess.run(['curl','--silent','--show-error','--location','--max-time','30','--write-out','\n%{http_code}\n%{url_effective}',encoded],capture_output=True)
  if proc.returncode: raise RuntimeError('curl failed: '+proc.stderr.decode(errors='replace'))
  data,code,final=proc.stdout.rsplit(b'\n',2)
  result.update(method='system curl with default certificate verification',status=int(code),finalUrl=final.decode(),responseBytes=len(data),responseSha256='sha256:'+hashlib.sha256(data).hexdigest())
  if int(code)>=400:
   result.update(accessible=False,error='HTTP '+code.decode())
   return result
  soup=BeautifulSoup(data,'html.parser');roots=soup.select('.mw-parser-output');root=max(roots,key=lambda n:len(n.get_text())) if roots else soup
  blocks=[{'index':i,'tag':n.name,'text':n.get_text(' ',strip=True)} for i,n in enumerate(root.find_all(['h2','h3','p','tr','pre'])) if n.get_text(strip=True)]
  # This is a bounded research cache: retain just matching blocks and local heading context,
  # not an entire book, chapter, site or repository copy.
  if key=='jin086':
   inds=[b['index'] for b in blocks if any(s in b['text'] for s in ['歲餘，茂築','明年，劉曜遣其將劉咸','未幾，茂復大城','永昌初，茂使','太興三年，寔既','太寧三年'])]
  elif key.startswith('tongjian'):
   inds=[b['index'] for b in blocks if any(s in b['text'] for s in ['靈鈞','靈均','灵钧','靈鈞','劉咸','刘咸','桑壁','張茂','张茂','中宗元皇帝下永昌','太興四年','太興三年','永昌元年','太寧元年'])]
  elif key=='jin006':
   inds=[b['index'] for b in blocks if any(s in b['text'] for s in ['三年春正月丁酉','六月，大水。丁酉','永昌元年','三月戊寅朔','四年春二月'])]
  elif key=='moe':inds=[b['index'] for b in blocks if any(s in b['text'] for s in ['太興','永昌','太寧'])]
  elif key=='cas':
   text=soup.get_text(' ',strip=True);m=re.search(r'太兴.{0,80}',text)
   result['extract']=m.group(0) if m else 'Requested page returned but matching table excerpt not located';inds=[]
  else:inds=[]
  selected=[]
  for idx in inds:
   b=next(b for b in blocks if b['index']==idx)
   heading=[x for x in blocks if x['index']<=idx and x['tag'] in ['h2','h3','pre']]
   selected.append({**b,'nearestHeading':heading[-1]['text'] if heading else None})
  result['blocks']=selected
  m=re.search(rb'\"wgRevisionId\":(\d+)',data)
  if m:result['revisionId']=int(m.group(1))
  result['evidenceHash']='sha256:'+hashlib.sha256(json.dumps(selected,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
 except HTTPError as e:result.update(status=e.code,error=str(e),accessible=False)
 except Exception as e:result.update(error=type(e).__name__+': '+str(e),accessible=False)
 return result
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(run,specs))
for r in results:
 old=out/(r['id']+'-source.json')
 if old.exists():
  old_data=json.loads(old.read_text())
  r['priorAttempt']=old_data
 (out/(r['id']+'-source.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
 print(r['id'],r.get('status'),r.get('error',''),len(r.get('blocks',[])))
 if r['id'].startswith('tongjian'):
  for b in r.get('blocks',[]): print(b['index'],b['nearestHeading'],b['text'][:240])
