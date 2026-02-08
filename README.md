# 9to5

You use Claude Code. Some tasks — code reviews, security scans, dependency audits — should just happen on their own. 9to5 makes that work.

Set a prompt, set a schedule, set a budget. A background daemon runs it while you're not looking. Results land in your inbox with cost, duration, and structured output.

> **Agents:** for complete option references and scheduling examples, read [`skills/9to5/SKILL.md`](skills/9to5/SKILL.md) or install the skill with `npx skills add Michaelliv/9to5`. You can also run `9to5 onboard` to add instructions to `~/.claude/CLAUDE.md`.

## What people automate

The [`examples/`](examples/) directory has ready-to-import automations:

```bash
9to5 import examples/morning-briefing.json
```

| Example | Schedule | What it does |
|---------|----------|-------------|
| [Morning briefing](examples/morning-briefing.json) | Daily 7am | Summarize last 24h of commits, PRs, issues, CI status |
| [Security scan](examples/security-scan.json) | Daily | Check recent commits for hardcoded secrets and vulnerability patterns |
| [Test gap finder](examples/test-gap-finder.json) | Nightly | Find untested code in recent commits, suggest test skeletons |
| [API contract watchdog](examples/api-contract-watchdog.json) | Every 2h | Hit API endpoints, compare responses to spec, flag drift |
| [Project health check](examples/project-health-check.json) | Every 6h | Run tests, measure build times, track repo metrics over time |
| [Ecosystem watch](examples/ecosystem-watch.json) | Every 12h | Check for new releases of dependencies and breaking changes |
| [Reddit trend scout](examples/reddit-trend-scout.json) | Every 4h | Scout trending posts and draft blog content |
| [TODO tracker](examples/todo-tracker.json) | Weekly | Inventory TODO/FIXME comments, track additions and removals |
| [Stale branch archaeologist](examples/stale-branch-archaeologist.json) | Weekly | Assess old branches and recommend which are safe to delete |
| [Dependency deep audit](examples/dependency-deep-audit.json) | Weekly | Analyze actual usage of deps, flag unmaintained or replaceable ones |
| [Refactor spotter](examples/refactor-spotter.json) | Weekly | Find emerging code patterns worth extracting |
| [License compliance](examples/license-compliance-checker.json) | Weekly | Scan dependency tree for copyleft or problematic licenses |
| [Drift detector](examples/drift-detector.json) | Daily | Compare IaC config against actual running state |
| [Competitor comparison](examples/competitor-comparison-pages.json) | Weekly | Research competitors and generate comparison docs via worktree PR |

## Quick start

Requires [Bun](https://bun.sh) (v1.1+) and [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated.

```bash
git clone https://github.com/Michaelliv/9to5.git
cd 9to5
bun install
```

```bash
# Create an automation that runs daily at 9am
9to5 add "morning-review" \
  --prompt "Review yesterday's commits and summarize changes" \
  --rrule "FREQ=DAILY;BYHOUR=9" \
  --model sonnet \
  --max-budget-usd 0.25

# Run it immediately to see what you get
9to5 run <id>

# Start the daemon — it handles the rest
9to5 start

# Or browse everything in the TUI
9to5 ui
```

## Why not just cron + `claude -p`?

You could. 9to5 adds what you'd end up building yourself:

- **Budget caps per automation** — it won't burn your API credits overnight
- **Run history with cost and duration** — know what each run cost and how long it took
- **Inbox** — read/unread notifications so you know what happened while you were away
- **Session resume** — pick up where a run left off with `9to5 resume <run-id>`
- **Interactive TUI** — browse, run, pause, delete, and drill into output without leaving the terminal
- **Export/import** — share automations as JSON, bring them to another machine
- **Model and system prompt per automation** — different personas for different jobs

## Commands

| Command | Description |
|---------|-------------|
| `9to5 add <name>` | Create a new automation |
| `9to5 edit <id>` | Edit an existing automation |
| `9to5 list` | List all automations |
| `9to5 run <id>` | Trigger an automation immediately |
| `9to5 runs [id]` | View run history |
| `9to5 resume <run-id>` | Resume the Claude Code session from a previous run |
| `9to5 inbox` | View notifications from completed runs |
| `9to5 remove <id>` | Delete an automation |
| `9to5 export [id]` | Export automation(s) as JSON |
| `9to5 import <file>` | Import automation(s) from JSON |
| `9to5 start` | Start the background daemon |
| `9to5 stop` | Stop the background daemon |
| `9to5 onboard` | Add 9to5 instructions to `~/.claude/CLAUDE.md` |
| `9to5 ui` | Launch the interactive TUI dashboard |

## TUI dashboard

Launch with `9to5 ui` for a two-panel terminal dashboard:

- **Automations** — browse, run, pause, and delete with a detail panel showing prompt, schedule, and config
- **Runs** — drill into an automation to see execution history with status, duration, cost, and structured output
- **Hotkeys** — `r` run, `p` pause/resume, `dd` delete, `c` copy output, `m` toggle read, `q` quit

## Data

All data is stored locally in `~/.9to5/` (SQLite database and daemon PID file).

## Docs

Landing page at [michaelliv.github.io/9to5](https://michaelliv.github.io/9to5/). For agent-friendly option references and scheduling examples, see [`skills/9to5/SKILL.md`](skills/9to5/SKILL.md).

## License

MIT
