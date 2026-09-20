# The lint gate

Six mechanical rules, run on the finished file, last. The gate does not care what anyone intended, which is its whole value; it is also mechanical, which is its whole limit. Nothing in it understands a sentence. It cannot see discourse signposting, the fault the tightening seat exists for, because no word in a signposting sentence is remarkable. Do not extend it with signpost patterns: a regex set written for that undercounted two readers by roughly four times, and banning marker words teaches the model to announce without them. Rules 5 and 6 arrived on 2026-09-13 and neither crosses that line, because a word is counted and a code point is compared; neither is read.

An agent runs these with whatever it has: a grep, a scripting runtime, its own reading. A finding bounces the text back to the revision step with the finding quoted. A deliberate exemption (a banned lexicon printed on purpose, a term of art named in the text, a real title carrying a dash, a proper name that needs a letter outside ASCII) is logged with the piece and never edited away: the gate has no escape syntax, so an exemption is a decision on the record.

1. **Em dashes**, and spaced hyphens posing as dashes. Patterns: `—` and `\s-\s`. Replacement: parentheses, commas, a colon, or a full stop.
2. **Reversal frames.** Patterns, case-insensitive: `\bnot (?:just |only |merely )?[^.;:]{1,50}?, (?:but|it'?s|they'?re)\b`, `\bisn'?t (?:just|only|merely)\b`, `\baren'?t (?:just|only|merely)\b`, `\bit'?s not about\b`. The frame in any costume is banned, including ones the patterns miss (parentheses between the halves, a double negative); the editor reads for those.
3. **The lexicon**, each matched as a word prefix, case-insensitive: delve, robust, seamless, pivotal, crucial, tapestry, landscape, testament, underscore, leverage, journey, load-bearing (either spelling), elegant, delightful, vibrant, boast, foster, realm, multifaceted, holistic, synergy, paradigm, nuance.
4. **Probable rule-of-three endings.** Pattern: `\b\w+(?:ed|ing|s)?, \w+(?:ed|ing|s)?, and \w+(?:ed|ing|s)?[.!]`. A closer that lists three things loses one or gains a fourth.
5. **The prose word count**, 120 to 220 words. The boundaries are mechanical: the count starts after the question line and stops at the TERMINOLOGY label, so the frame above and the three blocks below stay outside it, exactly as the skill says they do. **Part 0 is exempt**, because the pillar is shorter by design. A file with no position line is not a delivery, and the rule passes over it in silence. The position line is matched on its literal shape, `Part N of ?` with the question mark, because the denominator is unknown by design and a sentence in prose can open with the words alone; one did, in `provenance.md`, and an earlier pattern read it as a delivery. Every part in the file is measured, not only the first, because a kept document is parts concatenated and the whole of it goes through the gate once at the end. A file that has a position line and no TERMINOLOGY label is a delivery the gate cannot measure, and that is a finding of its own: a rule that skips quietly is a rule nobody can rely on. Why it is here: one draft in run 6 ran 304 words against the ceiling and passed the gate, and a later part's own count line said 190 where the relay counted 246. A self-reported count is not a check.
6. **Characters outside plain ASCII.** Each one is reported with its code point, its count, and the ASCII character it resembles where there is one. The code point is the point of the rule, because the characters that cause the damage are the ones nobody can see. Run 7's writer emitted U+2011, a non-breaking hyphen, inside hyphenated words in nearly every delivery; it reads as a hyphen on screen, walks straight through rule 1, and is hostile to every tool downstream. Typographic quotation marks arrive the same way. A letter that a real name needs is not a fault, and it is exempted like anything else, on the record.

**Rule 5's short-detour range is 60 to 120 words.** It applies only when the position line is exactly `Part N of ?, a short detour`, optionally wrapped in asterisks for emphasis. Ordinary parts and ordinary detours keep the 120 to 220 range. The boundaries, glossary requirement and Part 0 exemption stay the same. Eligibility for the short form is a semantic check under `SKILL.md`; the gate only enforces the declared range. A short marker never waives any other rule.

**Conversational overruns have a ten-word allowance.** The ranges above remain the writing targets. For read-once conversation, run `node style-lint.mjs <file> --conversation`: 221 to 230 words in an ordinary part, or 121 to 130 in a short detour, produces a recorded advisory and passes the length check. Never commission a rewrite solely for that advisory. A larger overrun still blocks, as does an underlength part or a missing glossary. All other rules still block. Kept work uses the default invocation without the flag and retains the strict ranges; a mixed file containing kept work uses that default too. Local assemblers must honor the same allowance instead of rejecting the draft before this gate sees it. Record advisories in the run log rather than adding machinery notes to the reader's part.

