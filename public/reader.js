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
  
  // Add cite button for English paragraphs only
  if (lang === 'en') {
    const citeBtn = document.createElement('button');
    citeBtn.className = 'cite-paragraph-btn';
    citeBtn.textContent = '📋 Cite';
    citeBtn.title = 'Cite this paragraph';
    citeBtn.onclick = (e) => {
      e.stopPropagation();
      openCitationModal('paragraph', paragraphIdx, block);
    };
    paraDiv.appendChild(citeBtn);
  }
  
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
    // Store globally for citations
    currentChapterData = chapterData;
    currentBookInfo = bookInfo;
    
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

// Citation functionality
let currentChapterData = null;
let currentBookInfo = null;

function getTranslatorInfo(block) {
  // Get translator from first sentence's translation
  if (block.sentences && block.sentences.length > 0) {
    const firstTranslation = block.sentences[0].translations?.[0];
    if (firstTranslation?.translator) {
      return firstTranslation.translator;
    }
  }
  return null;
}

function formatDate() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

function generateChicagoCitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterTitle = currentChapterData.meta.title.zh;
  const bookTitle = currentBookInfo.chinese;
  const author = currentBookInfo.author || 'Unknown';
  
  if (type === 'chapter') {
    // For chapter citations, check if there's a custom citation in metadata
    const citation = currentChapterData.meta.citation;
    if (citation && citation.includes('Partial translation')) {
      // Mixed translators - use custom citation format
      return `${author}. ${chapterTitle}. Partial translation by Herbert J. Allen, Journal of the Royal Asiatic Society 26, no. 2 (1894): 269–295; remaining portions translated by Garrett M. Petersen, 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
    }
    const translator = getTranslatorInfo(currentChapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen')) {
      return `${author}. ${chapterTitle}. Translated by Herbert J. Allen. Journal of the Royal Asiatic Society 26, no. 2 (1894): 269–295. Accessed via 24 Histories, ${formatDate()}. ${url}.`;
    }
    return `${author}. ${bookTitle}. ${chapterTitle}. Translated by Garrett M. Petersen. 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
  } else {
    const translator = getTranslatorInfo(block);
    const paraNum = paragraphIdx + 1;
    if (translator && translator.includes('Herbert J. Allen')) {
      return `${author}. ${chapterTitle}, trans. Herbert J. Allen, Journal of the Royal Asiatic Society 26, no. 2 (1894): 269–295, §${paraNum}, accessed via 24 Histories, ${formatDate()}, ${url}.`;
    }
    return `${author}. ${bookTitle}. ${chapterTitle}, §${paraNum}. Translated by Garrett M. Petersen. 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
  }
}

function generateAPACitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterTitle = currentChapterData.meta.title.zh;
  const year = new Date().getFullYear();
  const author = currentBookInfo.author || 'Unknown';
  const authorLastName = author.split(' ').pop().charAt(0);
  
  if (type === 'chapter') {
    const citation = currentChapterData.meta.citation;
    if (citation && citation.includes('Partial translation')) {
      return `${author}. (1894/2025). ${chapterTitle} (H. J. Allen & G. M. Petersen, Trans.). 24 Histories. Retrieved from ${url}`;
    }
    const translator = getTranslatorInfo(currentChapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen')) {
      return `${author}. (1894). ${chapterTitle} (H. J. Allen, Trans.). Journal of the Royal Asiatic Society, 26(2), 269-295. Retrieved from ${url}`;
    }
    return `${author}. (2025). ${chapterTitle} (G. M. Petersen, Trans.). 24 Histories. Retrieved from ${url}`;
  } else {
    const paraNum = paragraphIdx + 1;
    const translator = getTranslatorInfo(block);
    if (translator && translator.includes('Herbert J. Allen')) {
      return `${author}. (1894). ${chapterTitle} (H. J. Allen, Trans.) (para. ${paraNum}). Journal of the Royal Asiatic Society, 26(2), 269-295. Retrieved from ${url}`;
    }
    return `${author}. (2025). ${chapterTitle} (G. M. Petersen, Trans.) (para. ${paraNum}). 24 Histories. Retrieved from ${url}`;
  }
}

function generateMLACitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterTitle = currentChapterData.meta.title.zh;
  const accessDate = formatDate();
  const author = currentBookInfo.author || 'Unknown';
  
  if (type === 'chapter') {
    const citation = currentChapterData.meta.citation;
    if (citation && citation.includes('Partial translation')) {
      return `${author}. "${chapterTitle}." Partial translation by Herbert J. Allen, Journal of the Royal Asiatic Society, vol. 26, no. 2, 1894, pp. 269-295; remaining portions translated by Garrett M. Petersen, 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
    }
    const translator = getTranslatorInfo(currentChapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen')) {
      return `${author}. "${chapterTitle}." Translated by Herbert J. Allen, Journal of the Royal Asiatic Society, vol. 26, no. 2, 1894, pp. 269-295. 24 Histories, ${url}. Accessed ${accessDate}.`;
    }
    return `${author}. "${chapterTitle}." Translated by Garrett M. Petersen, 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
  } else {
    const paraNum = paragraphIdx + 1;
    const translator = getTranslatorInfo(block);
    if (translator && translator.includes('Herbert J. Allen')) {
      return `${author}. "${chapterTitle}." Translated by Herbert J. Allen, Journal of the Royal Asiatic Society, vol. 26, no. 2, 1894, pp. 269-295, para. ${paraNum}. 24 Histories, ${url}. Accessed ${accessDate}.`;
    }
    return `${author}. "${chapterTitle}." Translated by Garrett M. Petersen, para. ${paraNum}. 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
  }
}

function generateBibTeXCitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterTitle = currentChapterData.meta.title.zh.replace(/[《》]/g, '');
  const year = new Date().getFullYear();
  const author = currentBookInfo.author || 'Unknown';
  const authorKey = author.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  
  if (type === 'chapter') {
    const citation = currentChapterData.meta.citation;
    if (citation && citation.includes('Partial translation')) {
      return `@misc{${authorKey}2025${currentChapterData.meta.chapter},
  author = {${author}},
  title = {${chapterTitle}},
  translator = {Herbert J. Allen and Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {1894/2025},
  url = {${url}},
  note = {Partial translation by Herbert J. Allen (1894), Journal of the Royal Asiatic Society 26(2): 269-295; remaining portions by Garrett M. Petersen (2025). Accessed ${formatDate()}}
}`;
    }
    const translator = getTranslatorInfo(currentChapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen')) {
      return `@article{${authorKey}1894${currentChapterData.meta.chapter},
  author = {${author}},
  title = {${chapterTitle}},
  journal = {Journal of the Royal Asiatic Society},
  year = {1894},
  volume = {26},
  number = {2},
  pages = {269--295},
  note = {Translated by Herbert J. Allen. Accessed via 24 Histories, ${url}},
  urldate = {${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}}
}`;
    }
    return `@misc{${authorKey}2025${currentChapterData.meta.chapter},
  author = {${author}},
  title = {${chapterTitle}},
  translator = {Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
  } else {
    const paraNum = paragraphIdx + 1;
    const translator = getTranslatorInfo(block);
    if (translator && translator.includes('Herbert J. Allen')) {
      return `@article{${authorKey}1894${currentChapterData.meta.chapter}p${paraNum},
  author = {${author}},
  title = {${chapterTitle}, para. ${paraNum}},
  journal = {Journal of the Royal Asiatic Society},
  year = {1894},
  volume = {26},
  number = {2},
  pages = {269--295},
  note = {Translated by Herbert J. Allen. Accessed via 24 Histories, ${url}},
  urldate = {${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}}
}`;
    }
    return `@misc{${authorKey}2025${currentChapterData.meta.chapter}p${paraNum},
  author = {${author}},
  title = {${chapterTitle}, para. ${paraNum}},
  translator = {Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
  }
}

function generateCitation(format, type, paragraphIdx, block) {
  switch(format) {
    case 'chicago':
      return generateChicagoCitation(type, paragraphIdx, block);
    case 'apa':
      return generateAPACitation(type, paragraphIdx, block);
    case 'mla':
      return generateMLACitation(type, paragraphIdx, block);
    case 'bibtex':
      return generateBibTeXCitation(type, paragraphIdx, block);
    default:
      return '';
  }
}

function openCitationModal(type, paragraphIdx = null, block = null) {
  const modal = document.getElementById('citation-modal');
  const title = document.getElementById('citation-title');
  const citationText = document.getElementById('citation-text');
  
  title.textContent = type === 'chapter' ? 'Cite this Chapter' : `Cite Paragraph ${paragraphIdx + 1}`;
  
  // Store citation context
  modal.dataset.citationType = type;
  modal.dataset.paragraphIdx = paragraphIdx;
  if (block) {
    modal.dataset.blockData = JSON.stringify(block);
  }
  
  // Generate initial citation (Chicago)
  const initialCitation = generateCitation('chicago', type, paragraphIdx, block);
  citationText.value = initialCitation;
  
  // Set active tab
  document.querySelectorAll('.citation-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.format === 'chicago') {
      tab.classList.add('active');
    }
  });
  
  modal.style.display = 'flex';
}

function setupCitationModal() {
  const modal = document.getElementById('citation-modal');
  const closeBtn = document.getElementById('close-modal');
  const copyBtn = document.getElementById('copy-citation');
  const citationText = document.getElementById('citation-text');
  const tabs = document.querySelectorAll('.citation-tab');
  
  // Close modal
  closeBtn.onclick = () => modal.style.display = 'none';
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };
  
  // Copy citation
  copyBtn.onclick = () => {
    citationText.select();
    document.execCommand('copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  };
  
  // Tab switching
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const format = tab.dataset.format;
      const type = modal.dataset.citationType;
      const paragraphIdx = parseInt(modal.dataset.paragraphIdx);
      const block = modal.dataset.blockData ? JSON.parse(modal.dataset.blockData) : null;
      
      citationText.value = generateCitation(format, type, paragraphIdx, block);
    };
  });
  
  // Cite chapter button
  document.getElementById('cite-chapter-btn')?.addEventListener('click', () => {
    openCitationModal('chapter');
  });
}

// Close tooltip on scroll
window.addEventListener('scroll', hideTooltip);

// Make citation functions globally available for static pages
window.openCitationModal = openCitationModal;
window.setupCitationModal = setupCitationModal;
window.generateCitation = generateCitation;

// Initialize for dynamic reader pages
if (typeof renderReader === 'function') {
  renderReader().then(() => {
    setupSyncScroll();
    setupViewControls();
    setupCitationModal();
  });
} else {
  // For static pages, just set up citation modal
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('citation-modal')) {
      setupCitationModal();
    }
  });
}
