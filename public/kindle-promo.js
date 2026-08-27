import {
  DISMISS_DAYS,
  kindleProductForBook,
  kindleModalMarkup,
  storageKeyForBook,
} from './kindle-promo-shared.js?v=20260827-houhanshu';

/** Modal only on published book hubs — not on individual chapters. */
function currentBookHubProduct() {
  const bookId = document.body?.dataset?.book?.trim();
  const product = kindleProductForBook(bookId);
  if (!product) return null;
  const pattern = new RegExp(`/book/${product.bookId}(?:\\.html)?$`, 'i');
  return pattern.test(window.location.pathname) ? product : null;
}

function readSeenAt(bookId) {
  try {
    const raw = localStorage.getItem(storageKeyForBook(bookId));
    if (!raw) return null;
    const ts = Number.parseInt(raw, 10);
    return Number.isFinite(ts) ? ts : null;
  } catch {
    return null;
  }
}

function writeSeenAt(bookId) {
  try {
    localStorage.setItem(storageKeyForBook(bookId), String(Date.now()));
  } catch {
    // Ignore private browsing / storage limits.
  }
}

function shouldShowModal(bookId) {
  const seenAt = readSeenAt(bookId);
  if (!seenAt) return true;
  const ms = DISMISS_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - seenAt > ms;
}

function openModal(modal, bookId) {
  writeSeenAt(bookId);
  modal.hidden = false;
  document.body.classList.add('kindle-promo-open');
  const primary = modal.querySelector('.kindle-promo-btn--primary');
  if (primary instanceof HTMLElement) primary.focus();
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.classList.remove('kindle-promo-open');
}

function wireModal(modal) {
  const closeBtn = modal.querySelector('#kindle-promo-close');
  const dismissBtn = modal.querySelector('#kindle-promo-dismiss');

  closeBtn?.addEventListener('click', () => closeModal(modal));
  dismissBtn?.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal(modal);
  });
}

function initKindlePromo() {
  const product = currentBookHubProduct();
  if (!product || !shouldShowModal(product.bookId)) return;
  if (document.getElementById('kindle-promo-modal')) return;

  const intro = document.body?.dataset?.kindleIntro || '';
  document.body.insertAdjacentHTML('beforeend', kindleModalMarkup({ bookId: product.bookId, intro }));
  const modal = document.getElementById('kindle-promo-modal');
  if (!(modal instanceof HTMLElement)) return;

  wireModal(modal);
  window.requestAnimationFrame(() => openModal(modal, product.bookId));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKindlePromo);
} else {
  initKindlePromo();
}
