# 9to5 export

Export automations as JSON.

## Syntax

```bash
9to5 export [id]
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `id` | Export a specific automation | No |

## Output

Outputs formatted JSON to stdout. Pipe to a file to save:

```bash
9to5 export > automations.json
9to5 export abc123 > my-automation.json
```

## Examples

Export all automations:

```bash
9to5 export
```

```json
[
  {
    "name": "daily-report",
    "prompt": "Summarize yesterday's git commits",
    "status": "active",
    "rrule": "FREQ=DAILY;BYHOUR=9",
    "model": "sonnet",
    "max_budget_usd": 0.25,
    ...
  }
]
```

Export a single automation:

```bash
9to5 export abc123
```

## Tips

- Exported JSON can be imported with [`9to5 import`](./import)
- Use this to back up automations before removing them
- Share automation recipes with your team by committing exported JSON to a repo
- See the [Import & Export guide](/guides/import-export) for more details
