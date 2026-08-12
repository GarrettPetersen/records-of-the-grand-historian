function normalizeOrigin(origin) {
  const normalized = String(origin).replace(/\/+$/u, '');
  if (!/^https?:\/\//u.test(normalized)) {
    throw new Error(`Canonical origin must be an absolute HTTP(S) URL: ${origin}`);
  }
  return normalized;
}

export function canonicalPathForHtmlFile(htmlFile) {
  const normalized = String(htmlFile).replace(/\\/gu, '/').replace(/^\/+|\/+$/gu, '');
  if (!normalized.endsWith('.html')) {
    throw new Error(`Canonical page source must be an HTML file: ${htmlFile}`);
  }

  const withoutExtension = normalized.slice(0, -'.html'.length);
  if (withoutExtension === 'index') return '/';
  if (withoutExtension.endsWith('/index')) {
    return `/${withoutExtension.slice(0, -'index'.length)}`;
  }
  return `/${withoutExtension}`;
}

export function canonicalUrlForHtmlFile(origin, htmlFile) {
  return `${normalizeOrigin(origin)}${canonicalPathForHtmlFile(htmlFile)}`;
}
