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
  const zhSentence = document.querySelector(`.paragraph.chinese [data-sentence-id="${sentenceId}"]`);
  const enSentence = document.querySelector(`.paragraph.english [data-sentence-id="${sentenceId}"]`);
  
  if (zhSentence) zhSentence.classList.add('highlighted');
  if (enSentence) enSentence.classList.add('highlighted');
}

function unhighlightSentence(sentenceId) {
  const zhSentence = document.querySelector(`.paragraph.chinese [data-sentence-id="${sentenceId}"]`);
  const enSentence = document.querySelector(`.paragraph.english [data-sentence-id="${sentenceId}"]`);
  
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
    
    // Render content with aligned paragraphs in grid
    const readerContent = document.getElementById('reader-content');
    
    let paragraphIdx = 0;
    for (const block of chapterData.content) {
      if (block.type === 'paragraph') {
        // Create Chinese paragraph
        const zhPara = createParagraphElement(block, 'zh', paragraphIdx);
        zhPara.classList.add('chinese');
        zhPara.dataset.paraIndex = paragraphIdx;
        
        // Create English paragraph
        const enPara = createParagraphElement(block, 'en', paragraphIdx);
        enPara.classList.add('english');
        enPara.dataset.paraIndex = paragraphIdx;
        
        // Add both to grid (they'll automatically be in the same row)
        readerContent.appendChild(zhPara);
        readerContent.appendChild(enPara);
        
        paragraphIdx++;
      }
    }
    
    // Show reader
    document.getElementById('loading').style.display = 'none';
    document.querySelector('.reader-wrapper').style.display = 'block';
  }).catch(err => {
    document.getElementById('loading').textContent = `Error: ${err.message}`;
  });
}

// Synchronized scrolling - simplified since grid keeps things aligned
function setupSyncScroll() {
  // With grid layout, scrolling is naturally synchronized
  // Just hide tooltip on scroll
  window.addEventListener('scroll', hideTooltip);
}

// View controls
function setupViewControls() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const readerWrapper = document.querySelector('.reader-wrapper');
  const readerContent = document.getElementById('reader-content');
  const readerHeader = document.querySelector('.reader-header');
  
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active button
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Remove all view classes
      readerWrapper.classList.remove('view-both', 'view-chinese', 'view-english');
      
      // Add appropriate class
      if (view === 'both') {
        readerWrapper.classList.add('view-both');
        readerContent.style.gridTemplateColumns = '1fr 1px 1fr';
        readerHeader.style.gridTemplateColumns = '1fr 1px 1fr';
        document.querySelectorAll('.paragraph.chinese, .paragraph.english').forEach(p => p.style.display = 'block');
        document.querySelectorAll('.column-header').forEach(h => h.style.display = 'block');
      } else if (view === 'chinese') {
        readerWrapper.classList.add('view-chinese');
        readerContent.style.gridTemplateColumns = '1fr';
        readerHeader.style.gridTemplateColumns = '1fr';
        document.querySelectorAll('.paragraph.chinese').forEach(p => p.style.display = 'block');
        document.querySelectorAll('.paragraph.english').forEach(p => p.style.display = 'none');
        document.querySelector('.chinese-header').style.display = 'block';
        document.querySelector('.english-header').style.display = 'none';
      } else if (view === 'english') {
        readerWrapper.classList.add('view-english');
        readerContent.style.gridTemplateColumns = '1fr';
        readerHeader.style.gridTemplateColumns = '1fr';
        document.querySelectorAll('.paragraph.chinese').forEach(p => p.style.display = 'none');
        document.querySelectorAll('.paragraph.english').forEach(p => p.style.display = 'block');
        document.querySelector('.chinese-header').style.display = 'none';
        document.querySelector('.english-header').style.display = 'block';
      }
    });
  });
}

// Close tooltip on scroll
window.addEventListener('scroll', hideTooltip);

renderReader().then(() => {
  setupSyncScroll();
  setupViewControls();
});
