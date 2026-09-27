import { Buffer } from 'node:buffer';

export function positiveEnvironmentInteger(value, name, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

export function grokbotBridgeOptions(env) {
  return {
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
  };
}

export function configureGitHubGitAuthentication(token) {
  if (!token) return;
  const count = Number(process.env.GIT_CONFIG_COUNT ?? 0);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid inherited GIT_CONFIG_COUNT');
  const credential = Buffer.from(`x-access-token:${token}`).toString('base64');
  process.env.GIT_CONFIG_COUNT = String(count + 1);
  process.env[`GIT_CONFIG_KEY_${count}`] = 'http.https://github.com/.extraheader';
  process.env[`GIT_CONFIG_VALUE_${count}`] = `AUTHORIZATION: basic ${credential}`;
  process.env.GIT_TERMINAL_PROMPT = '0';
}
