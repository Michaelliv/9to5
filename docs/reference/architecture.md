# Architecture

9to5 is a monorepo with three packages that share a common database.

## Package Structure

```
9to5/
├── packages/
│   ├── cli/          # Command-line interface (Commander.js)
│   ├── core/         # Business logic, database, runner
│   └── tui/          # Terminal UI (OpenTUI React)
├── examples/         # Importable automation recipes
└── docs/             # This documentation site
```

### `packages/cli`

The CLI package provides the `9to5` command. Built with [Commander.js](https://github.com/tj/commander.js), it registers one command per file in `src/commands/`. The CLI delegates all business logic to the `core` package.

The `ui` command launches the TUI as a subprocess:

```
9to5 ui → bun run packages/tui/src/index.tsx
```

### `packages/core`

The core package contains all shared business logic:

- **Database** — SQLite via Bun's built-in SQLite driver, with WAL mode
- **Schema** — Table definitions and migrations
- **Runner** — `executeRun()` function that spawns Claude Code
- **Claude integration** — `buildClaudeArgs()` constructs the CLI invocation
- **Configuration** — Paths, constants, and defaults
- **Types** — TypeScript types for automations, runs, and inbox items
- **Utilities** — ID generation (nanoid), RRule scheduling

### `packages/tui`

The TUI package provides an interactive terminal dashboard. Built with [OpenTUI React](https://github.com/anthropics/opentui), it renders a full-screen interface with tab navigation, list/detail panels, and keyboard shortcuts.

## Data Flow

```
User
 │
 ├── CLI commands ──→ core (read/write DB)
 │
 ├── TUI ──→ core (read DB)
 │
 └── Daemon ──→ core (poll DB → executeRun)
                 │
                 └──→ Claude Code (spawn process)
                       │
                       └──→ JSON output (result, cost, turns)
                             │
                             └──→ core (update run, create inbox item)
```

### Execution Flow

1. **Trigger** — User runs `9to5 run <id>` or daemon detects a due automation
2. **Build args** — `buildClaudeArgs()` constructs the Claude Code CLI command
3. **Spawn** — `Bun.spawn()` executes Claude Code in the automation's `cwd`
4. **Capture** — stdout/stderr are captured as the process runs
5. **Parse** — JSON output is parsed for result, cost, duration, and turn count
6. **Store** — Run record is updated in the database
7. **Notify** — An inbox item is created with a summary

### Claude Code Invocation

```bash
claude \
  -p --permission-mode bypassPermissions \
  --output-format json \
  --model <model> \
  [--session-id <id>] \
  [--max-budget-usd <amount>] \
  [--allowed-tools tool1 tool2 ...] \
  [--append-system-prompt <prompt>] \
  "<automation prompt>"
```

## Runtime

9to5 runs on [Bun](https://bun.sh/), which provides:

- Fast startup and execution
- Built-in SQLite driver (no native addons)
- TypeScript execution without a build step
- Process spawning via `Bun.spawn()`

## Database

SQLite is used as the single data store, shared by the CLI, TUI, and daemon. The database file is at `~/.9to5/db.sqlite` with WAL mode enabled for concurrent read access.

See [Data Model](./data-model) for the full schema.
