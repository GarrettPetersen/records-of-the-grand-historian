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

  // Ensure glossary is loaded
  if (!glossary || Object.keys(glossary).length === 0) {
    return;
  }

  // Find the most relevant glossary entry for this character
  // Prioritize: exact match > longer terms containing this char > shorter terms
  let bestEntry = null;
  let bestScore = 0;

  for (const [id, data] of Object.entries(glossary)) {
    if (data.text === char) {
      // Exact match gets highest priority
      bestEntry = data;
      break;
    } else if (data.text.includes(char)) {
      // Multi-character term containing this char
      const score = data.text.length; // Prefer longer terms
      if (score > bestScore) {
        bestEntry = data;
        bestScore = score;
      }
    }
  }

  if (!bestEntry) {
    return;
  }

  // Set tooltip content
  tooltip.innerHTML = `
    <div class="pinyin">${bestEntry.pinyin || ''}</div>
    <div><strong>${bestEntry.text}</strong></div>
    <ul class="definitions">
      ${bestEntry.definitions.map(def => `<li>${def}</li>`).join('')}
    </ul>
  `;

  const targetRect = e.target.getBoundingClientRect();

  // Make tooltip temporarily visible to get its dimensions
  tooltip.style.display = 'block';
  tooltip.style.opacity = '0';
  tooltip.style.pointerEvents = 'none';

  // Get tooltip dimensions
  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width;
  const tooltipHeight = tooltipRect.height;

  // Calculate available space
  const spaceAbove = targetRect.top;
  const spaceBelow = window.innerHeight - targetRect.bottom;
  const spaceLeft = targetRect.left;
  const spaceRight = window.innerWidth - targetRect.right;

  // Determine best position (using viewport coordinates for position: fixed)
  let left, top;

  // Try to position below first (preferred)
  if (spaceBelow >= tooltipHeight + 10) {
    // Enough space below
    top = targetRect.bottom + 5;
    left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
  } else if (spaceAbove >= tooltipHeight + 10) {
    // Not enough space below, but enough above
    top = targetRect.top - tooltipHeight - 5;
    left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
  } else {
    // Not enough space above or below, position to the side
    left = targetRect.right + 5;
    top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);

    // If not enough space on right, try left
    if (left + tooltipWidth > window.innerWidth && spaceLeft >= tooltipWidth + 10) {
      left = targetRect.left - tooltipWidth - 5;
    }
  }

  // Ensure tooltip stays within viewport bounds
  if (left < 10) {
    left = 10;
  }
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10;
  }
  if (top < 10) {
    top = 10;
  }
  if (top + tooltipHeight > window.innerHeight - 10) {
    top = window.innerHeight - tooltipHeight - 10;
  }

  // Set final position
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.style.opacity = '1';
  tooltip.style.pointerEvents = 'auto';
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  tooltip.style.opacity = '0';
  tooltip.style.pointerEvents = 'none';
  // Keep it visible but transparent for a brief moment to allow transition
  setTimeout(() => {
    tooltip.style.display = 'none';
  }, 100);
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
    div.textContent = (translation?.idiomatic || translation?.literal || translation?.text) || '(No translation available)';
    if (!(translation?.idiomatic || translation?.literal || translation?.text)) {
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
      sentenceSpan.textContent = (translation?.idiomatic || translation?.literal || translation?.text) || '';
      if (!(translation?.idiomatic || translation?.literal || translation?.text)) {
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
  // Check if we're on a static page with embedded data
  if (window.currentChapterData && window.currentBookInfo) {
    // Static page - initialize interactive functionality
    await loadGlossary();
    initializeInteractiveFeatures();
    return;
  }

  // Dynamic reader page
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

// Use window variables if local ones aren't set (for static pages)
function getCurrentChapterData() {
  return currentChapterData || window.currentChapterData;
}

function getCurrentBookInfo() {
  return currentBookInfo || window.currentBookInfo;
}

function getTranslatorInfo(block) {
  // Get translator from first sentence's translation
  // Only count modern translations (idiomatic/literal), not legacy text field
  if (block.sentences && block.sentences.length > 0) {
    const firstTranslation = block.sentences[0].translations?.[0];
    if (firstTranslation?.translator && (firstTranslation.idiomatic || firstTranslation.literal)) {
      return firstTranslation.translator;
    }
  }
  return null;
}

function hasModernTranslations(chapterData) {
  // Check if chapter has any modern translations (idiomatic/literal fields)
  for (const block of chapterData.content) {
    if (block.type === 'paragraph' && block.sentences) {
      for (const sentence of block.sentences) {
        const trans = sentence.translations?.[0];
        if (trans && (trans.idiomatic || trans.literal)) {
          return true;
        }
      }
    } else if (block.type === 'table_row' && block.cells) {
      for (const cell of block.cells) {
        if (cell.idiomatic || cell.literal) {
          return true;
        }
      }
    }
  }
  return false;
}

function formatDate() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

function generateChicagoCitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterData = getCurrentChapterData();
  const bookInfo = getCurrentBookInfo();
  const chapterTitle = chapterData.meta.title.en || chapterData.meta.title.zh;
  const bookTitle = bookInfo.name;
  const author = bookInfo.author || 'Unknown';

  if (type === 'chapter') {
    // For chapter citations, check if there's a custom citation in metadata
    const citation = chapterData.meta.citation;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (citation && citation.includes('Partial translation')) {
      // Mixed translators - use custom citation format
      return `${author}. "${chapterTitle}." Partial translation by Herbert J. Allen, Journal of the Royal Asiatic Society 26, no. 2 (1894): 269–295; remaining portions translated by Garrett M. Petersen, 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
    }

    // Only credit Herbert J. Allen if there are also modern translations
    const translator = getTranslatorInfo(chapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `${author}. "${chapterTitle}." Partial translation by Herbert J. Allen, Journal of the Royal Asiatic Society 26, no. 2 (1894): 269–295; completed by Garrett M. Petersen, 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
    }

    // If chapter has modern translations, credit current translator
    if (hasModernTrans) {
      return `${author}. ${bookTitle}. "${chapterTitle}." Translated by Garrett M. Petersen. 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
    }

    // If chapter has only legacy translations, treat as untranslated
    return `${author}. ${bookTitle}. "${chapterTitle}." 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
  } else if (type === 'table') {
    const tableNum = paragraphIdx + 1;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (hasModernTrans) {
      return `${author}. ${bookTitle}. "${chapterTitle}," table ${tableNum}. Translated by Garrett M. Petersen. 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
    } else {
      return `${author}. ${bookTitle}. "${chapterTitle}," table ${tableNum}. 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
    }
  } else {
    const hasModernTrans = hasModernTranslations(chapterData);
    const translator = getTranslatorInfo(block);
    const paraNum = paragraphIdx + 1;

    // Only credit Herbert J. Allen if there are also modern translations
    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `${author}. "${chapterTitle}," trans. Herbert J. Allen, Journal of the Royal Asiatic Society 26, no. 2 (1894): 269–295; completed by Garrett M. Petersen, 24 Histories, 2025, §${paraNum}. ${url}. Accessed ${formatDate()}.`;
    }

    // If block has modern translations, credit current translator
    if (hasModernTrans) {
      return `${author}. ${bookTitle}. "${chapterTitle}," §${paraNum}. Translated by Garrett M. Petersen. 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
    }

    // If no modern translations, don't credit any translator
    return `${author}. ${bookTitle}. "${chapterTitle}," §${paraNum}. 24 Histories, 2025. ${url}. Accessed ${formatDate()}.`;
  }
}

function generateAPACitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterData = getCurrentChapterData();
  const bookInfo = getCurrentBookInfo();
  const chapterTitle = chapterData.meta.title.en || chapterData.meta.title.zh;
  const year = new Date().getFullYear();
  const author = bookInfo.author || 'Unknown';
  const authorLastName = author.split(' ').pop().charAt(0);
  
  if (type === 'chapter') {
    const citation = chapterData.meta.citation;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (citation && citation.includes('Partial translation')) {
      return `${author}. (1894/2025). ${chapterTitle} (H. J. Allen & G. M. Petersen, Trans.). 24 Histories. Retrieved from ${url}`;
    }

    const translator = getTranslatorInfo(chapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `${author}. (1894/2025). ${chapterTitle} (H. J. Allen & G. M. Petersen, Trans.). 24 Histories. Retrieved from ${url}`;
    }

    if (hasModernTrans) {
      return `${author}. (2025). ${chapterTitle} (G. M. Petersen, Trans.). 24 Histories. Retrieved from ${url}`;
    }

    return `${author}. (2025). ${chapterTitle}. 24 Histories. Retrieved from ${url}`;
  } else if (type === 'table') {
    const tableNum = paragraphIdx + 1;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (hasModernTrans) {
      return `${author}. (2025). ${chapterTitle} (G. M. Petersen, Trans.) [Table ${tableNum}]. 24 Histories. Retrieved from ${url}`;
    } else {
      return `${author}. (2025). ${chapterTitle} [Table ${tableNum}]. 24 Histories. Retrieved from ${url}`;
    }
  } else {
    const hasModernTrans = hasModernTranslations(chapterData);
    const paraNum = paragraphIdx + 1;
    const translator = getTranslatorInfo(block);

    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `${author}. (1894/2025). ${chapterTitle} (H. J. Allen & G. M. Petersen, Trans.) (para. ${paraNum}). 24 Histories. Retrieved from ${url}`;
    }

    if (hasModernTrans) {
      return `${author}. (2025). ${chapterTitle} (G. M. Petersen, Trans.) (para. ${paraNum}). 24 Histories. Retrieved from ${url}`;
    }

    return `${author}. (2025). ${chapterTitle} (para. ${paraNum}). 24 Histories. Retrieved from ${url}`;
  }
}

function generateMLACitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterData = getCurrentChapterData();
  const bookInfo = getCurrentBookInfo();
  const chapterTitle = chapterData.meta.title.en || chapterData.meta.title.zh;
  const accessDate = formatDate();
  const author = bookInfo.author || 'Unknown';
  
  if (type === 'chapter') {
    const citation = chapterData.meta.citation;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (citation && citation.includes('Partial translation')) {
      return `${author}. "${chapterTitle}." Partial translation by Herbert J. Allen, Journal of the Royal Asiatic Society, vol. 26, no. 2, 1894, pp. 269-295; remaining portions translated by Garrett M. Petersen, 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
    }

    const translator = getTranslatorInfo(chapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `${author}. "${chapterTitle}." Partial translation by Herbert J. Allen, Journal of the Royal Asiatic Society, vol. 26, no. 2, 1894, pp. 269-295; completed by Garrett M. Petersen, 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
    }

    if (hasModernTrans) {
      return `${author}. "${chapterTitle}." Translated by Garrett M. Petersen, 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
    }

    return `${author}. "${chapterTitle}." 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
  } else if (type === 'table') {
    const tableNum = paragraphIdx + 1;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (hasModernTrans) {
      return `${author}. "${chapterTitle}." Translated by Garrett M. Petersen, table ${tableNum}. 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
    } else {
      return `${author}. "${chapterTitle}." Table ${tableNum}. 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
    }
  } else {
    const hasModernTrans = hasModernTranslations(chapterData);
    const paraNum = paragraphIdx + 1;
    const translator = getTranslatorInfo(block);

    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `${author}. "${chapterTitle}." Partial translation by Herbert J. Allen, Journal of the Royal Asiatic Society, vol. 26, no. 2, 1894, pp. 269-295; completed by Garrett M. Petersen, 24 Histories, 2025, para. ${paraNum}, ${url}. Accessed ${accessDate}.`;
    }

    if (hasModernTrans) {
      return `${author}. "${chapterTitle}." Translated by Garrett M. Petersen, para. ${paraNum}. 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
    }

    return `${author}. "${chapterTitle}." Para. ${paraNum}. 24 Histories, 2025, ${url}. Accessed ${accessDate}.`;
  }
}

