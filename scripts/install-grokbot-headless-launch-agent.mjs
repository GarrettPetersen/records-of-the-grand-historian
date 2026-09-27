#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const LABEL = 'com.24histories.grokbot-headless';

function xml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function launchctl(...args) {
  return execFileSync('/bin/launchctl', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dispatcher = path.join(repoRoot, 'scripts', 'grokbot-headless-dispatch.mjs');
const stateDirectory = path.join(os.homedir(), '.local', 'state', '24histories-grokbot-headless');
const agentsDirectory = path.join(os.homedir(), 'Library', 'LaunchAgents');
const plist = path.join(agentsDirectory, `${LABEL}.plist`);
const domain = `gui/${process.getuid()}`;
const service = `${domain}/${LABEL}`;

function isLoaded() {
  return spawnSync('/bin/launchctl', ['print', service], { stdio: 'ignore' }).status === 0;
}

if (process.argv[2] === 'uninstall') {
  if (isLoaded()) launchctl('bootout', service);
  fs.rmSync(plist, { force: true });
  console.log(`Uninstalled ${LABEL}`);
  process.exit(0);
}
if (process.argv.length > 2) throw new Error('Usage: install-grokbot-headless-launch-agent.mjs [uninstall]');

fs.mkdirSync(stateDirectory, { recursive: true, mode: 0o700 });
fs.mkdirSync(agentsDirectory, { recursive: true });
const document = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${xml(process.execPath)}</string>
    <string>${xml(dispatcher)}</string>
    <string>daemon</string>
    <string>--launch-app</string>
  </array>
  <key>WorkingDirectory</key><string>${xml(repoRoot)}</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>10</integer>
  <key>StandardOutPath</key><string>${xml(path.join(stateDirectory, 'daemon.log'))}</string>
  <key>StandardErrorPath</key><string>${xml(path.join(stateDirectory, 'daemon.error.log'))}</string>
</dict>
</plist>
`;
fs.writeFileSync(plist, document, { mode: 0o644 });
if (isLoaded()) launchctl('bootout', service);
launchctl('bootstrap', domain, plist);
launchctl('enable', service);
launchctl('kickstart', '-k', service);
console.log(`Installed and started ${LABEL}`);
console.log(`Logs: ${stateDirectory}`);
