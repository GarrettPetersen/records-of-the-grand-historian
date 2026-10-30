#!/usr/bin/env node
import { recordChapterIdentityReview } from './lib/people-identity-review-record.mjs';
const options = {}, args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 2) {
  const name = args[index].slice(2), key = name === 'previous-sha256' ? 'previousSha256' : name;
  if (!args[index].startsWith('--') || !['packet','report','job','registry','supplement','out','previousSha256'].includes(key) || !args[index+1] || Object.hasOwn(options,key)) throw new Error('Usage: --packet FILE --report FILE --job CAPTURED_JOB --registry DIRECTORY [--supplement FILE] [--out FILE] [--previous-sha256 HEX]');
  options[key] = args[index+1];
}
for (const key of ['packet','report','job','registry']) if (!options[key]) throw new Error(`Missing --${key}`);
console.log(JSON.stringify(await recordChapterIdentityReview(options), null, 2));
