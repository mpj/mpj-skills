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
understanding something. An interviewer seat probes before anything is
explained, in a texture anchored on Brian Lamb's questions; a dense expert
statement stands as the pillar, the unit test of whether they already knew it;
every later part is written on demand from their own words, one rung down the
ladder of abstraction, with a detour whenever a misconception shows. Nothing is
written ahead of the reader. A position line and a ground line above each part,
so someone landing from another tab knows where they stand, and a labelled block
below it: terminology, summary, continue or ask.

The prose comes from a shop of seats that argue by letter. The head writer
continues verbatim passages of a real author rather than imitating a description
of one; a structure advisor rules on the map, the pillar and the exit; a
precision editor and a tightening advisor work the line; every concrete is held
against the world by an agent with tools, and a four-rule mechanical gate runs
last. The seats were filled by audition and each has lost an argument to the
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

Each `SKILL.md` is a plain [Agent Skill](https://github.com/anthropics/skills) —
prose, no scripts, no dependencies — so it works in any agent that reads the
format, and it names no repository, language or toolchain of its own. The
`rung` skill carries its charters and its record as `references/`, prose too;
its one mechanical gate is four patterns written out, with a reference
implementation an agent may run or re-express.
