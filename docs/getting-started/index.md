# Installation & Quickstart

## Prerequisites

- [Bun](https://bun.sh/) runtime (v1.0+)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed and authenticated

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/michaelliv/9to5.git
cd 9to5
bun install
```

Link the CLI globally so you can use `9to5` from anywhere:

```bash
bun link
```

## Quickstart

### 1. Create an automation

```bash
9to5 add "daily-summary" \
  --prompt "Summarize the git log from the last 24 hours" \
  --rrule "FREQ=DAILY;BYHOUR=9" \
  --model sonnet
```

### 2. Start the daemon

```bash
9to5 start
```

The daemon polls every 30 seconds and triggers automations when their scheduled time arrives.

### 3. Check results

View run history:

```bash
9to5 runs
```

Or launch the interactive TUI:

```bash
9to5 ui
```

## What's next?

- Follow the [Your First Automation](/getting-started/first-automation) guide for a step-by-step walkthrough
- Browse the [CLI Reference](/cli/) for all available commands
- Check out [Examples](/examples/) for real-world automation recipes
