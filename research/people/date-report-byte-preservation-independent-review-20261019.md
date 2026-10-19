# Independent review: date-report byte-preservation design

Research only. Reviewed `date-report-byte-preservation-design-20261019.md` SHA-256 `2cb7aedd52a52e242d64ca04a25f6d037fff1f93f32073039a30e7f932ff2d0f` against staged commit `29469570bc6e35d27aae9cb9e75baea9d522abce`, the isolated prototype and an injected race. The design is suitable to checkpoint alongside this review as **unapproved design research**. Neither prototype is approved for use, and no live state was changed.

## Confirmed race

In isolated `/tmp/people-history-repro.drvr9Pni`, the test file SHA-256 `d70a8961119daf1e1c2560ccd04789001e834fe828bb13661c69d51a9b72290f` uses the publisher prototype SHA-256 `bc175a5ec45a4acc4f54e14abb40815b7bdb0d369142d5ad09e203042bd67752`. Running `node --test --test-name-pattern='reproduce archive check' scripts/test-people-combined-curation.mjs` passed 1/1. The test inserts a distinct byte encoding of the same JSON at the archive path immediately after the publisher's absence observation; the publisher then completes and replaces the intervening archive with its own original bytes. This is a deterministic same-process injected interleaving, not a demonstrated live two-process incident or power-loss test. The publisher's durable receipt contains its own original bytes, but it does not preserve the competing archive bytes overwritten in this race.

The reproducible test, appended to the existing staged-derived offline fixture with `dateHistoryFile(f)`, is:

```js
test('reproduce archive check to rename interloper overwrite', t => {
  const f = fixture(t), file = dateHistoryFile(f);
  const original = Buffer.from(f.receipt.before.dateReport.base64, 'base64');
  const interloper = Buffer.from(JSON.stringify(JSON.parse(original.toString('utf8'))));
  const exists = fs.existsSync;
  let injected = false;
  fs.existsSync = function(candidate) {
    if (!injected && candidate === file && !exists(candidate)) {
      injected = true;
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, interloper);
      return false;
    }
    return exists(candidate);
  };
  try {
    assert.equal(publishCombinedCuration(f.receipt, f.hash, f.options).status, 'complete');
  } finally { fs.existsSync = exists; }
  assert.equal(injected, true);
  assert.notDeepEqual(interloper, original);
  assert.deepEqual(fs.readFileSync(file), original);
});
```

## Ownership and durability review

The design correctly requires host-controlled quiescence of old writers and one transaction/ownership protocol for standalone CLI, scheduler, combined publisher and recovery. Staging has a direct `scripts/people-date-audit.mjs` call to `recordDateAudit` that is outside the combined publisher's executor. A queue lease checked before a filesystem write is not a hard fence after expiry, and a per-checkout lock alone is not cross-checkout exclusion. Process-owned exclusive locking may safely avoid expiry-based takeover within its actual trust boundary, but must not be claimed to exclude other hosts, other checkouts, stale binaries, manual mutation, or direct library invocations unless that is actively enforced. The legacy-writer drain is a migration prerequisite, not a property conferred by new checks.

The proposed same-filesystem no-replace link of a flushed temporary history file, followed by directory sync, prevents an absent-check/replace race among writers that actually use the protocol. A byte-identical preexisting archive may be reused after verifying its durability; a different existing archive must be preserved and cause a loud hold or an independently reviewed, evidence-preserving collision procedure. A separate write-ahead receipt with exact before and after bytes and input pins is required for recovery. Atomic rename of the canonical report alone is **not** compare-and-swap: the before-state recheck and replacement require the same exclusive ownership through the write, and sources/extraction and other publication dependencies must stay fenced or be revalidated as part of the transaction. Crash, storage failure and no-follow/ancestor hazards need the concrete tests and platform limits in the design; successful process-kill tests cannot establish physical power-loss durability.

The draft is a proposal, not a verified implementation, and a later candidate needs independent review, actual child-process and isolated Git-backed ledger cases, durable failure injection, and explicit behavior for unsupported link/sync platforms. It does not approve any canonical chapter/date transition or authorize interrupting workers, changing claims, deleting locks, or discarding recovery artifacts.
