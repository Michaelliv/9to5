# 9to5 stop

Stop the background daemon.

## Syntax

```bash
9to5 stop
```

## Behavior

1. Checks if the PID file exists at `~/.9to5/daemon.pid`
2. If found, sends a SIGTERM signal to the process
3. Removes the PID file

## Output

```
Daemon stopped
```

If the daemon is not running:

```
Daemon is not running
```

## Examples

```bash
9to5 stop
```

## Tips

- Stopping the daemon does not affect running automations — any in-progress Claude Code execution will complete
- Scheduled automations will not trigger while the daemon is stopped
- Restart with [`9to5 start`](./start) at any time
