# 9to5 ui

Launch the interactive TUI dashboard.

## Syntax

```bash
9to5 ui
```

## Behavior

Opens a full-screen terminal UI built with OpenTUI React. The TUI provides a LazyGit-style interface for browsing automations, viewing runs, and inspecting results.

The TUI runs as a subprocess and takes over the terminal. Press `q` to exit and return to the shell.

## Features

- **Tab navigation** — Switch between Automations and Runs views
- **Dual-panel layout** — List on the left, detail on the right
- **Keyboard and mouse** — Full keyboard navigation plus mouse click support
- **Live data** — Reads directly from the SQLite database

## Examples

```bash
9to5 ui
```

## Tips

- See the [TUI guide](/tui/) for detailed navigation instructions and keyboard shortcuts
- The TUI reads from the same database as the CLI, so all data is always in sync
