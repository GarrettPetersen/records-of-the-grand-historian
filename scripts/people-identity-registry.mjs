#!/usr/bin/env node
import { runGuardedPeopleScript } from './lib/people-resource-job.mjs';
await runGuardedPeopleScript(new URL('./people-identity-registry-worker.mjs', import.meta.url), process.argv.slice(2));
