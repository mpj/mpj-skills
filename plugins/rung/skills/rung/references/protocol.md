# The protocol

The message-by-message choreography, written down so a future session can reproduce it instead of rediscovering it. The orchestrating agent is the relay bus: seats never talk to each other directly, and every letter passes through the relay verbatim.

**Two settings, and the skill says which is which.** Everything under "Every turn" runs on every part, because it is what makes the conversation a conversation. Everything under "When it will be kept" runs when the text is going to be held onto, pasted somewhere, or read by a person who was not in the room, and whenever a part carries concretes. A part read once in the conversation and then scrolled past does not need three letters spent on it; a paragraph the reader is about to put in a pull request does.

## Seat setup (every writing, advising and interviewing seat)

0. **The seat's model is fixed.** The head writer runs on DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`), always and explicitly, never a Claude model, by the reader's ruling of 2026-09-12; the advisors, the editor, the interviewer and the assessor sit on non-Claude models as well. Only the veridicality check may sit on a Claude agent or mirror the relay. The ruling and its reason are in `model-selection.md`, "The seats".
1. **Anchoring runs once per session; forks share the prefix.** Fetching the passages, deriving the bible and opening the seat's stateful conversation happen once; every later call from that seat continues that conversation. No seat is re-anchored mid-session and no seat is opened twice.
2. **Verbatim anchors, where the prose is published and reachable.** The agent fetches real passages of its author's published prose (300+ words each, at least three, original punctuation intact) into working notes before producing anything. Cleaned or summarized samples lose the voice. Writing happens by *continuation* of those passages, never by imitation of a description. A seat whose supply has closed takes the substitute path in `advisors.md` rather than this one: indicative material that ships with the skill and says on its first line that it is indicative, and doctrine alone below that, with the shortfall declared to the reader. The interviewer's seat has been on that path since 2026-09-13, and it reads Q and A lines rather than three long passages, which is a real difference and not a technicality.
3. **A voice bible derived from the passages**, not from reputation: roughly ten lines of mechanical traits (sentence rhythm, openers, connectives, punctuation habits, what the author never does). The agent writes its own bible as part of setup; it doubles as a check that the passages were actually read.
4. **A ground-truth sheet.** Every fact the text may assert, stated plainly by the relay in the seat's brief: proper nouns, terms of art, mechanisms, numbers, timelines. Editors check against this sheet. Note its limit: the sheet catches wrong terms, not invented concretes that happen to fit, which is what the veridicality step is for. Pin today's date from the clock in every brief, and say plainly what the sheet is silent on, because where it is silent the text is silent. And a sheet that names a term of art without defining it is worse than one that is silent: run 7 named one of its subject's terms of art and left it undefined, and the writer filled the hole with a definition that was wrong twice and contradicted his own next paragraph. Every term of art the sheet mentions carries its definition, in the source's own words where one exists. The same run showed the mirror failure: a sheet line narrower than it sounds gets widened by the seat reading it, when a note that a word had no definition anywhere came back as a claim that the word appears nowhere, which was false. Where a sheet claim has a scope, state the scope.
5. **The hard rules**, restated in every brief (see `head-writer.md`, Hygiene): no em dashes, no reversal frames, the banned lexicon, no triad endings. Restating them per-brief matters; inherited context is not enough.

## What a driver has to do

The skill ships no runner and names no vendor. Any client will do, and every requirement below is here because a run paid for it. A run that wants to know whether its client is good enough reads this list and checks itself against it.

* **One stateful conversation per seat, opened once and continued thereafter.** The anchors live in the system message and the session's letters accumulate as turns. Re-anchoring mid-session loses the voice, and opening a seat twice gives you two seats that disagree.
* **Append the user message to the stored conversation only after a non-empty reply comes back.** A failed call has to leave the conversation exactly as it was. A half-written turn corrupts every later call from that seat, and it does so silently.
* **Treat an empty reply as a failed call and retry it, never as a short letter.** This one has produced a structure advisor counselling on a blank page, and an advisor inventing a last word on a pushback it never received.
* **Log the finish reason, the provider's own finish reason and the reasoning-token count.** Without all three, truncation and an upstream stop are the same event on the wire. One seat returned 4,224 reasoning tokens against 1 content token at a 22,000 ceiling, which reads exactly like a short letter.
* **Take the output ceiling from the environment.** One candidate seat in the editor bake-off emitted nothing at all until it was given 40,000, on both its seats; a family's appetite for reasoning is part of its seating cost (`model-selection.md`).
* **Enforce a minimum word floor per call**, so an obviously truncated reply fails loudly instead of being relayed into the next letter.
* **One paid call at a time.** Seven runners launched in parallel tripped a router's in-flight budget, because each request reserves its whole completion ceiling against the account's credit. The remaining families ran one at a time behind a retry loop.

**Requirements rather than a script, ruled 2026-09-13; the record is in the provenance.** The obvious counter-argument is that the gate already ships as code and nobody has objected. It does not hold once you look at what that code is: a pure function from text to findings, with no network call, no credential, no vendor response shape and no dependency outside `node:fs`. Nothing outside it can move, so it cannot rot. A driver is the reverse on every one of those counts, and shipping one would make this plugin's only rotting file the one nobody can test without spending money. The knowledge is worth keeping anyway, so it is kept as behaviour, and each line names the failure it prevents.

## Every turn

### The map consultation, once per session

