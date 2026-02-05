# Your First Automation

This guide walks you through creating, running, and monitoring your first 9to5 automation.

## What we'll build

A simple automation that checks your project for TODO comments and reports them. It runs every morning at 9 AM.

## Step 1: Create the automation

```bash
9to5 add "todo-finder" \
  --prompt "Find all TODO and FIXME comments in the codebase. List each one with the file path, line number, and the comment text. Group them by file." \
  --cwd /path/to/your/project \
  --rrule "FREQ=DAILY;BYHOUR=9" \
  --model sonnet \
  --max-budget-usd 0.10
```

You should see output like:

```
Created automation abc123 "todo-finder"
```

## Step 2: Verify it was created

```bash
9to5 list
```

```
active  abc123  todo-finder  sonnet  Next: 2025-01-15T09:00:00
```

## Step 3: Test it with a manual run

Before relying on the daemon, trigger it manually:

```bash
9to5 run abc123
```

Claude Code will execute in your project directory and return results. You'll see the status and a summary of findings.

## Step 4: Check the results

View run details:

```bash
9to5 runs abc123
```

Check your inbox for the summary:

```bash
9to5 inbox
```

## Step 5: Start the daemon

Once you're happy with the results, start the background daemon:

```bash
9to5 start
```

The daemon polls every 30 seconds. When 9 AM arrives, it will automatically trigger your automation.

## Step 6: Monitor with the TUI

Launch the interactive dashboard to see everything at a glance:

```bash
9to5 ui
```

Use arrow keys to navigate between the Automations and Runs tabs. Select any run to see its full output and metrics.

## Next steps

- Add a [budget limit](/guides/budgets-models) to control costs
- Set up a [system prompt](/guides/system-prompts) to customize Claude's behavior
- Try a more complex recipe from the [Examples](/examples/) section
- Learn about [scheduling patterns](/guides/scheduling) for advanced recurrence rules
