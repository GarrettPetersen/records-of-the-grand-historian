#!/usr/bin/env python3
"""Losslessly archive an idle legacy worktree recovery directory, then verify it.

Never selects live chapter state. Originals are removed only after every file's
bytes, name, type and mode match the completed gzip archive and a durable receipt.
"""
import argparse
import base64
import ctypes
import sys
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import tarfile
import time


if sys.platform == 'darwin':
    # Python exposes os.*xattr on Linux, not macOS. Use the native macOS API
    # explicitly; any unsupported/permission/error result refuses archival.
    libc = ctypes.CDLL(None, use_errno=True)
    libc.listxattr.argtypes = [ctypes.c_char_p, ctypes.c_void_p, ctypes.c_size_t, ctypes.c_int]
    libc.listxattr.restype = ctypes.c_ssize_t
    libc.getxattr.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_void_p, ctypes.c_size_t, ctypes.c_uint32, ctypes.c_int]
    libc.getxattr.restype = ctypes.c_ssize_t
    libc.setxattr.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_void_p, ctypes.c_size_t, ctypes.c_uint32, ctypes.c_int]
    libc.setxattr.restype = ctypes.c_int


def attributes(p):
    if sys.platform != 'darwin':
        return {name: base64.b64encode(os.getxattr(p, name, follow_symlinks=False)).decode('ascii')
                for name in sorted(os.listxattr(p, follow_symlinks=False))}
    name = os.fsencode(p)
    size = libc.listxattr(name, None, 0, 1)
    if size < 0:
        raise OSError(ctypes.get_errno(), 'Cannot inspect extended attributes', str(p))
    b = ctypes.create_string_buffer(size + 1)
    count = libc.listxattr(name, b, size, 1)
    if count < 0:
        raise OSError(ctypes.get_errno(), 'Extended attributes changed/unreadable', str(p))
    result = {}
    for key in sorted(b.raw[:count].split(b'\0')):
        if not key:
            continue
        length = libc.getxattr(name, key, None, 0, 0, 1)
        if length < 0:
            raise OSError(ctypes.get_errno(), 'Cannot read extended attribute', str(p))
        value = ctypes.create_string_buffer(length + 1)
        read = libc.getxattr(name, key, value, length, 0, 1)
        if read != length:
            raise OSError(ctypes.get_errno(), 'Extended attribute changed', str(p))
        result[os.fsdecode(key)] = base64.b64encode(value.raw[:read]).decode('ascii')
    return result


def set_attribute(p, key, value):
    if sys.platform != 'darwin':
        os.setxattr(p, key, value, follow_symlinks=False)
    elif libc.setxattr(os.fsencode(p), os.fsencode(key), ctypes.create_string_buffer(value), len(value), 0, 1) != 0:
        raise OSError(ctypes.get_errno(), 'Cannot restore extended attribute', str(p))


def sha(stream):
    h = hashlib.sha256()
    for b in iter(lambda: stream.read(1024 * 1024), b''):
        h.update(b)
    return h.hexdigest()


def inventory(root):
    s = root.lstat()
    rows = {'.': dict(dev=s.st_dev, ino=s.st_ino, size=s.st_size,
                      mtime_ns=s.st_mtime_ns, mode=s.st_mode, xattrs=attributes(root))}
    for directory, dirs, files in os.walk(root, followlinks=False):
        for name in dirs + files:
            p = Path(directory) / name
            s = p.lstat()
            mode = stat.S_IFMT(s.st_mode)
            if mode not in (stat.S_IFREG, stat.S_IFDIR, stat.S_IFLNK):
                raise RuntimeError(f'Unsupported recovery entry: {p}')
            row = dict(dev=s.st_dev, ino=s.st_ino, size=s.st_size,
                       mtime_ns=s.st_mtime_ns, mode=s.st_mode)
            row['xattrs'] = attributes(p)
            if stat.S_ISREG(s.st_mode):
                with p.open('rb') as f:
                    row['sha256'] = sha(f)
            if stat.S_ISLNK(s.st_mode):
                row['target'] = os.readlink(p)
            rows[str(p.relative_to(root))] = row
    return rows


