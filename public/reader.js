import { BOOKS } from './app.js';

let glossary = {};
let currentHighlight = null;

async function loadGlossary() {
  try {
    const response = await fetch('/data/glossary.json');
    if (response.ok) {
      glossary = await response.json();
    }
  } catch (e) {
    console.error('Failed to load glossary:', e);
  }
}

function segmentChineseWords(text) {
  // Simple character-by-character segmentation
  // In production, you'd want a proper word segmenter
  return text.split('').filter(c => c.trim());
}

function createWordSpan(char, charIndex) {
  const span = document.createElement('span');
  span.className = 'word';
  span.textContent = char;
  span.dataset.char = char;
  span.dataset.charIndex = charIndex;
  
  span.addEventListener('mouseenter', showTooltip);
  span.addEventListener('mouseleave', hideTooltip);
  
  return span;
}

function showTooltip(e) {
  const char = e.target.dataset.char;
  const tooltip = document.getElementById('tooltip');
  
  // Find glossary entry for this character
  let entry = null;
  for (const [id, data] of Object.entries(glossary)) {
    if (data.text === char || data.text.includes(char)) {
      entry = data;
      break;
    }
  }
  
  if (!entry) {
    return;
  }
  
  tooltip.innerHTML = `
    <div class="pinyin">${entry.pinyin || ''}</div>
    <div><strong>${entry.text}</strong></div>
    <ul class="definitions">
      ${entry.definitions.map(def => `<li>${def}</li>`).join('')}
    </ul>
  `;
  
  const rect = e.target.getBoundingClientRect();
  tooltip.style.display = 'block';
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = (rect.bottom + 5) + 'px';
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  tooltip.style.display = 'none';
}

function createSentenceElement(sentence, lang, sentenceId) {
  const div = document.createElement('div');
  div.className = 'sentence';
  div.dataset.sentenceId = sentenceId;
  
  if (lang === 'zh') {
    // Segment into words with hover tooltips
    const chars = segmentChineseWords(sentence.zh);
    chars.forEach((char, idx) => {
      div.appendChild(createWordSpan(char, idx));
    });
  } else {
    // English text
    const translation = sentence.translations && sentence.translations[0];
    div.textContent = translation?.text || '(No translation available)';
    if (!translation?.text) {
      div.style.fontStyle = 'italic';
      div.style.color = '#999';
    }
  }
  
  // Add hover and click handlers for highlighting
  div.addEventListener('mouseenter', () => highlightSentence(sentenceId));
  div.addEventListener('mouseleave', () => {
    if (currentHighlight !== sentenceId) {
      unhighlightSentence(sentenceId);
    }
  });
  div.addEventListener('click', () => toggleHighlight(sentenceId));
  
  return div;
}

function highlightSentence(sentenceId) {
  const zhSentence = document.querySelector(`.chinese-pane [data-sentence-id="${sentenceId}"]`);
  const enSentence = document.querySelector(`.english-pane [data-sentence-id="${sentenceId}"]`);
  
  if (zhSentence) zhSentence.classList.add('highlighted');
  if (enSentence) enSentence.classList.add('highlighted');
}

function unhighlightSentence(sentenceId) {
  const zhSentence = document.querySelector(`.chinese-pane [data-sentence-id="${sentenceId}"]`);
  const enSentence = document.querySelector(`.english-pane [data-sentence-id="${sentenceId}"]`);
  
  if (zhSentence) zhSentence.classList.remove('highlighted');
  if (enSentence) enSentence.classList.remove('highlighted');
}

function toggleHighlight(sentenceId) {
  if (currentHighlight === sentenceId) {
    // Unclick
    unhighlightSentence(sentenceId);
    currentHighlight = null;
  } else {
    // Clear previous highlight
    if (currentHighlight) {
      unhighlightSentence(currentHighlight);
    }
    // Set new highlight
    highlightSentence(sentenceId);
    currentHighlight = sentenceId;
  }
}

