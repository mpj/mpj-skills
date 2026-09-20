// Extracts the lint gate's reference implementation from its own documentation
// and runs it. The gate ships as a code block inside `lint-gate.md`; nothing
// else in the repository is allowed to hold a second copy of it.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

export const GATE_DOC = 'plugins/rung/skills/rung/references/lint-gate.md';

export function extractGate(repoRoot) {
  const doc = readFileSync(join(repoRoot, GATE_DOC), 'utf8');
  const blocks = [...doc.matchAll(/```js\n([\s\S]*?)```/g)].map(m => m[1]);
  if (blocks.length !== 1) {
    throw new Error(`expected exactly one js block in ${GATE_DOC}, found ${blocks.length}`);
  }
  const dir = mkdtempSync(join(tmpdir(), 'rung-gate-'));
  const path = join(dir, 'style-lint.mjs');
  writeFileSync(path, blocks[0]);
  return path;
}

// Returns { ok, findings, notes } for one file. Advisories can accompany either
// exit status; exit 1 means blocking findings, while exit 0 permits delivery.
export function runGate(gatePath, filePath, { conversation = false } = {}) {
  let out;
  let ok = true;
  try {
    out = execFileSync(process.execPath, [gatePath, filePath, ...(conversation ? ['--conversation'] : [])], { encoding: 'utf8' });
  } catch (err) {
    if (err.status !== 1) throw err;
    ok = false;
    out = err.stdout;
  }
  const lines = out.split('\n').map(l => l.trim()).filter(Boolean);
  const notes = lines.filter(l => l.startsWith('note ')).map(l => l.slice(5));
  const findings = ok ? [] : lines.filter(l => !l.startsWith('note '))
    .map(l => l.replace(/^x /, ''));
  return { ok, findings, notes };
}

// The leak check ships the same way the gate does: as the single js block inside
// its own reference file. Extracted and imported rather than copied.
export const LEAK_DOC = 'plugins/rung/skills/rung/references/leak-check.md';

export function leakCheckPath(repoRoot) {
  const doc = readFileSync(join(repoRoot, LEAK_DOC), 'utf8');
  const blocks = [...doc.matchAll(/```js\n([\s\S]*?)```/g)].map(m => m[1]);
  if (blocks.length !== 1) {
    throw new Error(`expected exactly one js block in ${LEAK_DOC}, found ${blocks.length}`);
  }
  const dir = mkdtempSync(join(tmpdir(), 'rung-leak-'));
  const path = join(dir, 'leak-check.mjs');
  writeFileSync(path, blocks[0]);
  return path;
}

export async function importLeakCheck(repoRoot) {
  return import(`file://${leakCheckPath(repoRoot)}`);
}
