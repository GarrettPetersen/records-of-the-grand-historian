# Staging extraction release-gate inventory — incomplete

Observed 2026-10-19 06:48 UTC. At inspection, live `origin/master` was
`26ebf8c830a43c3eb0a15e361c72436bd946c83e` and live
`origin/codex/people-glossary-staging-v2` was
`489faf926c0d48a486b7a76b71ff6ae973f9c022`. Recheck live refs before any
release; the commands below deliberately pin these revisions.

The staging tree adds 61 extraction files and modifies two already-existing
extractions compared with master. None of these 63 paths has a corresponding
`data/people/date-audits/<book>/<chapter>.json` file in the pinned staging
tree. In particular, the 11 added Jinshu chapters are 001, 002, 006, 014,
022, 024, 032, 037, 045, 065 and 071. The modified extractions are Jinshu
126 and Sanguozhi 010: their changes replace unsupported posthumous event
labels with `retrospective-reference`. No canonical date-audit file differs
between these two revisions.

These are necessary-gate checks only. A missing current date report means
the affected chapter cannot be shown fully complete by the pinned tree; it
does not prove whether another saved artifact could eventually produce one.
This check did not test editorial closure, report quality, identity,
backlinks, ebooks, unrelated source-only changes, CI, or deployment. It is
not a full inventory of completion and does not show that no other chapter
could qualify. For example, see `jinshu-initial-date-audit-evidence-hold.md`
for substantive evidence concerns about other, mechanically audited Jinshu
chapters.

Reproduce the exact 61-file list and the two modified files:

```sh
git diff --name-status 26ebf8c830a43c3eb0a15e361c72436bd946c83e 489faf926c0d48a486b7a76b71ff6ae973f9c022 -- data/people/extractions
git diff --name-only --diff-filter=A 26ebf8c830a43c3eb0a15e361c72436bd946c83e 489faf926c0d48a486b7a76b71ff6ae973f9c022 -- data/people/extractions | wc -l
```

Reproduce all 63 corresponding missing date-report paths, without reading the
dirty worktree or writing files:

```sh
git diff --name-only --diff-filter=AM 26ebf8c830a43c3eb0a15e361c72436bd946c83e 489faf926c0d48a486b7a76b71ff6ae973f9c022 -- data/people/extractions |
while IFS= read -r extraction; do
  audit=${extraction/extractions/date-audits}
  if git cat-file -e "489faf926c0d48a486b7a76b71ff6ae973f9c022:$audit" 2>/dev/null; then
    printf 'present %s\n' "$audit"
  else
    printf 'missing %s\n' "$audit"
  fi
done
git diff --name-status 26ebf8c830a43c3eb0a15e361c72436bd946c83e 489faf926c0d48a486b7a76b71ff6ae973f9c022 -- data/people/date-audits
```

This is an incomplete research observation, not a date audit, publication
approval or authorization to release any changed chapter.
