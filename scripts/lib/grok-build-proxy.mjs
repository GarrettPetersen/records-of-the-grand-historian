import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ENDPOINT = 'https://cli-chat-proxy.grok.com/v1/chat/completions';
export const GROK_BUILD_MODEL = 'grok-build';

export function readGrokBuildCredential(file = path.join(os.homedir(), '.grok', 'auth.json')) {
  const auth = JSON.parse(fs.readFileSync(file, 'utf8'));
  const matches = Object.entries(auth).filter(([issuer, entry]) =>
    issuer.startsWith('https://auth.x.ai') && typeof entry?.key === 'string' && entry.key.length > 0);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one logged-in Grok Build session in ${file}; run grok login`);
  }
  const credential = matches[0][1];
  if (!credential.user_id || typeof credential.user_id !== 'string') {
    throw new Error('Grok Build session has no user ID; run grok login');
  }
  return { token: credential.key, userId: credential.user_id };
}

export function installedGrokBuildVersion(command = 'grok') {
  const result = execFileSync(command, ['--version'], { encoding: 'utf8', timeout: 5000 });
  const version = /^grok (\d+\.\d+\.\d+)/u.exec(result)?.[1];
  if (!version) throw new Error('Could not determine the installed Grok Build version');
  return version;
}

export async function grokBuildCompletion({ messages, tools, timeoutMs = 120000, maxTokens = 8192,
  fetchImpl = fetch, credential = readGrokBuildCredential(), version = installedGrokBuildVersion() }) {
  if (!Array.isArray(messages) || !messages.length || !Array.isArray(tools)) {
    throw new Error('Grok Build completion requires messages and a tool array');
  }
  if (!Number.isSafeInteger(maxTokens) || maxTokens < 1 || maxTokens > 8192) {
    throw new Error('Grok Build maxTokens must be between 1 and 8192');
  }
  const response = await fetchImpl(ENDPOINT, {
    method: 'POST',
    redirect: 'error',
    headers: {
      authorization: `Bearer ${credential.token}`,
      'content-type': 'application/json',
      'x-xai-token-auth': 'xai-grok-cli',
      'x-grok-client-version': version,
      'x-grok-client-identifier': 'grok-shell',
      'x-grok-client-mode': 'headless',
      'x-grok-model-override': GROK_BUILD_MODEL,
      'x-userid': credential.userId,
    },
    body: JSON.stringify({ model: GROK_BUILD_MODEL, messages, tools, tool_choice: 'auto',
      max_tokens: maxTokens, stream: false }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  let body;
  try { body = await response.json(); }
  catch { throw new Error(`Grok Build proxy returned non-JSON HTTP ${response.status}`); }
  if (!response.ok) {
    const detail = typeof body.error === 'string' ? body.error : body.error?.message;
    const error = new Error(`Grok Build proxy HTTP ${response.status}: ${String(detail ?? 'request failed').slice(0, 500)}`);
    error.status = response.status;
    throw error;
  }
  if (!body.choices?.[0]?.message || !Number.isSafeInteger(body.usage?.total_tokens)) {
    throw new Error('Grok Build proxy returned no assistant message or token usage');
  }
  return body;
}
