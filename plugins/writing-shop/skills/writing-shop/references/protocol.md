# The consultation protocol

The message-by-message choreography that produced every good result in the audition, written down so a future session can reproduce it instead of rediscovering it. The orchestrating session is the relay bus: agents never talk to each other directly, and every letter passes through the orchestrator verbatim.

## Agent setup (both writer and advisors)

0. **The writer's model is fixed.** The head writer runs on DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`), always and explicitly, never on a Claude model, by the reader's ruling of 2026-09-12; the advisors and the editor sit on DeepSeek V4 Pro as well, by the same ruling; only the veridicality check may sit on a Claude agent. The ruling and its reason are in `model-selection.md`, "The seats".
1. **Verbatim anchors.** The agent fetches real passages of its author's published prose (300+ words each, at least three, original punctuation intact) into working notes before producing anything. Cleaned or summarized samples lose the voice. Writing happens by *continuation* of those passages, never by imitation of a description.
2. **A voice bible derived from the passages**, not from reputation: roughly ten lines of mechanical traits (sentence rhythm, openers, connectives, punctuation habits, what the author never does). The agent writes its own bible as part of setup; it doubles as a check that the passages were actually read.
3. **A ground-truth sheet.** Every fact the text may assert, stated plainly by the orchestrator in the agent's brief: proper nouns, terms of art, mechanisms, numbers, timelines. Editors check the draft against this sheet. Note its limit: the sheet catches wrong terms, not invented concretes that happen to fit; that is what the veridicality step is for.
4. **The hard rules**, restated in every brief (see `head-writer.md`, Hygiene): no em dashes, no reversal frames, the banned lexicon, no triad endings. Restating them per-brief matters; inherited context is not enough.

## The structure consultation (before a full draft)

1. Writer sends a **pitch note**: where the piece opens, the spine, where the analogy sits, where tension and caveats go, how it ends. 130-190 words. For a serial, a **term ledger** follows the note: the terms each part will introduce, in order, so the advisor can rule on the order the reader meets them in.
2. Advisor sends **counsel**: assess the pitch against the advisor's doctrine, concretely, about this material. 170-250 words.
3. Writer sends the **pushback**: accept what convinces, argue the rest on the merits. The brief must say explicitly: do not roll over to be agreeable. The best material of every consultation came from honest holdouts.
4. Advisor sends the **last word**: rule on the holdouts, close the consultation. 50-120 words.
5. Writer produces the piece to the settled structure.

## The line pass (after the draft)

1. Editor sends a numbered **edit letter** (6-9 items; quote the phrase, name the problem, minimal fix). Structure is settled and not reopenable.
2. Writer responds **item by item**; easy accepts batched; factual questions answered honestly (checking a questioned concrete is mandatory, and has produced the best sentences).
3. Editor **rules** on holdouts and closes.
4. Writer produces the revision, changing nothing an edit didn't touch.

## The tightening pass (after the line pass, before verification)

1. The tightening advisor reads the revision and sends **at most twelve proposals** (quote the phrase, name the rule offended, give the tightened version or say CUT ENTIRELY, state the word saving). Orwell's rules one to four and six; rule five is suspended (see `advisors.md`).
2. Writer answers each **ACCEPT or DECLINE** with a line of reasoning. He holds the voice, so a decline on the merits closes the item.
3. Writer applies the accepted cuts, changing nothing else.

**Make addition impossible rather than forbidden.** Deletion-avoidance is measured: asked to remove something, models keep it and add a bypass or a bridging clause about a third of the time (arXiv 2607.28887). An instruction not to add is under-executed, and the thing it adds back is exactly the connective tissue being stripped. So the tightener's output should be **proposals keyed to quoted spans**, and, when a future run automates the application step, a **list of sentence indices to delete** rather than prose. Text that is not in the output schema cannot be added.

**Report the measured saving, never the estimated one.** The first pass estimated 74 words across twelve proposals; ten were accepted and the file lost 67. Count the file.

## Verification and gate

5. Writer lists the revision's **concretes** (dates, counts, names, quotes, timeline claims) and requests a veridicality check from a repo-aware agent. Unverifiable concretes get cut or reworded as uncertain.
6. **Lint**: the four rules in `lint-gate.md`, run on the finished file with whatever the agent has. Findings bounce the text back to the revision step with the findings quoted. The gate checks: em dashes and spaced hyphens posing as dashes; "not X, but Y" and "isn't just" frames; the banned lexicon; probable rule-of-three sentence endings.

