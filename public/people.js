const SEARCH_ROOT = '/data/people/search';
const MAX_RESULTS = 250;
const FETCH_RETRIES = 2;
const FETCH_BACKOFF_MS = 250;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#039;');
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLocaleLowerCase('en')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function transientStatus(status) {
  return status === 408 || status === 429 || status >= 500;
}

async function fetchJsonWithRetry(url) {
  let lastError = null;
  for (let attempt = 0; attempt <= FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      const status = Number(error?.status);
      const transient = !Number.isFinite(status) || transientStatus(status);
      if (!transient || attempt === FETCH_RETRIES) throw error;
      await sleep(FETCH_BACKOFF_MS * (2 ** attempt));
    }
  }
  throw lastError || new Error('Search data request failed');
}

async function loadEntries() {
  const index = await fetchJsonWithRetry(`${SEARCH_ROOT}/index.json`);
  if (!Array.isArray(index.parts) || index.parts.length === 0) throw new Error('Invalid people search index');
  const parts = await Promise.all(index.parts.map((part) =>
    fetchJsonWithRetry(`${SEARCH_ROOT}/${encodeURIComponent(part.file)}`)
  ));
  const entries = parts.flatMap((part) => part.entries ?? []);
  if (entries.length !== index.people) throw new Error(`People search index expected ${index.people}, found ${entries.length}`);
  return entries;
}

function scoreEntry(entry, query) {
  const [slug, en, zh, pinyin, description, searchText] = entry;
  const fields = [en, zh, pinyin, description, searchText].map(normalize);
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/u).filter(Boolean);
  if (!tokens.length || !tokens.every((token) => fields.some((field) => field.includes(token)))) return null;
  let score = 0;
  if (fields[0] === normalizedQuery || fields[1] === normalizedQuery || fields[2] === normalizedQuery) score += 1000;
  if (fields[0].startsWith(normalizedQuery) || fields[1].startsWith(normalizedQuery) || fields[2].startsWith(normalizedQuery)) score += 450;
  if (fields[0].includes(normalizedQuery) || fields[1].includes(normalizedQuery) || fields[2].includes(normalizedQuery)) score += 220;
  for (const token of tokens) {
    if (fields[0].includes(token)) score += 80;
    if (fields[1].includes(token)) score += 85;
    if (fields[2].includes(token)) score += 70;
    if (fields[3].includes(token)) score += 30;
    if (fields[4].includes(token)) score += 10;
  }
  score -= en.length / 100;
  return { entry: [slug, en, zh, pinyin, description, searchText], score };
}

function renderEntries(element, entries) {
  element.innerHTML = entries.map(([slug, en, zh, , description]) => `<li data-person-row>
    <a href="${encodeURIComponent(slug)}.html">
      <span>${escapeHtml(en)}</span>
      <span lang="zh-Hant">${escapeHtml(zh)}</span>
      <span>${escapeHtml(description)}</span>
    </a>
  </li>`).join('');
}

async function main() {
  const input = document.getElementById('people-search-input');
  const results = document.getElementById('people-search-results');
  const status = document.getElementById('people-search-status');
  if (!input || !results || !status) return;

  let entries;
  try {
    entries = await loadEntries();
  } catch {
    status.textContent = 'People search is temporarily unavailable.';
    return;
  }

  const apply = () => {
    const query = input.value.trim();
    let matches;
    let total;
    if (!query) {
      matches = entries.slice(0, MAX_RESULTS);
      total = entries.length;
    } else {
      const scored = entries.map((entry) => scoreEntry(entry, query)).filter(Boolean);
      total = scored.length;
      matches = scored
      .sort((left, right) => right.score - left.score || left.entry[1].localeCompare(right.entry[1], 'en'))
      .slice(0, MAX_RESULTS)
      .map((result) => result.entry);
    }
    renderEntries(results, matches);
    status.textContent = total === 0
      ? 'No matching individuals.'
      : `${total.toLocaleString('en-US')} individual${total === 1 ? '' : 's'}${total > MAX_RESULTS ? ` · first ${MAX_RESULTS} shown` : ''}`;
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  };

  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 80);
  });
  const initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery) input.value = initialQuery;
  apply();
}

main();
