#!/usr/bin/env python3
import concurrent.futures
import fcntl
import importlib.util
import json
import multiprocessing
import os
import pathlib
import signal
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('lock_proto', pathlib.Path(__file__).with_name('process-lock-guard-prototype.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def attempt(args):
    return module.transition(*args)


def exit_immediately():
    return None


def hold_guard_until_killed(guard_path, ready):
    with open(guard_path, 'a+b') as guard:
        fcntl.flock(guard.fileno(), fcntl.LOCK_EX)
        ready.set()
        signal.pause()


class GuardPrototypeTest(unittest.TestCase):
    def test_competing_recoverers_cannot_remove_successor(self):
        with tempfile.TemporaryDirectory(prefix='people-lock-proof-') as tmp:
            lock = os.path.join(tmp, 'run.lock')
            # A terminated child supplies an actually dead PID.
            proc = multiprocessing.Process(target=exit_immediately)
            proc.start()
            proc.join()
            with open(lock, 'w', encoding='utf8') as out:
                json.dump({'pid': proc.pid, 'token': 'old'}, out)
            owners = [{'pid': os.getpid(), 'token': f'new-{n}'} for n in range(40)]
            with concurrent.futures.ProcessPoolExecutor(max_workers=12) as pool:
                statuses = list(pool.map(attempt, [(lock, 'acquire', owner) for owner in owners]))
            self.assertEqual(statuses.count('acquired'), 1)
            self.assertEqual(statuses.count('busy'), 39)
            with open(lock, encoding='utf8') as inp:
                winner = json.load(inp)
            self.assertIn(winner, owners)
            self.assertEqual(module.transition(lock, 'release', {'token': 'old'}), 'not-owner')
            self.assertEqual(module.transition(lock, 'release', winner), 'released')
            self.assertEqual(module.transition(lock, 'acquire', owners[0]), 'acquired')

    def test_malformed_owner_is_not_reclaimed(self):
        with tempfile.TemporaryDirectory(prefix='people-lock-proof-') as tmp:
            lock = os.path.join(tmp, 'run.lock')
            for broken in ('{', '{}', '{"pid": null, "token": "x"}'):
                with open(lock, 'w', encoding='utf8') as out:
                    out.write(broken)
                with self.assertRaises((ValueError, json.JSONDecodeError)):
                    module.transition(lock, 'acquire', {'pid': os.getpid(), 'token': 'new'})
                with open(lock, encoding='utf8') as inp:
                    self.assertEqual(inp.read(), broken)

    def test_dead_guard_holder_releases_kernel_lock(self):
        with tempfile.TemporaryDirectory(prefix='people-lock-proof-') as tmp:
            lock = os.path.join(tmp, 'run.lock')
            ready = multiprocessing.Event()
            proc = multiprocessing.Process(target=hold_guard_until_killed, args=(lock + '.guard', ready))
            proc.start()
            try:
                self.assertTrue(ready.wait(5))
            finally:
                proc.terminate()
                proc.join(5)
            self.assertFalse(proc.is_alive())
            self.assertEqual(module.transition(lock, 'acquire', {'pid': os.getpid(), 'token': 'new'}), 'acquired')


if __name__ == '__main__':
    unittest.main()
