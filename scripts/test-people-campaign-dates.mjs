import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  campaignDaySteps, campaignStateFile, calibrationIsCurrent, dateCalibrationStep,
  migrateCampaignDayState, recordDateCalibrationRun,
} from './run-people-deadline-day.mjs';
import {
  assertPhaseCapacity,
  catalogRefreshAction,
  dateRunAcceptedChapters,
  phaseCommand,
  phaseHasWork,
} from './run-people-deadline-wave.mjs';

const plan = {
  dateAuditDebt: 4098,
  dateChaptersPerWave: 5,
  dateConcurrency: 2,
  blackoutDays: 11,
  capacityStart: '2026-09-24',
};

test('every managed cycle reviews dates after editorial and refreshes before identity', () => {
  const steps = campaignDaySteps({ waves: 2, calibration: false });
  assert.equal(steps[0].phase, 'recovery');
  for (let index = 1; index < steps.length; index += 4) {
    const cycle = steps.slice(index, index + 4);
    assert.deepEqual(cycle.map(({ phase }) => phase), ['extraction', 'editorial', 'dates', 'resolution']);
    assert.deepEqual(cycle.map((step) => catalogRefreshAction({
      ...step, catalogInputsChanged: step.phase !== 'resolution',
    })), ['defer', 'defer', 'rebuild', 'skip']);
    assert.equal(catalogRefreshAction(cycle[2]), 'rebuild');
  }
});

test('reset calibration includes a small date cohort before identity', () => {
  const steps = campaignDaySteps({ waves: 3, calibration: true });
  assert.deepEqual(steps.map(({ phase }) => phase), ['recovery', 'editorial', 'dates', 'resolution']);
  assert.equal(steps[1].limit, 5);
  const editorial = phaseCommand('editorial', { editorialChaptersPerWave: 50, editorialConcurrency: 17 }, steps[1]);
  assert.equal(editorial[editorial.indexOf('--limit') + 1], '5');
  assert.equal(editorial[editorial.indexOf('--concurrency') + 1], '5');
  assert.equal(steps[2].limit, 5);
  assert.equal(steps[2].forceCatalog, true);
  assert.equal(steps[2].order, 'calibration');
  assert.equal(steps[3].limit, 10);
});

test('calibration ordering reaches date workers and survives partial-cohort retries', () => {
  const step = campaignDaySteps({ waves: 3, calibration: true }).find(({ phase }) => phase === 'dates');
  const resumed = dateCalibrationStep(step, { dateAcceptedChapters: ['shiji/001'] }, '/tmp/cohort.json');
  for (const dryRun of [true, false]) {
    const command = phaseCommand('dates', { ...plan, dateChaptersPerWave: resumed.limit }, { ...resumed, dryRun });
    assert.equal(command[command.indexOf('--order') + 1], 'calibration');
    assert.equal(command[command.indexOf('--limit') + 1], '4');
  }
  const production = campaignDaySteps({ waves: 1, calibration: false }).find(({ phase }) => phase === 'dates');
  assert.equal(phaseCommand('dates', plan, production).includes('--order'), false);
});

test('date worker is stable across calibration, production, and dry runs', () => {
  const command = phaseCommand('dates', plan);
  assert.deepEqual(command, [
    'scripts/run-people-date-workflow.mjs', '--all',
    '--worker', 'deadline-dates-cursor-sdk', '--lane', 'cursor-sdk',
    '--model', 'grok-4.6', '--run', '--limit', '5', '--concurrency', '2',
    '--cursor-capacity-start', '2026-09-24',
  ]);
  const editorial = phaseCommand('editorial', {});
  assert.equal(command[command.indexOf('--model') + 1], editorial[editorial.indexOf('--model') + 1]);
  const dryRun = phaseCommand('dates', plan, { dryRun: true });
  assert.deepEqual(dryRun, command.map((arg) => arg === '--run' ? '--dry-run' : arg));
  assert.equal(dryRun.includes('--run'), false);
  assert.equal(command.includes('--force-catalog'), false);
});

