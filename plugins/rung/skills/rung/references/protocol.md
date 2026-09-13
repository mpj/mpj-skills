# The protocol

The message-by-message choreography, written down so a future session can reproduce it instead of rediscovering it. The orchestrating agent is the relay bus: seats never talk to each other directly, and every letter passes through the relay verbatim.

**Two settings, and the skill says which is which.** Everything under "Every turn" runs on every part, because it is what makes the conversation a conversation. Everything under "When it will be kept" runs when the text is going to be held onto, pasted somewhere, or read by a person who was not in the room, and whenever a part carries concretes. A part read once in the conversation and then scrolled past does not need three letters spent on it; a paragraph the reader is about to put in a pull request does.

## Seat setup (every writing, advising and interviewing seat)

0. **The seat's model is fixed.** The head writer runs on DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`), always and explicitly, never a Claude model, by the reader's ruling of 2026-09-12; the advisors, the editor, the interviewer and the assessor sit on non-Claude models as well. Only the veridicality check may sit on a Claude agent or mirror the relay. The ruling and its reason are in `model-selection.md`, "The seats".
1. **Anchoring runs once per session; forks share the prefix.** Fetching the passages, deriving the bible and opening the seat's stateful conversation happen once; every later call from that seat continues that conversation. No seat is re-anchored mid-session and no seat is opened twice.
2. **Verbatim anchors.** The agent fetches real passages of its author's published prose (300+ words each, at least three, original punctuation intact) into working notes before producing anything. Cleaned or summarized samples lose the voice. Writing happens by *continuation* of those passages, never by imitation of a description.
3. **A voice bible derived from the passages**, not from reputation: roughly ten lines of mechanical traits (sentence rhythm, openers, connectives, punctuation habits, what the author never does). The agent writes its own bible as part of setup; it doubles as a check that the passages were actually read.
4. **A ground-truth sheet.** Every fact the text may assert, stated plainly by the relay in the seat's brief: proper nouns, terms of art, mechanisms, numbers, timelines. Editors check against this sheet. Note its limit: the sheet catches wrong terms, not invented concretes that happen to fit, which is what the veridicality step is for. Pin today's date from the clock in every brief, and say plainly what the sheet is silent on, because where it is silent the text is silent. And a sheet that names a term of art without defining it is worse than one that is silent: run 7 named "the charter's honest eval gap" and left it undefined, and the writer filled the hole with a definition that was wrong twice and contradicted his own next paragraph. Every term of art the sheet mentions carries its definition, in the source's own words where one exists. The same run showed the mirror failure: a sheet line narrower than it sounds gets widened by the seat reading it, when "the word has no definition anywhere" came back as "the word appears nowhere", which was false. Where a sheet claim has a scope, state the scope.
5. **The hard rules**, restated in every brief (see `head-writer.md`, Hygiene): no em dashes, no reversal frames, the banned lexicon, no triad endings. Restating them per-brief matters; inherited context is not enough.

## Every turn

### The map consultation, once per session

1. Writer sends a **pitch note** of 130 to 190 words (the one thing the reader should end up holding, where the explanation starts, what the last rung is, where he is likely to stop early), then the **concept map**: nodes, each with a one-line plain definition and a candidate concrete; "must be grounded before" edges, one per line; and the **pillar sentence**.
2. Advisor sends **counsel**, 170 to 250 words: the one point, the lead of Part 1, the order the reader meets the terms in, which nodes are clutter, and where the session is allowed to stop.
3. Writer sends the **pushback**: accept what convinces, argue the rest on the merits. The brief must say explicitly: do not roll over to be agreeable. The best material of every consultation came from honest holdouts.
4. Advisor sends the **last word**, 50 to 120 words: rule on the holdouts, then state the settled shape as one line per rung, so the relay has a spec every part can be held to.

The map is revisable after the interview. A node the reader already holds is pruned, or becomes the footing the explanation builds from.

### The interview and the ledger

