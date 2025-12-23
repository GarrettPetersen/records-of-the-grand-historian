// Test script to verify boilerplate detection
function isBoilerplateText(text) {
  if (!text) return true;

  const t = text.toLowerCase().trim();

  // Common boilerplate patterns that should not be attributed to Herbert J. Allen
  const boilerplatePatterns = [
    'public domain',
    'this text is',
    'copyright',
    'all rights reserved',
    'permission granted',
    'free to copy',
    'distributed under',
    'creative commons',
    'gnu general public',
    'wikipedia',
    '維基百科',
    'dictionary cache',
    'jump to dictionary',
    'show parallel',
    'chinese text project',
    'home',
    'source:'
  ];

  return boilerplatePatterns.some(pattern => t.includes(pattern));
}

// Test cases
const testCases = [
  { text: 'This text is part of the public domain.', expected: true },
  { text: 'Emperor Gaozu said to his ministers...', expected: false },
  { text: 'Copyright 2024 Some Publisher', expected: true },
  { text: 'The king ordered his troops to advance.', expected: false },
  { text: 'Source: Chinese Text Project', expected: true },
  { text: '', expected: true },
  { text: null, expected: true }
];

console.log('Testing boilerplate detection:');
testCases.forEach((test, i) => {
  const result = isBoilerplateText(test.text);
  const status = result === test.expected ? '✓' : '✗';
  console.log(`${status} Test ${i + 1}: "${test.text}" -> ${result} (expected: ${test.expected})`);
});

