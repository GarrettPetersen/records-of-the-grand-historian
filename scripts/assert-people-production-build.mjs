#!/usr/bin/env node

// A preview may be generated locally, but must never be left in the deploy
// output by a failed production build before the later site verifier runs.
if (process.env.PEOPLE_SITE_PREVIEW === '1') {
  console.error('Production build refuses PEOPLE_SITE_PREVIEW=1; use the separate local preview workflow.');
  process.exitCode = 1;
}
