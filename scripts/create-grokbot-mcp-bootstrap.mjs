#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const runtimeRoot = path.resolve(
  process.env.GROKBOT_MCP_RUNTIME_ROOT ??
    path.join(process.env.HOME ?? '', '.local', 'share', '24histories-grokbot-mcp'),
);
const authFile = path.join(runtimeRoot, 'secrets', 'auth-token');
const bootstrapFile = path.join(runtimeRoot, 'bootstrap.json');

if (!process.env.HOME && !process.env.GROKBOT_MCP_RUNTIME_ROOT) {
  throw new Error('HOME or GROKBOT_MCP_RUNTIME_ROOT is required');
}
if (!fs.existsSync(authFile)) throw new Error(`Missing MCP bearer token: ${authFile}`);
if (fs.existsSync(bootstrapFile)) {
  throw new Error(`Refusing to replace an unconsumed bootstrap: ${bootstrapFile}`);
}

const authToken = fs.readFileSync(authFile, 'utf8').trim();
if (authToken.length < 32) throw new Error(`${authFile} must contain at least 32 characters`);
const secret = randomBytes(32).toString('hex');
fs.writeFileSync(bootstrapFile, `${JSON.stringify({ secret, authToken })}\n`, {
  encoding: 'utf8',
  mode: 0o600,
  flag: 'wx',
});

console.log('Created a single-use bootstrap. It is deleted after the first successful request.');
console.log('Run this once on the Grok Bot shared computer:');
console.log(
  `curl -fsS -X POST -H 'x-bootstrap-key: ${secret}' ` +
  `'https://grokbot-mcp.24histories.com/bootstrap' | sh`,
);
