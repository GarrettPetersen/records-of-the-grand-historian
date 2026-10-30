#!/usr/bin/env node
import { runGuardedPeopleScript } from './lib/people-resource-job.mjs';
const args = process.argv.slice(2);
// Saved pair assignments retain their explicit recovery path. Fresh work always
// prepares one indexed chapter dossier job, never a complete name-pair graph.
const script = args.includes('--recover-only') || args.includes('--self-test')
  ? new URL('./sdk-people-resolve.mjs', import.meta.url)
  : new URL('./prepare-people-chapter-identity.mjs', import.meta.url);
await runGuardedPeopleScript(script, args);
