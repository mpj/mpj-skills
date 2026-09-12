# The consultation protocol

The message-by-message choreography that produced every good result in the audition, written down so a future session can reproduce it instead of rediscovering it. The orchestrating session is the relay bus: agents never talk to each other directly, and every letter passes through the orchestrator verbatim.

## Agent setup (both writer and advisors)

0. **The writer's model is fixed.** The head writer runs on DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`), always and explicitly, never on a Claude model, by the reader's ruling of 2026-09-12; the advisors, the editor, the serial's interviewer and its assessor sit on non-Claude models as well (DeepSeek V4 Pro today; Grok 4.5 is licensed as an editing family); only the veridicality check may sit on a Claude agent or mirror the orchestrator. The ruling and its reason are in `model-selection.md`, "The seats".
5. **Anchoring runs once per session; forks share the prefix.** Fetching the passages, deriving the bible and opening the seat's stateful conversation happen once; every later call from that seat continues that conversation. No seat is re-anchored mid-session and no seat is opened twice.
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

## Serial delivery (the only delivery)

Ruled by the reader on 2026-09-12 and redesigned the same day; full form in the `serial` skill, which is the specification. The failure it answers is the agent's, twice over: an agent deep in a context assumes its reader is in the same context and has read everything, and it delivers in chunks so large that the reader stops a few paragraphs in with a question, then has to type that question underneath the whole output. In conversation the reader would have said "wait, I haven't understood this yet; explain this first." The serial gives him that stop, and it generates nothing ahead of him. How the protocol above maps onto it:

- **The consultation runs once per session, on a map.** The writer's pitch is a concept map (terms as nodes with one-line definitions and candidate concretes, "must be grounded before" edges) plus the pillar sentence for serial 0, in place of the piece pitch and term ledger; counsel, pushback and last word as above. The settled map is the spec every part is held to and is revisable after the interview.
- **The interview and the ledger come before any part.** The interviewer seat (`advisors.md`, Lamb) probes three to five times; the assessor, a plain non-Claude seat, classifies each answer into four routes and keeps an internal learner ledger that is never shown to the reader. "I know this well" is followed by inquiry into what "this" is, so the known thing becomes the footing for analogy.
- **Serial 0 is the pillar**, an expert statement with no pedagogy, argued inside the map consultation, canonical and attributed where a canonical formulation exists, formatted by the writer in one call, and held to a root-conformance gate inside the veridicality check (every term an exact map node, no new commitments, a disposition per clause, delivery blocked on failure).
- **Every later part is generated on the reader's reply and edited per part**: edit letter and item-by-item reply, the tightening pass every second part, the veridicality check with the conformance gate, the gate, then delivery. A misconception in the ledger makes the next part a detour, announced in its masthead, and detours are the parts the form exists for. Nothing is pre-generated while the reader reads; that was ruled out as a speculative cache built before anyone had looked at usage.
- **The masthead and the checkpoint block frame every part**: title, standfirst, position line ("Part N of ?", serial 0 as Part 0, a detour marked as one), ground line from Part 1; then TERMINOLOGY (terms in italics, a definition of a sentence or two each), SUMMARY, CONTINUE OR ASK, labels in bold capitals, modelled on the chapter ends of Deutsch's *The Beginning of Infinity*. The writer writes both, in the voice.
- **Between parts**, the interviewer's follow-up and the reader's questions come first, answered at the reader's depth; then the next rung.

There is no short path and no full shop; there is serial 0 and as many rungs as the reader needs. The old register dial (medium, pedagogical, complex) is gone: depth comes from the ledger, not from a knob.

## Why the theater works (so nobody "optimizes" it away)

The letters are not decoration. Three mechanisms do real work: the pushback step forces trade-offs into the open where the orchestrator and reader can see them; the advisor's last word creates a settled, citable structure so the revision has a spec; and staying in character keeps each agent inside its anchored texture, which is what prevents regression to the model's default register (see `research.md` on the assistant prior). Collapsing the exchange into "just edit it" reintroduces exactly the single-pass, style-versus-correctness trade the two-pass design exists to avoid.
