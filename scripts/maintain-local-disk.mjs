#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { inspectLocalDisk } from './check-local-disk.mjs';
import { maintainDisk, cleanNpmDownloads } from './lib/local-disk-maintenance.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(os.homedir(), '.local/state/24histories-disk-maintenance');
const label = 'com.24histories.disk-maintenance';
const plist = path.join(os.homedir(), 'Library/LaunchAgents', `${label}.plist`);
const service = `gui/${process.getuid()}/${label}`;
const xml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const command = process.argv[2];
if (process.argv.length !== 3 || !['run', 'status', 'install', 'uninstall'].includes(command)) throw new Error('Usage: node scripts/maintain-local-disk.mjs run|status|install|uninstall');
if (process.platform !== 'darwin') throw new Error('Automatic disk maintenance is a macOS host service');
const statePath = path.join(directory, 'state.json');
const read = () => fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : null;
if (command === 'status') {
  console.log(JSON.stringify({ service, statePath, state: read() }, null, 2));
} else if (command === 'install' || command === 'uninstall') {
  const loaded = spawnSync('/bin/launchctl', ['print', service], { stdio: 'ignore' }).status === 0;
  if (loaded) execFileSync('/bin/launchctl', ['bootout', service]);
  if (command === 'uninstall') {
    fs.rmSync(plist, { force: true });
    console.log('Disk maintenance timer uninstalled; incident receipts preserved.');
  } else {
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    fs.mkdirSync(path.dirname(plist), { recursive: true });
    const doc = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict>
<key>Label</key><string>${label}</string><key>ProgramArguments</key><array><string>${xml(process.execPath)}</string><string>${xml(fileURLToPath(import.meta.url))}</string><string>run</string></array>
<key>WorkingDirectory</key><string>${xml(root)}</string><key>StartInterval</key><integer>300</integer><key>RunAtLoad</key><true/>
<key>StandardErrorPath</key><string>${xml(path.join(directory, 'error.log'))}</string></dict></plist>`;
    fs.writeFileSync(plist, doc, { mode: 0o600 });
    execFileSync('/usr/bin/plutil', ['-lint', plist]);
    execFileSync('/bin/launchctl', ['bootstrap', `gui/${process.getuid()}`, plist]);
    console.log(`Installed five-minute disk maintenance timer: ${service}`);
  }
} else {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const lock = path.join(directory, 'running.lock');
  try { fs.mkdirSync(lock); } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    throw new Error(`Maintenance already running or interrupted: inspect ${lock}; never clear a live lock`);
  }
  try {
    fs.writeFileSync(path.join(lock, 'pid'), String(process.pid));
    const now = new Date().toISOString();
    const save = state => {
      const temp = `${statePath}.tmp`;
      fs.writeFileSync(temp, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
      fs.renameSync(temp, statePath);
    };
    const result = maintainDisk({ state: read(), now, measure: () => inspectLocalDisk(root), save,
      clean: plan => cleanNpmDownloads(os.homedir(), undefined, plan),
      notify: state => {
        const message = ['needs-space', 'cleanup-error', 'interrupted-needs-inspection'].includes(state.status)
          ? `24histories disk low: ${state.measurement.availableGiB.toFixed(1)} GiB free. Safe cleanup exhausted. See LOCAL_DISK_STRATEGY.md; preserve active work.`
          : `24histories disk cleanup recorded: ${state.measurement.availableGiB.toFixed(1)} GiB free. Resource guards still apply.`;
        execFileSync('/usr/bin/osascript', ['-e', `display notification ${JSON.stringify(message)} with title "24histories disk maintenance"`], { timeout: 10000 });
      } });
    // Keep one small receipt per episode, rather than an unbounded polling log.
    if (result.episode) fs.writeFileSync(path.join(directory, `incident-${result.episode.startedAt.replaceAll(':', '-')}.json`), JSON.stringify(result, null, 2) + '\n', { mode: 0o600 });
    if (process.stdout.isTTY) console.log(JSON.stringify(result, null, 2));
    if (result.measurement.errors.length || ['cleanup-error', 'interrupted-needs-inspection'].includes(result.status)) process.exitCode = 1;
  } finally { fs.rmSync(lock, { recursive: true }); }
}
