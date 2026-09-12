import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './people-content.mjs';

const POLICY_PATH = path.join(REPO_ROOT, 'data', 'people', 'campaign-policy.json');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;

export function readPeopleCampaignPolicy() {
  const policy = JSON.parse(fs.readFileSync(POLICY_PATH, 'utf8'));
  if (policy.schemaVersion !== 1) throw new Error('Unsupported people campaign policy schema');
  if (policy.mode !== 'quality-first') throw new Error('People campaign policy must be quality-first');
  if (!Number.isInteger(policy.planningHorizonDays) || policy.planningHorizonDays < 1) {
    throw new Error('People campaign policy planningHorizonDays must be a positive integer');
  }
  if (!Number.isInteger(policy.maxChaptersPerWave) || policy.maxChaptersPerWave < 1) {
    throw new Error('People campaign policy maxChaptersPerWave must be a positive integer');
  }
  for (const lane of ['cursor-sdk', 'grokbot']) {
    if (!ISO_DATE.test(policy.lanes?.[lane]?.capacityStart ?? '')) {
      throw new Error(`People campaign policy ${lane} capacityStart must use YYYY-MM-DD`);
    }
  }
  return policy;
}

export function rollingCampaignDeadline(asOf, planningHorizonDays) {
  if (!ISO_DATE.test(asOf)) throw new Error('Campaign planning date must use YYYY-MM-DD');
  const [year, month, day] = asOf.split('-').map(Number);
  const deadline = new Date(Date.UTC(year, month - 1, day + planningHorizonDays - 1));
  return deadline.toISOString().slice(0, 10);
}
