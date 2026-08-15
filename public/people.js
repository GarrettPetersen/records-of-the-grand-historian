const SEARCH_ROOT = '/data/people/search';
const MAX_RESULTS = 120;
const FETCH_RETRIES = 2;
const FETCH_BACKOFF_MS = 250;

const FIELD = Object.freeze({
  slug: 0,
  en: 1,
  zh: 2,
  pinyin: 3,
  description: 4,
  searchText: 5,
  chronology: 6,
  roles: 7,
  sources: 8,
  passages: 9,
  period: 10,
  directory: 11,
});

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
        const error = new Error(`People search request failed with HTTP ${response.status}`);
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
  throw lastError || new Error('People search data request failed');
}

async function loadEntries() {
  const index = await fetchJsonWithRetry(`${SEARCH_ROOT}/index.json`);
  if (index.v !== 3 || !Array.isArray(index.parts) || index.parts.length === 0) {
    throw new Error('Unsupported people search index');
  }
  const parts = await Promise.all(index.parts.map((part) =>
    fetchJsonWithRetry(`${SEARCH_ROOT}/${encodeURIComponent(part.file)}`)
  ));
  const entries = parts.flatMap((part) => {
    if (part.v !== 3 || !Array.isArray(part.entries)) throw new Error('Invalid people search shard');
    return part.entries;
  });
  if (entries.length !== index.people) {
    throw new Error(`People search index expected ${index.people}, found ${entries.length}`);
  }
  return entries;
}

function scoreEntry(entry, query) {
  const nameFields = [entry[FIELD.en], entry[FIELD.zh], entry[FIELD.pinyin]].map(normalize);
  const fields = [
    entry[FIELD.en],
    entry[FIELD.zh],
    entry[FIELD.pinyin],
    entry[FIELD.description],
    entry[FIELD.searchText],
    entry[FIELD.chronology],
  ].map(normalize);
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/u).filter(Boolean);
  if (!tokens.length) return 0;
  if (!tokens.every((token) => fields.some((field) => field.includes(token)))) return null;
  if (nameFields.slice(0, 2).some((field) => field === normalizedQuery)) return 1000;
  if (nameFields.some((field) => field.startsWith(normalizedQuery))) return 800;
  if (nameFields.some((field) => field.includes(normalizedQuery))) return 600;
  if (tokens.every((token) => nameFields.some((field) => field.includes(token)))) return 400;
  if (fields[3].includes(normalizedQuery) || fields[5].includes(normalizedQuery)) return 200;
  return 100;
}

function matchesFilters(entry, filters) {
  return (!filters.period || entry[FIELD.period] === filters.period) &&
    (!filters.role || entry[FIELD.roles].includes(filters.role)) &&
    (!filters.source || entry[FIELD.sources].includes(filters.source)) &&
    (!filters.letter || entry[FIELD.directory] === filters.letter);
}

function renderEntries(element, entries) {
  element.innerHTML = entries.map((entry) => `<li class="people-card" data-person-row>
    <a href="${encodeURIComponent(entry[FIELD.slug])}.html">
      <span class="people-card-name">${escapeHtml(entry[FIELD.en])}</span>
      ${entry[FIELD.zh] ? `<span class="people-card-zh" lang="zh-Hant">${escapeHtml(entry[FIELD.zh])}</span>` : ''}
      <span class="people-card-life">${escapeHtml(entry[FIELD.chronology])}</span>
      <span class="people-card-description">${escapeHtml(entry[FIELD.description])}</span>
      <span class="people-card-meta">${Number(entry[FIELD.passages]).toLocaleString('en-US')} passage${entry[FIELD.passages] === 1 ? '' : 's'}</span>
    </a>
  </li>`).join('');
}

function currentFilters(elements) {
  return {
    query: elements.input.value.trim(),
    period: elements.period.value,
    role: elements.role.value,
    source: elements.source.value,
    sort: elements.sort.value,
    letter: elements.letter,
  };
}

function syncUrl(filters) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries({
    q: filters.query,
    period: filters.period,
    role: filters.role,
    source: filters.source,
    sort: filters.sort === 'relevance' ? '' : filters.sort,
    letter: filters.letter,
  })) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(null, '', url);
}

function restoreUrl(elements) {
  const params = new URLSearchParams(window.location.search);
  elements.input.value = params.get('q') ?? '';
  elements.letter = params.get('letter') ?? '';
  for (const [key, element] of [['period', elements.period], ['role', elements.role], ['source', elements.source], ['sort', elements.sort]]) {
    const value = params.get(key);
    if (value && [...element.options].some((option) => option.value === value)) element.value = value;
  }
}

async function main() {
  const elements = {
    input: document.getElementById('people-search-input'),
    results: document.getElementById('people-search-results'),
    status: document.getElementById('people-search-status'),
    clear: document.getElementById('people-search-clear'),
    period: document.getElementById('people-period-filter'),
    role: document.getElementById('people-role-filter'),
    source: document.getElementById('people-source-filter'),
    sort: document.getElementById('people-sort'),
  };
  if (Object.values(elements).some((element) => !element)) return;
  elements.letter = '';

  restoreUrl(elements);
  let entries;
  try {
    entries = await loadEntries();
  } catch (error) {
    console.error(error);
    elements.status.textContent = 'People search could not load. Use the period, role, source, or A-Z links below.';
    return;
  }

  const apply = () => {
    const filters = currentFilters(elements);
    const scored = [];
    for (const entry of entries) {
      if (!matchesFilters(entry, filters)) continue;
      const score = scoreEntry(entry, filters.query);
      if (score !== null) scored.push({ entry, score });
    }
    const order = filters.sort === 'relevance' && !filters.query ? 'documented' : filters.sort;
    scored.sort((left, right) => {
      if (order === 'documented') return right.entry[FIELD.passages] - left.entry[FIELD.passages] || left.entry[FIELD.en].localeCompare(right.entry[FIELD.en], 'en');
      if (order === 'az') return left.entry[FIELD.en].localeCompare(right.entry[FIELD.en], 'en');
      return right.score - left.score || right.entry[FIELD.passages] - left.entry[FIELD.passages] || left.entry[FIELD.en].localeCompare(right.entry[FIELD.en], 'en');
    });
    const total = scored.length;
    renderEntries(elements.results, scored.slice(0, MAX_RESULTS).map(({ entry }) => entry));
    elements.status.textContent = total === 0
      ? 'No matching people. Try fewer terms or clear a filter.'
      : `${total.toLocaleString('en-US')} ${total === 1 ? 'person' : 'people'}${total > MAX_RESULTS ? ` · first ${MAX_RESULTS} shown` : ''}`;
    elements.clear.hidden = !filters.query && !filters.period && !filters.role && !filters.source && !filters.letter && filters.sort === 'relevance';
    syncUrl(filters);
  };

  let timer = null;
  elements.input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 80);
  });
  for (const select of [elements.period, elements.role, elements.source, elements.sort]) {
    select.addEventListener('change', apply);
  }
  elements.clear.addEventListener('click', () => {
    elements.input.value = '';
    elements.period.value = '';
    elements.role.value = '';
    elements.source.value = '';
    elements.sort.value = 'relevance';
    elements.letter = '';
    apply();
    elements.input.focus();
  });
  apply();
}

main();