function createParagraphElement(block, lang, paragraphIdx) {
  const paraDiv = document.createElement('div');
  paraDiv.className = 'paragraph';
  paraDiv.dataset.paragraphId = `p${paragraphIdx}`;
  
  for (const sentence of block.sentences) {
    const sentenceSpan = document.createElement('span');
    sentenceSpan.className = 'sentence';
    sentenceSpan.dataset.sentenceId = sentence.id;
    
    if (lang === 'zh') {
      // Segment into words with hover tooltips
      const chars = segmentChineseWords(sentence.zh);
      chars.forEach((char, idx) => {
        sentenceSpan.appendChild(createWordSpan(char, idx));
      });
    } else {
      // English text
      const translation = sentence.translations && sentence.translations[0];
      sentenceSpan.textContent = translation?.text || '';
      if (!translation?.text) {
        sentenceSpan.style.fontStyle = 'italic';
        sentenceSpan.style.color = '#999';
      }
    }
    
    // Add hover and click handlers for highlighting
    sentenceSpan.addEventListener('mouseenter', () => highlightSentence(sentence.id));
    sentenceSpan.addEventListener('mouseleave', () => {
      if (currentHighlight !== sentence.id) {
        unhighlightSentence(sentence.id);
      }
    });
    sentenceSpan.addEventListener('click', () => toggleHighlight(sentence.id));
    
    paraDiv.appendChild(sentenceSpan);
    
    // Add space between sentences in English
    if (lang === 'en') {
      paraDiv.appendChild(document.createTextNode(' '));
    }
  }
  
  return paraDiv;
}

async function renderReader() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('book');
  const chapter = params.get('chapter');
  
  if (!bookId || !chapter || !BOOKS[bookId]) {
    document.getElementById('loading').textContent = 'Invalid parameters';
    return;
  }
  
  const bookInfo = BOOKS[bookId];
  
  // Load glossary and chapter data in parallel
  await Promise.all([
    loadGlossary(),
    (async () => {
      const response = await fetch(`/data/${bookId}/${chapter}.json`);
      if (!response.ok) {
        throw new Error('Chapter not found');
      }
      return response.json();
    })()
  ]).then(([_, chapterData]) => {
    // Update header
    document.title = `${chapterData.meta.title.zh} - ${bookInfo.chinese}`;
    document.getElementById('chapter-title').textContent = chapterData.meta.title.zh;
    document.getElementById('chapter-subtitle').textContent = chapterData.meta.title.en || '';
    
    // Render content
    const zhContent = document.getElementById('chinese-content');
    const enContent = document.getElementById('english-content');
    
    let paragraphIdx = 0;
    for (const block of chapterData.content) {
      if (block.type === 'paragraph') {
        zhContent.appendChild(createParagraphElement(block, 'zh', paragraphIdx));
        enContent.appendChild(createParagraphElement(block, 'en', paragraphIdx));
        paragraphIdx++;
      }
    }
    
    // Show reader
    document.getElementById('loading').style.display = 'none';
    document.querySelector('.reader-container').style.display = 'flex';
  }).catch(err => {
    document.getElementById('loading').textContent = `Error: ${err.message}`;
  });
}

// Synchronized scrolling between panes
let isSyncing = false;

function syncScroll(source, target) {
  if (isSyncing) return;
  isSyncing = true;
  
  const sourceMax = source.scrollHeight - source.clientHeight;
  const targetMax = target.scrollHeight - target.clientHeight;
  
  if (sourceMax > 0) {
    const scrollRatio = source.scrollTop / sourceMax;
    target.scrollTop = scrollRatio * targetMax;
  }
  
  requestAnimationFrame(() => {
    isSyncing = false;
  });
}

function setupSyncScroll() {
  const zhPane = document.querySelector('.chinese-pane');
  const enPane = document.querySelector('.english-pane');
  
  if (zhPane && enPane) {
    zhPane.addEventListener('scroll', () => {
      syncScroll(zhPane, enPane);
      hideTooltip();
    });
    enPane.addEventListener('scroll', () => {
      syncScroll(enPane, zhPane);
      hideTooltip();
    });
  }
}

// Close tooltip on scroll
window.addEventListener('scroll', hideTooltip);

renderReader().then(setupSyncScroll);
