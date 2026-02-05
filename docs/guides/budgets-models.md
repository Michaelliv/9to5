# Budgets & Models

## Model Selection

9to5 supports any Claude model available through Claude Code. Set the model when creating an automation:

```bash
9to5 add "my-task" --prompt "..." --model sonnet
```

Common model choices:

| Model | Best for |
|-------|----------|
| `sonnet` | General tasks, good balance of speed and quality (default) |
| `opus` | Complex reasoning, detailed analysis, code review |
| `haiku` | Fast, simple tasks, lightweight checks |

The default model is `sonnet` if not specified.

## Budget Limits

Set a maximum spend per run with `--max-budget-usd`:

```bash
9to5 add "expensive-task" \
  --prompt "Deep code audit of the entire codebase" \
  --max-budget-usd 1.00
```

### How it works

- The budget limit is passed to Claude Code's `--max-budget-usd` flag
- Claude Code will stop execution if the budget is exceeded during a run
- Each run tracks its actual cost in the `cost_usd` field

### Choosing a budget

| Task type | Suggested budget |
|-----------|-----------------|
| Quick checks, linting | $0.05 – $0.10 |
| Code summaries, reports | $0.10 – $0.25 |
| Code review, refactoring | $0.25 – $0.50 |
| Complex multi-step tasks | $0.50 – $2.00 |

::: tip
Start with a low budget and increase as needed. Use [`9to5 run`](/cli/run) to test manually and check the actual cost before setting up a schedule.
:::

## Cost Tracking

Every run automatically captures:

| Metric | Description |
|--------|-------------|
| `cost_usd` | Total API cost for the run |
| `duration_ms` | Execution time in milliseconds |
| `num_turns` | Number of Claude Code interaction turns |

View these metrics in the [TUI](/tui/runs) or by inspecting run records.

## Allowed Tools

Restrict which tools Claude Code can use:

```bash
9to5 add "read-only-check" \
  --prompt "Audit the codebase for issues" \
  --allowed-tools "Read,Glob,Grep"
```

This is useful for:

- **Read-only automations** — Prevent any file modifications
- **Restricted access** — Limit Claude to specific tools
- **Safety** — Ensure automations can't perform unintended actions
