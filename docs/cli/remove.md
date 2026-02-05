# 9to5 remove

Remove an automation and all its associated data.

## Syntax

```bash
9to5 remove <id>
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `id` | Automation ID to remove | Yes |

## Behavior

This performs a cascading delete:

1. Removes all inbox items associated with the automation's runs
2. Removes all run records for the automation
3. Removes the automation itself

::: warning
This action is permanent. All run history and inbox items for this automation will be deleted.
:::

## Examples

```bash
9to5 remove abc123
```

```
Removed automation abc123
```

If the automation doesn't exist:

```
Automation abc123 not found
```

## Tips

- Use [`9to5 list`](./list) to find the automation ID
- Consider [`9to5 export`](./export) before removing if you want to keep a backup
