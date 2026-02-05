# Scheduling

9to5 uses [RRule](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10) (RFC 5545 Recurrence Rules) to define when automations run. The `--rrule` option accepts a recurrence rule string.

## Common Patterns

### Time-based

| Pattern | RRule |
|---------|-------|
| Every hour | `FREQ=HOURLY` |
| Every 4 hours | `FREQ=HOURLY;INTERVAL=4` |
| Daily at 9 AM | `FREQ=DAILY;BYHOUR=9` |
| Daily at 9 AM and 5 PM | `FREQ=DAILY;BYHOUR=9,17` |
| Every 12 hours | `FREQ=HOURLY;INTERVAL=12` |

### Day-based

| Pattern | RRule |
|---------|-------|
| Every weekday | `FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR` |
| Every Monday | `FREQ=WEEKLY;BYDAY=MO` |
| Mon, Wed, Fri | `FREQ=WEEKLY;BYDAY=MO,WE,FR` |
| Every 2 weeks | `FREQ=WEEKLY;INTERVAL=2` |
| First day of month | `FREQ=MONTHLY;BYMONTHDAY=1` |

## RRule Syntax

An RRule is a semicolon-separated list of key-value pairs:

```
FREQ=DAILY;INTERVAL=1;BYHOUR=9;BYDAY=MO,TU,WE,TH,FR
```

### Required

| Key | Values | Description |
|-----|--------|-------------|
| `FREQ` | `HOURLY`, `DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY` | Base frequency |

### Optional

| Key | Values | Description |
|-----|--------|-------------|
| `INTERVAL` | Integer | Run every N intervals (default: 1) |
| `BYHOUR` | 0-23 | Specific hour(s) |
| `BYDAY` | `MO`,`TU`,`WE`,`TH`,`FR`,`SA`,`SU` | Specific day(s) |
| `BYMONTHDAY` | 1-31 | Specific day(s) of month |
| `BYMONTH` | 1-12 | Specific month(s) |
| `COUNT` | Integer | Stop after N occurrences |

## Examples

Create an automation that runs every weekday morning:

```bash
9to5 add "standup-prep" \
  --prompt "Summarize my git activity from the last 24 hours" \
  --rrule "FREQ=DAILY;BYHOUR=9;BYDAY=MO,TU,WE,TH,FR"
```

Run every 4 hours during business hours:

```bash
9to5 add "health-check" \
  --prompt "Run the test suite and check for regressions" \
  --rrule "FREQ=HOURLY;INTERVAL=4;BYHOUR=8,12,16,20"
```

## How Scheduling Works

1. When you create an automation with `--rrule`, 9to5 calculates the next occurrence and stores it as `next_run_at`
2. The [daemon](/guides/daemon) polls every 30 seconds
3. When `next_run_at` is in the past, the daemon triggers the run
4. After execution, the next occurrence is recalculated

## No Schedule

Automations without an `--rrule` can only be triggered manually:

```bash
9to5 run <id>
```
