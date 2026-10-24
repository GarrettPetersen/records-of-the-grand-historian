#!/usr/bin/env node

import process from 'node:process';
import { GrokbotMcpBridge } from './lib/grokbot-mcp-bridge.mjs';
import { configureGitHubGitAuthentication, grokbotBridgeOptions } from './lib/grokbot-mcp-runtime-config.mjs';

const operations = new Map([
  ['resumeOrClaim', 'resumeOrClaim'],
  ['getChunk', 'getChunk'],
  ['submitChunk', 'submitChunk'],
  ['finalizeChapter', 'finalizeChapter'],
  ['status', 'status'],
]);

function bridgeFromEnvironment() {
  const claimSecret = process.env.GROKBOT_MCP_CLAIM_SECRET;
  if (!claimSecret || claimSecret.length < 32) {
    throw new Error('GROKBOT_MCP_CLAIM_SECRET must contain at least 32 characters');
  }
  configureGitHubGitAuthentication(process.env.GITHUB_TOKEN);
  return new GrokbotMcpBridge({
    claimSecret,
    githubToken: process.env.GITHUB_TOKEN,
    githubRepository: process.env.GITHUB_REPOSITORY,
    options: grokbotBridgeOptions(process.env),
  });
}

function sendReply(payload) {
  return new Promise((resolve, reject) => {
    if (typeof process.send !== 'function') {
      resolve();
      return;
    }
    process.send(payload, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

process.once('message', async (message) => {
  let reply;
  let exitCode = 0;
  try {
    const method = operations.get(message?.operation);
    if (!method) throw new Error('Unsupported Grok Bot MCP operation');
    reply = { ok: true, result: await bridgeFromEnvironment()[method](message.args) };
  } catch (error) {
    exitCode = 1;
    reply = { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  try {
    await sendReply(reply);
  } catch {
    exitCode = 1;
  } finally {
    process.disconnect?.();
    process.exit(exitCode);
  }
});
