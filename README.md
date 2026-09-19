# mpj-skills

Agent skills by [Mattias Petter Johansson](https://github.com/mpj).

## sweeps

Two repository sweeps, paired, with deliberately opposite calibrations.

**`truing`** finds what a repo says that is not so. Three passes, each holding a
claim against a different thing: *veridicality* against the world, *congruency*
against another claim, *disambiguation* against its reader. It edits nothing,
keeps no memory between runs, and every finding must name what would show it
wrong — a finding nothing could refute stays out of the brief.

**`parsimony`** proposes what should stop existing. Not what is broken, which is
`truing`'s business, and not what is unused, which is housekeeping — but what
still works and no longer earns what everyone coming after has to carry. Its
proposals are meant to be refused more often than accepted, because a proposal
you would bet gets accepted is one you did not have to be brave to make.

They are two skills rather than one because the calibrations cannot share a
page: a run that has to be right most of the time will never say the thing worth
saying in the second one.

## noun

One skill, **`noun-api`**, for the Noun Project icon API: how to sign a request
with the two keys in the environment (`NOUN_API_KEY`, `NOUN_API_SECRET`), what
to ask for, and what to remember — the asset URLs expire within the hour, every
icon comes with the attribution you owe, and the quota is monthly. Checked live
against the API rather than transcribed from its documentation.

```
/plugin install noun@mpj
```

## rung

One skill, **`rung`**, for holding a discussion with one person that leaves them
understanding something. A session opens on a title, a one-line standfirst and a
welcome, so nobody starts reading page one of a book with no cover. Then an
interviewer seat probes before anything is explained, working from Brian Lamb's
doctrine and from an indicative corpus that ships with the skill and says on its
first line that no real person said a word of it, because his transcripts
stopped being reachable; a dense expert
statement stands as the pillar, the unit test of whether they already knew it;
every later part is settled against their actual reply, one rung down the
ladder of abstraction, with a detour whenever a misconception shows. After
Part 0, one provisional next part can be prepared while the reader reads,
assuming "I understand, go on", then reused, revised or replaced when they reply.
A position line and a question line above each
part, so someone landing from another tab knows where they stand and what the
part is for, and a labelled block below it: terminology, summary, and the three
moves (I understand, ask, or go on).

The prose comes from a shop of seats that argue by letter. The head writer
continues verbatim passages of a real author rather than imitating a description
of one, fetched once per machine and never committed to this repository; a structure advisor rules on the map, the pillar and the exit; a
precision editor and a tightening advisor work the line; every concrete is held
against the world by an agent with tools, a leak check makes sure no eight words
of an author's own prose come back out the other end, and a six-rule mechanical
gate runs last. The seats were filled by audition and each has lost an argument to the
writer on the merits. The heavy seats run when the text will be kept rather than
on every turn, because a full pass costs minutes. Model-agnostic in form, and
the seats should sit on different families: the provenance records what happened
when they did not.

The same voice writes a document when one is wanted, a pull request body or a
retrospective, at the fuller setting. It builds no files and no pages of its
own.

## Install

```
/plugin marketplace add mpj/mpj-skills
/plugin install sweeps@mpj
/plugin install rung@mpj
```

Or copy the skill directories under `plugins/*/skills/` into `~/.claude/skills/`.

OpenCode also discovers skills in `~/.claude/skills/`. A copied installation is
a snapshot: pushing changes here does not update it. Refresh the complete skill
directory, including `references/`, while preserving any `*.local.md` anchor
files, then quit and restart OpenCode. Start a fresh rung session to avoid
continuing with the old seat prompts. When installing from a feature branch,
record its commit; the normal marketplace source does not include those changes
until they reach its default branch.

Each `SKILL.md` is a plain [Agent Skill](https://github.com/anthropics/skills) —
prose, no scripts, no dependencies — so it works in any agent that reads the
format, and it names no repository, language or toolchain of its own. The
`rung` skill carries its charters and its record as `references/`, prose too;
its mechanical checks are patterns written out, each with a reference
implementation an agent may run or re-express. Those implementations, and the
claims the prose makes about itself, are held by a test suite at the root of
this repository, which ships with no plugin.
