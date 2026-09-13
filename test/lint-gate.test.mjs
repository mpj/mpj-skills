// The lint gate, tested against the documentation it ships inside of.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, globSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { extractGate, runGate, GATE_DOC } from './gate.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const SKILL = 'plugins/rung/skills/rung';
const gate = extractGate(ROOT);

function lintText(text) {
  const f = join(mkdtempSync(join(tmpdir(), 'rung-t-')), 'sample.md');
  writeFileSync(f, text);
  return runGate(gate, f);
}

test('the gate ships as exactly one code block and that block runs', () => {
  const r = lintText('A plain sentence that offends nothing at all.\n');
  assert.deepEqual(r.findings, []);
  assert.equal(r.ok, true);
});

test('rule 1 catches em dashes and spaced hyphens posing as dashes', () => {
  // An em dash is a rule 1 finding and a rule 6 finding at once, by design:
  // rule 1 names the punctuation fault and rule 6 names the code point.
  assert.deepEqual(lintText('He left — and stayed.').findings,
    ['em dash: 1x', 'non-ASCII U+2014 "—" (1x) looks like "-"']);
  assert.deepEqual(lintText('He left - and stayed.').findings, ['spaced hyphen as dash: 1x']);
});

test('rule 2 catches the reversal frame in its costumes', () => {
  for (const s of ['It is not a bug, but a feature.', "This isn't just slow.",
                   "These aren't only tests.", "It's not about the money."]) {
    assert.equal(lintText(s).findings.length, 1, s);
    assert.match(lintText(s).findings[0], /^reversal frame:/, s);
  }
  assert.deepEqual(lintText('It is not a bug. It is a feature.').findings, []);
});

test('rule 3 matches the lexicon as a word prefix and reports a count', () => {
  assert.deepEqual(lintText('A robust and robustly delightful thing.').findings,
    ['slop word: robust (2x)', 'slop word: delightful (1x)']);
  assert.deepEqual(lintText('The load bearing wall, the load-bearing wall.').findings,
    ['slop word: load-bearing (2x)']);   // either spelling, as rule 3 says
});

test('rule 4 catches a probable three-item ending', () => {
  assert.deepEqual(lintText('He arrived, waited, and left.').findings,
    ['possible triad ending: "arrived, waited, and left."']);
});

// Rule 5 is the one with the most moving parts, so it gets the most cases.
const body = w => Array.from({ length: w }, (_, i) => `w${i}`).join(' ');
const part = (n, words) => `**Part ${n} of ?**\n\nWhat is a thing?\n\n${body(words)}\n\n**TERMINOLOGY**\n`;

test('rule 5 measures prose between the question line and the label', () => {
  assert.deepEqual(lintText(part(1, 150)).findings, []);
  assert.deepEqual(lintText(part(1, 99)).findings,
    ['prose word count (Part 1): 99 words (the range is 120 to 220)']);
  assert.deepEqual(lintText(part(1, 250)).findings,
    ['prose word count (Part 1): 250 words (the range is 120 to 220)']);
});

test('rule 5 exempts Part 0 and stays silent on a file with no position line', () => {
  assert.deepEqual(lintText(part(0, 40)).findings, []);
  assert.deepEqual(lintText(`${body(40)}\n`).findings, []);
});

test('rule 5 measures every part in the file, not only the first', () => {
  assert.deepEqual(lintText(part(1, 150) + '\n' + part(2, 40)).findings,
    ['prose word count (Part 2): 40 words (the range is 120 to 220)']);
});

test('rule 5 reports a delivery it cannot measure instead of skipping it', () => {
  const r = lintText('**Part 3 of ?**\n\nWhat is a thing?\n\n' + body(40) + '\n');
  assert.deepEqual(r.findings,
    ['prose word count (Part 3): no TERMINOLOGY label before the next part or the end of the file; not measured']);
});

test('rule 5 does not read a sentence opening with the words as a delivery', () => {
  // `provenance.md` contains such a sentence; an earlier pattern read it as a part.
  assert.deepEqual(lintText('Part 2 of the record was written later.\n').findings, []);
});

test('rule 6 names the code point and the ASCII character it resembles', () => {
  assert.deepEqual(lintText('a‑b').findings, ['non-ASCII U+2011 "‑" (1x) looks like "-"']);
  assert.deepEqual(lintText('ó').findings, ['non-ASCII U+00F3 "ó" (1x)']);
  assert.deepEqual(lintText('plain ascii, tabs\tand newlines\n').findings, []);
});

test('rule 6 catches the invisible hyphen that walks through rule 1', () => {
  // Run 7 emitted U+2011 in nearly every delivery; it reads as a hyphen on screen.
  assert.deepEqual(lintText('a‑b').findings.length, 1);
  assert.equal(lintText('a‑b').findings[0].includes('em dash'), false);
});

// --- The skill's own files, against the exemption list it publishes ---

const skillFiles = globSync(`${SKILL}/**/*.md`, { cwd: ROOT }).sort();

test('the published exemption block is the gate\'s own current output', () => {
  const doc = readFileSync(join(ROOT, GATE_DOC), 'utf8');
  const blocks = [...doc.matchAll(/```text\n([\s\S]*?)```/g)];
  assert.equal(blocks.length, 1, 'expected exactly one exemption block in lint-gate.md');
  const published = blocks[0][1].trim().split('\n');

  const actual = [];
  for (const f of skillFiles) {
    const rel = f.replace(`${SKILL}/`, '');
    if (rel === 'references/lint-gate.md') continue;   // self-referential; see the file
    for (const x of runGate(gate, join(ROOT, f)).findings) actual.push(`${rel}  ${x}`);
  }
  assert.deepEqual(published, actual,
    'lint-gate.md\'s exemption block has drifted from what the gate finds');
});

// lint-gate.md cannot carry its own expected findings: every finding is a literal
// string, so publishing the list inside the file changes the list. This is the one
// fact in the skill that lives in a test rather than in a document.
const LINT_GATE_EXPECTED = [
  'em dash: 2x',
  'reversal frame: "not X, but"', 'reversal frame: "not X, but"',
  'reversal frame: "not X, it\'s"', 'reversal frame: "not X, but"',
  'reversal frame: "isn\'t just"', 'reversal frame: "isn\'t just"',
  'slop word: delve (3x)', 'slop word: robust (3x)', 'slop word: seamless (3x)',
  'slop word: pivotal (3x)', 'slop word: crucial (3x)', 'slop word: tapestry (3x)',
  'slop word: landscape (3x)', 'slop word: testament (3x)', 'slop word: underscore (3x)',
  'slop word: leverage (3x)', 'slop word: journey (3x)', 'slop word: load-bearing (6x)',
  'slop word: elegant (6x)', 'slop word: delightful (3x)', 'slop word: vibrant (2x)',
  'slop word: boast (2x)', 'slop word: foster (2x)', 'slop word: realm (2x)',
  'slop word: multifaceted (2x)', 'slop word: holistic (2x)', 'slop word: synergy (2x)',
  'slop word: paradigm (2x)', 'slop word: nuance (2x)',
  'non-ASCII U+00F3 "ó" (1x)',
  'non-ASCII U+2014 "—" (2x) looks like "-"',
  'non-ASCII U+2192 "→" (1x)',
];

test('lint-gate.md itself carries nothing beyond what it quotes by necessity', () => {
  const found = runGate(gate, join(ROOT, GATE_DOC)).findings;
  assert.deepEqual(found, LINT_GATE_EXPECTED);
});
