import importlib.util
from pathlib import Path
import tempfile
import unittest
import tarfile
import os

spec = importlib.util.spec_from_file_location('archive', Path(__file__).with_name('archive-people-worktree-recovery.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ArchiveTests(unittest.TestCase):
    def test_complete_byte_verified_recovery_and_symlinks(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / 'source'
            root.mkdir()
            module.set_attribute(root, 'user.people-root', b'root provenance')
            (root / 'nested').mkdir()
            (root / 'nested/evidence').write_bytes(b'private review\x00' * 100)
            (root / 'link').symlink_to('nested/evidence')
            module.set_attribute(root / 'nested/evidence', 'user.people-review', b'preserve\x00metadata')
            before = module.inventory(root)
            archive = Path(d) / 'recovery.tar.gz'
            r = module.archive_recovery(root, archive, lambda _: None)
            self.assertFalse(root.exists())
            self.assertTrue(r['verified'])
            module.verify(archive, before)
            module.restore_recovery(archive, root)
            self.assertEqual((root / 'nested/evidence').read_bytes(), b'private review\x00' * 100)
            self.assertEqual(module.attributes(root / 'nested/evidence')['user.people-review'], 'cHJlc2VydmUAbWV0YWRhdGE=')
            self.assertEqual(module.attributes(root)['user.people-root'], 'cm9vdCBwcm92ZW5hbmNl')

    def test_busy_and_changed_inputs_preserve_originals(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / 'source'
            root.mkdir()
            (root / 'evidence').write_bytes(b'original')
            def busy(_):
                raise RuntimeError('busy')
            with self.assertRaisesRegex(RuntimeError, 'busy'):
                module.archive_recovery(root, Path(d) / 'a.tar.gz', busy)
            calls = 0
            def mutate(_):
                nonlocal calls
                calls += 1
                if calls == 2:
                    (root / 'evidence').write_bytes(b'changed')
            with self.assertRaisesRegex(RuntimeError, 'changed while'):
                module.archive_recovery(root, Path(d) / 'b.tar.gz', mutate)
            self.assertEqual((root / 'evidence').read_bytes(), b'changed')

    def test_corrupt_archive_does_not_verify(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d) / 'source'
            root.mkdir()
            (root / 'evidence').write_bytes(b'original')
            before = module.inventory(root)
            p = Path(d) / 'wrong.tar.gz'
            (root / 'evidence').write_bytes(b'changed')
            with tarfile.open(p, 'w:gz') as tar:
                tar.add(root / 'evidence', arcname='evidence')
            with self.assertRaisesRegex(RuntimeError, 'differs|differ'):
                module.verify(p, before)
            self.assertTrue(root.exists())


if __name__ == '__main__':
    unittest.main()