**The code block below is the gate.** Extract it from the installed skill at session setup and keep it with that session's version. An older copy may lack the word-count rule or the short-detour range, so a familiar filename on disk is not evidence that it checks the current contract.

The reference implementation, exit 0 allowing delivery (possibly with advisory notes) and exit 1 with blocking findings printed:

```js
#!/usr/bin/env node
// Usage: node style-lint.mjs <file> [--conversation]
import { readFileSync } from 'node:fs';
const text = readFileSync(process.argv[2], 'utf8');
const findings = [];
const conversation = process.argv.slice(3).includes('--conversation');
const notes = [];
for (const [re, label] of [[/—/g, 'em dash'], [/\s-\s/g, 'spaced hyphen as dash']]) {
  const m = text.match(re); if (m) findings.push(`${label}: ${m.length}x`);
}
const frames = [
  /\bnot (?:just |only |merely )?[^.;:]{1,50}?, (?:but|it'?s|they'?re)\b/gi,
  /\bisn'?t (?:just|only|merely)\b/gi, /\baren'?t (?:just|only|merely)\b/gi, /\bit'?s not about\b/gi,
];
for (const re of frames) { const m = text.match(re); if (m) for (const hit of m) findings.push(`reversal frame: "${hit}"`); }
const slop = ['delve','robust','seamless','pivotal','crucial','tapestry','landscape','testament','underscore',
  'leverage','journey','load-bearing','elegant','delightful','vibrant','boast','foster','realm','multifaceted',
  'holistic','synergy','paradigm','nuance'];
for (const w of slop) {
  const re = new RegExp(`\\b${w.replace('-', '[-\\s]')}\\w*`, 'gi');
  const m = text.match(re); if (m) findings.push(`slop word: ${w} (${m.length}x)`);
}
const triads = text.match(/\b\w+(?:ed|ing|s)?, \w+(?:ed|ing|s)?, and \w+(?:ed|ing|s)?[.!]/g);
if (triads) for (const t of triads) findings.push(`possible triad ending: "${t}"`);

// 5. prose word count: after the question line, up to the TERMINOLOGY label. Part 0 exempt.
const POS = /^\**Part (\d+) of \?/, TERM = /^\**TERMINOLOGY\b/;
const SHORT = /^\**Part \d+ of \?, a short detour\**$/;
const lines = text.split('\n');
const starts = [];
lines.forEach((l, i) => { if (POS.test(l.trim())) starts.push(i); });
for (let k = 0; k < starts.length; k++) {          // every part in the file, not only the first
  const pos = starts[k], limit = k + 1 < starts.length ? starts[k + 1] : lines.length;
  const part = Number(lines[pos].trim().match(POS)[1]);
  let end = -1;
  for (let i = pos + 1; i < limit; i++) if (TERM.test(lines[i].trim())) { end = i; break; }
  if (end < 0) {
    findings.push(`prose word count (Part ${part}): no TERMINOLOGY label before the next part or the end of the file; not measured`);
  } else if (part > 0) {
    let s = pos + 1;
    while (s < end && lines[s].trim() === '') s++;  // blank lines under the position line
    s++;                                            // the question line itself
    const n = lines.slice(s, end).join(' ').split(/\s+/).filter(Boolean).length;
    const [min, max] = SHORT.test(lines[pos].trim()) ? [60, 120] : [120, 220];
    const allowance = conversation ? 10 : 0;
    if (n < min || n > max + allowance) {
      const extra = conversation ? `; conversational maximum is ${max + allowance}` : '';
      findings.push(`prose word count (Part ${part}): ${n} words (the range is ${min} to ${max}${extra})`);
    } else if (n > max) {
      notes.push(`prose word count (Part ${part}): ${n} words (target maximum ${max}; conversational allowance ${allowance})`);
    }
  }
}

// 6. characters outside plain ASCII, named by code point, with the look-alike called out.
const twins = { 0x2018: "'", 0x2019: "'", 0x201a: "'", 0x02bc: "'", 0x201c: '"', 0x201d: '"', 0x201e: '"',
  0x2010: '-', 0x2011: '-', 0x2012: '-', 0x2013: '-', 0x2014: '-', 0x2015: '-', 0x2212: '-',
  0x00a0: ' ', 0x2007: ' ', 0x2009: ' ', 0x202f: ' ', 0x2026: '...', 0x00ad: '' };
const seen = new Map();
for (const ch of text) {
  const c = ch.codePointAt(0);
  if (c > 126 || (c < 32 && c !== 10 && c !== 9)) seen.set(c, (seen.get(c) || 0) + 1);
}
for (const [c, n] of [...seen].sort((a, b) => a[0]-b[0])) {
  const hex = 'U+' + c.toString(16).toUpperCase().padStart(4, '0');
  const twin = Object.prototype.hasOwnProperty.call(twins, c)
    ? ` looks like ${JSON.stringify(twins[c])}` : '';
  findings.push(`non-ASCII ${hex} ${JSON.stringify(String.fromCodePoint(c))} (${n}x)${twin}`);
}

if (notes.length) console.log(notes.map(n => `  note ${n}`).join('\n'));
if (findings.length) { console.log(findings.map(f => `  x ${f}`).join('\n')); process.exit(1); }
console.log('  ok clean');
```

