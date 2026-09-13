# The leak check

The anchors go into a seat's system message as a living author's own sentences, and the whole method depends on them being there. That creates one hazard the rest of the machinery cannot see: a model that hands a passage back. At least one family is independently reported to reproduce input text nearly verbatim (`model-selection.md`), and this shop has watched a milder version of it happen, when a model in the bake-off returned a phrase from its own brief inside paragraph two. The lint gate cannot catch this, because a sentence Joel Spolsky wrote is good prose and breaks none of the six rules. The ground-truth sheet cannot catch it either, because the sentence is true.

So the check is mechanical and separate: **no run of eight or more words may appear in both the delivery and the anchor file it was written from.** It runs inside the veridicality check, on every part, before delivery. A hit blocks delivery and takes one constrained rewrite from the writer, like the root-conformance gate, and for the same reason: the checker reports and never edits.

**Eight words, and why that number.** Shorter runs fire on ordinary English. "the thing you have to understand about this" is seven words that anyone might write and nobody owns. At eight the match is almost always a lift, and the cost of the rare false alarm is one sentence rewritten. The number is a setting rather than a law; move it down if a leak gets through, and log the move.

**Comparison is on words, not on characters.** Case is folded, punctuation is dropped, and runs of whitespace collapse, so a quotation that arrives with different quotation marks or a changed comma still matches. That is the point: a model reproducing a passage rarely reproduces its typography.

**A quotation the writer meant to make is an exemption on the record,** logged with the piece like any gate exemption, and it carries the author's name and the source in the text where the reader can see them. The check exists to catch the unmarked lift. It has no opinion about an attributed quote, and it cannot tell them apart, so a person does.

**This runs against whatever anchored the seat.** Where a seat is on the shortfall path and has no anchor file at all, the check has nothing to compare against and reports that, in one line, rather than passing in silence. A check that skips quietly is a check nobody can rely on, which is the same ruling rule 5 of the gate carries.

The reference implementation, exit 0 clean and exit 1 with findings printed:

```js
#!/usr/bin/env node
// Usage: node leak-check.mjs <delivery> <anchor-file> [...more anchor files]
import { readFileSync } from 'node:fs';

export const N = 8;                       // the run length; see the file above

// Words only, case folded, punctuation dropped. Typography is not evidence.
export function words(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').split(/\s+/).filter(Boolean);
}

// Every run of N words in the text, as strings, with the index it started at.
function runs(ws, n) {
  const out = [];
  for (let i = 0; i + n <= ws.length; i++) out.push([i, ws.slice(i, i + n).join(' ')]);
  return out;
}

// Returns the longest match for each place the delivery touches an anchor, so a
// lifted paragraph is one finding and not a hundred overlapping ones.
export function leaks(delivery, anchors, n = N) {
  const anchorRuns = new Set(runs(words(anchors), n).map(([, r]) => r));
  const dw = words(delivery);
  const found = [];
  let i = 0;
  while (i + n <= dw.length) {
    if (!anchorRuns.has(dw.slice(i, i + n).join(' '))) { i++; continue; }
    let end = i + n;                      // grow the window while it still matches
    while (end < dw.length && anchorRuns.has(dw.slice(end-n+1, end + 1).join(' '))) end++;
    found.push({ start: i, length: end-i, text: dw.slice(i, end).join(' ') });
    i = end;                              // and never report inside what was reported
  }
  return found;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [delivery, ...anchorPaths] = process.argv.slice(2);
  if (!anchorPaths.length) {
    console.log('  x no anchor file given: the seat is on the shortfall path, or the call is wrong');
    process.exit(1);
  }
  const anchors = anchorPaths.map(p => readFileSync(p, 'utf8')).join('\n\n');
  const found = leaks(readFileSync(delivery, 'utf8'), anchors);
  if (found.length) {
    for (const f of found) console.log(`  x ${f.length} words reproduced from the anchors: "${f.text}"`);
    process.exit(1);
  }
  console.log('  ok clean');
}
```
