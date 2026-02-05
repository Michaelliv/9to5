# 9to5 runs

View run history.

## Syntax

```bash
9to5 runs [automation-id]
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `automation-id` | Filter runs for a specific automation | No |

## Output

Displays runs ordered by creation date (newest first):

```
completed  run123  abc123  Started: 2025-01-15T09:00:15
failed     run456  abc123  Started: 2025-01-14T09:00:12
running    run789  def456  Started: 2025-01-15T12:00:01
pending    run012  def456  —
```

Each row shows:

| Field | Description |
|-------|-------------|
| Status | `pending`, `running`, `completed`, or `failed` |
| Run ID | Unique run identifier |
| Automation ID | Parent automation |
| Started | Start timestamp, or `—` if pending |

## Examples

View all recent runs (up to 50):

```bash
9to5 runs
```

View runs for a specific automation:

```bash
9to5 runs abc123
```

## Tips

- Without an automation ID, shows the last 50 runs across all automations
- Use the [TUI](./ui) for a more detailed view with full output and metrics
