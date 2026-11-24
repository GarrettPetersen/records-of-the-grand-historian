import { execFileSync } from 'node:child_process';

// Parse without linking or evaluating repository code. Read exactly the sealed
// byte count: waiting for stdin EOF can stall on a macOS synchronous child pipe.
export const PINNED_MODULE_PARSER = `
import vm from 'node:vm';
import fs from 'node:fs';
const size = Number(process.argv[1]);
if (!Number.isSafeInteger(size) || size < 0 || size > 16 * 1024 * 1024) throw Error('Invalid pinned module size');
const bytes = Buffer.alloc(size);
let offset = 0;
while (offset < size) {
  const count = fs.readSync(0, bytes, offset, size - offset, null);
  if (count === 0) throw Error('Truncated pinned module input');
  offset += count;
}
const module = new vm.SourceTextModule(bytes.toString('utf8'));
process.stdout.write(JSON.stringify(module.dependencySpecifiers));
`;

export function pinnedModuleDependencies(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length > 16 * 1024 * 1024) throw Error('Bounded pinned module bytes required');
  const output = execFileSync(process.execPath,
    ['--experimental-vm-modules', '--input-type=module', '-e', PINNED_MODULE_PARSER, String(bytes.length)],
    { input: bytes, timeout: 10_000, maxBuffer: 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
  const imports = JSON.parse(output);
  if (!Array.isArray(imports) || imports.some(specifier => typeof specifier !== 'string')) throw Error('Invalid pinned module dependencies');
  return imports;
}
