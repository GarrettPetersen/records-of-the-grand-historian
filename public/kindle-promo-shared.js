/** Shared Kindle / Amazon Associates promo copy (browser + static page generator). */

export const SHIJI_KINDLE = {
  bookId: 'shiji',
  amazonUrl: 'https://amzn.to/4vzL5yT',
  title: 'Records of the Grand Historian',
  chinese: '史記',
  coverPath: '/covers/books/shiji.svg',
  coverColor: '#9f2f2f',
  disclosure: 'As an Amazon Associate, Garrett M. Petersen earns from qualifying purchases.',
};

function kindleCoverImgHtml({ className = 'kindle-promo-cover', width = 96 }) {
  const { coverPath, title, coverColor } = SHIJI_KINDLE;
  const height = Math.round(width * (2560 / 1600));
  return `<div class="${className}" style="--book-color: ${coverColor}; --cover-width: ${width}px"><img src="${coverPath}" alt="${title} cover" width="${width}" height="${height}" loading="lazy" decoding="async" /></div>`;
}

export const PROMO_VERSION = '1';
export const STORAGE_KEY = `shiji-kindle-promo-dismissed-v${PROMO_VERSION}`;
export const DISMISS_DAYS = 14;

export function amazonLinkRel() {
  return 'noopener noreferrer sponsored';
}

/**
 * @param {string} [prefix] Path prefix for internal links (e.g. "../").
 */
export function kindleFooterLine(prefix = '') {
  const { amazonUrl, title, disclosure } = SHIJI_KINDLE;
  const rel = amazonLinkRel();
  return `<p class="kindle-footer-link"><a href="${amazonUrl}" target="_blank" rel="${rel}">${title} — Kindle edition</a> · <span class="affiliate-disclosure">${disclosure}</span> · <a href="${prefix}privacy.html#amazon-associates">Details</a></p>`;
}

/**
 * @param {{ variant?: 'hub' | 'chapter' }} [options]
 */
export function kindleInlineCalloutHtml({ variant = 'hub' } = {}) {
  const { amazonUrl, title, chinese, disclosure } = SHIJI_KINDLE;
  const rel = amazonLinkRel();
  const heading = variant === 'chapter'
    ? 'Take it offline'
    : 'Now on Kindle';
  const body = variant === 'chapter'
    ? `The complete English translation of the <em>${title}</em> is available as a Kindle e-book for uninterrupted reading.`
    : `The complete English translation of the <em>${title}</em> is now available as a Kindle e-book — polished for long-form reading away from the browser.`;

  const coverWidth = variant === 'hub' ? 96 : 72;

  return `<aside class="kindle-callout kindle-callout--${variant}" aria-label="Kindle edition">
  ${kindleCoverImgHtml({ className: 'kindle-callout-cover', width: coverWidth })}
  <div class="kindle-callout-body">
    <p class="kindle-callout-eyebrow">${heading}</p>
    <p class="kindle-callout-text">${body}</p>
    <p class="kindle-callout-disclosure">${disclosure}</p>
  </div>
  <a class="kindle-callout-btn" href="${amazonUrl}" target="_blank" rel="${rel}">View on Amazon</a>
</aside>`;
}

export function kindleModalMarkup() {
  const { amazonUrl, title, disclosure } = SHIJI_KINDLE;
  const rel = amazonLinkRel();

  return `<div id="kindle-promo-modal" class="kindle-promo-modal" hidden role="dialog" aria-modal="true" aria-labelledby="kindle-promo-title">
  <div class="kindle-promo-panel" role="document">
    <button type="button" class="kindle-promo-close" id="kindle-promo-close" aria-label="Close">&times;</button>
    ${kindleCoverImgHtml({ width: 88 })}
    <p class="kindle-promo-eyebrow">New</p>
    <h2 id="kindle-promo-title" class="kindle-promo-title">${title} on Kindle</h2>
    <p class="kindle-promo-text">The complete English translation of <em>${title}</em> is now available as a Kindle e-book.</p>
    <div class="kindle-promo-actions">
      <a class="kindle-promo-btn kindle-promo-btn--primary" href="${amazonUrl}" target="_blank" rel="${rel}">View on Amazon</a>
      <button type="button" class="kindle-promo-btn kindle-promo-btn--ghost" id="kindle-promo-dismiss">Not now</button>
    </div>
    <p class="kindle-promo-disclosure">${disclosure}</p>
  </div>
</div>`;
}
