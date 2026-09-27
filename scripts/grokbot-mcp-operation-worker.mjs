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

process.once('message', async (message) => {
  try {
    const method = operations.get(message?.operation);
    if (!method) throw new Error('Unsupported Grok Bot MCP operation');
    const result = await bridgeFromEnvironment()[method](message.args);
    process.send?.({ ok: true, result });
  } catch (error) {
    process.send?.({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});
