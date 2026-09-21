import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { grokbotMcpTokenInternals } from './lib/grokbot-mcp-bridge.mjs';
import { startGrokbotMcpServer } from './grokbot-mcp-server.mjs';

const AUTH_TOKEN = 'a'.repeat(48);
const CLAIM_SECRET = 'c'.repeat(48);

test('bootstrap generator creates an owner-only file and refuses to overwrite it', t => {
  const runtime = fs.mkdtempSync(path.join(os.tmpdir(), 'grokbot-mcp-bootstrap-generator-'));
  t.after(() => fs.rmSync(runtime, { recursive: true, force: true }));
  const secrets = path.join(runtime, 'secrets');
  fs.mkdirSync(secrets);
  fs.writeFileSync(path.join(secrets, 'auth-token'), `${AUTH_TOKEN}\n`, { mode: 0o600 });
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'create-grokbot-mcp-bootstrap.mjs');
  const env = { ...process.env, GROKBOT_MCP_RUNTIME_ROOT: runtime };
  const first = spawnSync(process.execPath, [script], { encoding: 'utf8', env });
  assert.equal(first.status, 0, first.stderr);
  const file = path.join(runtime, 'bootstrap.json');
  const bootstrap = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(bootstrap.authToken, AUTH_TOKEN);
  assert.match(bootstrap.secret, /^[a-f0-9]{64}$/u);
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  const second = spawnSync(process.execPath, [script], { encoding: 'utf8', env });
  assert.notEqual(second.status, 0);
  assert.match(second.stderr, /Refusing to replace an unconsumed bootstrap/u);
});

test('claim tokens reject tampering', () => {
  const payload = {
    version: 1,
    worker: 'grokbot-01',
    book: 'shiji',
    chapter: '001',
    chapterFingerprint: 'sha256:fixture',
    planHash: 'fixture-plan',
  };
  const token = grokbotMcpTokenInternals.makeClaimToken(CLAIM_SECRET, payload);
  assert.deepEqual(grokbotMcpTokenInternals.parseClaimToken(CLAIM_SECRET, token), payload);
  assert.throws(
    () => grokbotMcpTokenInternals.parseClaimToken(CLAIM_SECRET, `${token.slice(0, -1)}x`),
    /Invalid claim token signature/u,
  );
});

test('HTTP endpoint requires bearer auth and exposes only the narrow lane tools', async t => {
  const calls = [];
  const bridge = {
    resumeOrClaim: async (args) => ({ operation: 'claim', ...args }),
    getChunk: (args) => ({ operation: 'get', ...args }),
    submitChunk: (args) => ({ operation: 'submit', chunkId: args.chunkId }),
    finalizeChapter: async () => ({ submitted: true }),
    status: (args) => {
      calls.push(args);
      return { worker: args.worker, claims: [] };
    },
  };
  const running = startGrokbotMcpServer({
    bridge,
    env: {
      HOST: '127.0.0.1',
      PORT: '0',
      GROKBOT_MCP_AUTH_TOKEN: AUTH_TOKEN,
      GROKBOT_MCP_CLAIM_SECRET: CLAIM_SECRET,
    },
  });
  t.after(async () => running.close());
  if (!running.httpServer.listening) await once(running.httpServer, 'listening');
  const address = running.httpServer.address();
  const base = `http://127.0.0.1:${address.port}`;

  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  const unauthorized = await fetch(`${base}/mcp`, { method: 'POST', body: '{}' });
  assert.equal(unauthorized.status, 401);

  const client = new Client({ name: 'grokbot-mcp-test', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(`${base}/mcp`), {
    requestInit: { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } },
  });
  await client.connect(transport);
  t.after(async () => client.close());

  const tools = await client.listTools();
  assert.deepEqual(
    tools.tools.map((tool) => tool.name).sort(),
    ['finalize_chapter', 'get_chunk', 'resume_or_claim', 'submit_chunk', 'worker_status'],
  );
  const result = await client.callTool({
    name: 'worker_status',
    arguments: { worker: 'grokbot-01' },
  });
  assert.equal(result.isError, undefined);
  assert.deepEqual(JSON.parse(result.content[0].text), { worker: 'grokbot-01', claims: [] });
  assert.deepEqual(calls, [{ worker: 'grokbot-01' }]);
});

test('bootstrap URL is high-entropy, single-use, and never cacheable', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'grokbot-mcp-bootstrap-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'bootstrap.json');
  const secret = 'b'.repeat(64);
  fs.writeFileSync(file, JSON.stringify({ secret, authToken: 'd'.repeat(64) }), { mode: 0o600 });
  const running = startGrokbotMcpServer({
    bridge: {},
    env: {
      HOST: '127.0.0.1',
      PORT: '0',
      GROKBOT_MCP_AUTH_TOKEN: AUTH_TOKEN,
      GROKBOT_MCP_CLAIM_SECRET: CLAIM_SECRET,
      GROKBOT_MCP_BOOTSTRAP_FILE: file,
    },
  });
  t.after(async () => running.close());
  if (!running.httpServer.listening) await once(running.httpServer, 'listening');
  const address = running.httpServer.address();
  const url = `http://127.0.0.1:${address.port}/bootstrap`;
  assert.equal((await fetch(url)).status, 404);
  const first = await fetch(url, { method: 'POST', headers: { 'x-bootstrap-key': secret } });
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('cache-control'), 'no-store');
  assert.match(await first.text(), /grokbot-mcp-token/u);
  assert.equal(fs.existsSync(file), false);
  assert.equal((await fetch(url, { method: 'POST', headers: { 'x-bootstrap-key': secret } })).status, 404);
});
