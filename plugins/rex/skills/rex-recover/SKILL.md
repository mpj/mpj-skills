---
name: rex-recover
description: Put coding-agent conversations back in their Rex windows after the Rex server restarted (an upgrade, a crash, an OOM kill, a reboot). Rex restores its sessions, windows and splits but not the programs that ran in them, so every agent tab comes back as an empty shell; this skill works out which conversation each empty tab held, checks it is not open anywhere else, and resumes it. Use when asked to recover, restore or reattach Rex tabs or agent sessions, or on noticing that agent windows are empty shells after a Rex restart.
---

# rex-recover

**What breaks.** When the Rex server restarts, it restores its saved sessions,
windows and splits, with the same window and block IDs. It deliberately does not
re-run what was in them. Rex's documentation says so: the server *"saves its
session layouts but the programs that were running in them don't come back
today"*. Every agent tab comes back as an empty shell prompt, under the label it
had before.

**What survives.** The conversations. A coding agent writes its conversation to
disk as it goes, so the process died with the tab but the record did not:

| Agent | Where the conversations are | How one is reopened |
|---|---|---|
| Claude Code | `~/.claude/projects/<dir-slug>/<session-id>.jsonl`, where `<dir-slug>` is the working directory with every `/` and `.` turned into `-` | `claude --resume <session-id>` (or `claude --continue`, the newest in the current directory) |
| OpenCode | its own database; `opencode session list --format json` lists them, with each one's directory and title | `opencode -s <session-id>` |
| Codex | `~/.codex/sessions/`, one JSONL file per conversation, recording its `cwd` | `codex resume <session-id>` |

Check each agent's `--help` on the machine before relying on a row: these flags
belong to the agents, not to Rex, and they move. A reply that was being written
when the server stopped is lost; the user asks again for the last step.

**The move.** For each empty tab: work out which conversation it held, prove
nothing else has that conversation open, and reopen it. Nothing else.

This is a judgement procedure, not a script, because the one dangerous mistake —
reopening a conversation that is still open somewhere, or touching a tab an
agent is still running in — is exactly the call that benefits from looking at
the screen. **When in doubt about a tab, leave it and report it.** An orphan left
behind costs the user one command; a wrong action costs a live agent.

## The three rules

1. **Never act on a tab that is in use.** Only a tab whose foreground process is
   its own idle shell is a candidate. An agent, an editor, a build, a pager or a
   prompt you cannot read means someone is using it.
2. **Never open one conversation twice.** Two agent processes writing the same
   conversation corrupt it, or at best interleave two threads of work in one
   record. Before reopening, find every running agent process and rule each one
   out.
3. **Resume first, retire second.** If reopening means making a new window, the
   old empty one stays until the new one is shown to hold the live
   conversation. A failed resume must never cost the tab that marked the spot.

## Scope

- **In scope:** a restart of the Rex server on this machine: an upgrade, a crash,
  an OOM kill, a reboot.
- **Your own tab is never an orphan.** If you run inside Rex, you started after
  the restart. Never act on your own block (`$REX_BLOCK`) or window.
- **Out of scope:** a machine rebuilt from scratch, or one whose disk was lost.
  The conversations went with the disk; there is nothing to recover. Say so and
  stop.
- **A project with its own layer.** Some projects launch their agents through
  their own wrapper, with a resume verb and a record of which tab holds which
  conversation. If the project's agent instructions (`AGENTS.md`, `CLAUDE.md`) or
  a project-level skill describe one, follow it: its record answers step 3
  exactly, where this skill can only infer, and relaunching through the wrapper
  keeps whatever the wrapper adds. This skill's rules still hold over it.

## Procedure

### 1. Establish that a restart happened, and when

```bash
rex server status        # `started:` is the restart instant, in UTC; `version:` is the running build
```

Every conversation that matters was last written before that instant. Keep it to
hand.

### 2. List the tabs and what is running in each

```bash
rex window ls -A --json                      # every window, in every session, with its label
rex block ls --json                          # every block, with its window
rex block call --block <block_id> process    # the block's shell and its foreground process, each with a cwd
```

For each block, read `process`:

- `foreground` is the shell itself (`foreground.pid == child.pid`), or there is no
  foreground: the tab is **idle**. A candidate.
- `foreground` is anything else: the tab is **in use**. Leave it.

Then look, because the census is a first reading and not a verdict:

