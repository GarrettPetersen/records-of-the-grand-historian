import {
  SHIJI_KINDLE,
  STORAGE_KEY,
  DISMISS_DAYS,
  kindleModalMarkup,
} from './kindle-promo-shared.js';

/** Modal only on the Shiji book hub — not on individual chapters. */
function isShijiBookHub() {
  if (document.body?.dataset?.book?.trim() !== SHIJI_KINDLE.bookId) return false;
  return /\/book\/shiji(?:\.html)?$/i.test(window.location.pathname);
}

function readSeenAt() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const ts = Number.parseInt(raw, 10);
    return Number.isFinite(ts) ? ts : null;
  } catch {
    return null;
  }
}

function writeSeenAt() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Ignore private browsing / storage limits.
  }
}

function shouldShowModal() {
  const seenAt = readSeenAt();
  if (!seenAt) return true;
  const ms = DISMISS_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - seenAt > ms;
}

function openModal(modal) {
  writeSeenAt();
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
  if (!isShijiBookHub() || !shouldShowModal()) return;
  if (document.getElementById('kindle-promo-modal')) return;

  document.body.insertAdjacentHTML('beforeend', kindleModalMarkup());
  const modal = document.getElementById('kindle-promo-modal');
  if (!(modal instanceof HTMLElement)) return;

  wireModal(modal);
  window.requestAnimationFrame(() => openModal(modal));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKindlePromo);
} else {
  initKindlePromo();
}
