# Independent review: process-lock guard prototype

Research only; not an approval for production. Reviewed the adjacent Python
prototype, its three tests and notes, and the current Node lock implementation.
No live lock, claim, or shared Git state was changed. All three existing tests
passed locally (`PYTHONDONTWRITEBYTECODE=1 python3 test-process-lock-guard-prototype.py`
from this directory).

## Reproduced mutual-exclusion failure

`transition` line 41 calls `alive(owner.get('pid'))` but discards its `False`
result. An already-dead owner can acquire; another caller can then reclaim its
lock while the original caller believes it succeeded. This actual isolated
temporary-directory reproduction printed `acquired` twice without a release:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -c 'import importlib.util,os,subprocess,tempfile; p="data/people/generated/jinshu-identity-ref-64521198-20261018/process-lock-guard-prototype.py"; s=importlib.util.spec_from_file_location("proto",p); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); c=subprocess.Popen(["true"]); c.wait(); d=tempfile.TemporaryDirectory(prefix="people-lock-audit-"); f=os.path.join(d.name,"test.lock"); print("dead owner acquisition:",m.transition(f,"acquire",{"pid":c.pid,"token":"first"})); print("live owner acquisition without release:",m.transition(f,"acquire",{"pid":os.getpid(),"token":"second"})); d.cleanup()'
```

Requiring a live owner at acquisition is necessary but not a complete fix: the
design must specify which host process owns the lock, ensure its lifetime covers
every protected operation (including children), and handle termination between
publication and acknowledgement. A helper's PID must not stand in for a host
that continues working after the helper exits.

## Other production blockers and limits

- The proof requires every mutator to use one persistent guard inode. Current
  Node callers ignore it, and an old process or cleanup that replaces/unlinks
  the guard permits separate kernel locks and split-brain access. A mixed-version
  migration needs explicit quiescence and safe inode lifecycle coordination;
  no guard removal is safe while any participant may hold or wait on it.
- `flock` is blocking with no timeout or diagnostics. A stopped, wedged, or
  reentrant guard holder can prevent progress indefinitely; the test covers a
  killed guard holder, not a live hung holder or interrupted system calls.
- PID-only liveness assumes one host and PID namespace. A recycled live PID or
  unreaped zombie can retain a stale lock indefinitely; liveness cannot prove
  process identity. Different hosts/namespaces and filesystems without reliable
  advisory locks/hard links are unsupported. `fcntl` is not portable to Windows;
  network-filesystem and production macOS/Linux semantics were not tested here.
- A helper can die after linking the complete owner file but before reporting
  success; the parent then needs a defined, token-checked recovery path and must
  not proceed when outcome is uncertain. Tests do not inject crashes at each
  unlink/write/link/acknowledgement boundary or simulate a parent/child lifetime
  mismatch. Atomic link does not establish power-loss durability. Temp cleanup
  failure can mask a successful link, leaving an owner despite reported failure.
- The Node API, its `failIfExists` behavior and diagnostics, and all consumers
  still need integration and tests. Guard permissions, symlink/path policy,
  filesystem support and ownership across processes require explicit decisions.
  The guard protocol is advisory, not protection against nonparticipating writers.

The test suite is useful evidence for a narrower property: under its cooperative,
single-host fixture, competing stale recoverers yielded exactly one winner;
malformed owner contents failed closed; and killing a guard holder released its
kernel lock. The competing test uses the same live parent PID in each proposed
owner and does not exercise real owner lifetimes. It does not establish production
safety or end-to-end interoperation with the current Node implementation.
