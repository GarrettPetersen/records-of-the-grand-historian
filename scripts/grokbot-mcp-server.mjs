#!/usr/bin/env node

import { createServer as createHttpServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer, createMcpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import * as z from 'zod/v4';
import { GrokbotMcpBridge } from './lib/grokbot-mcp-bridge.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const SERVER_VERSION = '1.0.0';
const CLIENT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'grokbot-mcp-client.mjs');

function textResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value) }] };
}

function toolHandler(callback) {
  return async (args) => {
    try {
      return textResult(await callback(args));
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: error instanceof Error ? error.message : String(error),
        }],
        isError: true,
      };
    }
  };
}

export function createGrokbotMcpServer(bridge) {
  const server = new McpServer(
    { name: '24histories-people-grokbot', version: SERVER_VERSION },
    {
      instructions:
        'Process exactly one sticky people-glossary claim at a time. Start with resume_or_claim. ' +
        'For each returned chunk, call get_chunk, complete only that sealed packet, and call submit_chunk. ' +
        'After every chunk is accepted, call finalize_chapter. Never invent a claim token or alter source files.',
    },
  );

  server.registerTool('resume_or_claim', {
    description:
      'Resume this worker\'s sticky Grok Bot chapter, or atomically claim one new chapter if none is active. ' +
      'Omit book and chapter for deadline-balanced allocation.',
    inputSchema: z.object({
      worker: z.string().describe('Stable worker ID such as grokbot-01.'),
      book: z.string().optional(),
      chapter: z.string().regex(/^\d{3}$/u).optional(),
    }).refine((value) => Boolean(value.book) === Boolean(value.chapter), {
      message: 'book and chapter must be supplied together',
    }),
    annotations: { title: 'Resume or claim chapter', idempotentHint: true },
  }, toolHandler((args) => bridge.resumeOrClaim(args)));

  server.registerTool('get_chunk', {
    description:
      'Return the prompt, schema, packet, and saved draft for exactly one sealed chunk. ' +
      'Do not combine it with material from another chunk.',
    inputSchema: z.object({
      claimToken: z.string().min(20),
      chunkId: z.string().min(1).max(32),
    }),
    annotations: { title: 'Get sealed extraction chunk', readOnlyHint: true, idempotentHint: true },
  }, toolHandler((args) => bridge.getChunk(args)));

  server.registerTool('submit_chunk', {
    description:
      'Validate and atomically save a complete extraction for one sealed chunk. ' +
      'Invalid output is rejected without replacing the last valid saved output.',
    inputSchema: z.object({
      claimToken: z.string().min(20),
      chunkId: z.string().min(1).max(32),
      extraction: z.record(z.string(), z.unknown()),
    }),
    annotations: { title: 'Submit validated extraction chunk', idempotentHint: true },
  }, toolHandler((args) => bridge.submitChunk(args)));

  server.registerTool('finalize_chapter', {
    description:
      'Assemble all accepted chunks, run complete chapter validation, publish the exact JSON to a GitHub branch, ' +
      'open or reuse its staging pull request, and mark the shared claim submitted.',
    inputSchema: z.object({ claimToken: z.string().min(20) }),
    annotations: { title: 'Finalize and publish chapter', idempotentHint: true },
  }, toolHandler((args) => bridge.finalizeChapter(args)));

  server.registerTool('worker_status', {
    description: 'List this stable Grok Bot worker\'s active and submitted people-glossary claims.',
    inputSchema: z.object({ worker: z.string() }),
    annotations: { title: 'Read worker status', readOnlyHint: true, idempotentHint: true },
  }, toolHandler((args) => bridge.status(args)));

  return server;
}

function constantTimeTokenMatch(supplied, expected) {
  const left = Buffer.from(supplied ?? '');
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function bearerToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}

function normalizeHost(value) {
  if (!value) return '';
  if (value.startsWith('[')) return value.slice(0, value.indexOf(']') + 1).toLowerCase();
  return value.split(':')[0].toLowerCase();
}

function commaSet(value) {
  return new Set(String(value ?? '').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean));
}

