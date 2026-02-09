---
name: 9to5
description: Automated agents for Claude Code. Use when the user wants to create agents, manage recurring AI agent runs, view run history, check their inbox, start/stop the background daemon, trigger agents via webhooks, or use the 9to5 TUI dashboard. Keywords: agents, schedule, cron, automation, recurring tasks, daemon, background jobs, webhook, trigger, CI, GitHub Actions.
license: MIT
compatibility: Requires Bun runtime (v1.1+) and Claude Code CLI installed and authenticated
metadata:
  author: Michaelliv
  version: "0.2.0"
  homepage: "https://michaelliv.github.io/9to5/"
  repository: "https://github.com/Michaelliv/9to5"
---

# 9to5 — Automated agents for Claude Code

9to5 is a CLI + TUI for creating automated Claude Code agents. Define an agent with a prompt, schedule, budget cap, and system prompt. Trigger it on a schedule, from a webhook, or on demand. A background daemon runs them automatically. Results land in an inbox with cost and duration tracking.

## When to use this skill

Use this skill when the user wants to:
- Create automated Claude Code agents that run on a schedule or via webhook
- Create, edit, list, pause, or remove agents
- Trigger an agent manually or resume a previous run's session
- Trigger agents from external sources (GitHub Actions, CI, scripts) via webhooks
- View run history and execution results
- Check inbox notifications from completed runs
- Start or stop the background daemon
- Export or import agent configurations
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
| `9to5 add <name>` | Create a new agent |
| `9to5 edit <id>` | Edit an existing agent |
| `9to5 list` | List your agents with status and next run time |
| `9to5 run <id>` | Run an agent now |
| `9to5 runs [id]` | View run history (all or filtered by agent) |
| `9to5 resume <run-id>` | Resume the Claude Code session from a previous run |
| `9to5 inbox` | Check your inbox |
| `9to5 remove <id>` | Remove an agent and its runs/inbox items |
| `9to5 export [id]` | Export agent(s) as JSON |
| `9to5 import <file>` | Import agents from JSON (`--update` to merge by name) |
| `9to5 start` | Start the background daemon |
| `9to5 stop` | Stop the background daemon |
| `9to5 onboard` | Add 9to5 instructions to ~/.claude/CLAUDE.md |
| `9to5 ui` | Launch the interactive TUI dashboard |
| `9to5 webhook info` | Show webhook configuration and URLs |
| `9to5 webhook refresh` | Regenerate the webhook secret |
| `9to5 webhook enable` | Enable webhook triggers |
| `9to5 webhook disable` | Disable webhook triggers |
| `9to5 webhook url <id>` | Print ready-to-use trigger commands for an agent |

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

Without `--rrule`, agents are manual-only (`9to5 run <id>`) or webhook-triggered.

## TUI dashboard

Launch with `9to5 ui`. Two-column layout: list on the left, detail on the right.

| View | Hotkeys |
|------|---------|
| Agents | `r` run, `p` pause/resume, `dd` delete, `Enter` drill into runs |
| Runs | `c` copy output, `Enter` view detail, `Esc` back |

Navigation: arrow keys or `j`/`k`, `q` to quit.

## Editing via file

```bash
9to5 export <id> > agent.json
# edit the JSON
9to5 import agent.json --update
```

`--update` matches by name and applies changed fields.

## Webhooks

Trigger agents from GitHub Actions, CI pipelines, or scripts on other machines. Two paths — local HTTP and remote via ntfy.sh — both secured with HMAC-SHA256 signing. No infrastructure to host, no accounts needed.

Webhooks are enabled by default — the daemon auto-generates a secret on first start. Use `9to5 webhook disable` to turn them off.

```bash
# View webhook config and URLs
9to5 webhook info

# Get ready-to-use curl commands for a specific agent
9to5 webhook url <agent-id>

# Regenerate the secret (breaks existing integrations)
9to5 webhook refresh
```

**Local trigger** — `POST http://localhost:9505/trigger/<id>` with signed body and `X-Signature` header. For same-machine or local network scripts.

**Remote trigger** — `POST` to the ntfy.sh URL shown by `webhook info`. Works from anywhere. The daemon subscribes via SSE.

Both verify signatures and reject messages older than 5 minutes.

## Data storage

All data lives in `~/.9to5/`:
- `db.sqlite` — SQLite database (WAL mode) with agents, runs, and inbox tables
- `daemon.pid` — PID file for the background daemon
- `webhook.secret` — HMAC secret for webhook triggers (auto-generated on first daemon start)
- `webhook.disabled` — Marker file indicating webhooks are explicitly disabled

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