test('date workers receive the capacity override only when provided by the plan', () => {
  const overridden = phaseCommand('dates', { ...plan, capacityStart: '2026-10-01' });
  assert.equal(overridden[overridden.indexOf('--cursor-capacity-start') + 1], '2026-10-01');
  const withoutCapacity = phaseCommand('dates', { dateChaptersPerWave: 5, dateConcurrency: 2 });
  assert.equal(withoutCapacity.includes('--cursor-capacity-start'), false);
  assert.equal(overridden.includes('--as-of'), false);
});

test('date audit debt schedules work independently of extraction and editorial debt', () => {
  assert.equal(phaseHasWork('dates', { ...plan, extractionDebt: 0, editorialDebt: 0 }), true);
  assert.equal(phaseHasWork('dates', { dateAuditDebt: 0, extractionDebt: 100 }), false);
});

test('dates preserve the Cursor blackout and offline exceptions', () => {
  for (const phase of ['dates', 'extraction', 'editorial', 'resolution']) {
    assert.throws(() => assertPhaseCapacity({ phase }, plan), /capacity is unavailable until 2026-09-24/);
    assert.doesNotThrow(() => assertPhaseCapacity({ phase, dryRun: true }, plan));
    assert.doesNotThrow(() => assertPhaseCapacity({ phase }, { ...plan, blackoutDays: 0 }));
  }
  assert.doesNotThrow(() => assertPhaseCapacity({ phase: 'recovery' }, plan));
  assert.doesNotThrow(() => assertPhaseCapacity({ phase: 'resolution', prepareDossiers: true }, plan));
  assert.throws(() => assertPhaseCapacity({ phase: 'dates', prepareDossiers: true }, plan), /capacity is unavailable/);
});

test('old identity-only or previous-reset calibration cannot unlock production', () => {
  const calibration = {
    schemaVersion: 2, asOf: '2026-09-24', capacityStart: '2026-09-24',
    dateChapters: 5, dateConcurrency: 2, scopes: 10,
    dateAcceptedChapters: ['shiji/001', 'shiji/002', 'shiji/003', 'shiji/004', 'shiji/005'],
  };
  assert.equal(calibrationIsCurrent(calibration, '2026-09-24'), true);
  assert.equal(calibrationIsCurrent(null, '2026-09-24'), false);
  assert.equal(calibrationIsCurrent({ ...calibration, schemaVersion: 1 }, '2026-09-24'), false);
  assert.equal(calibrationIsCurrent({ ...calibration, dateChapters: undefined }, '2026-09-24'), false);
  assert.equal(calibrationIsCurrent({ ...calibration, dateAcceptedChapters: undefined }, '2026-09-24'), false);
  assert.equal(calibrationIsCurrent({ ...calibration, dateAcceptedChapters: [] }, '2026-09-24'), false);
  assert.equal(calibrationIsCurrent({ ...calibration, dateAcceptedChapters: Array(5).fill('shiji/001') }, '2026-09-24'), false);
  assert.equal(calibrationIsCurrent({ ...calibration, asOf: '2026-09-13' }, '2026-09-24'), false);
  assert.equal(calibrationIsCurrent(calibration, '2026-10-24'), false);
});

test('schema 1 migration preserves expensive completed work and invalidates following identity stages', () => {
  const state = {
    schemaVersion: 1, key: 'same-day', mode: 'production', waves: 2,
    completed: ['recovery', 'extraction-1', 'editorial-1', 'resolution-1', 'extraction-2', 'editorial-2', 'resolution-2'],
  };
  const migrated = migrateCampaignDayState(state);
  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.key, state.key);
  assert.deepEqual(migrated.completed, ['recovery', 'extraction-1', 'editorial-1', 'extraction-2', 'editorial-2']);
  assert.equal(state.completed.includes('resolution-1'), true);
  const partial = migrateCampaignDayState({ ...state, schemaVersion: 2, completed: [...state.completed, 'dates-1'] });
  assert.equal(partial.completed.includes('resolution-1'), true);
  assert.equal(partial.completed.includes('resolution-2'), false);
});

