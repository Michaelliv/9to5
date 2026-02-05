# 9to5 inbox

View inbox items.

## Syntax

```bash
9to5 inbox
```

## Output

Displays up to 50 inbox items, newest first:

```
[unread] inbox123 — daily-report completed
  Found 12 commits across 3 authors...

[read]   inbox456 — test-runner completed
  All 47 tests passing...
```

Each item shows:

| Field | Description |
|-------|-------------|
| Status | `[unread]` or `[read]` |
| ID | Inbox item identifier |
| Title | Notification title (e.g., automation completion) |
| Summary | First 500 characters of the run result |

## Behavior

Inbox items are created automatically when a run completes. Each item contains:

- A title indicating which automation completed
- A summary extracted from the run's result output

## Examples

```bash
9to5 inbox
```

If the inbox is empty:

```
Inbox is empty
```

## Tips

- Inbox items are created automatically on successful run completion
- Use the [TUI](./ui) for an interactive inbox experience
