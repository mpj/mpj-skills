# The lint gate

Six mechanical rules, run on the finished file, last. The gate does not care what anyone intended, which is its whole value; it is also mechanical, which is its whole limit. Nothing in it understands a sentence. It cannot see discourse signposting, the fault the tightening seat exists for, because no word in a signposting sentence is remarkable. Do not extend it with signpost patterns: a regex set written for that undercounted two readers by roughly four times, and banning marker words teaches the model to announce without them. Rules 5 and 6 arrived on 2026-09-13 and neither crosses that line, because a word is counted and a code point is compared; neither is read.

An agent runs these with whatever it has: a grep, a scripting runtime, its own reading. A finding bounces the text back to the revision step with the finding quoted. A deliberate exemption (a banned lexicon printed on purpose, a term of art named in the text, a real title carrying a dash, a proper name that needs a letter outside ASCII) is logged with the piece and never edited away: the gate has no escape syntax, so an exemption is a decision on the record.

1. **Em dashes**, and spaced hyphens posing as dashes. Patterns: `—` and `\s-\s`. Replacement: parentheses, commas, a colon, or a full stop.
2. **Reversal frames.** Patterns, case-insensitive: `\bnot (?:just |only |merely )?[^.;:]{1,50}?, (?:but|it'?s|they'?re)\b`, `\bisn'?t (?:just|only|merely)\b`, `\baren'?t (?:just|only|merely)\b`, `\bit'?s not about\b`. The frame in any costume is banned, including ones the patterns miss (parentheses between the halves, a double negative); the editor reads for those.
3. **The lexicon**, each matched as a word prefix, case-insensitive: delve, robust, seamless, pivotal, crucial, tapestry, landscape, testament, underscore, leverage, journey, load-bearing (either spelling), elegant, delightful, vibrant, boast, foster, realm, multifaceted, holistic, synergy, paradigm, nuance.
4. **Probable rule-of-three endings.** Pattern: `\b\w+(?:ed|ing|s)?, \w+(?:ed|ing|s)?, and \w+(?:ed|ing|s)?[.!]`. A closer that lists three things loses one or gains a fourth.
5. **The prose word count**, 120 to 220 words. The boundaries are mechanical: the count starts after the question line and stops at the TERMINOLOGY label, so the frame above and the three blocks below stay outside it, exactly as the skill says they do. **Part 0 is exempt**, because the pillar is shorter by design. A file with no position line is not a delivery, and the rule passes over it in silence. The position line is matched on its literal shape, `Part N of ?` with the question mark, because the denominator is unknown by design and a sentence in prose can open with the words alone; one did, in `provenance.md`, and an earlier pattern read it as a delivery. A file that has a position line and no TERMINOLOGY label is a delivery the gate cannot measure, and that is a finding of its own: a rule that skips quietly is a rule nobody can rely on. Why it is here: one draft in run 6 ran 304 words against the ceiling and passed the gate, and a later part's own count line said 190 where the relay counted 246. A self-reported count is not a check.
6. **Characters outside plain ASCII.** Each one is reported with its code point, its count, and the ASCII character it resembles where there is one. The code point is the point of the rule, because the characters that cause the damage are the ones nobody can see. Run 7's writer emitted U+2011, a non-breaking hyphen, inside hyphenated words in nearly every delivery; it reads as a hyphen on screen, walks straight through rule 1, and is hostile to every tool downstream. Typographic quotation marks arrive the same way. A letter that a real name needs is not a fault, and it is exempted like anything else, on the record.

The reference implementation, fifty-nine lines, exit 0 clean and exit 1 with findings printed:

```js
#!/usr/bin/env node
// Usage: node style-lint.mjs <file>
import { readFileSync } from 'node:fs';
const text = readFileSync(process.argv[2], 'utf8');
const findings = [];
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
const lines = text.split('\n');
const pos = lines.findIndex(l => POS.test(l.trim()));
if (pos >= 0) {
  const part = Number(lines[pos].trim().match(POS)[1]);
  const end = lines.findIndex((l, i) => i > pos && TERM.test(l.trim()));
  if (end < 0) {
    findings.push('prose word count: position line present and no TERMINOLOGY label, so the prose has no end; not measured');
  } else if (part > 0) {
    let s = pos + 1;
    while (s < end && lines[s].trim() === '') s++;  // blank lines under the position line
    s++;                                            // the question line itself
    const n = lines.slice(s, end).join(' ').split(/\s+/).filter(Boolean).length;
    if (n < 120 || n > 220) findings.push(`prose word count: ${n} words (the range is 120 to 220)`);
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

if (findings.length) { console.log(findings.map(f => `  x ${f}`).join('\n')); process.exit(1); }
console.log('  ok clean');
```

## The exemptions in this skill's own files

The gate has no escape syntax, so a file that must print a banned thing is logged here rather than edited. Every one of these is the lexicon or the pattern being named, and none of them is the fault being committed. The list is written from the gate's own output, run on all eight files, and not from memory.

* `lint-gate.md` prints all 23 lexicon words twice, once in rule 3 and once in the reference implementation, and prints the em dash character twice for the same reason. Those two characters are also its only finding under rule 6.
* `head-writer.md` prints the lexicon once, in the hygiene rules the writer gets.
* `SKILL.md` and `protocol.md` name the reversal frame by quoting it, "not X, but Y", and `protocol.md` also quotes "isn't just".
* `research.md` quotes "not X, it's Y" as the pattern the first round of pastiches carried, and `research.md` and `provenance.md` both quote "load-bearing" as a word the reader named in a verdict.
* `SKILL.md` and `advisors.md` gloss the Swedish *sirligt* as "ornate, over-elegant", which is the reader's own verdict and the reason the tightening seat exists.
* Under rule 6: `advisors.md` carries U+00F3 once, inside a proper name on its bench of candidates, and `model-selection.md` carries U+2192 six times, as the arrow in its seating tables. Both are deliberate and neither resembles an ASCII character.

Every other file is clean of non-ASCII entirely, which is the state rule 6 exists to keep.

Everything else in this skill passes. The bullets are `*` rather than `-` on purpose: a markdown hyphen bullet at the start of a line is a spaced hyphen to rule 1, and the gate is right to count it, because the file it is reading might be prose.
