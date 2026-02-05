# 9to5 edit

Edit an existing automation. Only the fields you specify are updated.

## Syntax

```bash
9to5 edit <id> [options]
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `id` | Automation ID | Yes |

## Options

| Option | Description |
|--------|-------------|
| `--name <name>` | Rename the automation |
| `--prompt <prompt>` | Update the prompt |
| `--cwd <dir>` | Update working directory |
| `--rrule <rule>` | Update recurrence rule |
| `--model <model>` | Update model (sonnet, opus, haiku) |
| `--max-budget-usd <amount>` | Update max budget in USD |
| `--allowed-tools <tools>` | Update allowed tools (comma-separated) |
| `--system-prompt <prompt>` | Update system prompt |
| `--status <status>` | Set status (active, paused) |

## Examples

Change the model:

```bash
9to5 edit abc123 --model haiku
```

Update the budget:

```bash
9to5 edit abc123 --max-budget-usd 1.00
```

Pause an automation:

```bash
9to5 edit abc123 --status paused
```

Update multiple fields at once:

```bash
9to5 edit abc123 --model opus --max-budget-usd 2.00 --name "Renamed task"
```

## Tips

- Use [`9to5 list`](./list) to find automation IDs.
- Updating `--rrule` also recalculates the next run time.
- Only specified fields are changed — everything else stays the same.
