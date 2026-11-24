#!/usr/bin/env node
import { runGuardedPeopleScript } from './lib/people-resource-job.mjs';
await runGuardedPeopleScript(new URL('./reconcile-people-identity-reviews-worker.mjs', import.meta.url), process.argv.slice(2));