function positiveEnvironmentInteger(value, name, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

function bootstrapScript(authToken) {
  if (!/^[a-f0-9]{64}$/u.test(authToken)) throw new Error('Bootstrap auth token has an invalid format');
  return `#!/bin/sh
set -eu
umask 077
mkdir -p "$HOME/.config/24histories" "$HOME/.local/bin" "$HOME/.local/lib/24histories"
printf '%s\\n' '${authToken}' > "$HOME/.config/24histories/grokbot-mcp-token"
curl -fsS https://grokbot-mcp.24histories.com/grokbot-mcp-client.mjs \\
  -o "$HOME/.local/lib/24histories/grokbot-mcp-client.mjs"
chmod 700 "$HOME/.local/lib/24histories/grokbot-mcp-client.mjs"
cat > "$HOME/.local/bin/24histories-people" <<'WRAPPER'
#!/bin/sh
set -eu
export GROKBOT_MCP_AUTH_TOKEN="$(cat "$HOME/.config/24histories/grokbot-mcp-token")"
exec node "$HOME/.local/lib/24histories/grokbot-mcp-client.mjs" "$@"
WRAPPER
chmod 700 "$HOME/.local/bin/24histories-people"
"$HOME/.local/bin/24histories-people" status --worker grokbot-01
`;
}

function configureGitHubGitAuthentication(token) {
  if (!token) return;
  const count = Number(process.env.GIT_CONFIG_COUNT ?? 0);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid inherited GIT_CONFIG_COUNT');
  const credential = Buffer.from(`x-access-token:${token}`).toString('base64');
  process.env.GIT_CONFIG_COUNT = String(count + 1);
  process.env[`GIT_CONFIG_KEY_${count}`] = 'http.https://github.com/.extraheader';
  process.env[`GIT_CONFIG_VALUE_${count}`] = `AUTHORIZATION: basic ${credential}`;
  process.env.GIT_TERMINAL_PROMPT = '0';
}

export function startGrokbotMcpServer({ env = process.env, bridge } = {}) {
  const authToken = env.GROKBOT_MCP_AUTH_TOKEN;
  const claimSecret = env.GROKBOT_MCP_CLAIM_SECRET;
  if (!authToken || authToken.length < 32) {
    throw new Error('GROKBOT_MCP_AUTH_TOKEN must contain at least 32 characters');
  }
  if (!claimSecret || claimSecret.length < 32) {
    throw new Error('GROKBOT_MCP_CLAIM_SECRET must contain at least 32 characters');
  }
  const host = env.HOST ?? '127.0.0.1';
  const port = Number(env.PORT ?? 3001);
  if (!Number.isSafeInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be 0-65535');
  const allowedHosts = commaSet(env.GROKBOT_MCP_ALLOWED_HOSTS);
  const allowedOrigins = commaSet(env.GROKBOT_MCP_ALLOWED_ORIGINS);
  const publicBind = !['127.0.0.1', '::1', 'localhost'].includes(host.toLowerCase());
  if (publicBind && allowedHosts.size === 0) {
    throw new Error('GROKBOT_MCP_ALLOWED_HOSTS is required when binding a public interface');
  }

  configureGitHubGitAuthentication(env.GITHUB_TOKEN);
  const lane = bridge ?? new GrokbotMcpBridge({
    claimSecret,
    githubToken: env.GITHUB_TOKEN,
    githubRepository: env.GITHUB_REPOSITORY,
    options: {
      order: 'deadline-balanced',
      maxUnits: positiveEnvironmentInteger(env.GROKBOT_MCP_MAX_UNITS, 'GROKBOT_MCP_MAX_UNITS', 80),
      maxCandidates: positiveEnvironmentInteger(
        env.GROKBOT_MCP_MAX_CANDIDATES,
        'GROKBOT_MCP_MAX_CANDIDATES',
        200,
      ),
      maxWorkerBytes: positiveEnvironmentInteger(
        env.GROKBOT_MCP_MAX_WORKER_KIB,
        'GROKBOT_MCP_MAX_WORKER_KIB',
        48,
      ) * 1024,
    },
  });
  const handler = createMcpHandler(() => createGrokbotMcpServer(lane), {
    responseMode: 'json',
    legacy: 'stateless',
  });
  const nodeHandler = toNodeHandler(handler);
  const httpServer = createHttpServer((req, res) => {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    if (req.method === 'GET' && pathname === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, service: '24histories-people-grokbot', version: SERVER_VERSION }));
      return;
    }
    if (req.method === 'GET' && pathname === '/grokbot-mcp-client.mjs') {
      res.writeHead(200, {
        'content-type': 'text/javascript; charset=utf-8',
        'cache-control': 'public, max-age=300',
      });
      fs.createReadStream(CLIENT_FILE).pipe(res);
      return;
    }
    if (req.method === 'POST' && pathname === '/bootstrap') {
      const bootstrapFile = env.GROKBOT_MCP_BOOTSTRAP_FILE;
      if (!bootstrapFile || !fs.existsSync(bootstrapFile)) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      const bootstrap = JSON.parse(fs.readFileSync(bootstrapFile, 'utf8'));
      const supplied = String(req.headers['x-bootstrap-key'] ?? '');
      if (!constantTimeTokenMatch(supplied, bootstrap.secret)) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      const script = bootstrapScript(bootstrap.authToken);
      fs.unlinkSync(bootstrapFile);
      res.writeHead(200, {
        'content-type': 'text/x-shellscript; charset=utf-8',
        'cache-control': 'no-store',
      });
      res.end(script);
      return;
    }
    if (pathname !== '/mcp') {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    if (allowedHosts.size && !allowedHosts.has(normalizeHost(req.headers.host))) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Host not allowed');
      return;
    }
    const origin = String(req.headers.origin ?? '').toLowerCase();
    if (origin && !allowedOrigins.has(origin)) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Origin not allowed');
      return;
    }
    if (!constantTimeTokenMatch(bearerToken(req), authToken)) {
      res.writeHead(401, {
        'content-type': 'text/plain; charset=utf-8',
        'www-authenticate': 'Bearer realm="24histories-grokbot"',
      });
      res.end('Unauthorized');
      return;
    }
    void nodeHandler(req, res);
  });
  httpServer.listen(port, host, () => {
    console.error(`24histories Grok Bot MCP listening on http://${host}:${port}/mcp`);
  });

  const close = async () => {
    await new Promise((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
    await handler.close();
  };
  return { httpServer, handler, close };
}

if (isMain) {
  const running = startGrokbotMcpServer();
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      running.close()
        .then(() => process.exit(0))
        .catch((error) => {
          console.error(error instanceof Error ? error.message : error);
          process.exit(1);
        });
    });
  }
}
