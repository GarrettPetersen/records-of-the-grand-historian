// A mechanical semantic diff only: it does not establish provenance, reviewer
// independence, or the factual correctness of any change. Callers must pin the
// original input bytes. Use parseCurationDriftJson on raw input to reject
// duplicate JSON member names, which JSON.parse alone silently overwrites.

export function parseCurationDriftJson(text) {
  const parsed = JSON.parse(text); // Validate the complete JSON grammar first.
  let pos = 0;
  // Compare mathematical decimal values, so a rounded token cannot silently
  // collapse distinct source numbers onto one JavaScript Number.
  function decimalKey(token) {
    const m = /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(token);
    let digits = `${m[2]}${m[3] ?? ''}`.replace(/^0+/, '');
    if (!digits) return '0';
    const trimmed = digits.replace(/0+$/, '');
    const exponent = BigInt(m[4] ?? '0') - BigInt((m[3] ?? '').length) + BigInt(digits.length - trimmed.length);
    return `${m[1]}${trimmed}e${exponent}`;
  }
  const whitespace = () => { while (/[\x20\t\r\n]/.test(text[pos] ?? '\0')) pos++; };
  function string() {
    const start = pos++;
    while (pos < text.length) {
      if (text[pos] === '"') return JSON.parse(text.slice(start, ++pos));
      if (text[pos] === '\\') pos++;
      pos++;
    }
    throw new Error('Unterminated JSON string');
  }
  function scan() {
    whitespace();
    if (text[pos] === '{') {
      pos++; whitespace();
      const keys = new Set();
      if (text[pos] === '}') { pos++; return; }
      while (true) {
        const key = string();
        if (keys.has(key)) throw new Error(`Duplicate JSON member ${JSON.stringify(key)}`);
        keys.add(key);
        whitespace(); pos++; // colon, already validated by JSON.parse
        scan(); whitespace();
        if (text[pos++] === '}') return;
        whitespace();
      }
    }
    if (text[pos] === '[') {
      pos++; whitespace();
      if (text[pos] === ']') { pos++; return; }
      while (true) {
        scan(); whitespace();
        if (text[pos++] === ']') return;
      }
    }
    if (text[pos] === '"') { string(); return; }
    const token = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(pos));
    if (!token) throw new Error('Invalid JSON token');
    if (/^-?\d/.test(token[0])) {
      const number = Number(token[0]);
      if (!Number.isFinite(number) || Object.is(number, -0) || (Number.isInteger(number) && !Number.isSafeInteger(number)) || decimalKey(token[0]) !== decimalKey(String(number))) {
        throw new Error(`JSON number cannot be represented without ambiguity: ${token[0]}`);
      }
    }
    pos += token[0].length;
  }
  scan(); whitespace();
  if (pos !== text.length) throw new Error('Unexpected trailing JSON input');
  return copyJson(parsed);
}

function copyJson(value, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value) && !Object.is(value, -0) && (!Number.isInteger(value) || Number.isSafeInteger(value))) return value;
  if (typeof value !== 'object' || seen.has(value)) throw new Error('Expected unambiguous JSON values without cycles or aliases');
  const array = Array.isArray(value);
  if ((!array && Object.getPrototypeOf(value) !== Object.prototype) || Object.getOwnPropertySymbols(value).length) {
    throw new Error('Expected a plain JSON object or array');
  }
  seen.add(value);
  const names = Object.getOwnPropertyNames(value);
  const keys = array ? Array.from({ length: value.length }, (_, i) => String(i)) : names.sort();
  if (array && (Object.getPrototypeOf(value) !== Array.prototype || names.length !== keys.length + 1 || !names.includes('length'))) {
    throw new Error('Expected a dense JSON array without extra properties');
  }
  const entries = keys.map(key => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new Error('Expected JSON data properties');
    return [key, copyJson(descriptor.value, seen)];
  });
  return array ? entries.map(([, item]) => item) : Object.fromEntries(entries);
}

const pointer = (base, key) => `${base}/${String(key).replaceAll('~', '~0').replaceAll('/', '~1')}`;
const kind = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

/** Deterministically inventory every semantic difference using JSON Pointers.
 * Array positions are compared by index, not inferred identity. Added or
 * removed subtrees are represented in full in a single row. */
export function computeCurationDrift(before, after) {
  const left = copyJson(before);
  const right = copyJson(after);
  const rows = [];
  function walk(a, b, path) {
    const type = kind(a);
    if (type !== kind(b) || (type !== 'array' && type !== 'object')) {
      if (type !== kind(b) || a !== b) rows.push({ op: 'replace', path, before: a, after: b });
      return;
    }
    if (type === 'array') {
      const common = Math.min(a.length, b.length);
      for (let i = 0; i < common; i++) walk(a[i], b[i], pointer(path, i));
      for (let i = common; i < a.length; i++) rows.push({ op: 'remove', path: pointer(path, i), before: a[i] });
      for (let i = common; i < b.length; i++) rows.push({ op: 'add', path: pointer(path, i), after: b[i] });
      return;
    }
    for (const key of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
      const oldPresent = Object.hasOwn(a, key), newPresent = Object.hasOwn(b, key);
      const child = pointer(path, key);
      if (!oldPresent) rows.push({ op: 'add', path: child, after: b[key] });
      else if (!newPresent) rows.push({ op: 'remove', path: child, before: a[key] });
      else walk(a[key], b[key], child);
    }
  }
  walk(left, right, '');
  return rows;
}

/** Validate exact inventory contents and order against the actual snapshots. */
export function verifyCurationDrift(before, after, claimed) {
  const normalized = copyJson(claimed);
  if (!Array.isArray(normalized)) throw new Error('Drift inventory must be an array');
  const expected = computeCurationDrift(before, after);
  // copyJson sorts object keys on both sides; serialization distinguishes
  // omitted fields from null and enforces exact ordered rows and values.
  if (JSON.stringify(normalized) !== JSON.stringify(copyJson(expected))) throw new Error('Drift inventory does not exactly match snapshots');
  return true;
}