def verify(archive, rows):
    seen = set()
    with tarfile.open(archive, 'r:gz') as tar:
        for entry in tar:
            name = entry.name.removeprefix('./')
            if name not in rows or name in seen:
                raise RuntimeError('Archive has an extra/duplicate entry: ' + name)
            seen.add(name)
            row = rows[name]
            attrs = {'PEOPLE.xattr.' + os.fsencode(k).hex(): v
                     for k, v in row['xattrs'].items()}
            if {k: v for k, v in entry.pax_headers.items() if k.startswith('PEOPLE.xattr.')} != attrs:
                raise RuntimeError('Archive extended attributes differ: ' + name)
            mode = row['mode']
            if stat.S_IMODE(mode) != entry.mode:
                raise RuntimeError('Archive permissions differ: ' + name)
            if stat.S_ISREG(mode):
                if not entry.isfile() or entry.size != row['size']:
                    raise RuntimeError('Archive file type/size differs: ' + name)
                with tar.extractfile(entry) as f:
                    if sha(f) != row['sha256']:
                        raise RuntimeError('Archive file bytes differ: ' + name)
            elif stat.S_ISDIR(mode):
                if not entry.isdir():
                    raise RuntimeError('Archive directory type differs: ' + name)
            elif not entry.issym() or entry.linkname != row['target']:
                raise RuntimeError('Archive symlink differs: ' + name)
    if seen != set(rows):
        raise RuntimeError('Archive is missing recovery entries')


def archive_recovery(source, archive, check_idle):
    source, archive = Path(source), Path(archive)
    if source.is_symlink() or not source.is_dir() or archive.exists():
        raise RuntimeError('Original regular directory and NEW archive required')
    check_idle(source)
    before = inventory(source)
    size = sum(r['size'] for r in before.values() if 'sha256' in r)
    if shutil.disk_usage(source).free < size * 1.02 + 2 * 1024 ** 3:
        raise RuntimeError('Insufficient worst-case archive workspace; originals preserved')
    archive.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    partial = Path(str(archive) + '.partial')
    if partial.exists():
        raise RuntimeError('Interrupted archive exists; inspect it before retrying')
    with partial.open('xb') as raw:
        with tarfile.open(fileobj=raw, mode='w:gz', compresslevel=6, dereference=True) as tar:
            # Add each inventoried entry without traversal; symlinks never read targets.
            tar.dereference = False
            for name in sorted(before):
                info = tar.gettarinfo(str(source / name), arcname=name)
                info.pax_headers.update({'PEOPLE.xattr.' + os.fsencode(k).hex(): v
                                         for k, v in before[name]['xattrs'].items()})
                # Preserve each independent regular file as bytes, not a hard link.
                tar.inodes.clear()
                if 'sha256' in before[name]:
                    info.type = tarfile.REGTYPE
                    info.linkname = ''
                    info.size = before[name]['size']
                    with (source / name).open('rb') as f:
                        tar.addfile(info, f)
                else:
                    tar.addfile(info)
        raw.flush()
        os.fsync(raw.fileno())
    verify(partial, before)
    check_idle(source)
    if inventory(source) != before:
        raise RuntimeError('Recovery changed while archiving; originals preserved')
    partial.rename(archive)
    directory_fd = os.open(archive.parent, os.O_RDONLY)
    try:
        os.fsync(directory_fd)
    finally:
        os.close(directory_fd)
    with archive.open('rb') as f:
        archive_hash = sha(f)
    receipt = Path(str(archive) + '.receipt.json')
    report = dict(schemaVersion=1, source=str(source), archive=str(archive),
                  archiveSha256=archive_hash, originalBytes=size,
                  archiveBytes=archive.stat().st_size, entries=before,
                  verified=True, status='verified-originals-still-present', at=time.time())
    with receipt.open('x') as f:
        json.dump(report, f)
        f.flush()
        os.fsync(f.fileno())
    # A crash here leaves either originals plus archive or archive alone; neither
    # case discards a byte. Restore from the verified archive, never regenerate proof.
    shutil.rmtree(source)
    report['status'] = 'archived'
    pending_receipt = Path(str(receipt) + '.tmp')
    with pending_receipt.open('x') as f:
        json.dump(report, f)
        f.flush()
        os.fsync(f.fileno())
    pending_receipt.replace(receipt)
    return {k: v for k, v in report.items() if k != 'entries'}


