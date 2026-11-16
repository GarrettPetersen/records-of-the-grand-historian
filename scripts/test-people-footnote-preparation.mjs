import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareEnglishFootnoteAdditions} from './lib/people-footnote-preparation.mjs';
import {replayReviewedFootnoteAdditions} from './lib/people-combined-footnote-review.mjs';
import {sha256} from './lib/people-content.mjs';
const hash=d=>sha256(JSON.stringify(d));
const fixture=()=>({meta:{book:'test',chapter:'001'},content:[{sentences:[{id:'s0001',zh:'寐而告其妻曰。',translations:[{lang:'en',literal:'Awake, he told his wife.',idiomatic:'Awake, he told his wife.'}]}]}]});
const options={book:'test',chapter:'001',authorAgentId:'actual-host',additions:[{unit:'s0001',text:'The received source has 寐; the parallel text has 寤.'}]};
test('footnote preparation creates only the exact structural candidate, with no native approval',()=>{
 const source=fixture(),before=structuredClone(source),r=prepareEnglishFootnoteAdditions(source,options);
 assert.deepEqual(source,before);assert.equal(r.contract.beforeSourceHash,hash(source));assert.equal(r.contract.afterSourceHash,hash(r.source));assert.equal(r.approvalGranted,false);
 assert.throws(()=>replayReviewedFootnoteAdditions(source,{contract:r.contract,book:'test',chapter:'001',authorAgentIds:['actual-host']}),/contract pin/);
});
test('prepared footnotes replay through the unchanged native independent review contract',()=>{
 const source=fixture(),r=prepareEnglishFootnoteAdditions(source,options),context={sourceFootnoteContractHash:hash(r.contract)};
 const identity={reviewContext:context,reviewer:{agentId:'independent',actualAgentId:'independent',independentOfExtractor:true,independentOfRepairAuthor:true},sourceFootnoteReviewKind:'independent-editorial-footnote-review',sourceFootnoteChecks:[{unit:'s0001',text:options.additions[0].text,verdict:'supported',reason:'Both primary textual witnesses support the exact disclosed reading.',sourceQuote:'寐',referenceIndexes:[0]}],references:[{kind:'external',title:'Parallel source',url:'https://example.org/primary',accessedAt:'2026-11-15T00:00:00Z',quote:'寤而告其妻曰',sourceHash:sha256('寤而告其妻曰'),reason:'The independent witness has the waking reading disclosed in the note.'}]};
 assert.deepEqual(replayReviewedFootnoteAdditions(source,{contract:r.contract,identity,dateReport:{reviewContext:context},validation:context,seal:context,book:'test',chapter:'001',authorAgentIds:['actual-host']}),r.source);
 identity.reviewer.agentId='actual-host';assert.throws(()=>replayReviewedFootnoteAdditions(source,{contract:r.contract,identity,dateReport:{reviewContext:context},validation:context,seal:context,book:'test',chapter:'001',authorAgentIds:['actual-host']}),/independent/);
});
test('preparation rejects replacements, extra fields, duplicate targets and ambiguous translations',()=>{
 const source=fixture();source.content[0].sentences[0].translations[0].footnote='Existing';assert.throws(()=>prepareEnglishFootnoteAdditions(source,options),/without existing/);
 assert.throws(()=>prepareEnglishFootnoteAdditions(fixture(),{...options,additions:[{...options.additions[0],other:'edit'}]}),/Closed addition fields/);
 assert.throws(()=>prepareEnglishFootnoteAdditions(fixture(),{...options,additions:[...options.additions,...options.additions]}),/Duplicate/);
 const ambiguous=fixture();ambiguous.content[0].sentences[0].translations.push({...ambiguous.content[0].sentences[0].translations[0]});assert.throws(()=>prepareEnglishFootnoteAdditions(ambiguous,options),/one English/);
});
