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
    
    // Render content with aligned paragraphs
    const readerContainer = document.querySelector('.reader-container');
    
    // Clear existing content
    readerContainer.innerHTML = '';
    
    // Create wrapper for Chinese pane
    const zhPane = document.createElement('div');
    zhPane.className = 'pane chinese-pane';
    zhPane.innerHTML = '<h3>原文 (Original Text)</h3>';
    const zhContent = document.createElement('div');
    zhContent.id = 'chinese-content';
    zhPane.appendChild(zhContent);
    
    // Create wrapper for English pane
    const enPane = document.createElement('div');
    enPane.className = 'pane english-pane';
    enPane.innerHTML = '<h3>English Translation</h3>';
    const enContent = document.createElement('div');
    enContent.id = 'english-content';
    enPane.appendChild(enContent);
    
    readerContainer.appendChild(zhPane);
    readerContainer.appendChild(enPane);
    
    let paragraphIdx = 0;
    for (const block of chapterData.content) {
      if (block.type === 'paragraph') {
        const zhPara = createParagraphElement(block, 'zh', paragraphIdx);
        const enPara = createParagraphElement(block, 'en', paragraphIdx);
        
        // Add matching data attributes for alignment
        zhPara.dataset.paraIndex = paragraphIdx;
        enPara.dataset.paraIndex = paragraphIdx;
        
        zhContent.appendChild(zhPara);
        enContent.appendChild(enPara);
        paragraphIdx++;
      }
    }
    
    // Show reader
    document.getElementById('loading').style.display = 'none';
    readerContainer.style.display = 'flex';
  }).catch(err => {
    document.getElementById('loading').textContent = `Error: ${err.message}`;
  });
}

// Synchronized scrolling between panes based on sentence alignment
let isSyncing = false;

function syncScroll(source, target) {
  if (isSyncing) return;
  isSyncing = true;
  
  // Find the first visible sentence in the source pane
  const sourceRect = source.getBoundingClientRect();
  const sourceSentences = source.querySelectorAll('.sentence[data-sentence-id]');
  
  let visibleSentenceId = null;
  for (const sentence of sourceSentences) {
    const rect = sentence.getBoundingClientRect();
    if (rect.top >= sourceRect.top && rect.top <= sourceRect.bottom) {
      visibleSentenceId = sentence.dataset.sentenceId;
      break;
    }
  }
  
  // Scroll target to show the same sentence
  if (visibleSentenceId) {
    const targetSentence = target.querySelector(`[data-sentence-id="${visibleSentenceId}"]`);
    if (targetSentence) {
      const targetRect = target.getBoundingClientRect();
      const sentenceRect = targetSentence.getBoundingClientRect();
      const offset = sentenceRect.top - targetRect.top;
      target.scrollTop += offset;
    }
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

// View controls
function setupViewControls() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const zhPane = document.querySelector('.chinese-pane');
  const enPane = document.querySelector('.english-pane');
  
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active button
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Toggle pane visibility
      if (view === 'both') {
        zhPane.classList.remove('collapsed');
        enPane.classList.remove('collapsed');
        zhPane.style.maxWidth = '50%';
        enPane.style.maxWidth = '50%';
      } else if (view === 'chinese') {
        zhPane.classList.remove('collapsed');
        enPane.classList.add('collapsed');
        zhPane.style.maxWidth = '100%';
      } else if (view === 'english') {
        zhPane.classList.add('collapsed');
        enPane.classList.remove('collapsed');
        enPane.style.maxWidth = '100%';
      }
    });
  });
}

// Align corresponding paragraphs
function alignParagraphs() {
  const zhParas = document.querySelectorAll('.chinese-pane .paragraph');
  const enParas = document.querySelectorAll('.english-pane .paragraph');
  
  for (let i = 0; i < Math.min(zhParas.length, enParas.length); i++) {
    const zhPara = zhParas[i];
    const enPara = enParas[i];
    
    // Reset heights
    zhPara.style.minHeight = '';
    enPara.style.minHeight = '';
    
    // Get natural heights
    const zhHeight = zhPara.offsetHeight;
    const enHeight = enPara.offsetHeight;
    
    // Set both to the maximum height
    const maxHeight = Math.max(zhHeight, enHeight);
    zhPara.style.minHeight = maxHeight + 'px';
    enPara.style.minHeight = maxHeight + 'px';
  }
}

// Close tooltip on scroll
window.addEventListener('scroll', hideTooltip);

renderReader().then(() => {
  setupSyncScroll();
  setupViewControls();
  
  // Align paragraphs after rendering
  setTimeout(() => {
    alignParagraphs();
  }, 100);
  
  // Re-align on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(alignParagraphs, 250);
  });
});