```bash
rex block capture --block <block_id> --trim | tail -15    # an empty prompt, not an agent's screen
```

### 3. Work out which conversation each idle tab held

This is the inference, and it is where care is spent. The evidence, strongest
first:

- **The project's own record**, if it keeps one (see "A project with its own
  layer"). Use it and skip the rest.
- **The shell's working directory** (`child.cwd` in the census). A restored shell
  usually starts where it was, and an agent works in the directory it was started
  from. Look for conversations recorded for that directory: the Claude Code
  project folder named for it, OpenCode sessions whose `directory` matches,
  Codex session files whose `cwd` matches.
- **The window's label.** It often names the work, and an agent's conversation
  usually carries a title or a first message that matches it.
- **The time.** The conversation was written to shortly before the restart, and
  not after it (if it was written after, something else has it open).

A tab is **matched** when the evidence names exactly one conversation. Several
idle tabs in one directory, several recent conversations there and nothing to
tell them apart, or a home directory or a main checkout that many conversations
share: **ambiguous**. Report the candidates and let the user choose, for
example:

```bash
ls -t ~/.claude/projects/<dir-slug>/*.jsonl | head -3
```

### 4. Prove the conversation is not open anywhere

```bash
ps -eo pid=,comm=,args= | grep -Ei 'claude|opencode|codex' | grep -v grep
readlink /proc/<pid>/cwd            # Linux; on macOS: lsof -a -p <pid> -d cwd -Fn
```

For each running agent process: if its command line names the conversation, or
it names none and its working directory is the conversation's directory, treat
the conversation as **attached**. Skip it, and list it under "needs eyes". Leave
out any agent's background server (OpenCode's `opencode serve`, for one): it
holds every conversation and none of them as a view. Check also that the
conversation's directory still exists.

### 5. Show the plan before acting

One row per tab, leading with what the user can see — the window's label — and
not with an ID:

| Window label | Agent | Verdict | Action |
|---|---|---|---|
| `Payments refactor` | Claude Code | orphan | resume `8f2c…` in place |
| `Docs pass` | OpenCode | orphan | resume `ses_…` in place |
| `Migration review` | Claude Code | working | none |
| `scratch` | (none) | ambiguous | report two candidates |

If the user is watching and the list is long or anything is unclear, wait for a
go-ahead. If they asked you to just recover, go ahead with the unambiguous
orphans only.

### 6. Reopen each orphan, one at a time

The plain way is in place: type the resume command into the restored shell, which
is already in the right window under the right label.

```bash
rex block call --block <block_id> process      # re-check, immediately before: still idle?
rex send -b <block_id> $'cd <directory> && claude --resume <session-id>\n'
rex block capture --block <block_id> --trim | tail -15   # the agent's screen, showing that conversation
```

Re-check immediately before sending, because the user may have started typing in
that tab since step 2. Text sent to a busy terminal lands in whatever is running
there.

If the project's layer reopens a conversation by launching a new window instead,
rule 3 applies: run its resume verb, confirm the new window shows the live
conversation, and only then close the empty restored window
(`rex window close <window_id>`). If the resume fails, leave the old window
alone and report the error word for word. If the new window shows anything other
than the agent with its conversation, close nothing and report both windows.

### 7. Report

End with three lists, one line each, labels first:

- **Reattached:** window label → conversation, and where it now runs.
- **Left alone:** working, not an agent, your own tab.
- **Needs eyes:** ambiguous, attached elsewhere, missing directory, failed
  resume, anything you could not read.

Give every time with its zone. `rex server status` prints UTC.

## What this skill never does

- Restart the Rex server or an agent's background service. Recovery follows a
  restart; it never causes one.
- Run `rex server stop --discard`, which deletes the saved layout that marks
  where each conversation was.
- Send keys to a tab whose foreground is not its idle shell.
- Close a window it did not just replace with a live one.
- Guess between candidates. An ambiguous tab is reported, with its candidates.

## Background

- Rex on restarts: <https://www.superlogical.com/rex/docs/linux/upgrading>
  ("What Restarts").
- `fazxes/rex-durable` (MIT) does a similar job unattended, as a daemon that
  types resume commands into restored shells, for Claude Code and Codex among
  others. If unattended recovery is ever wanted, that is the shape to compare
  against. What such a daemon must solve is what this skill leaves to a judging
  agent: firing on every restart and not only at boot, an unambiguous idle-shell
  check, a guard against double attach, and parity with however the agents were
  first launched.