function generateBibTeXCitation(type, paragraphIdx, block) {
  const url = window.location.href;
  const chapterData = getCurrentChapterData();
  const bookInfo = getCurrentBookInfo();
  const chapterTitle = (chapterData.meta.title.en || chapterData.meta.title.zh).replace(/[《》]/g, '');
  const year = new Date().getFullYear();
  const author = bookInfo.author || 'Unknown';
  const authorKey = author.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  
  if (type === 'chapter') {
    const citation = chapterData.meta.citation;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (citation && citation.includes('Partial translation')) {
      return `@misc{${authorKey}2025${chapterData.meta.chapter},
  author = {${author}},
  title = {${chapterTitle}},
  translator = {Herbert J. Allen and Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {1894/2025},
  url = {${url}},
  note = {Partial translation by Herbert J. Allen (1894), Journal of the Royal Asiatic Society 26(2): 269-295; remaining portions by Garrett M. Petersen (2025). Accessed ${formatDate()}}
}`;
    }

    const translator = getTranslatorInfo(chapterData.content[0]);
    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `@misc{${authorKey}2025${chapterData.meta.chapter},
  author = {${author}},
  title = {${chapterTitle}},
  translator = {Herbert J. Allen and Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {1894/2025},
  url = {${url}},
  note = {Partial translation by Herbert J. Allen (1894), completed by Garrett M. Petersen (2025). Accessed ${formatDate()}}
}`;
    }

    if (hasModernTrans) {
      return `@misc{${authorKey}2025${chapterData.meta.chapter},
  author = {${author}},
  title = {${chapterTitle}},
  translator = {Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
    }

    return `@misc{${authorKey}2025${chapterData.meta.chapter},
  author = {${author}},
  title = {${chapterTitle}},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
  } else if (type === 'table') {
    const tableNum = paragraphIdx + 1;
    const hasModernTrans = hasModernTranslations(chapterData);

    if (hasModernTrans) {
      return `@misc{${authorKey}2025${chapterData.meta.chapter}t${tableNum},
  author = {${author}},
  title = {${chapterTitle}, Table ${tableNum}},
  translator = {Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
    } else {
      return `@misc{${authorKey}2025${chapterData.meta.chapter}t${tableNum},
  author = {${author}},
  title = {${chapterTitle}, Table ${tableNum}},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
    }
  } else {
    const hasModernTrans = hasModernTranslations(chapterData);
    const paraNum = paragraphIdx + 1;
    const translator = getTranslatorInfo(block);

    if (translator && translator.includes('Herbert J. Allen') && hasModernTrans) {
      return `@misc{${authorKey}2025${chapterData.meta.chapter}p${paraNum},
  author = {${author}},
  title = {${chapterTitle}, para. ${paraNum}},
  translator = {Herbert J. Allen and Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {1894/2025},
  url = {${url}},
  note = {Partial translation by Herbert J. Allen (1894), completed by Garrett M. Petersen (2025). Accessed ${formatDate()}}
}`;
    }

    if (hasModernTrans) {
      return `@misc{${authorKey}2025${chapterData.meta.chapter}p${paraNum},
  author = {${author}},
  title = {${chapterTitle}, para. ${paraNum}},
  translator = {Garrett M. Petersen},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
    } else {
      return `@misc{${authorKey}2025${chapterData.meta.chapter}p${paraNum},
  author = {${author}},
  title = {${chapterTitle}, para. ${paraNum}},
  howpublished = {24 Histories},
  year = {2025},
  url = {${url}},
  note = {Accessed ${formatDate()}}
}`;
  }
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

  if (type === 'chapter') {
    title.textContent = 'Cite this Chapter';
  } else if (type === 'table') {
    title.textContent = `Cite Table ${paragraphIdx + 1}`;
  } else {
    title.textContent = `Cite Paragraph ${paragraphIdx + 1}`;
  }

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

// Export citation functions for static pages
export { openCitationModal, setupCitationModal, generateCitation };

// Initialize interactive features for static pages
function initializeInteractiveFeatures() {
  // Set up sentence highlighting
  setupSentenceHighlighting();

  // Set up citation modal
  if (document.getElementById('citation-modal')) {
    setupCitationModal();
  }

  // Set up table citation buttons
  document.querySelectorAll('.cite-table-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tableNum = parseInt(btn.dataset.table); // Already 1-based from generation
      openCitationModal('table', tableNum - 1); // Pass 0-based index
    });
  });

  // Hide loading if it exists
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
}

// Set up sentence highlighting for static pages
function setupSentenceHighlighting() {
  // Add event listeners to all sentence elements
  document.querySelectorAll('.sentence').forEach(sentence => {
    sentence.addEventListener('mouseenter', () => {
      const sentenceId = sentence.dataset.sentenceId;
      if (sentenceId) {
        highlightSentence(sentenceId);
      }
    });

    sentence.addEventListener('mouseleave', () => {
      const sentenceId = sentence.dataset.sentenceId;
      if (sentenceId && currentHighlight !== sentenceId) {
        unhighlightSentence(sentenceId);
      }
    });

    sentence.addEventListener('click', () => {
      const sentenceId = sentence.dataset.sentenceId;
      if (sentenceId) {
        toggleHighlight(sentenceId);
      }
    });
  });

  // Add event listeners to Chinese character spans for tooltips
  document.querySelectorAll('.word').forEach(span => {
    span.addEventListener('mouseenter', showTooltip);
    span.addEventListener('mouseleave', hideTooltip);
  });
}

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
}
