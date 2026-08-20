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

## Install

```
/plugin marketplace add mpj/mpj-skills
/plugin install sweeps@mpj
```

Or copy `plugins/sweeps/skills/truing/` and `plugins/sweeps/skills/parsimony/`
into `~/.claude/skills/`.

Each `SKILL.md` is a plain [Agent Skill](https://github.com/anthropics/skills) —
prose, no scripts, no dependencies — so it works in any agent that reads the
format, and it names no repository, language or toolchain of its own.
