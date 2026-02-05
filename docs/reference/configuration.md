# Configuration

9to5 stores all data in the `~/.9to5/` directory.

## Directory Structure

```
~/.9to5/
├── db.sqlite         # SQLite database (automations, runs, inbox)
├── db.sqlite-wal     # WAL file (auto-managed)
├── db.sqlite-shm     # Shared memory file (auto-managed)
└── daemon.pid        # Daemon process ID (when running)
```

## Files

### `db.sqlite`

The SQLite database containing all automations, run history, and inbox items. Created automatically on first use.

- Shared by the CLI, TUI, and daemon
- Uses WAL mode for concurrent access
- See [Data Model](./data-model) for the full schema

### `daemon.pid`

Contains the PID of the running daemon process. Created by `9to5 start`, removed by `9to5 stop`.

If this file exists but the process is no longer running, you can safely delete it:

```bash
rm ~/.9to5/daemon.pid
```

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| Data directory | `~/.9to5/` | Root directory for all 9to5 data |
| Database path | `~/.9to5/db.sqlite` | SQLite database file |
| PID file | `~/.9to5/daemon.pid` | Daemon process ID file |
| Poll interval | 30 seconds | How often the daemon checks for due automations |

## Defaults

| Setting | Default |
|---------|---------|
| Model | `sonnet` |
| Status | `active` |
| Budget | Unlimited |
| Allowed tools | All tools |
| System prompt | None (uses Claude Code's default) |
| Working directory | Current directory at time of `9to5 add` |

## Environment

9to5 requires:

- **Bun** runtime (v1.0+)
- **Claude Code** CLI installed and authenticated
- The `claude` command must be available in `PATH` for the runner to work
