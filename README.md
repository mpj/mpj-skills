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

## writing-shop

An editorial shop for prose an agent writes to a person, and the delivery form
that goes with it.

**`writing-shop`** writes a piece in one settled voice and edits it by letter.
The head writer continues verbatim passages of a real author rather than
imitating a description of one; a structure advisor rules on the one point,
the lead and the exit before the draft; a precision editor and a tightening
advisor work the line after it; every concrete is then held against the world
by an agent with tools, and a four-rule mechanical gate runs last. The seats
were filled by audition and each has lost an argument to the writer on the
merits. Model-agnostic, and the seats should sit on different families: the
provenance records what happened when they did not.

**`serial`** delivers an explanation one part at a time, inverted pyramid, at
most three new terms a part and each defined before anything leans on it, a
masthead above every part for the reader landing from another tab, and a
checkpoint after every part that invites them to continue or to ask about a
word. It exists because an agent deep in a context assumes its reader is in it
too, and delivers in blocks too large to stop and ask about.

## Install

```
/plugin marketplace add mpj/mpj-skills
/plugin install sweeps@mpj
/plugin install writing-shop@mpj
```

Or copy the skill directories under `plugins/*/skills/` into `~/.claude/skills/`.

Each `SKILL.md` is a plain [Agent Skill](https://github.com/anthropics/skills) —
prose, no scripts, no dependencies — so it works in any agent that reads the
format, and it names no repository, language or toolchain of its own. The
writing shop carries its charters and its record as `references/`, prose too;
its one mechanical gate is four patterns written out, with a reference
implementation an agent may run or re-express.