## The exemptions in this skill's own files

The gate has no escape syntax, so a file that must print a banned thing is logged here rather than edited. Every one of these is the lexicon or a pattern being named, and none of them is the fault being committed.

**The list is the gate's own output and not a description of it.** A test in this repository regenerates the block below and fails when the two disagree, so a new fault cannot hide behind a stale exemption and a fixed one cannot stand as a claim nobody rechecked. It was prose until 2026-09-13, and the prose had already drifted: it gave `research.md` one reversal frame where the gate finds two, and it undercounted this file by three frames and two words. Counts live in the block. The bullets underneath say only why each exemption is allowed to stand.

**This file is missing from its own list, and that is not an oversight.** Every finding in the block is a literal string, so a block listing this file's findings would add to them the moment it was written, and the count would never settle. Worse, the block quotes what the gate found in every other file, so this file now carries a copy of the Spanish letter in `advisors.md` and of the arrow in `model-selection.md` as well. The one place an expected list for this file can live is the test, which is the single exception to the rule that a document owns its own facts, and it exists because self-reference leaves nowhere else to put it. The test's list is frozen and any new finding here fails it, which is the property that matters.

```text
SKILL.md  reversal frame: "not X, but"
SKILL.md  slop word: elegant (1x)
references/advisors.md  slop word: elegant (1x)
references/advisors.md  non-ASCII U+00F3 "ó" (1x)
references/head-writer.md  slop word: delve (1x)
references/head-writer.md  slop word: robust (1x)
references/head-writer.md  slop word: seamless (1x)
references/head-writer.md  slop word: pivotal (1x)
references/head-writer.md  slop word: crucial (1x)
references/head-writer.md  slop word: tapestry (1x)
references/head-writer.md  slop word: landscape (1x)
references/head-writer.md  slop word: testament (1x)
references/head-writer.md  slop word: underscore (1x)
references/head-writer.md  slop word: leverage (1x)
references/head-writer.md  slop word: journey (1x)
references/head-writer.md  slop word: load-bearing (1x)
references/head-writer.md  slop word: elegant (1x)
references/head-writer.md  slop word: delightful (1x)
references/model-selection.md  non-ASCII U+2192 "→" (6x)
references/protocol.md  reversal frame: "not X, but"
references/protocol.md  reversal frame: "isn't just"
references/provenance.md  slop word: load-bearing (1x)
references/research.md  reversal frame: "not X, it's"
references/research.md  reversal frame: "not X, but"
references/research.md  slop word: load-bearing (1x)
```

* `lint-gate.md` prints the whole lexicon twice, in rule 3 and again in the reference implementation, and prints the em dash character and the reversal frames for the same reason.
* `head-writer.md` prints the lexicon once, in the hygiene rules the writer gets.
* `SKILL.md` and `protocol.md` name the reversal frame by quoting it, and `protocol.md` also quotes "isn't just".
* `research.md` quotes both shapes of the frame as the patterns the first round of pastiches carried, and `research.md` and `provenance.md` both quote "load-bearing" as a word the reader named in a verdict.
* `SKILL.md` and `advisors.md` gloss the Swedish *sirligt* as "ornate, over-elegant", which is the reader's own verdict and the reason the tightening seat exists.
* Under rule 6: `advisors.md` carries U+00F3 inside a proper name on its bench of candidates, and `model-selection.md` carries U+2192 as the arrow in its seating tables. Both are deliberate and neither resembles an ASCII character.

Every other file is clean of non-ASCII entirely, which is the state rule 6 exists to keep.

Everything else in this skill passes. The bullets are `*` rather than `-` on purpose: a markdown hyphen bullet at the start of a line is a spaced hyphen to rule 1, and the gate is right to count it, because the file it is reading might be prose.
