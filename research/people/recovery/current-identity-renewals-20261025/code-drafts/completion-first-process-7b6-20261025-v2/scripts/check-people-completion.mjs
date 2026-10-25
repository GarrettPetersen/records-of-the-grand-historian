#!/usr/bin/env node
import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { compareCompletionCheckpoints } from './lib/people-completion-plan.mjs';

const {values} = parseArgs({options:{baseline:{type:'string'},current:{type:'string'}}});
const read = key => {
  const file=values[key];
  if(!file)throw new Error(`--${key} is required`);
  if(fs.statSync(file).size>10*1024*1024)throw new Error('Completion checkpoint exceeds 10 MiB; export the chapter frontier, not the corpus');
  return JSON.parse(fs.readFileSync(file,'utf8'));
};
const report=compareCompletionCheckpoints(read('baseline'),read('current'));
console.log(JSON.stringify(report,null,2));
if(['empty-scope','replan-required'].includes(report.state))process.exitCode=1;
