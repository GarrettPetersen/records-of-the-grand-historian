#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SELF = "check-no-autotranslate.js";

const RULES = [
  {
    label: "deep_translator import",
    regex: /^\s*from\s+deep_translator\s+import\s+/m,
  },
  {
    label: "deep_translator module import",
    regex: /^\s*import\s+deep_translator(?:\s|$)/m,
  },
  {
    label: "GoogleTranslator usage",
    regex: /\bGoogleTranslator\s*\(/m,
  },
  {
    label: "googletrans import",
    regex: /^\s*(?:from\s+googletrans\s+import\s+|import\s+googletrans(?:\s|$))/m,
  },
  {
    label: "argostranslate import",
    regex: /^\s*(?:from\s+argostranslate\s+import\s+|import\s+argostranslate(?:\s|$))/m,
  },
  {
    label: "translatepy import",
    regex: /^\s*(?:from\s+translatepy\s+import\s+|import\s+translatepy(?:\s|$))/m,
  },
];

function listFiles() {
  const output = execSync("git ls-files --cached --others --exclude-standard", {
    encoding: "utf8",
  }).trim();
  if (!output) return [];
  return output
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)
    .filter((f) => f !== SELF);
}

function isText(content) {
  return !content.includes("\u0000");
}

function findLineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

function findViolationsInFile(file) {
  const abs = path.join(ROOT, file);
  let content;
  try {
    content = fs.readFileSync(abs, "utf8");
  } catch {
    return [];
  }
  if (!isText(content)) return [];

  const hits = [];
  for (const rule of RULES) {
    const match = content.match(rule.regex);
    if (!match || match.index == null) continue;
    const line = findLineNumber(content, match.index);
    const snippet = content.split("\n")[line - 1]?.trim() ?? "";
    hits.push({ file, line, label: rule.label, snippet });
  }
  return hits;
}

const files = listFiles();
const violations = files.flatMap(findViolationsInFile);

if (violations.length > 0) {
  console.error("❌ Auto-translation import/usage check failed.");
  console.error("Found blocked machine-translation patterns:\n");
  for (const v of violations) {
    console.error(`- ${v.file}:${v.line} [${v.label}]`);
    if (v.snippet) console.error(`  ${v.snippet}`);
  }
  console.error(
    "\nRemove these imports/usages. Translation work must be authored manually."
  );
  process.exit(1);
}

console.log("✅ No blocked auto-translation imports/usages found.");
