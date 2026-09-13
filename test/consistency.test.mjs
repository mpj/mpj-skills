// The stale-claim tests.
//
// Every defect found in this skill by review rather than by the gate has had the
// same shape: a rule moved, and a sentence stating the old rule stayed standing in
// a file the change never touched. The masthead sentence, the anchoring universal
// and the README's four-rule gate were all of that kind, and so was the writer's
// seat keeping the ground-truth sheet in its system message. None of them is a
// style fault, so the gate is blind to all of them. These are the ones a machine
// can hold.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, globSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKILL = 'plugins/rung/skills/rung';
const files = globSync(`${SKILL}/**/*.md`, { cwd: ROOT }).sort();
const read = f => readFileSync(join(ROOT, f), 'utf8');
const corpus = files.map(f => [f, read(f)]);

test('every reference file the prose names exists on disk', () => {
  const missing = [];
  for (const [f, text] of corpus) {
    for (const m of text.matchAll(/`((?:references\/)?[a-z0-9-]+(?:\/[a-z0-9-]+)*\.md)`/g)) {
      const named = m[1];
      // A `.local.md` anchor is git-ignored by design and is absent until a
      // session on this machine fetches it. Its absence is the correct state.
      if (named.endsWith('.local.md')) continue;
      const candidates = [
        join(SKILL, named),
        join(SKILL, 'references', basename(named)),
      ];
      if (!candidates.some(c => existsSync(join(ROOT, c)))) missing.push(`${f} names ${named}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('no living author\'s prose is committed: the anchor cache stays git-ignored', () => {
  // The invariant is "not committed", never "not present". A machine that has
  // correctly fetched its anchors has the file in the working tree, and this
  // test must stay green there, so it asks git what is tracked and not the disk.
  const tracked = execFileSync('git', ['ls-files', '*.local.md'], { cwd: ROOT, encoding: 'utf8' }).trim();
  assert.equal(tracked, '',
    'a *.local.md file is tracked; anchors are fetched per machine and never committed');
  const ignore = readFileSync(join(ROOT, '.gitignore'), 'utf8');
  assert.match(ignore, /^\*\.local\.md$/m, '.gitignore must still carry the anchor pattern');
});

test('the two files that name the anchor cache agree on how it is spelled', () => {
  // These are the only two places the filename appears, and the existence test
  // skips them by design, so nothing else holds them together. A session reading
  // one file and a session reading the other must write the same path.
  const pattern = read(`${SKILL}/references/protocol.md`).match(/`references\/anchors\/<author>\.local\.md`/);
  assert.ok(pattern, 'protocol.md must state the anchor cache convention');
  const concrete = read(`${SKILL}/references/head-writer.md`).match(/`references\/anchors\/([a-z-]+)\.local\.md`/);
  assert.ok(concrete, 'head-writer.md must name its own anchor cache file');
  assert.equal(concrete[1], 'spolsky', 'the writer\'s anchor file is named for its author, lowercased');
});

test('every anchor file that does ship says on its first line what it is', () => {
  const shipped = globSync(`${SKILL}/references/anchors/*.md`, { cwd: ROOT });
  assert.ok(shipped.length > 0, 'expected at least one shipped anchor file');
  for (const f of shipped) {
    const first = read(f).split('\n').find(l => l.trim() && !l.startsWith('#'));
    assert.match(first, /synthetic|invented|indicative/i,
      `${f} must declare on its first line that no real person said it`);
  }
});

test('one file says what goes in a seat\'s system message', () => {
  // `model-selection.md` told the writer's seat to put the ground-truth sheet there
  // until 2026-09-13, contradicting the driver's contract and costing the cached
  // prefix on every call. The contract owns this fact; the provenance records the
  // history and is allowed to quote the old wording.
  const offenders = corpus
    .filter(([f]) => !f.endsWith('protocol.md') && !f.endsWith('provenance.md'))
    .filter(([, t]) => /ground-truth sheet[^.]{0,80}in the system message/i.test(t))
    .map(([f]) => f);
  assert.deepEqual(offenders, []);
});

test('the anchor dose has a ceiling everywhere it is stated', () => {
  // "at least three" with no ceiling stood in head-writer.md and protocol.md while
  // model-selection.md recorded that fidelity is flat beyond roughly four exemplars.
  const offenders = corpus
    .filter(([, t]) => /at least three (?:verbatim )?(?:passages|essays)|three or more verbatim/i.test(t))
    .filter(([f]) => !f.endsWith('provenance.md'))
    .map(([f]) => f);
  assert.deepEqual(offenders, []);
});

test('no file outside the record claims a count of the skill\'s own files', () => {
  // provenance.md's counts are dated entries about a particular day and stay put.
  const offenders = corpus
    .filter(([f]) => !f.endsWith('provenance.md'))
    .filter(([, t]) => /\b(?:all |own )(?:six|seven|eight|nine|ten|eleven|twelve|\d+) files\b/i.test(t))
    .map(([f]) => f);
  assert.deepEqual(offenders, []);
});

test('the head writer\'s model id is the same string everywhere it appears', () => {
  const ids = new Set();
  for (const [, t] of corpus) for (const m of t.matchAll(/`(deepseek\/[a-z0-9.-]+)`/g)) ids.add(m[1]);
  assert.deepEqual([...ids], ['deepseek/deepseek-v4-pro']);
});

test('the dead C-SPAN routes keep their status codes on the record', () => {
  // The routes are written down so the next session does not spend a turn
  // rediscovering them, and so nobody quietly restores the "fetchable" claim by
  // deleting the evidence against it.
  const advisors = readFileSync(join(ROOT, SKILL, 'references/advisors.md'), 'utf8');
  assert.match(advisors, /402 Payment Required/);
  assert.equal((advisors.match(/answers 404/g) || []).length, 2);
  assert.match(advisors, /used to say they were/,
    'the file must keep saying that it once claimed these were reachable');
});
