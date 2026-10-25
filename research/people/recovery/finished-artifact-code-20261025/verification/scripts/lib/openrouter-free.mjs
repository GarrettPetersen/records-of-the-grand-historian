const BASE = 'https://openrouter.ai/api/v1';
export const DEFAULT_OPENROUTER_FREE_MODEL = 'dots-studio/dots-3-note-preview:free';

export function assertFreeModel(model, catalog) {
  if (typeof model !== 'string' || (model !== 'openrouter/free' && !model.endsWith(':free'))) throw new Error('OpenRouter lane requires openrouter/free or an explicit :free model');
  const entry = catalog?.data?.find(row => row.id === model);
  if (!entry) throw new Error(`OpenRouter free model unavailable: ${model}`);
  const { prompt, completion } = entry.pricing ?? {};
  if (prompt == null || completion == null || Number(prompt) !== 0 || Number(completion) !== 0) {
    throw new Error(`OpenRouter model is not verified zero-priced: ${model}`);
  }
  return entry;
}

async function api(key, endpoint, { body, timeoutMs = 120000, fetchImpl = fetch } = {}) {
  if (!key) throw new Error('OPENROUTER_API_KEY is missing');
  const response = await fetchImpl(`${BASE}/${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    const error = new Error(`OpenRouter HTTP ${response.status}${response.status === 429 ? ' (free quota or rate limit; resume after reset)' : ''}`);
    error.status = response.status;
    error.retryAfter = response.headers?.get?.('retry-after') ?? null;
    throw error;
  }
  return response.json();
}

export async function verifyOpenRouterFreeModel({ key, model = DEFAULT_OPENROUTER_FREE_MODEL, fetchImpl = fetch }) {
  return assertFreeModel(model, await api(key, 'models', { fetchImpl }));
}

export async function openRouterFreeCompletion({ key, model = DEFAULT_OPENROUTER_FREE_MODEL, messages,
  tools, maxTokens = 8192, timeoutMs = 120000, fetchImpl = fetch, onResponse }) {
  if (!Array.isArray(messages) || !messages.length) throw new Error('OpenRouter messages required');
  const entry = await verifyOpenRouterFreeModel({ key, model, fetchImpl });
  if (!Number.isSafeInteger(maxTokens) || maxTokens < 1 || maxTokens > (entry.top_provider?.max_completion_tokens ?? 32768)) {
    throw new Error('OpenRouter maxTokens exceeds verified model limit');
  }
  const response = await api(key, 'chat/completions', { fetchImpl, timeoutMs, body: {
    model, messages, max_tokens: maxTokens, temperature: 0,
    reasoning: { enabled: true, effort: 'low' },
    provider: { allow_fallbacks: false },
    ...(tools ? { tools, tool_choice: 'auto' } : { response_format: { type: 'json_object' } }),
  } });
  if (model !== 'openrouter/free' && response.model !== model) throw new Error(`OpenRouter returned unexpected model ${response.model ?? 'null'}`);
  if (model === 'openrouter/free') {
    await verifyOpenRouterFreeModel({ key, model: response.model, fetchImpl });
  }
  if (response.usage?.cost != null && Number(response.usage.cost) !== 0) throw new Error('OpenRouter free model reported a nonzero cost');
  if (onResponse) await onResponse(response);
  return response;
}

export async function openRouterFreeJson(options) {
  const response = await openRouterFreeCompletion(options);
  const text = response.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text.trim()) throw new Error('OpenRouter returned no JSON text');
  let artifact;
  try { artifact = JSON.parse(text); }
  catch (error) { throw new Error(`OpenRouter returned invalid JSON: ${error.message}`); }
  if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact)) throw new Error('OpenRouter JSON must be an object');
  return { artifact, response };
}
