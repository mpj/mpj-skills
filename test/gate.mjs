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

// Returns { ok, findings } for one file. The gate exits 1 with findings printed
// and 0 with "ok clean", so a non-zero exit is a result and never an error.
export function runGate(gatePath, filePath) {
  let out;
  try {
    out = execFileSync(process.execPath, [gatePath, filePath], { encoding: 'utf8' });
    return { ok: true, findings: [] };
  } catch (err) {
    if (err.status !== 1) throw err;
    out = err.stdout;
  }
  const findings = out.split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => l.replace(/^x /, ''));
  return { ok: false, findings };
}

// The leak check ships the same way the gate does: as the single js block inside
// its own reference file. Extracted and imported rather than copied.
export const LEAK_DOC = 'plugins/rung/skills/rung/references/leak-check.md';

export async function importLeakCheck(repoRoot) {
  const doc = readFileSync(join(repoRoot, LEAK_DOC), 'utf8');
  const blocks = [...doc.matchAll(/```js\n([\s\S]*?)```/g)].map(m => m[1]);
  if (blocks.length !== 1) {
    throw new Error(`expected exactly one js block in ${LEAK_DOC}, found ${blocks.length}`);
  }
  const dir = mkdtempSync(join(tmpdir(), 'rung-leak-'));
  const path = join(dir, 'leak-check.mjs');
  writeFileSync(path, blocks[0]);
  return import(`file://${path}`);
}
