import datetime, hashlib, json, os, pathlib, re, subprocess, sys, zlib

mode, receipt_name = sys.argv[1:]
assert mode in ['queue', 'json'] and re.fullmatch(r'[a-z0-9-]+\.json', receipt_name)
base = pathlib.Path('data/people/generated/completion/jinshu/109/bounded-dossiers-parser-fixed-20261105/candidate-date-review-1-20261105/native-final-date-stage-a2332e08')
receipt = base / receipt_name
intent = receipt.with_suffix('.intent.private.json')
assert not receipt.exists() and not intent.exists()
env = dict(os.environ, GIT_CONFIG_COUNT='3', GIT_CONFIG_KEY_0='gc.auto', GIT_CONFIG_VALUE_0='0', GIT_CONFIG_KEY_1='pack.deltaCacheSize', GIT_CONFIG_VALUE_1='32m', GIT_CONFIG_KEY_2='core.deltaBaseCacheLimit', GIT_CONFIG_VALUE_2='32m')
def git(*args, data=None):
    return subprocess.check_output(['git', *args], input=data, env=env)
def digest(data):
    return hashlib.sha256(data).hexdigest()
def guard():
    p = subprocess.run(['npm', 'run', 'people:disk:check'], capture_output=True, text=True)
    g = json.loads(p.stdout[p.stdout.index('{'):])
    assert g['memory']['status'] == 'measured' and not g['memory']['errors'], 'Memory stop; preserve all objects'
    return g

before = guard()
objects = pathlib.Path(git('rev-parse', '--git-path', 'objects').decode().strip()).resolve()
assert git('rev-parse', '--show-object-format').strip() == b'sha1'
refs_before = digest(git('show-ref'))
index = pathlib.Path(git('rev-parse', '--git-path', 'index').decode().strip())
index_before = digest(index.read_bytes())
source_paths = [pathlib.Path(f) for f in ['data/jinshu/109.json', 'data/people/extractions/jinshu/109.json', 'data/people/editorial-decisions/jinshu/109.json']]
source_before = {str(p): digest(p.read_bytes()) for p in source_paths}
selected = []
if mode == 'queue':
    raw = git('rev-list', '--objects', '--unpacked', '--max-count=20000', 'refs/remotes/origin/codex/people-work-queue', '--', 'people-work-queue.json').decode()
    ids = list(dict.fromkeys(l.split()[0] for l in raw.splitlines() if l.endswith(' people-work-queue.json')))
    for oid in ids:
        p = objects / oid[:2] / oid[2:]
        st = p.stat()
        assert not p.is_symlink()
        if st.st_nlink == 1:
            selected.append((oid, st.st_size, st.st_blocks * 512))
    assert sum(x[1] for x in selected) <= 1536 * 1024**2
else:
    candidates = []
    for directory in objects.iterdir():
        if not re.fullmatch(r'[0-9a-f]{2}', directory.name) or not directory.is_dir():
            continue
        for p in directory.iterdir():
            if not re.fullmatch(r'[0-9a-f]{38}', p.name) or p.is_symlink():
                continue
            st = p.stat()
            if st.st_nlink != 1 or st.st_size < 65536 or st.st_size > 4 * 1024**2:
                continue
            with p.open('rb') as f:
                header = zlib.decompressobj().decompress(f.read(4096), 256)
            parts = header.split(b'\0', 1)
            if len(parts) != 2 or not parts[0].startswith(b'blob ') or not parts[1].lstrip().startswith((b'{', b'[')):
                continue
            logical = int(parts[0].split()[1])
            if logical <= 16 * 1024**2:
                candidates.append((st.st_size, logical, directory.name + p.name, st.st_blocks * 512))
    total = logical_total = 0
    for size, logical, oid, allocated in sorted(candidates, reverse=True):
        if total + size > 2048 * 1024**2 or logical_total + logical > 16 * 1024**3 or len(selected) >= 20000:
            continue
        selected.append((oid, size, allocated))
        total += size
        logical_total += logical

assert selected, 'No eligible loose JSON objects; no pack or deletion performed'
ids = [x[0] for x in selected]
assert all(re.fullmatch(r'[0-9a-f]{40}', oid) for oid in ids)
oid_input = ('\n'.join(ids) + '\n').encode()
original_types = git('cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)', data=oid_input)
assert all(l.split()[1] == b'blob' for l in original_types.splitlines())
plan = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'phase': 'packing', 'mode': mode, 'selectedObjectIds': ids, 'objects': len(ids), 'looseCompressedBytes': sum(x[1] for x in selected), 'looseAllocatedBytes': sum(x[2] for x in selected), 'refsSha256': refs_before, 'indexSha256': index_before, 'guardBefore': before, 'windowMemory': '64m', 'deltaCache': '32m', 'threads': 1, 'noHistoryOrRecoveryDeletion': True}
intent.write_text(json.dumps(plan, indent=2) + '\n')
cmd = ['git', 'pack-objects', '--quiet', '--threads=1', '--window=10', '--window-memory=64m', '--depth=50', '--delta-base-offset', '--compression=6', '--max-pack-size=128m', '--non-empty', str(objects / 'pack' / 'pack')]
p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env)
plan['packerPid'] = p.pid
intent.write_text(json.dumps(plan, indent=2) + '\n')
print(json.dumps({'packingObjects': len(ids), 'looseCompressedBytes': plan['looseCompressedBytes'], 'packerPid': p.pid, 'refsAndSourcesWillBePreserved': True}), flush=True)
stdout, stderr = p.communicate(oid_input)
assert p.returncode == 0, stderr.decode()
packs = stdout.decode().splitlines()
assert packs and all(re.fullmatch(r'[0-9a-f]{40}', h) for h in packs)
plan.update(phase='verifying-pack', packs=packs)
intent.write_text(json.dumps(plan, indent=2) + '\n')
guard()
for h in packs:
    git('verify-pack', str(objects / 'pack' / ('pack-' + h + '.idx')))
assert digest(git('show-ref')) == refs_before, 'Refs changed; retain loose originals and verified new packs'
assert digest(index.read_bytes()) == index_before
assert source_before == {str(p): digest(p.read_bytes()) for p in source_paths}
plan['phase'] = 'verified-before-removing-only-packed-duplicates'
intent.write_text(json.dumps(plan, indent=2) + '\n')
git('prune-packed', '--quiet')
assert git('cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)', data=oid_input) == original_types
assert digest(git('show-ref')) == refs_before and digest(index.read_bytes()) == index_before
assert source_before == {str(p): digest(p.read_bytes()) for p in source_paths}
after = guard()
out = {k: v for k, v in plan.items() if k != 'selectedObjectIds'}
out.update(completedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(), phase='complete', packsVerified=packs, allSelectedObjectTypesAndSizesStillReadable=True, refsUnchanged=True, primaryIndexUnchanged=True, canonicalSourcesUnchanged=True, onlyPackedDuplicateCopiesRemoved=True, guardAfter=after)
receipt.write_text(json.dumps(out, indent=2) + '\n')
print(json.dumps({'packedObjects': len(ids), 'newPackBytes': sum((objects / 'pack' / ('pack-' + h + '.pack')).stat().st_size for h in packs), 'freeGiBBefore': before['availableGiB'], 'freeGiBAfter': after['availableGiB'], 'guardErrors': after['errors'], 'allObjectsRefsAndSourcesPreserved': True}))