**Know what the gate does not see.** All four rules are lexical. The register fault that produced the tightening seat is *discourse-level* and no word in it is remarkable, so the gate passes it silently. See `model-selection.md` for what a detector would need. A deliberate exemption (a quoted lexicon, a term of art named in the text, a real title carrying an em dash) is **logged and published with the piece**, never edited away: the linter has no escape syntax, so an exemption is a decision on the record rather than a change to the artifact.

## Serial delivery (the explainer mode)

Ruled by the reader on 2026-09-12, mid-run, and binding on any piece a reader will read as an explanation rather than glance at as status. The failure it answers is the agent's, twice over: an agent deep in a context assumes its reader is in the same context and has read everything, and it delivers in chunks so large that the reader stops a few paragraphs in with a question, then has to type that question underneath the whole output. In conversation the reader would have said "wait, I haven't understood this yet; explain this first." The serial form gives him that stop.

- **Inverted pyramid, in parts.** Five to eight parts, delivered one at a time. Part 1 carries the whole point in plain words a cold reader can follow; each later part adds one layer (a mechanism, an incident, a number). A reader who stops after any part holds a true picture at that depth.
- **Assume the reader has read nothing.** Not the pull request, not the docs, not the letters. He is arriving cold.
- **Ground the vocabulary before leaning on it.** Each part introduces at most three new terms or names, defines each in plain words at first use, and no term is used in part N that was not grounded in parts 1 to N. The ground-truth sheet supplies the definitions; the writer supplies the plain words. The defining occurrence is set in bold, once, so a reader scanning back finds where the word was introduced; the ground line uses the same spelling.
- **A masthead opens every part**, outside the prose and not counted as prose: a title (two to five words, a name and never a summary), a standfirst (one sentence under twenty words saying what the document is, never a preview), a position line (part N of M, the date, who wrote it), and from part 2 a ground line ("So far:" and the terms already grounded, as bare nouns). The writer writes it, in the voice, under the hygiene rules; a masthead written by the relay in its own register was the first thing the reader called machine-made. Full form in the `serial` skill.
- **A checkpoint closes every part**, as a self-descriptive labelled block outside the prose, modelled on the chapter ends of Deutsch's *The Beginning of Infinity*: TERMINOLOGY (each term the part introduced, with a one-line plain definition), SUMMARY (one or two sentences on what the part established), CONTINUE OR ASK (one line in the writer's voice). Ruled by the reader 2026-09-12 over the earlier closing paragraph, which did not say what it was. Never a preview of what comes next (a preview is signposting, and the tightening seat may cut it). Full form in the `serial` skill.
- **React between parts.** When the reader asks about a word, answer that question at his depth (the register dial applies), and only then offer to go on. Read how inquisitive he is: a reader asking about every second term needs more ground before the next part, and the writer should say so plainly rather than press on. The goal is that the reader understands the full current state and every word in the output, not that the serial finishes.
- **The shop runs the same.** The consultation, the line pass, the tightening pass, the veridicality check and the lint gate all run on the whole serial before part 1 is delivered. Zinsser rules on the lead of part 1 and the exit of the last part; the checkpoints, the first-use definitions and the masthead are the reader's specification and are not clutter.

What the orchestrator shows the reader is part 1 and nothing more. The rest waits.

## Session replies (the short path)

A few-paragraph session answer doesn't convene the shop. It uses the head-writer prompt (which already carries Zinsser's structural doctrine and the standing law), the dial, and the lint gate. The full consultation is for pieces: retrospectives, explainers, anything the reader will read as prose rather than glance at as status.

## Why the theater works (so nobody "optimizes" it away)

The letters are not decoration. Three mechanisms do real work: the pushback step forces trade-offs into the open where the orchestrator and reader can see them; the advisor's last word creates a settled, citable structure so the revision has a spec; and staying in character keeps each agent inside its anchored texture, which is what prevents regression to the model's default register (see `research.md` on the assistant prior). Collapsing the exchange into "just edit it" reintroduces exactly the single-pass, style-versus-correctness trade the two-pass design exists to avoid.
