/** Shared Kindle / Amazon Associates promo copy (browser + static page generator). */

export const KINDLE_PRODUCTS = {
  shiji: {
    bookId: 'shiji',
    amazonUrl: 'https://amzn.to/4vzL5yT',
    title: 'Records of the Grand Historian',
    chinese: '史記',
    coverPath: '/covers/books/shiji.svg',
    coverColor: '#9f2f2f',
  },
  hanshu: {
    bookId: 'hanshu',
    amazonUrl: 'https://amzn.to/4fFZepo',
    title: 'Book of Han',
    chinese: '漢書',
    coverPath: '/covers/books/hanshu.svg',
    coverColor: '#2f5f9f',
  },
  sanguozhi: {
    bookId: 'sanguozhi',
    amazonUrl: 'https://amzn.to/3QesTM8',
    title: 'Records of the Three Kingdoms',
    chinese: '三國志',
    coverPath: '/covers/books/sanguozhi.svg',
    coverColor: '#8f4b2f',
  },
};

export const KINDLE_SERIES = {
  amazonUrl: 'https://amzn.to/3QesTM8',
  title: 'The Twenty-Four Histories series',
};

export const SHIJI_KINDLE = KINDLE_PRODUCTS.shiji;
export const AFFILIATE_DISCLOSURE = 'As an Amazon Associate, Garrett M. Petersen earns from qualifying purchases.';

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function kindleProductForBook(bookId) {
  return KINDLE_PRODUCTS[String(bookId || '').trim()] || null;
}

function kindleCoverImgHtml(product, { className = 'kindle-promo-cover', width = 96 } = {}) {
  const { coverPath, title, coverColor } = product;
  const height = Math.round(width * (2560 / 1600));
  return `<div class="${className}" style="--book-color: ${coverColor}; --cover-width: ${width}px"><img src="${coverPath}" alt="${escapeHtml(title)} cover" width="${width}" height="${height}" loading="lazy" decoding="async" /></div>`;
}

export const PROMO_VERSION = '2';
export const DISMISS_DAYS = 14;

export function storageKeyForBook(bookId) {
  return `${bookId}-kindle-promo-dismissed-v${PROMO_VERSION}`;
}

export function amazonLinkRel() {
  return 'noopener noreferrer sponsored';
}

/**
 * @param {string} [prefix] Path prefix for internal links (e.g. "../").
 */
export function kindleFooterLine(prefix = '') {
  const rel = amazonLinkRel();
  const productLinks = Object.values(KINDLE_PRODUCTS)
    .map(({ amazonUrl, title }) => `<a href="${amazonUrl}" target="_blank" rel="${rel}">${escapeHtml(title)}</a>`)
    .join(' · ');
  return `<p class="kindle-footer-link">Kindle editions: ${productLinks} · <a href="${KINDLE_SERIES.amazonUrl}" target="_blank" rel="${rel}">${escapeHtml(KINDLE_SERIES.title)}</a> · <span class="affiliate-disclosure">${AFFILIATE_DISCLOSURE}</span> · <a href="${prefix}privacy.html#amazon-associates">Details</a></p>`;
}

/**
 * @param {{ bookId?: string, variant?: 'hub' | 'chapter', intro?: string }} [options]
 */
export function kindleInlineCalloutHtml({ bookId = 'shiji', variant = 'hub', intro = '' } = {}) {
  const product = kindleProductForBook(bookId);
  if (!product) return '';
  const { amazonUrl, title, chinese } = product;
  const rel = amazonLinkRel();
  const heading = variant === 'chapter'
    ? 'Take it offline'
    : 'Now on Kindle';
  const body = intro?.trim()
    ? escapeHtml(intro.trim())
    : `The complete English translation of ${escapeHtml(title)} is available as a Kindle e-book.`;

  const coverWidth = variant === 'hub' ? 96 : 72;

  return `<aside class="kindle-callout kindle-callout--${variant}" aria-label="Kindle edition">
  ${kindleCoverImgHtml(product, { className: 'kindle-callout-cover', width: coverWidth })}
  <div class="kindle-callout-body">
    <p class="kindle-callout-eyebrow">${heading}</p>
    <p class="kindle-callout-text">${body}</p>
    <p class="kindle-callout-disclosure">${AFFILIATE_DISCLOSURE}</p>
  </div>
  <a class="kindle-callout-btn" href="${amazonUrl}" target="_blank" rel="${rel}">View ${escapeHtml(chinese)} on Amazon</a>
</aside>`;
}

export function kindleModalMarkup({ bookId = 'shiji', intro = '' } = {}) {
  const product = kindleProductForBook(bookId);
  if (!product) return '';
  const { amazonUrl, title } = product;
  const rel = amazonLinkRel();
  const body = intro?.trim()
    ? escapeHtml(intro.trim())
    : `The complete English translation of ${escapeHtml(title)} is available as a Kindle e-book.`;

  return `<div id="kindle-promo-modal" class="kindle-promo-modal" hidden role="dialog" aria-modal="true" aria-labelledby="kindle-promo-title">
  <div class="kindle-promo-panel" role="document">
    <button type="button" class="kindle-promo-close" id="kindle-promo-close" aria-label="Close">&times;</button>
    ${kindleCoverImgHtml(product, { width: 88 })}
    <p class="kindle-promo-eyebrow">New</p>
    <h2 id="kindle-promo-title" class="kindle-promo-title">${title} on Kindle</h2>
    <p class="kindle-promo-text">${body}</p>
    <div class="kindle-promo-actions">
      <a class="kindle-promo-btn kindle-promo-btn--primary" href="${amazonUrl}" target="_blank" rel="${rel}">View on Amazon</a>
      <button type="button" class="kindle-promo-btn kindle-promo-btn--ghost" id="kindle-promo-dismiss">Not now</button>
    </div>
    <p class="kindle-promo-disclosure">${AFFILIATE_DISCLOSURE}</p>
  </div>
</div>`;
}
