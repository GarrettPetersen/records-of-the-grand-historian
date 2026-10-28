from pathlib import Path
import json,re,ast
j=Path(__file__).resolve().parent
lines=[]
for idx in range(3):
 patch=(j/f'retained-generator-{idx}.patch').read_text().splitlines()
 pos=2;delta=0
 while pos<len(patch):
  m=re.fullmatch(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@.*',patch[pos]);assert m,patch[pos]
  oldstart,oldcount,newstart,newcount=[int(v) if v is not None else 1 for v in m.groups()];pos+=1;old=[];new=[]
  while pos<len(patch) and not patch[pos].startswith('@@ '):
   row=patch[pos];pos+=1
   if row.startswith('\\ No newline'):continue
   assert row and row[0] in ' +-'
   if row[0] in ' -':old.append(row[1:])
   if row[0] in ' +':new.append(row[1:])
  assert len(old)==oldcount and len(new)==newcount,(idx,len(old),oldcount,len(new),newcount)
  start=max(0,oldstart-1)+delta;assert lines[start:start+oldcount]==old,(idx,start)
  lines[start:start+oldcount]=new;delta+=newcount-oldcount
s='\n'.join(lines)+'\n';(j/'retained-generator.UNTRUSTED.py').write_text(s);tree=ast.parse(s)
print(json.dumps({'lines':len(lines),'imports':[ast.unparse(n) for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom))],'functions':[n.name for n in tree.body if isinstance(n,ast.FunctionDef)],'calls':sorted(set(ast.unparse(n.func) for n in ast.walk(tree) if isinstance(n,ast.Call)))},ensure_ascii=False))
print('\n'.join(lines[-65:]))
