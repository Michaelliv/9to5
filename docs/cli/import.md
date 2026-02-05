# 9to5 import

Import automations from a JSON file.

## Syntax

```bash
9to5 import <file> [options]
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `file` | Path to JSON file | Yes |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--cwd <dir>` | Override working directory for imported automations | Uses value from JSON |

## Input format

Accepts a single automation object or an array of automations:

```json
{
  "name": "my-automation",
  "prompt": "Do something useful",
  "rrule": "FREQ=DAILY",
  "model": "sonnet"
}
```

Or:

```json
[
  { "name": "auto-1", "prompt": "..." },
  { "name": "auto-2", "prompt": "..." }
]
```

## Behavior

- Each imported automation gets a new unique ID
- Default values are applied: `status: "active"`, `model: "sonnet"`
- The `--cwd` option overrides the working directory for all imported automations

## Examples

Import from a file:

```bash
9to5 import recipes/reddit-scout.json
```

Import with a different working directory:

```bash
9to5 import recipes/test-runner.json --cwd /path/to/project
```

## Tips

- Exported automations from [`9to5 export`](./export) can be re-imported directly
- The `--cwd` override is useful when importing recipes designed for a different project
- Check the [Examples](/examples/) section for ready-to-import recipes
