import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { maintainDisk, cleanNpmDownloads, hasPackageInstall } from './lib/local-disk-maintenance.mjs';

const report = (gib, pressureLevel = 1) => ({ availableBytes: String(BigInt(gib) * 1024n ** 3n), availableGiB: gib, memory: { pressureLevel }, errors: gib < 30 ? ['disk reserve'] : [] });
test('early trigger cleans once, measures actual recovery and does not dismiss native guard failure', () => {
  let state, cleaned = 0, notified = 0;
  const reports = [report(29), report(31)];
  const deps = { now: 'test', measure: () => reports.shift(), save: x => { state = structuredClone(x); }, clean: plan => { cleaned++; plan({path:'cache'}); return { status: 'removed' }; }, notify: () => notified++ };
  const result = maintainDisk(deps);
  assert.equal(result.status, 'needs-space');
  assert.equal(result.episode.observedFreeBytesChange, String(2n * 1024n ** 3n));
  assert.equal(result.episode.plan.path, 'cache');
  maintainDisk({ ...deps, state, measure: () => report(28) });
  assert.equal(cleaned, 1); assert.equal(notified, 1);
  assert.deepEqual(state.measurement.errors, ['disk reserve']);
});
test('40GiB recovery rearms trigger; healthy checks never clean', () => {
  let state, calls = 0;
  const deps = { now: 'test', save: x => { state = structuredClone(x); }, clean: () => { calls++; }, notify: () => {} };
  maintainDisk({ ...deps, measure: () => report(35) });
  assert.equal(calls, 0);
  maintainDisk({ ...deps, state: {episode:{startedAt:'old'}}, measure: () => report(40) });
  assert.equal(state.episode, undefined);
});
test('unknown/warning memory skips cleanup and failed measurements throw before deletion', () => {
  let cleanup = 0;
  const deps = { now:'test', save:()=>{}, notify:()=>{}, clean:()=>{cleanup++;} };
  const r = maintainDisk({...deps, measure:()=>report(29,2)});
  assert.equal(r.episode.cleanup.status,'skipped');
  assert.throws(()=>maintainDisk({...deps,measure:()=>{throw Error('unknown');}}),/unknown/);
  assert.equal(cleanup,0);
});
test('cleanup failure is durable, visible and not retried on next tick', () => {
  let state, alerted=0;
  const deps={now:'test',measure:()=>report(31),save:x=>{state=structuredClone(x);},notify:()=>alerted++,clean:()=>{throw Error('lsof unavailable');}};
  assert.throws(()=>maintainDisk(deps),/lsof unavailable/);
  assert.equal(state.status,'cleanup-error');
  maintainDisk({...deps,state});
  assert.equal(alerted,1);
});
test('interrupted cleanup requires inspection and alerts once without retrying deletion',()=>{
  let state, alerts=0;
  const deps={now:'test',measure:()=>report(32),save:x=>{state=structuredClone(x);},notify:()=>alerts++,clean:()=>assert.fail('must not retry')};
  maintainDisk({...deps,state:{status:'cleanup-started',episode:{startedAt:'prior',cleanupAttempted:true}}});
  assert.equal(state.status,'interrupted-needs-inspection');
  maintainDisk({...deps,state});assert.equal(alerts,1);
});
test('busy and warning-pressure deferrals retry safely after conditions clear',()=>{
  let state, attempts=0, alerts=0;
  const deps={now:'test',measure:()=>report(32),save:x=>{state=structuredClone(x);},notify:()=>alerts++,clean:()=>{attempts++;return{status:attempts===1?'busy':'removed-download-cache'};}};
  maintainDisk(deps);assert.equal(state.status,'cleanup-deferred');
  maintainDisk({...deps,state});assert.equal(attempts,2);assert.equal(alerts,1);
  maintainDisk({...deps,state});assert.equal(attempts,2);
  maintainDisk({...deps,state:undefined,measure:()=>report(32,2)});
  assert.equal(state.status,'cleanup-deferred');
  maintainDisk({...deps,state});assert.equal(attempts,3);
});
test('notification failure retains incident and retries alert without repeating deletion',()=>{
  let state, cleanups=0, alerts=0;
  const deps={now:'test',measure:()=>report(32),save:x=>{state=structuredClone(x);},clean:()=>{cleanups++;return{status:'removed-download-cache'};},notify:()=>{if(++alerts===1)throw Error('alert unavailable');}};
  assert.throws(()=>maintainDisk(deps),/alert unavailable/);
  assert.equal(state.episode.notificationDeliveredAt,undefined);
  maintainDisk({...deps,state});assert.equal(alerts,2);assert.equal(cleanups,1);
  assert.equal(state.episode.notificationError,undefined);
});
function fixture(t) {
  const home=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'disk-cleanup-test-')));
  t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
  const cache=path.join(home,'.npm/_cacache');fs.mkdirSync(cache,{recursive:true});
  fs.writeFileSync(path.join(cache,'download'),'reproducible');
  fs.writeFileSync(path.join(home,'.npm/config'),'preserve');
  return {home,cache};
}
const idle=(command)=>command.endsWith('lsof')?{status:1,stdout:'',stderr:''}:{status:0,stdout:'node app/server.mjs\n',stderr:''};
test('only exact npm downloads removed, receipt precedes mutation, installed/config files retained',t=>{
  const {home,cache}=fixture(t);let planned=false;
  const result=cleanNpmDownloads(home,idle,plan=>{assert.equal(plan.path,cache);assert.ok(fs.existsSync(cache));planned=true;});
  assert.equal(result.status,'removed-download-cache');assert.ok(planned);
  assert.ok(!fs.existsSync(cache));assert.equal(fs.readFileSync(path.join(home,'.npm/config'),'utf8'),'preserve');
});
test('open files and package installs preserve cache; failed lsof fails closed',t=>{
  const {home,cache}=fixture(t);
  assert.equal(cleanNpmDownloads(home,()=>({status:0,stdout:'p123\nn/cache/download\n'})).status,'busy');
  const install=command=>command.endsWith('lsof')?idle(command):{status:0,stdout:'node /bin/npm-cli.js install\n'};
  assert.equal(cleanNpmDownloads(home,install).status,'busy');
  assert.throws(()=>cleanNpmDownloads(home,()=>({status:1,stdout:'',stderr:'permission denied'})),/incomplete/);
  assert.ok(fs.existsSync(cache));
});
test('only the exact lsof inspection PID is excluded; malformed open-file output refuses deletion',t=>{
  const {home,cache}=fixture(t);
  const self=command=>command.endsWith('lsof')?{status:0,pid:42,stdout:'p42\nn/cache\n'}:idle(command);
  assert.equal(cleanNpmDownloads(home,self).status,'removed-download-cache');
  fs.mkdirSync(cache);
  const other=()=>({status:0,pid:42,stdout:'p42\nn/cache\np43\nn/cache/file\n'});
  assert.equal(cleanNpmDownloads(home,other).status,'busy');
  assert.throws(()=>cleanNpmDownloads(home,()=>({status:0,stdout:'unknown\n'})),/Unrecognized/);
});
test('symlinks and special files cannot expand deletion scope',t=>{
  const {home,cache}=fixture(t);fs.symlinkSync(home,path.join(cache,'redirect'));
  assert.throws(()=>cleanNpmDownloads(home,idle),/special file/);
  fs.unlinkSync(path.join(cache,'redirect'));fs.renameSync(cache,cache+'-saved');fs.symlinkSync(cache+'-saved',cache);
  assert.throws(()=>cleanNpmDownloads(home,idle),/redirected/);
  assert.ok(fs.existsSync(path.join(cache+'-saved','download')));
});
test('package activity detection fails closed with flags and even npm dev invocations',()=>{
  assert.equal(hasPackageInstall('node app/server.mjs\nnode scripts/maintain-local-disk.mjs run'),false);
  for(const text of ['npm install','node /bin/npm-cli.js ci','pnpm add x','yarn install','npx package','npm --omit=dev install','npm --prefix x ci','pnpm --filter pkg add','yarn --cwd d install','npm run dev'])assert.equal(hasPackageInstall(text),true);
});
test('kernel lock rejects a concurrent job and releases after worker termination without deleting lock file', { skip: process.platform !== 'darwin' }, async t=>{
  const {home}=fixture(t),lock=path.join(home,'maintenance.lock');
  const child=spawn('/usr/bin/lockf',['-k','-t','0',lock,process.execPath,'-e','console.log(process.pid);setInterval(()=>{},1000)']);
  let worker;
  t.after(()=>{if(worker){try{process.kill(worker,'SIGTERM');}catch(e){if(e.code!=='ESRCH')throw e;}}});
  const exited=new Promise(resolve=>child.once('exit',resolve));
  worker=Number(await new Promise((resolve,reject)=>{child.stdout.once('data',x=>resolve(x.toString().trim()));child.once('error',reject);}));
  assert.ok(worker>0);
  const blocked=spawnSync('/usr/bin/lockf',['-k','-t','0',lock,'/usr/bin/true']);
  assert.equal(blocked.status,75);
  process.kill(worker,'SIGTERM');await exited;worker=null;
  assert.ok(fs.existsSync(lock));
  assert.equal(spawnSync('/usr/bin/lockf',['-k','-t','0',lock,'/usr/bin/true']).status,0);
});