5. Interviewer sends three to five **probes**, one clause each, numbered, nothing else in the letter. Keyed to what the reader already has in his hands rather than to terms he has not met.
6. The reader answers. Assessor returns the **routes** (one line per answer, one of the five) and the **ledger** (one entry per node: state, and the reader's own words as evidence), plus a misconception section stating what he believes and what is true instead, and a line naming any answer that needs one follow-up.
7. After every part, the interviewer asks **one follow-up** that checks whether the part landed, and the assessor updates the ledger.

### The pillar, and every part

8. The writer formats the **pillar** in one call: the position line, the settled pillar sentence with any canonical formulation quoted and attributed, a TERMINOLOGY block drawn from the map's definitions, and the closing label with its line. Plain declarative register, no scene, no analogy, no wisecrack.
9. The **root-conformance gate** runs inside the veridicality check, on the pillar, every time: every term an exact map node, every relation stated or deliberately omitted without changing scope, no new commitment in the TERMINOLOGY block, a disposition per clause. A failure blocks delivery and takes one constrained rewrite.
10. Each later **part** is written after the reader replies: one rung down, aimed at the deepest node the ledger shows ungrounded, built from what he holds. Then the interviewer reads the finished part and writes the one question that goes under its closing label. Then the lint gate, then delivery. Both lines under the label are their seats' own words and the relay assembles without editing either.

The relay counts the prose words before delivery, between the question line and the TERMINOLOGY label. The writer's own count is not a check: in the validation run it reported 190 where the relay counted 246.

## When it will be kept

### The line pass

1. Editor sends a numbered **edit letter** (6-9 items; quote the phrase, name the problem, give the minimal fix). Structure is settled and not reopenable. The masthead and the three checkpoint blocks are the reader's specification: a definition may be sharpened, never cut, and the labels are untouchable.
2. Writer responds **item by item**; easy accepts batched; factual questions answered honestly. Checking a questioned concrete is mandatory and has produced the best sentences in the record: in the validation run the editor questioned a claim the sheet did not carry, the relay checked it against the paper, and the sheet gained an amendment rather than the sentence being cut.
3. Editor **rules** on the holdouts and closes.
4. Writer produces the revision, changing nothing an edit did not touch.

### The tightening pass, every second part

5. The tightening advisor reads the revision and sends **at most twelve proposals** (quote the phrase, name the rule offended, give the tightened version or say CUT ENTIRELY, state the word saving). Orwell's rules one to four and six; rule five is suspended (see `advisors.md`).
6. Writer answers each **ACCEPT or DECLINE** with a line of reasoning. He holds the voice, so a decline on the merits closes the item.
7. Writer applies the accepted cuts, changing nothing else.

**Make addition impossible rather than forbidden.** Deletion-avoidance is measured: asked to remove something, models keep it and add a bypass or a bridging clause about a third of the time (arXiv 2607.28887). An instruction not to add is under-executed, and the thing it adds back is exactly the connective tissue being stripped. So the tightener's output should be **proposals keyed to quoted spans**, and, when a future run automates the application step, a **list of sentence indices to delete** rather than prose. Text that is not in the output schema cannot be added.

**Report the measured saving, never the estimated one.** The first pass estimated 74 words across twelve proposals; ten were accepted and the file lost 67. Count the text.

### Verification

8. Writer lists the part's **concretes** (dates, counts, names, quotes, timeline claims) and requests a veridicality check from an agent with tools. Unverifiable concretes get cut or reworded as uncertain. A concrete can go false between the sheet and the check on the same morning, so re-check the ones that live in a repository at the end and not at the start.

### The whole read, before anything is handed over

9. When a session has produced something that will be kept, one editor instance reads **all of it at once**, in a fresh conversation, and sends one letter. Per-part editing cannot see definition drift between two checkpoints, a later part dropping a distinction an earlier part established, or a term rule broken three parts back. The validation run measured this: three per-part letters missed all three, and a single whole read caught them.

## The gate, last

10. **Lint**: the four rules in `lint-gate.md`, run on the finished text with whatever the agent has. Findings bounce the text back to the revision step with the findings quoted. The gate checks em dashes and spaced hyphens posing as dashes; "not X, but Y" and "isn't just" frames; the banned lexicon; probable rule-of-three sentence endings.

**Know what the gate does not see.** All four rules are lexical. The register fault that produced the tightening seat is *discourse-level* and no word in it is remarkable, so the gate passes it silently. It also cannot see the part-length ceiling, and it does not look for characters outside plain ASCII, which is how typographic quotation marks and non-breaking hyphens have reached finished text. A deliberate exemption (a quoted lexicon, a term of art named in the text, a real title carrying an em dash) is **logged and published with the text**, never edited away: the linter has no escape syntax, so an exemption is a decision on the record rather than a change to the artifact.

## When a document is wanted

The same seats, the same voice, the same gate, at the full setting, with three differences. The masthead gets its title and standfirst back, because a document lands in front of someone who did not watch it being made. The whole read is mandatory rather than conditional. And the veridicality check runs on every concrete in the finished text, not only on the ones a part happened to introduce. A pull request body, a retrospective, an explainer for a newcomer: these are the same machine pointed at a thing that will outlive the conversation.

## Why the theatre works (so nobody optimizes it away)

The letters are not decoration. Three mechanisms do real work: the pushback step forces trade-offs into the open where the relay and the reader can see them; the advisor's last word creates a settled, citable structure so the revision has a spec; and staying in character keeps each agent inside its anchored texture, which is what prevents regression to the model's default register (see `research.md` on the assistant prior). Collapsing the exchange into "just edit it" reintroduces exactly the single-pass, style-versus-correctness trade the two-pass design exists to avoid.

**The relay's own failures are false concretes too, and they propagate faster than the writer's.** A silenced error once sent an empty pitch to the structure advisor, who counselled on a blank page; a heading in bold once defeated the letter extraction, and the advisor invented a last word on a pushback it never received. Check every reply is non-empty before relaying it, extract letters by content and never by an exact heading, and treat an empty reply as a failed call rather than a short letter. Letters to paid models go out one at a time: a parallel fan-out trips a router's in-flight budget, because each request reserves its whole completion ceiling against the account's credit.
