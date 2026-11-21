// The exa CLI, held offline: what it does without a key, and whether the skill
// that documents it names only commands it has.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKILL = join(ROOT, 'plugins/exa/skills/exa');
const CLI = join(SKILL, 'bin/exa');
const run = (args, env = {}) => {
  const e = { ...process.env, ...env };
  delete e.EXA_API_KEY;
  return spawnSync(process.execPath, [CLI, ...args], { env: e, encoding: 'utf8' });
};

test('without a key it exits 1 before any request, and says how to get one into the shell', () => {
  const r = run(['search', 'anything']);
  assert.equal(r.status, 1);
  assert.equal(r.stdout, '');
  const err = JSON.parse(r.stderr);
  assert.match(err.error, /EXA_API_KEY is not set/);
  assert.match(err.hint, /zsh -ic/);
  assert.match(err.hint, /~\/\.zshenv/, 'the hint must name the lasting fix, not only the workaround');
});

test('a malformed argument fails on its own, without needing the key', () => {
  const r = run(['search', 'x', '--since', '2026/01/01']);
  assert.equal(r.status, 1);
  assert.match(JSON.parse(r.stderr).error, /YYYY-MM-DD/);
});

test('every `exa <command>` the skill shows is a command the CLI has', () => {
  const help = run(['--help']).stdout;
  const known = new Set([...help.matchAll(/^  ([a-z]+) </gm)].map(m => m[1]));
  assert.ok(known.size >= 5, 'expected the usage text to list its commands');
  const shown = new Set([...readFileSync(join(SKILL, 'SKILL.md'), 'utf8').matchAll(/^exa ([a-z]+)\b/gm)].map(m => m[1]));
  const unknown = [...shown].filter(c => !known.has(c));
  assert.deepEqual(unknown, []);
});
