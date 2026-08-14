const CHRONOLOGICAL_ORDER = [
    'shiji',
    'hanshu',
    'houhanshu',
    'sanguozhi',
    'jinshu',
    'songshu',
    'nanqishu',
    'liangshu',
    'chenshu',
    'weishu',
    'beiqishu',
    'zhoushu',
    'suishu',
    'nanshi',
    'beishi',
    'jiutangshu',
    'xintangshu',
    'jiuwudaishi',
    'xinwudaishi',
    'songshi',
    'liaoshi',
    'jinshi',
    'yuanshi',
    'mingshi'
];

const OTHER_WORKS_ORDER = ['zizhitongjian', 'qingshigao'];
const VALID_STATES = new Set(['current', 'rereview', 'missing']);
const STATE_LABELS = {
    current: 'Current pass complete',
    rereview: 'Needs rereview',
    missing: 'Not started'
};

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function loadJson(url) {
    const delays = [0, 300, 900];
    let lastError;
    for (const delay of delays) {
        if (delay) await sleep(delay);
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (response.ok) return response.json();
            const retryable = response.status === 429 || response.status >= 500;
            lastError = new Error(`Could not load ${url}: HTTP ${response.status}`);
            if (!retryable) throw lastError;
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError;
}

function requireCondition(condition, message) {
    if (!condition) throw new Error(`Glossary progress data error: ${message}`);
}

function formatInteger(value) {
    return Number(value || 0).toLocaleString();
}

function formatPercent(value) {
    return `${Number(value || 0).toFixed(1)}%`;
}

function metric(label, value, note) {
    const item = document.createElement('div');
    item.className = 'corpus-metric';

    const labelElement = document.createElement('div');
    labelElement.className = 'corpus-metric-label';
    labelElement.textContent = label;

    const valueElement = document.createElement('div');
    valueElement.className = 'corpus-metric-value';
    valueElement.textContent = formatInteger(value);

    const noteElement = document.createElement('div');
    noteElement.className = 'corpus-metric-note';
    noteElement.textContent = note;

    item.append(labelElement, valueElement, noteElement);
    return item;
}

function validateSummary(summary) {
    requireCondition(summary && typeof summary === 'object', 'missing peopleGlossary summary');
    const integerFields = [
        'currentPromptVersion',
        'sourceChapters',
        'extractedChapters',
        'currentChapters',
        'rereviewChapters',
        'missingChapters',
        'peopleRecords',
        'factClaims',
        'familyRelationships',
        'attestations',
        'appliedTranslationRepairs',
        'pendingTranslationRepairs'
    ];
    for (const field of integerFields) {
        requireCondition(Number.isInteger(summary[field]) && summary[field] >= 0, `invalid ${field}`);
    }
    requireCondition(
        summary.sourceChapters === summary.currentChapters + summary.rereviewChapters + summary.missingChapters,
        'chapter state counts do not add up'
    );
    requireCondition(
        summary.extractedChapters === summary.currentChapters + summary.rereviewChapters,
        'extracted chapter count is inconsistent'
    );
}

function renderOverview(summary) {
    validateSummary(summary);
    const percent = summary.sourceChapters > 0
        ? (summary.currentChapters / summary.sourceChapters) * 100
        : 0;
    const rereviewPercent = summary.sourceChapters > 0
        ? (summary.rereviewChapters / summary.sourceChapters) * 100
        : 0;

    document.getElementById('coverage-percent').textContent = formatPercent(percent);
    document.getElementById('coverage-current').style.width = `${percent}%`;
    document.getElementById('coverage-rereview').style.width = `${rereviewPercent}%`;
    document.getElementById('coverage-track').setAttribute('aria-valuenow', percent.toFixed(1));

    const metrics = document.getElementById('corpus-metrics');
    metrics.replaceChildren(
        metric('Current chapters', summary.currentChapters, `Complete under prompt v${summary.currentPromptVersion}.`),
        metric('Needs rereview', summary.rereviewChapters, 'Extracted under an earlier contract.'),
        metric('Not started', summary.missingChapters, 'Awaiting the full glossary pass.'),
        metric('Individual records', summary.peopleRecords, 'Chapter-local people gathered so far.'),
        metric('Historical facts', summary.factClaims, `${formatInteger(summary.attestations)} dated attestations recorded.`),
        metric('Translation fixes', summary.appliedTranslationRepairs, 'Editorial repairs applied during extraction.')
    );

    const publicationNote = document.getElementById('publication-note');
    publicationNote.textContent = summary.missingChapters === 0 && summary.rereviewChapters === 0
        ? 'Chapter extraction is complete. Cross-book identity resolution remains part of the publication gate.'
        : `People pages and chapter links remain unpublished until all chapters are current and cross-book identities are resolved. ${formatInteger(summary.familyRelationships)} family relationships have been recorded so far.`;
    if (summary.pendingTranslationRepairs > 0) {
        publicationNote.textContent += ` ${formatInteger(summary.pendingTranslationRepairs)} proposed translation repairs still await editorial review.`;
    }
}

function chapterTitle(chapter) {
    if (typeof chapter.title === 'string') return chapter.title;
    return chapter.title?.en || chapter.title?.zh || `Chapter ${chapter.chapter}`;
}

function chapterTooltip(chapter, people) {
    const lines = [
        `${chapter.chapter}: ${chapterTitle(chapter)}`,
        `Glossary: ${STATE_LABELS[people.state]}`
    ];
    if (people.state !== 'missing') {
        lines.push(
            `Named records: ${formatInteger(people.peopleRecords)}`,
            `Facts: ${formatInteger(people.factClaims)}`,
            `Dated attestations: ${formatInteger(people.attestations)}`,
            `Family relationships: ${formatInteger(people.familyRelationships)}`,
            `Translation fixes applied: ${formatInteger(people.appliedTranslationRepairs)}`,
            `Extraction prompt: v${people.promptVersion}`
        );
    }
    return lines.join('\n');
}

function bookStats(book) {
    const stats = { current: 0, rereview: 0, missing: 0, people: 0, facts: 0 };
    for (const chapter of book.chapters || []) {
        const people = chapter.peopleGlossary;
        requireCondition(people && VALID_STATES.has(people.state), `invalid chapter state in ${chapter.chapter}`);
        stats[people.state] += 1;
        stats.people += Number(people.peopleRecords || 0);
        stats.facts += Number(people.factClaims || 0);
    }
    stats.total = stats.current + stats.rereview + stats.missing;
    return stats;
}

function statItem(state, text) {
    const item = document.createElement('span');
    item.className = 'book-stat';
    const swatch = document.createElement('i');
    swatch.className = `status-swatch ${state}`;
    const label = document.createElement('span');
    label.textContent = text;
    item.append(swatch, label);
    return item;
}

function createBookSection(bookId, book) {
    requireCondition(Array.isArray(book.chapters), `${bookId} has no chapter list`);
    const stats = bookStats(book);
    const percent = stats.total > 0 ? (stats.current / stats.total) * 100 : 0;
    const section = document.createElement('section');
    section.className = 'book-progress-section';
    section.id = `book-progress-${bookId}`;

    const header = document.createElement('div');
    header.className = 'book-progress-header';
    const identity = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'book-progress-title';
    title.textContent = book.name;
    const subtitle = document.createElement('div');
    subtitle.className = 'book-subtitle';
    subtitle.textContent = [book.chinese, book.pinyin ? `(${book.pinyin})` : '', book.dynasty].filter(Boolean).join(' ');
    identity.append(title, subtitle);
    const percentElement = document.createElement('div');
    percentElement.className = 'book-progress-percent';
    percentElement.textContent = formatPercent(percent);
    header.append(identity, percentElement);

    const statsRow = document.createElement('div');
    statsRow.className = 'book-progress-stats';
    statsRow.append(
        statItem('current', `${formatInteger(stats.current)} current`),
        statItem('rereview', `${formatInteger(stats.rereview)} need rereview`),
        statItem('missing', `${formatInteger(stats.missing)} not started`)
    );
    const records = document.createElement('span');
    records.textContent = `${formatInteger(stats.people)} individual records · ${formatInteger(stats.facts)} facts`;
    statsRow.append(records);

    const grid = document.createElement('div');
    grid.className = 'chapter-progress-grid';
    for (const chapter of book.chapters) {
        const people = chapter.peopleGlossary;
        const tooltip = chapterTooltip(chapter, people);
        const square = document.createElement('a');
        square.className = `chapter-progress-square ${people.state}`;
        square.href = `${bookId}/${chapter.chapter}.html`;
        square.dataset.tooltip = tooltip;
        square.title = tooltip.replaceAll('\n', ' | ');
        square.setAttribute('aria-label', tooltip.replaceAll('\n', '. '));
        grid.append(square);
    }

    section.append(header, statsRow, grid);
    return section;
}

function appendBookGroup(container, heading, bookIds, books) {
    const groupHeading = document.createElement('h3');
    groupHeading.className = 'progress-group-heading';
    groupHeading.textContent = heading;
    container.append(groupHeading);
    for (const bookId of bookIds) {
        requireCondition(books.has(bookId), `missing progress chunk for ${bookId}`);
        container.append(createBookSection(bookId, books.get(bookId)));
    }
}

async function init() {
    const loading = document.getElementById('loading');
    const progressContent = document.getElementById('progress-content');
    const loadingStatus = document.getElementById('books-loading-status');
    try {
        const index = await loadJson('data/progress.json');
        requireCondition(index.chunked === true && index.bookChunks, 'progress index is not chunked');
        renderOverview(index.peopleGlossary);

        const allBookIds = [...CHRONOLOGICAL_ORDER, ...OTHER_WORKS_ORDER];
        requireCondition(Object.keys(index.bookChunks).length === allBookIds.length, 'book chunk count does not match the corpus');
        loading.textContent = 'Loading chapter ledger...';

        let loadedCount = 0;
        const entries = await Promise.all(allBookIds.map(async bookId => {
            const chunkUrl = index.bookChunks[bookId];
            requireCondition(typeof chunkUrl === 'string', `missing chunk URL for ${bookId}`);
            const chunk = await loadJson(chunkUrl);
            loadedCount += 1;
            loadingStatus.textContent = `Loaded ${loadedCount} of ${allBookIds.length} works`;
            requireCondition(chunk.bookId === bookId && chunk.book, `invalid progress chunk for ${bookId}`);
            return [bookId, chunk.book];
        }));

        const books = new Map(entries);
        const container = document.getElementById('books-container');
        appendBookGroup(container, 'Twenty-Four Histories', CHRONOLOGICAL_ORDER, books);
        appendBookGroup(container, 'Other Works', OTHER_WORKS_ORDER, books);
        loadingStatus.textContent = '';

        const updated = new Date(index.generatedAt);
        requireCondition(!Number.isNaN(updated.getTime()), 'generatedAt is invalid');
        document.getElementById('last-updated').textContent = `Last updated ${updated.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`;

        loading.hidden = true;
        progressContent.hidden = false;
    } catch (error) {
        console.error(error);
        loading.textContent = 'Glossary progress could not be loaded. Please try again shortly.';
        loadingStatus.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', init);
