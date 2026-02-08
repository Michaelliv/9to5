---
name: 9to5
description: Schedule and automate Claude Code tasks with 9to5. Use when the user wants to create scheduled automations, manage recurring AI agent runs, view run history, check their inbox, start/stop the background daemon, or use the 9to5 TUI dashboard. Keywords: schedule, cron, automation, recurring tasks, daemon, background jobs.
license: MIT
compatibility: Requires Bun runtime (v1.1+) and Claude Code CLI installed and authenticated
metadata:
  author: Michaelliv
  version: "0.1.7"
  homepage: "https://michaelliv.github.io/9to5/"
  repository: "https://github.com/Michaelliv/9to5"
---

# 9to5 — Cron for Claude Code

9to5 is a CLI + TUI that schedules Claude Code to run on a timer. Create automations with prompts, schedules, budget caps, and system prompts. A background daemon triggers them automatically. Results land in an inbox with cost and duration tracking.

## When to use this skill

Use this skill when the user wants to:
- Schedule Claude Code to run automatically on a recurring basis
- Create, edit, list, pause, or remove automations
- Trigger an automation manually or resume a previous run's session
- View run history and execution results
- Check inbox notifications from completed runs
- Start or stop the background daemon
- Export or import automation configurations
- Launch the interactive TUI dashboard

## Installation

```bash
# Via npm (requires Bun)
bunx 9to5 --help

# Or clone and install
git clone https://github.com/Michaelliv/9to5.git
cd 9to5 && bun install

# Run in dev mode
bun run dev -- <command>

# Build standalone binary
bun run build
./9to5 <command>
```

## Commands

| Command | Description |
|---------|-------------|
| `9to5 add <name>` | Create a new automation (interactive prompts for config) |
| `9to5 edit <id>` | Edit an existing automation's fields |
| `9to5 list` | List all automations with status and next run time |
| `9to5 run <id>` | Trigger an automation immediately |
| `9to5 runs [id]` | View run history (all or filtered by automation) |
| `9to5 resume <run-id>` | Resume the Claude Code session from a previous run |
| `9to5 inbox` | View notifications from completed runs |
| `9to5 remove <id>` | Delete an automation and its runs/inbox items |
| `9to5 export [id]` | Export automation(s) as JSON |
| `9to5 import <file>` | Import automations from JSON (`--update` to merge by name) |
| `9to5 start` | Start the background daemon |
| `9to5 stop` | Stop the background daemon |
| `9to5 onboard` | Add 9to5 instructions to ~/.claude/CLAUDE.md |
| `9to5 ui` | Launch the interactive TUI dashboard |

## Options for `add` and `edit`

| Option | Description | Default |
|--------|-------------|---------|
| `--prompt <prompt>` | The instruction Claude Code will execute | Required |
| `--cwd <dir>` | Working directory for the run | Current directory |
| `--rrule <rule>` | RFC 5545 recurrence rule | None (manual only) |
| `--model <model>` | Claude model (`sonnet`, `opus`, `haiku`) | `sonnet` |
| `--max-budget-usd <n>` | Max spend per run in USD | None |
| `--allowed-tools <t>` | Comma-separated tool allowlist | All tools |
| `--system-prompt <p>` | Appended to Claude's system prompt | None |
| `--status <s>` | `active` or `paused` (edit only) | `active` |

## Schedule format (rrule)

Schedules use RFC 5545 recurrence rules. Examples:

| Rule | Meaning |
|------|---------|
| `FREQ=DAILY;BYHOUR=9` | Daily at 9 AM |
| `FREQ=HOURLY;INTERVAL=4` | Every 4 hours |
| `FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=10` | Weekdays at 10 AM |
| `FREQ=WEEKLY;BYDAY=MO;BYHOUR=9` | Mondays at 9 AM |
| `FREQ=MINUTELY;INTERVAL=30` | Every 30 minutes |

Without `--rrule`, automations are manual-only (`9to5 run <id>`).

## TUI dashboard

Launch with `9to5 ui`. Two-column layout: list on the left, detail on the right.

| View | Hotkeys |
|------|---------|
| Automations | `r` run, `p` pause/resume, `dd` delete, `Enter` drill into runs |
| Runs | `c` copy output, `Enter` view detail, `Esc` back |

Navigation: arrow keys or `j`/`k`, `q` to quit.

## Editing via file

```bash
9to5 export <id> > automation.json
# edit the JSON
9to5 import automation.json --update
```

`--update` matches by name and applies changed fields.

## Data storage

All data lives in `~/.9to5/`:
- `db.sqlite` — SQLite database (WAL mode) with automations, runs, and inbox tables
- `daemon.pid` — PID file for the background daemon

## Example

```bash
9to5 add "morning-review" \
  --prompt "Review yesterday's commits and summarize changes" \
  --rrule "FREQ=DAILY;BYHOUR=9" \
  --model sonnet \
  --max-budget-usd 0.25

9to5 start  # daemon triggers it daily at 9 AM
```

More examples in the [`examples/`](https://github.com/Michaelliv/9to5/tree/main/examples) directory — import any with `9to5 import examples/<name>.json`.
