from pathlib import Path
import subprocess
J=Path(__file__).resolve().parent;C=J/'candidate';REF='1f031602cf7aa15090b26ec997097d46dd2ef09f'
files=['scripts/test-people-site.mjs','scripts/test-ebook-people-readiness.mjs','scripts/test-ebook-current-date-audits.mjs','scripts/test-people-date-audit.mjs','scripts/test-people-editorial-rejections.mjs','scripts/test-people-production-build.mjs']
terms=['unresolvedCandidateBlocks','resolutionWorkByChapter','unresolvedCanonicalPeople','people-global-identity-seal','completeChapters']
for f in files:
 s=(C/f).read_text() if (C/f).exists() else subprocess.check_output(['git','show',REF+':'+f]).decode()
 for n,line in enumerate(s.splitlines(),1):
  if any(t in line for t in terms):print(f,n,line.strip()[:220])
