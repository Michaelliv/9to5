# 9to5 run

Trigger an automation immediately.

## Syntax

```bash
9to5 run <id>
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `id` | Automation ID to execute | Yes |

## Behavior

1. Looks up the automation by ID
2. Creates a new run record with a unique session ID
3. Spawns Claude Code with the automation's prompt, model, and options
4. Waits for completion and captures the output
5. Stores results (output, cost, duration, turns) in the database
6. Creates an inbox notification with a summary

## Output

On success:

```
Run xyz789 completed
Summary: Found 3 TODO comments across 2 files...
```

On failure:

```
Run xyz789 failed
Error: ...
```

## Examples

Run an automation:

```bash
9to5 run abc123
```

## Tips

- This is useful for testing an automation before setting up a schedule
- Each run generates a unique session ID for Claude Code session continuity
- The run's cost, duration, and number of turns are captured automatically
- Check results with [`9to5 runs`](./runs) or [`9to5 inbox`](./inbox)
