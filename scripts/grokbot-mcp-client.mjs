#!/usr/bin/env node

import fs from 'node:fs';

const DEFAULT_URL = 'https://grokbot-mcp.24histories.com/mcp';
const COMMAND_TO_TOOL = new Map([
  ['status', 'worker_status'],
  ['resume', 'resume_or_claim'],
  ['get-chunk', 'get_chunk'],
  ['submit-chunk', 'submit_chunk'],
  ['finalize', 'finalize_chapter'],
]);

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const values = {};
  for (let index = 0; index < rest.length; index += 2) {
    const flag = rest[index];
    const value = rest[index + 1];
    if (!flag?.startsWith('--') || value === undefined) {
      throw new Error(`Expected --name value pairs; received ${flag ?? '<end>'}`);
    }
    values[flag.slice(2)] = value;
  }
  return { command, values };
}

function required(values, name, environmentName) {
  const value = values[name] ?? (environmentName ? process.env[environmentName] : null);
  if (!value) throw new Error(`Missing --${name}${environmentName ? ` or ${environmentName}` : ''}`);
  return value;
}

function toolArguments(command, values) {
  if (command === 'status') return { worker: required(values, 'worker') };
  if (command === 'resume') {
    const args = { worker: required(values, 'worker') };
    if (values.book || values.chapter) {
      args.book = required(values, 'book');
      args.chapter = required(values, 'chapter');
    }
    return args;
  }
  if (command === 'get-chunk') {
    return {
      claimToken: required(values, 'claim-token', 'GROKBOT_CLAIM_TOKEN'),
      chunkId: required(values, 'chunk-id'),
    };
  }
  if (command === 'submit-chunk') {
    return {
      claimToken: required(values, 'claim-token', 'GROKBOT_CLAIM_TOKEN'),
      chunkId: required(values, 'chunk-id'),
      extraction: JSON.parse(fs.readFileSync(required(values, 'file'), 'utf8')),
    };
  }
  if (command === 'finalize') {
    return { claimToken: required(values, 'claim-token', 'GROKBOT_CLAIM_TOKEN') };
  }
  throw new Error(`Unknown command: ${command ?? '<none>'}`);
}

function parseMcpResponse(text) {
  const dataLines = text.split(/\r?\n/u)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice('data:'.length).trim());
  const raw = dataLines.length ? dataLines.at(-1) : text;
  return raw ? JSON.parse(raw) : null;
}

async function post(url, headers, body) {
  const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await response.text();
  if (!response.ok) throw new Error(`MCP HTTP ${response.status}: ${text}`);
  return parseMcpResponse(text);
}

async function main() {
  const { command, values } = parseArgs(process.argv.slice(2));
  const tool = COMMAND_TO_TOOL.get(command);
  if (!tool) {
    throw new Error('Usage: grokbot-mcp-client.mjs <status|resume|get-chunk|submit-chunk|finalize> --name value ...');
  }
  const token = required(values, 'auth-token', 'GROKBOT_MCP_AUTH_TOKEN');
  const url = process.env.GROKBOT_MCP_URL ?? DEFAULT_URL;
  const headers = {
    authorization: `Bearer ${token}`,
    accept: 'application/json, text/event-stream',
    'content-type': 'application/json',
  };
  await post(url, headers, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: '24histories-grokbot-cli', version: '1.0.0' },
    },
  });
  await post(url, headers, { jsonrpc: '2.0', method: 'notifications/initialized' });
  const response = await post(url, headers, {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: { name: tool, arguments: toolArguments(command, values) },
  });
  if (response?.error) throw new Error(response.error.message ?? JSON.stringify(response.error));
  const result = response?.result;
  if (result?.isError) throw new Error(result.content?.[0]?.text ?? 'MCP tool failed');
  const text = result?.content?.[0]?.text;
  if (!text) throw new Error('MCP tool returned no text result');
  console.log(JSON.stringify(JSON.parse(text), null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
