# 9to5 start

Start the background daemon.

## Syntax

```bash
9to5 start
```

## Behavior

1. Checks if a daemon is already running by reading the PID file
2. If running, displays the existing daemon's PID and exits
3. If not running, spawns a new background process
4. Saves the process PID to `~/.9to5/daemon.pid`

The daemon runs in the background and polls every 30 seconds for automations that are due to run. When an automation's `next_run_at` time has passed, the daemon triggers it automatically.

## Output

```
Daemon started (PID 12345)
```

If already running:

```
Daemon already running (PID 12345)
```

## Examples

```bash
9to5 start
```

## Tips

- The daemon runs until explicitly stopped with [`9to5 stop`](./stop) or the system shuts down
- Check if the daemon is running by looking for the PID file at `~/.9to5/daemon.pid`
- See the [Background Daemon guide](/guides/daemon) for details on how the daemon works
