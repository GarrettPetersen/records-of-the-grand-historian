#!/usr/bin/env node
import path from 'node:path';
import { compactPeopleGitStorage } from './lib/people-git-storage.mjs';
const args = process.argv.slice(2), options = { root: process.cwd(), apply: false };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--apply') options.apply = true;
  else if (args[i] === '--receipt' && args[i + 1]) options.receipt = path.resolve(args[++i]);
  else if (args[i] === '--resume' && args[i + 1]) options.resumeReceipt = path.resolve(args[++i]);
  else if (args[i] === '--pack' && args[i + 1]) options.existingPack = args[++i];
  else throw Error('Usage: [--apply --receipt NEW_PATH] [--resume PRESERVED_RECEIPT --pack COMPLETED_HASH]');
}
console.log(JSON.stringify(compactPeopleGitStorage(options), null, 2));
