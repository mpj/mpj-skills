---
name: truing
description: Sweep a repository in three passes — veridicality (a claim held against the world), congruency (a claim held against another claim), disambiguation (a claim held against its reader) — and produce one dated findings brief. Use when asked to audit what a repo asserts, hunt contradictions between code and its docs, find sentences two readers would act on differently, or check whether what a project says about itself is still so. Edits nothing, lands nothing, keeps no memory between runs. Sibling of `parsimony`.
---

# truing

*Any argument you were invoked with is the operator's seed word.*

A repo goes out of true the way a wheel does — nothing is broken, every part is
where someone put it, and it still will not run straight. One run, three
sweeps, each holding a claim against a different thing. **Veridicality** holds
a claim against the world: is this so, how would anyone know, and does
something re-derive it or does an adjective assert it — *fast*, *safe*,
*complete*. Both what the repo says about itself and what the software says to
whoever reads its output. **Congruency** holds a claim against another claim:
two statements that disagree are worse than either alone, because a human
reader gets suspicious and checks, while an agent picks one at full confidence
and builds on it. Two places one decision would have to change together, where
nothing goes red when only one moves and nothing on record says why there are
two, are already incongruent — the promise to stay in step is a claim nobody
wrote down. The finding is that silence, never the copy, and splitting them on
purpose is as good a remedy as merging. **Disambiguation** holds a claim
against its reader: one
sentence, two readings, two different artifacts. Sweep in that order; each
hands the next its suspects. None of the three asks whether a thing should
exist at all — that is `parsimony`, and it is a separate sitting on purpose.

Invent the traversal, and a different one every time. A route written down
becomes a checklist, and a checklist finds one class of defect forever, then
reports clean — which is why this run keeps no memory of any previous one, and
why you are not told where to walk. But taste does not vary, so seed the
entrance from outside your own instinct: best is a word the operator hands you,
failing that the `HEAD` sha or today's date, mapped to a start by a command a
reviewer could rerun. Say the route and the reason before you take it. Your
frame is the tracked, claim-bearing set, because contradictions against
abandoned text are all true and worthless, and an earlier brief sits in that
set as prose rather than as a route to retake. The unswept ground is usually
the checking apparatus itself — the CI workflow, the hooks, the tests that
guard other tests — since nothing inspects it.

A finding is worth writing down when it names two things. **The address of the
check** that would have caught it: the gate that should have gone red, or,
where no gate could reach it, the document that would have to say so. And
**what would show it wrong**: a file, a value, or the person who would say so.
*Wrong if the operator reads that sentence and does not stumble* is a good
refutation condition, and a finding nothing could refute stays out of the
brief. That bar sits below naming a fix on purpose. Findings sharing an address
are one **class** carrying instances, and a class outranks a lone defect,
because closing it closes every future instance. Where something already checks
a claim, name it — the file, the assertion, the message, never "add more
logging". Logs are the method before they are the remedy: where the system
narrates itself, hold a behavioural claim against what it actually emitted.

The **forks** go first, not because they outrank anything but because they are
the only findings the operator cannot delegate: two readings both defensible, leading to two different artifacts,
where the implementation quietly picked one and nothing recorded that a
decision was being made. Name the artifact that differs under each reading;
without that it is a preference. Where forks hide is greppable — a rule saying
what happens but not what should happen when its cases collide, a default
nothing records choosing, a *for now* that outlived whoever wrote it. A
question the repo already records is not a fork; it is reading. Raise them and
do not settle them. Silence decides nothing, and an answer belongs in the house
law where the next run will read it, because a brief binds nobody. Put them in
the operator's world: the researcher opening the record in six months, a named
customer, a real date.

The run edits nothing, lands nothing, and produces one dated brief. Say how
many claims you tested and how many survived, and stop at ten findings, a class
counting once — a finding that does not survive costs the operator the walk you
already took, where one you never wrote costs them nothing. Judge against the
house: whatever the repo you stand in uses as its law, and where nothing is
written down, read it off what blocks a merge and what its recent edits repeat.
A standard with neither behind it is imported, so say so and from where. Where
the house law is itself untrue, incongruent or ambiguous, say so plainly;
nothing else you find will be copied as widely. Then write the brief to the
standard it enforces, because an agent is not sloppy in a careful codebase or
vague in a clear one, and every sentence left behind is evidence or poison for
the next session, with no neutral third state a wrong one can retire into.
Where a sentence does not survive, delete it rather than defend it.
