# Background Daemon

The 9to5 daemon is a background process that automatically triggers scheduled automations.

## Starting the Daemon

```bash
9to5 start
```

The daemon starts as a detached background process. Its PID is saved to `~/.9to5/daemon.pid`.

## Stopping the Daemon

```bash
9to5 stop
```

Sends SIGTERM to the daemon process and removes the PID file.

## How It Works

1. The daemon polls the database every **30 seconds**
2. It checks all active automations for a `next_run_at` time that has passed
3. When an automation is due, it triggers a run (identical to [`9to5 run`](/cli/run))
4. After the run completes, it recalculates the next occurrence from the RRule
5. Results are stored in the database and an inbox notification is created

```
┌──────────────────────────────────────────────────┐
│                    Daemon Loop                   │
│                                                  │
│  Poll (30s) → Check automations → Due?           │
│                                    │             │
│                              No ←──┘             │
│                              Yes → Execute run   │
│                                    │             │
│                                    ↓             │
│                              Update next_run_at  │
│                              Create inbox item   │
│                                    │             │
│                              ← Back to poll      │
└──────────────────────────────────────────────────┘
```

## Process Management

| File | Location | Purpose |
|------|----------|---------|
| PID file | `~/.9to5/daemon.pid` | Tracks the daemon process ID |
| Database | `~/.9to5/db.sqlite` | Shared with CLI and TUI |

The daemon:
- Runs as a detached child process (survives terminal close)
- Writes its PID to disk for tracking
- Uses the same database as the CLI and TUI
- Only one instance runs at a time (checked via PID)

## Troubleshooting

### Daemon won't start

Check if a stale PID file exists:

```bash
cat ~/.9to5/daemon.pid
```

If the process doesn't exist, remove the file and try again:

```bash
rm ~/.9to5/daemon.pid
9to5 start
```

### Automations aren't running

1. Verify the daemon is running: `cat ~/.9to5/daemon.pid` and check the process
2. Check the automation status is `active` with `9to5 list`
3. Verify the automation has an `rrule` set
4. Check that `next_run_at` is in the past

### Checking daemon status

```bash
# Check if PID file exists
ls ~/.9to5/daemon.pid

# Verify process is running
kill -0 $(cat ~/.9to5/daemon.pid) 2>/dev/null && echo "Running" || echo "Not running"
```
