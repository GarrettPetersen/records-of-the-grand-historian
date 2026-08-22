export function parseCursorDollarLimit(value, flag) {
  if (value === 'unlimited') return null;
  if (!/^\d+(?:\.\d{1,2})?$/u.test(value) || Number(value) <= 0) {
    throw new Error(`${flag} must be a positive dollar amount or unlimited`);
  }
  return Math.round(Number(value) * 100);
}

export function parseCursorIntegerLimit(value, flag) {
  if (value === 'unlimited') return null;
  if (!/^\d+$/u.test(value) || Number(value) < 1) {
    throw new Error(`${flag} must be a positive integer or unlimited`);
  }
  return Number(value);
}

export function describeCursorRunLimits(options) {
  const cost = options.maxRunCostCents === null
    ? 'unlimited'
    : `$${(options.maxRunCostCents / 100).toFixed(2)}`;
  const tokens = options.maxRunTokens === null
    ? 'unlimited'
    : options.maxRunTokens.toLocaleString('en-US');
  return `per-run raw ceiling=${cost}; per-run token ceiling=${tokens}`;
}
