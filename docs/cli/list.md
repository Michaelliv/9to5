# 9to5 list

List all automations.

## Syntax

```bash
9to5 list
```

## Output

Displays a table of all automations, ordered by creation date (newest first):

```
active  abc123  daily-report  sonnet  Next: 2025-01-15T09:00:00
active  def456  test-runner   sonnet  Next: 2025-01-15T12:00:00
paused  ghi789  code-review   opus    —
```

Each row shows:

| Field | Description |
|-------|-------------|
| Status | `active` or `paused` |
| ID | Unique automation identifier |
| Name | Automation name |
| Model | Claude model |
| Next run | Next scheduled time, or `—` if not scheduled |

## Examples

```bash
9to5 list
```

If no automations exist, you'll see:

```
No automations found
```
