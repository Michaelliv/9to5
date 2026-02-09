# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is 9to5

Automated agents for Claude Code. A CLI + TUI that lets users create agents (scheduled or webhook-triggered), which a background daemon executes via `claude -p`. Results land in an inbox.

## Commands

```bash
bun install                  # Install dependencies
bun run dev -- <subcommand>  # Run CLI in dev (e.g. bun run dev -- list)
bun run build                # Compile single binary
bun run check                # Lint + format (Biome)
bun test                     # Run tests
bun run packages/tui/src/index.tsx  # Run TUI directly
```

## Architecture

Bun monorepo with three workspace packages:

- **`@9to5/core`** (`packages/core/`) — Shared logic: SQLite database (bun:sqlite), types, config, run execution. The `executeRun` function in `runner.ts` spawns `claude -p` with args built by `claude.ts`. Data lives in `~/.9to5/db.sqlite`.
- **`@9to5/cli`** (`packages/cli/`) — Commander.js CLI. Each command is a `register*` function in `commands/` that takes a `Command` and adds a subcommand. Registered in `index.ts`. The daemon (`daemon/index.ts`) polls every 30s for due agents.
- **`@9to5/tui`** (`packages/tui/`) — React-based terminal UI using `@opentui/react`. Two-column layout: left panel is a list (agents or runs), right panel is a detail view. Hooks in `hooks/`, components in `components/`.

### Data flow

`add` command → row in `automations` table → daemon checks `next_run_at` (or webhook fires) → `executeRun` spawns `claude -p --output-format json` → parses JSON response → updates `runs` table + inserts into `inbox`.

### Soft-delete

`remove` sets `deleted_at` on the agent row rather than deleting it. All queries filter `WHERE deleted_at IS NULL`. `restore` clears `deleted_at` and sets status to `paused`. The unique name index only enforces uniqueness for non-deleted rows. Use `remove --force` for permanent hard-delete.

### Daemon management

The daemon auto-starts when the TUI launches and self-heals if it crashes (checked every 3s). CLI `start`/`stop` commands remain available. Stale runs (orphaned processes) are detected via PID tracking — the `tick()` loop checks if a run's spawned process is still alive using `process.kill(pid, 0)` and marks dead runs as failed. The daemon polls for due agents every 30s and also listens for webhook triggers.

### Webhook triggers

Webhooks are enabled by default — the daemon auto-generates an HMAC secret on first start if `~/.9to5/webhook.secret` doesn't exist and webhooks haven't been explicitly disabled (`~/.9to5/webhook.disabled` marker file). CLI commands: `webhook info`, `webhook refresh`, `webhook enable`, `webhook disable`, `webhook url <id>`.

When the daemon starts with a secret, it spins up two listeners alongside the cron poll loop:

- **Local HTTP** (`daemon/webhook-server.ts`) — `Bun.serve()` on `localhost:9505`. Receives `POST /trigger/:id` with `X-Signature` header.
- **Remote SSE** (`daemon/ntfy-listener.ts`) — Connects to `ntfy.sh/9to5-{topic}/sse` (topic derived from secret). Signature is embedded in the message body since ntfy doesn't forward headers to SSE subscribers.

Both verify HMAC-SHA256 signatures, validate timestamps (5-min window), and call the same `runAutomation()` function the cron poller uses. Webhook config is file-based (`~/.9to5/webhook.secret`, `~/.9to5/webhook.port`, `~/.9to5/webhook.disabled`), not in the database. Core utilities live in `packages/core/src/webhook.ts`.

### Adding a CLI command

1. Create `packages/cli/src/commands/<name>.ts` exporting `registerX(program: Command)`
2. Import and call `registerX(program)` in `packages/cli/src/index.ts`

## Conventions

- Biome for linting/formatting. Tab indentation.
- Imports use `.ts`/`.tsx` extensions (Bun convention, tsc will warn but that's expected).
- All timestamps are epoch milliseconds (`Date.now()`).
- Model defaults to `"sonnet"` (Claude Code alias).
- Releases: bump version in root `package.json`, commit, push tag `v*` — GitHub Actions builds binaries + publishes to npm.

## Docs site

Landing page in `packages/landing/`. Examples in `examples/` each have a CLI command + importable JSON block.
