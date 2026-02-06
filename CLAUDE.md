# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is 9to5

Cron for Claude Code. A CLI + TUI that lets users create automations (scheduled prompts), which a background daemon executes via `claude -p` at specified times. Results land in an inbox.

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
- **`@9to5/cli`** (`packages/cli/`) — Commander.js CLI. Each command is a `register*` function in `commands/` that takes a `Command` and adds a subcommand. Registered in `index.ts`. The daemon (`daemon/index.ts`) polls every 30s for due automations.
- **`@9to5/tui`** (`packages/tui/`) — React-based terminal UI using `@opentui/react`. Two-column layout: left panel is a list (automations or runs), right panel is a detail view. Hooks in `hooks/`, components in `components/`.

### Data flow

`add` command → row in `automations` table → daemon checks `next_run_at` → `executeRun` spawns `claude -p --output-format json` → parses JSON response → updates `runs` table + inserts into `inbox`.

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

VitePress site in `docs/`. Run `bun run docs:dev` to preview. Examples in `docs/examples/` each have a CLI command + importable JSON block.
