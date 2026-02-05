# 9to5

Schedule and automate Claude Code tasks. Create recurring automations, monitor runs, and manage everything from a CLI or interactive TUI dashboard.

## Installation

### From npm

```bash
npm install -g 9to5
```

### From source

Requires [Bun](https://bun.sh) (v1.1+) and [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated.

```bash
# Clone the repository
git clone https://github.com/miclivs/9to5.git
cd 9to5

# Install dependencies
bun install

# Run directly
bun run dev

# Or compile to a standalone binary
bun run build
./9to5
```

## Quick start

```bash
# Create an automation
9to5 add "Daily tests" --prompt "Run the test suite and fix any failures" --rrule "FREQ=DAILY"

# Run it immediately
9to5 run <automation-id>

# Start the daemon to run automations on schedule
9to5 start

# Launch the interactive dashboard
9to5 ui
```

## Commands

| Command | Description |
|---|---|
| `9to5 add <name>` | Create a new automation |
| `9to5 list` | List all automations |
| `9to5 remove <id>` | Delete an automation |
| `9to5 run <id>` | Trigger an automation immediately |
| `9to5 runs [id]` | View run history |
| `9to5 inbox` | View notifications from completed runs |
| `9to5 export [id]` | Export automation(s) as JSON |
| `9to5 import <file>` | Import automation(s) from JSON |
| `9to5 start` | Start the background daemon |
| `9to5 stop` | Stop the background daemon |
| `9to5 ui` | Launch the interactive TUI dashboard |

### `add` options

| Option | Description |
|---|---|
| `--prompt <prompt>` | Prompt to send to Claude (required) |
| `--cwd <dir>` | Working directory (default: current) |
| `--rrule <rule>` | RFC 5545 recurrence rule (e.g. `FREQ=DAILY`) |
| `--model <model>` | Claude model (default: `sonnet`) |
| `--max-budget-usd <n>` | Cost limit per run |
| `--allowed-tools <tools>` | Comma-separated list of allowed tools |
| `--system-prompt <prompt>` | Custom system prompt |

## TUI dashboard

Launch with `9to5 ui` for an interactive terminal dashboard with three tabs:

- **Automations** — view, run, pause, and delete automations
- **Runs** — monitor execution history with status, duration, and cost
- **Inbox** — read notifications from completed runs

Navigate with `1`/`2`/`3` to switch tabs, `j`/`k` or arrow keys to move, `Enter` to view details, and `q` to quit.

## Data

All data is stored locally in `~/.9to5/` (SQLite database and daemon PID file).

## License

MIT
