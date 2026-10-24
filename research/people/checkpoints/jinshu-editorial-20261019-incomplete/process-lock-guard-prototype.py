#!/usr/bin/env python3
"""Research prototype only. Not interoperable with the existing lock writer."""
import fcntl
import json
import os
import tempfile


def alive(pid):
    if not isinstance(pid, int) or isinstance(pid, bool) or pid < 1:
        raise ValueError('invalid owner pid')
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True


def transition(lock, action, owner):
    """Serialize all namespace mutations on a permanent, never-unlinked guard."""
    with open(lock + '.guard', 'a+b') as guard:
        fcntl.flock(guard.fileno(), fcntl.LOCK_EX)
        try:
            with open(lock, encoding='utf8') as inp:
                current = json.load(inp)
        except FileNotFoundError:
            current = None
        if current is not None:
            if not isinstance(current, dict) or not isinstance(current.get('token'), str) or not current['token']:
                raise ValueError('malformed owner')
            alive(current.get('pid'))  # malformed PID is never treated as stale
        if action == 'release':
            if current is not None and current['token'] == owner['token']:
                os.unlink(lock)
                return 'released'
            return 'not-owner'
        if action != 'acquire':
            raise ValueError('unsupported action')
        alive(owner.get('pid'))
        if not isinstance(owner.get('token'), str) or not owner['token']:
            raise ValueError('invalid token')
        if current is not None:
            if alive(current['pid']):
                return 'busy'
            os.unlink(lock)
        # No partial owner file is ever published. A crashed helper may leave a
        # uniquely named temporary file, which is never considered a lock.
        fd, temp = tempfile.mkstemp(prefix='.lock-owner-', dir=os.path.dirname(lock))
        try:
            with os.fdopen(fd, 'w', encoding='utf8') as out:
                json.dump(owner, out)
                out.write('\n')
            os.link(temp, lock)
        finally:
            os.unlink(temp)
        return 'acquired'
