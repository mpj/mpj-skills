# The lint gate

Four mechanical rules, run on the finished file, last. The gate does not care what anyone intended, which is its whole value; it is also lexical, which is its whole limit. It cannot see discourse signposting, the fault the tightening seat exists for, because no word in a signposting sentence is remarkable. Do not extend it with signpost patterns: a regex set written for that undercounted two readers by roughly four times, and banning marker words teaches the model to announce without them.

An agent runs these with whatever it has: a grep, a scripting runtime, its own reading. A finding bounces the text back to the revision step with the finding quoted. A deliberate exemption (a banned lexicon printed on purpose, a term of art named in the text, a real title carrying a dash) is logged with the piece and never edited away: the gate has no escape syntax, so an exemption is a decision on the record.

1. **Em dashes**, and spaced hyphens posing as dashes. Patterns: `—` and `\s-\s`. Replacement: parentheses, commas, a colon, or a full stop.
2. **Reversal frames.** Patterns, case-insensitive: `\bnot (?:just |only |merely )?[^.;:]{1,50}?, (?:but|it'?s|they'?re)\b`, `\bisn'?t (?:just|only|merely)\b`, `\baren'?t (?:just|only|merely)\b`, `\bit'?s not about\b`. The frame in any costume is banned, including ones the patterns miss (parentheses between the halves, a double negative); the editor reads for those.
3. **The lexicon**, each matched as a word prefix, case-insensitive: delve, robust, seamless, pivotal, crucial, tapestry, landscape, testament, underscore, leverage, journey, load-bearing (either spelling), elegant, delightful, vibrant, boast, foster, realm, multifaceted, holistic, synergy, paradigm, nuance.
4. **Probable rule-of-three endings.** Pattern: `\b\w+(?:ed|ing|s)?, \w+(?:ed|ing|s)?, and \w+(?:ed|ing|s)?[.!]`. A closer that lists three things loses one or gains a fourth.

The reference implementation, forty-nine lines, exit 0 clean and exit 1 with findings printed:

```js
#!/usr/bin/env node
// Usage: node style-lint.mjs <file>
import { readFileSync } from 'node:fs';
const text = readFileSync(process.argv[2], 'utf8');
const findings = [];
for (const [re, label] of [[/—/g, 'em dash'], [/\s-\s/g, 'spaced hyphen as dash']]) {
  const m = text.match(re); if (m) findings.push(`${label}: ${m.length}×`);
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
  const m = text.match(re); if (m) findings.push(`slop word: ${w} (${m.length}×)`);
}
const triads = text.match(/\b\w+(?:ed|ing|s)?, \w+(?:ed|ing|s)?, and \w+(?:ed|ing|s)?[.!]/g);
if (triads) for (const t of triads) findings.push(`possible triad ending: "${t}"`);
if (findings.length) { console.log(findings.map(f => `  ✗ ${f}`).join('\n')); process.exit(1); }
console.log('  ✓ clean');
```
