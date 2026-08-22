export function createRunControl() {
  return {
    stopRequested: false,
    cancelRequested: false,
    stopReason: null,
    activeRuns: new Map(),
  };
}

function entryLabel(entry) {
  if (entry.label) return entry.label;
  if (entry.target?.book && entry.target?.chapter) {
    return `[${entry.target.book}/${entry.target.chapter}]`;
  }
  return 'Cursor agent';
}

export async function cancelActiveRuns(control) {
  control.cancelRequested = true;
  const active = [...control.activeRuns.values()];
  if (active.length === 0) return;
  console.error(`Cancelling ${active.length} active Cursor run(s)...`);
  await Promise.all(active.map(async (entry) => {
    try {
      if (entry.cancel) await entry.cancel(entry.run);
      else if (entry.run.supports('cancel')) await entry.run.cancel();
      else console.error(`${entryLabel(entry)} run ${entry.run.id} does not support cancellation`);
    } catch (error) {
      console.error(
        `${entryLabel(entry)} could not cancel ${entry.run.id}: ` +
        `${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }));
}

export function installSignalHandlers(control, options = {}) {
  let interruptCount = 0;
  const cancelOnFirstInterrupt = options.cancelOnFirstInterrupt ?? false;
  const onInterrupt = () => {
    interruptCount += 1;
    control.stopRequested = true;
    control.stopReason = 'SIGINT';
    if (cancelOnFirstInterrupt || interruptCount > 1) {
      void cancelActiveRuns(control);
      return;
    }
    console.error(
      `SIGINT received: draining ${control.activeRuns.size} active run(s); ` +
      'no new agents will start. Press Ctrl-C again to cancel active runs.',
    );
  };
  const onTerminate = () => {
    control.stopRequested = true;
    control.stopReason = 'SIGTERM';
    void cancelActiveRuns(control);
  };
  process.on('SIGINT', onInterrupt);
  process.on('SIGTERM', onTerminate);
  return () => {
    process.off('SIGINT', onInterrupt);
    process.off('SIGTERM', onTerminate);
  };
}
