import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { grokBuildCompletion, readGrokBuildCredential } from './lib/grok-build-proxy.mjs';

test('reads only one Grok session without exposing it', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'grok-build-auth-test-'));
  const file = path.join(directory, 'auth.json');
  try {
    fs.writeFileSync(file, JSON.stringify({ 'https://auth.x.ai::test': { key: 'secret', user_id: 'user-1' } }));
    assert.deepEqual(readGrokBuildCredential(file), { token: 'secret', userId: 'user-1' });
    fs.writeFileSync(file, JSON.stringify({ unrelated: { key: 'secret' } }));
    assert.throws(() => readGrokBuildCredential(file), /exactly one logged-in/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('sends only bounded tool chat to the official CLI proxy', async () => {
  let request;
  const result = await grokBuildCompletion({
    credential: { token: 'secret', userId: 'user-1' }, version: '1.0.46',
    messages: [{ role: 'user', content: 'Save alpha' }],
    tools: [{ type: 'function', function: { name: 'save', parameters: { type: 'object' } } }],
    fetchImpl: async (url, init) => {
      request = { url, init };
      return new Response(JSON.stringify({ choices: [{ message: { role: 'assistant', tool_calls: [] } }],
        usage: { total_tokens: 20 } }), { status: 200 });
    },
  });
  assert.equal(result.usage.total_tokens, 20);
  assert.equal(request.url, 'https://cli-chat-proxy.grok.com/v1/chat/completions');
  assert.equal(request.init.redirect, 'error');
  assert.equal(request.init.headers['x-grok-client-version'], '1.0.46');
  assert.equal(JSON.parse(request.init.body).model, 'grok-build');
  assert.equal(JSON.parse(request.init.body).stream, false);
});

test('fails loudly on quota exhaustion and malformed responses', async () => {
  const options = { credential: { token: 'secret', userId: 'user-1' }, version: '1.0.46',
    messages: [{ role: 'user', content: 'hello' }], tools: [] };
  await assert.rejects(grokBuildCompletion({ ...options, fetchImpl: async () =>
    new Response(JSON.stringify({ error: 'quota exceeded' }), { status: 429 }) }),
  error => error.status === 429 && /quota exceeded/.test(error.message));
  await assert.rejects(grokBuildCompletion({ ...options, fetchImpl: async () =>
    new Response(JSON.stringify({ choices: [] }), { status: 200 }) }),
  /no assistant message or token usage/);
});
