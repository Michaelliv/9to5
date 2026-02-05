# 9to5 add

Create a new automation.

## Syntax

```bash
9to5 add <name> --prompt <prompt> [options]
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `name` | Name for the automation | Yes |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--prompt <prompt>` | Prompt to send to Claude | Required |
| `--cwd <dir>` | Working directory for execution | Current directory |
| `--rrule <rule>` | RFC 5545 recurrence rule | None (manual only) |
| `--model <model>` | Claude model to use | `sonnet` |
| `--max-budget-usd <amount>` | Maximum spend per run in USD | None |
| `--allowed-tools <tools>` | Comma-separated list of allowed tools | All tools |
| `--system-prompt <prompt>` | System prompt appended to Claude's default | None |

## Examples

Create a simple automation:

```bash
9to5 add "code-review" --prompt "Review open PRs and leave comments"
```

With scheduling (runs daily at 9 AM):

```bash
9to5 add "daily-report" \
  --prompt "Generate a summary of yesterday's git commits" \
  --rrule "FREQ=DAILY;BYHOUR=9"
```

With budget and model:

```bash
9to5 add "test-runner" \
  --prompt "Run the test suite and report failures" \
  --model sonnet \
  --max-budget-usd 0.25
```

With a custom working directory:

```bash
9to5 add "lint-check" \
  --prompt "Run linting and fix any issues" \
  --cwd /path/to/project
```

With restricted tools:

```bash
9to5 add "read-only-audit" \
  --prompt "Audit the codebase for security issues" \
  --allowed-tools "Read,Glob,Grep"
```

With a system prompt:

```bash
9to5 add "blog-scout" \
  --prompt "Find trending topics and draft a blog post" \
  --system-prompt "You are a content scout. Be direct, no fluff."
```

## Tips

- The `--rrule` option uses [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545) recurrence rule syntax. See the [Scheduling guide](/guides/scheduling) for common patterns.
- Without `--rrule`, the automation can only be triggered manually with [`9to5 run`](./run).
- The `--cwd` directory is where Claude Code will execute. It determines which files are accessible.
- Budget limits are per-run. See [Budgets & Models](/guides/budgets-models) for details.