def restore_recovery(archive, destination):
    archive, destination = Path(archive), Path(destination)
    if destination.exists() or destination.is_symlink():
        raise RuntimeError('Restore requires a new empty original-path destination')
    report = json.loads(Path(str(archive) + '.receipt.json').read_text())
    if str(destination) != report['source']:
        raise RuntimeError('Restore must use the original path, not create another registry/worktree copy')
    with archive.open('rb') as f:
        if sha(f) != report['archiveSha256']:
            raise RuntimeError('Recovery archive checksum mismatch')
    rows = report['entries']
    verify(archive, rows)
    for name in rows:
        p = Path(name)
        if p.is_absolute() or '..' in p.parts or name == '':
            raise RuntimeError('Unsafe recovery entry')
        for ancestor in p.parents:
            if str(ancestor) != '.' and not stat.S_ISDIR(rows.get(str(ancestor), {}).get('mode', 0)):
                raise RuntimeError('Recovery entry traverses non-directory')
    destination.mkdir(mode=0o700)
    with tarfile.open(archive, 'r:gz') as tar:
        for entry in tar:
            name = entry.name.removeprefix('./')
            target = destination / name
            if entry.isdir():
                target.mkdir(mode=0o700, parents=True, exist_ok=True)
            elif entry.isfile():
                target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
                with tar.extractfile(entry) as src, target.open('xb') as out:
                    shutil.copyfileobj(src, out)
    # Links are created last so extraction never traverses them.
    for name, row in rows.items():
        if 'target' in row:
            target = destination / name
            target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            target.symlink_to(row['target'])
    for name in sorted(rows, key=lambda n: len(Path(n).parts), reverse=True):
        row, target = rows[name], destination / name
        for key, value in row['xattrs'].items():
            set_attribute(target, key, base64.b64decode(value))
        if 'target' not in row:
            target.chmod(stat.S_IMODE(row['mode']))
        os.utime(target, ns=(row['mtime_ns'], row['mtime_ns']), follow_symlinks=False)
    restored = inventory(destination)
    for name, row in rows.items():
        for key in ['mode', 'sha256', 'target', 'xattrs', 'mtime_ns']:
            if restored[name].get(key) != row.get(key):
                raise RuntimeError('Restored recovery does not match: ' + name + ' ' + key)
    return dict(restored=True, destination=str(destination), archiveRetained=True)


def idle(source):
    r = subprocess.run(['/usr/sbin/lsof', '-nP', '+D', str(source), '-Fpn'],
                       capture_output=True, timeout=30)
    if r.returncode != 1 or r.stdout or r.stderr:
        raise RuntimeError('Recovery directory has open files or unverifiable ownership; preserved')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True)
    parser.add_argument('--archive', required=True)
    parser.add_argument('--restore', action='store_true')
    parser.add_argument('--registry', action='store_true')
    parser.add_argument('--retirement-plan')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    source = Path(args.source).absolute()
    if args.registry:
        if root / 'data/people/generated' not in source.parents or source.resolve() != source:
            raise RuntimeError('Only original immutable local registry paths are supported')
        if not args.restore:
            if not args.retirement_plan:
                raise RuntimeError('Explicit owner-confirmed retirement plan required')
            plan = json.loads(Path(args.retirement_plan).read_text())
            if plan.get('schemaVersion') != 1 or not plan.get('owner') or not plan.get('confirmedAt') or \
               str(source) not in plan['archiveCandidates'] or str(source) in plan['protected']:
                raise RuntimeError('Registry is not confirmed superseded or is still protected')
            manifest = json.loads((source / 'manifest.json').read_text())
            if manifest.get('kind') != 'canonical-identity-dossier-store':
                raise RuntimeError('Only complete immutable full stores can be archived, not partial jobs or delta ancestry')
            parts = [manifest['headers'], manifest['metadata']]
            if {p['file'] for p in parts} != {'dossiers.jsonl', 'index.jsonl'} or \
               set(os.listdir(source)) != {'manifest.json', 'dossiers.jsonl', 'index.jsonl'}:
                raise RuntimeError('Unexpected registry files; preserve them')
            for part in parts:
                payload = source / part['file']
                if payload.is_symlink() or payload.stat().st_size != part['bytes']:
                    raise RuntimeError('Immutable registry payload changed')
                with payload.open('rb') as f:
                    if sha(f) != part['sha256']:
                        raise RuntimeError('Immutable registry checksum mismatch')
    elif source.parent != root / '.git' or not source.name.startswith('worktree-recovery-'):
        raise RuntimeError('Only legacy .git/worktree-recovery-* directories can be archived')
    archive = Path(args.archive).absolute()
    if archive.parent != root / '.git/recovery-archives' or not archive.name.endswith('.tar.gz'):
        raise RuntimeError('Archive must remain private under .git/recovery-archives')
    print(json.dumps(restore_recovery(archive, source) if args.restore else archive_recovery(source, archive, idle), indent=2))