test('old calibration checkpoints keep recovery and editorial but cannot bypass date evidence', () => {
  const state = {
    schemaVersion: 2, mode: 'calibration', waves: 3,
    completed: ['recovery', 'editorial-calibration', 'date-calibration', 'identity-calibration'],
  };
  assert.deepEqual(migrateCampaignDayState(state).completed, ['recovery', 'editorial-calibration']);
});

const summary = (results) => ({
  started: results.length, approved: results.filter(({ status }) => status === 'audited').length,
  failed: results.filter(({ status }) => status !== 'audited').length,
  eligibleChapters: results.length, results,
});
const outcome = (chapter, status = 'audited') => ({ book: 'shiji', chapter, status });

test('date summaries count actual accepted chapters, not planned work or foreign claims', () => {
  assert.deepEqual(dateRunAcceptedChapters(summary([])), []);
  assert.deepEqual(dateRunAcceptedChapters(summary([outcome('001'), outcome('002', 'research-blocked'), outcome('003', 'skipped')])), ['shiji/001']);
  assert.throws(() => dateRunAcceptedChapters({ ...summary([]), approved: 5 }), /counts do not match/);
  assert.throws(() => dateRunAcceptedChapters({ ...summary([]), started: -1 }), /incompatible/);
  assert.throws(() => dateRunAcceptedChapters({ accepted: 5 }), /incompatible/);
  assert.throws(() => dateRunAcceptedChapters(summary([outcome('001'), outcome('001')])), /Duplicate/);
  assert.throws(() => dateRunAcceptedChapters(summary([outcome('1')])), /Invalid chapter/);
  assert.deepEqual(dateRunAcceptedChapters({
    ...summary([outcome('001'), outcome('001', 'interrupted')]), started: 1,
  }), ['shiji/001']);
});

test('partial calibration resumes only remaining chapters and retains summary receipts', () => {
  const step = { id: 'date-calibration', phase: 'dates', limit: 5, forceCatalog: true };
  const invocation = dateCalibrationStep(step, {}, '/tmp/run-one.json');
  let state = recordDateCalibrationRun({}, summary([outcome('001'), outcome('002')]), invocation);
  assert.deepEqual(state.dateAcceptedChapters, ['shiji/001', 'shiji/002']);
  const resumed = dateCalibrationStep(step, state, '/tmp/run-two.json');
  assert.equal(resumed.limit, 3);
  assert.equal(resumed.catalogOnly, false);
  const command = phaseCommand('dates', { ...plan, dateChaptersPerWave: resumed.limit }, resumed);
  assert.deepEqual(command.slice(-4), ['--summary-out', '/tmp/run-two.json', '--min-approved', '1']);
  state = recordDateCalibrationRun(state, summary([outcome('003'), outcome('004'), outcome('005')]), resumed);
  assert.equal(state.dateAcceptedChapters.length, 5);
  assert.deepEqual(state.dateRunSummaries, ['/tmp/run-one.json', '/tmp/run-two.json']);
  const catalogRetry = dateCalibrationStep(step, state, '/tmp/unused.json');
  assert.equal(catalogRetry.catalogOnly, true);
  assert.equal(catalogRetry.limit, 0);
  assert.throws(() => recordDateCalibrationRun({}, summary([outcome('001'), outcome('002')]), { limit: 1 }), /exceeded/);
});

test('recalibration does not overwrite the production checkpoint', () => {
  assert.notEqual(campaignStateFile('calibration'), campaignStateFile('production'));
});

test('npm exposes the independent date runner and its offline tests', () => {
  const { scripts } = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(scripts['people:dates:run'], 'node scripts/run-people-date-workflow.mjs');
  assert.equal(scripts['people:dates:workflow:self-test'], 'node --test scripts/test-people-date-workflow.mjs');
});