1. Writer sends a **pitch note** of 130 to 190 words (the one thing the reader should end up holding, where the explanation starts, what the last rung is, where he is likely to stop early), then the **concept map**: nodes, each with a one-line plain definition and a candidate concrete; "must be grounded before" edges, one per line; and the **pillar sentence**.
2. Advisor sends **counsel**, 170 to 250 words: the one point, the lead of Part 1, the order the reader meets the terms in, which nodes are clutter, and where the session is allowed to stop.
3. Writer sends the **pushback**: accept what convinces, argue the rest on the merits. The brief must say explicitly: do not roll over to be agreeable. The best material of every consultation came from honest holdouts.
4. Advisor sends the **last word**, 50 to 120 words: rule on the holdouts, then state the settled shape as one line per rung, so the relay has a spec every part can be held to.

The map is revisable after the interview. A node the reader already holds is pruned, or becomes the footing the explanation builds from.

### The interview and the ledger

5. Writer sends the **masthead and the welcome** in one call, off the settled map: a title of two to five words, a standfirst of one sentence under twenty words, and 110 to 160 words of welcome that opens on a real concrete, says why the questions come first, names "I don't know" as a complete answer, and explains nothing. It is the writer's call because Lamb's seat cannot preface anything, and it goes out on its own like every other paid call, before the probes or after them; the reader waits once either way, since nothing reaches him until both letters are back. Check the concrete it opens on before relaying it: the first draft of the first one invented a time of day.
6. Interviewer sends three to five **probes**, one clause each, numbered, nothing else in the letter. Keyed to what the reader already has in his hands rather than to terms he has not met. They are delivered under the welcome, and the relay adds no machinery notes above them.
7. The reader answers. Assessor returns the **routes** (one line per answer, one of the five) and the **ledger** (one entry per node: state, and the reader's own words as evidence), plus a misconception section stating what he believes and what is true instead, and a line naming any answer that needs one follow-up.
8. After every part, the interviewer asks **one follow-up** that checks whether the part landed, and the assessor updates the ledger.

### The pillar, and every part

9. The writer formats the **pillar** in one call: the position line, the settled pillar sentence with any canonical formulation quoted and attributed, a TERMINOLOGY block drawn from the map's definitions, and the closing label with its line. Plain declarative register, no scene, no analogy, no wisecrack.
10. The **root-conformance gate** runs inside the veridicality check, on the pillar, every time: every term an exact map node; every relation stated or deliberately omitted without changing scope; no new commitment in the TERMINOLOGY block; an entry in that block for every term the prose uses, under the same spelling; every map node the pillar's scope commits to reaches the prose under its settled name, or is named in the finding as deliberately omitted; a disposition per clause. A failure blocks delivery and takes one constrained rewrite. **The gate reports and never edits.** The naming is the writer's, done in that rewrite, so no Claude seat writes a word of the pillar's prose. The last two clauses were ruled on 2026-09-13: run 6 shipped a pillar in which a settled node name never reached the prose at all, and in run 7 this gate found both faults unaided, which is what made writing them down worth doing.
11. Each later **part** is written after the reader replies: one rung down, aimed at the deepest node the ledger shows ungrounded, built from what he holds. Then the interviewer reads the finished part and writes the one question that goes under its closing label. Then the lint gate, then delivery. Both lines under the label are their seats' own words and the relay assembles without editing either.

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

10. **Lint**: the six rules in `lint-gate.md`, run on the finished text with whatever the agent has. Findings bounce the text back to the revision step with the findings quoted. The gate checks em dashes and spaced hyphens posing as dashes; "not X, but Y" and "isn't just" frames; the banned lexicon; probable rule-of-three sentence endings; the prose word count between the question line and the TERMINOLOGY label, with Part 0 exempt; and every character outside plain ASCII, named by its code point and by the ASCII character it resembles.

**Know what the gate does not see.** All six rules are mechanical and none of them reads a sentence. The register fault that produced the tightening seat is *discourse-level* and no word in it is remarkable, so the gate passes it silently, and that is the line rules 5 and 6 were written to stay behind: a word is counted and a code point is compared. The two things it used to miss for free are now rules of its own, after run 6 passed a 304-word part and run 7 emitted an invisible hyphen in nearly every delivery. A deliberate exemption (a quoted lexicon, a term of art named in the text, a real title carrying an em dash, a letter a proper name needs) is **logged and published with the text**, never edited away: the linter has no escape syntax, so an exemption is a decision on the record rather than a change to the artifact.

## When a document is wanted

The same seats, the same voice, the same gate, at the full setting, with three differences. The masthead grows from two slots to four: a session's title and standfirst stay, and a document adds the position line and the question line under them, because it lands in front of someone who did not watch it being made and cannot ask. The whole read is mandatory rather than conditional. And the veridicality check runs on every concrete in the finished text, not only on the ones a part happened to introduce. A pull request body, a retrospective, an explainer for a newcomer: these are the same machine pointed at a thing that will outlive the conversation.

## Why the theatre works (so nobody optimizes it away)

The letters are not decoration. Three mechanisms do real work: the pushback step forces trade-offs into the open where the relay and the reader can see them; the advisor's last word creates a settled, citable structure so the revision has a spec; and staying in character keeps each agent inside its anchored texture, which is what prevents regression to the model's default register (see `research.md` on the assistant prior). Collapsing the exchange into "just edit it" reintroduces exactly the single-pass, style-versus-correctness trade the two-pass design exists to avoid.

**The relay's own failures are false concretes too, and they propagate faster than the writer's.** A silenced error once sent an empty pitch to the structure advisor, who counselled on a blank page; a heading in bold once defeated the letter extraction, and the advisor invented a last word on a pushback it never received. So the relay checks every reply is non-empty before it goes anywhere, and extracts a letter by its content and never by an exact heading. What the client underneath has to do about the same failures is in the driver's contract above, stated once there and nowhere else.
