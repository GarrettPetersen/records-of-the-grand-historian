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
if (process.argv.length !== 3 || !['run', '_locked-run', 'status', 'install', 'uninstall'].includes(command)) throw new Error('Usage: node scripts/maintain-local-disk.mjs run|status|install|uninstall');
if (process.platform !== 'darwin') throw new Error('Automatic disk maintenance is a macOS host service');
const statePath = path.join(directory, 'state.json');
const read = () => { try { return JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
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
} else if (command === 'run') {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  // Kernel-owned BSD lock: automatically released after crash/reboot. Never
  // unlink it (-k), which would let another process lock a different inode.
  const child = spawnSync('/usr/bin/lockf', ['-k', '-t', '0', path.join(directory, 'maintenance.lock'),
    process.execPath, fileURLToPath(import.meta.url), '_locked-run'], { stdio: 'inherit',
    env: { ...process.env, HISTORIES_DISK_MAINTENANCE_LOCK: path.join(directory, 'maintenance.lock') } });
  if (child.error) throw child.error;
  if (child.status === null) throw new Error(`Disk maintenance terminated: ${child.signal}`);
  process.exitCode = child.status;
} else {
    if (process.env.HISTORIES_DISK_MAINTENANCE_LOCK !== path.join(directory, 'maintenance.lock')) throw new Error('Internal maintenance worker requires lockf handoff; use run');
    delete process.env.HISTORIES_DISK_MAINTENANCE_LOCK;
    const now = new Date().toISOString();
    const save = state => {
      const temp = `${statePath}.tmp`;
      fs.writeFileSync(temp, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
      fs.renameSync(temp, statePath);
      if (state.episode) fs.writeFileSync(path.join(directory, `incident-${state.episode.startedAt.replaceAll(':', '-')}.json`), JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
    };
    const result = maintainDisk({ state: read(), now, measure: () => inspectLocalDisk(root), save,
      clean: plan => cleanNpmDownloads(os.homedir(), undefined, plan),
      notify: state => {
        const outcome = state.status === 'cleanup-deferred'
          ? `Cleanup deferred (${state.episode.cleanup.status}); no deletion.`
          : state.status === 'cleanup-error' || state.status === 'interrupted-needs-inspection'
            ? 'Cleanup needs inspection; no automatic retry.'
            : state.episode.cleanup?.status === 'removed-download-cache' ? 'Unused npm downloads removed.' : 'No cleanup performed.';
        const message = `24histories: ${state.measurement.availableGiB.toFixed(1)} GiB free. ${outcome} See LOCAL_DISK_STRATEGY.md; resource guards still apply.`;
        execFileSync('/usr/bin/osascript', ['-e', `display notification ${JSON.stringify(message)} with title "24histories disk maintenance"`], { timeout: 10000 });
      } });
    if (process.stdout.isTTY) console.log(JSON.stringify(result, null, 2));
    if (result.measurement.errors.length || ['cleanup-error', 'interrupted-needs-inspection'].includes(result.status)) process.exitCode = 1;
}
