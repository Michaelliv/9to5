# Data Model

9to5 uses SQLite with three tables. The database is at `~/.9to5/db.sqlite`.

## automations

Stores automation configurations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `TEXT` PRIMARY KEY | Unique identifier (nanoid) |
| `name` | `TEXT` NOT NULL | Display name |
| `prompt` | `TEXT` NOT NULL | Prompt sent to Claude Code |
| `status` | `TEXT` NOT NULL | `active` or `paused` (default: `active`) |
| `next_run_at` | `INTEGER` | Unix timestamp of next scheduled run |
| `last_run_at` | `INTEGER` | Unix timestamp of last execution |
| `cwd` | `TEXT` NOT NULL | Working directory for Claude Code |
| `rrule` | `TEXT` | RFC 5545 recurrence rule |
| `model` | `TEXT` | Claude model (default: `sonnet`) |
| `max_budget_usd` | `REAL` | Maximum spend per run in USD |
| `allowed_tools` | `TEXT` | JSON array of allowed tool names |
| `system_prompt` | `TEXT` | System prompt appended to Claude's default |
| `created_at` | `INTEGER` NOT NULL | Creation timestamp |
| `updated_at` | `INTEGER` NOT NULL | Last update timestamp |

## runs

Stores execution records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `TEXT` PRIMARY KEY | Unique identifier (nanoid) |
| `automation_id` | `TEXT` NOT NULL | Foreign key to `automations.id` |
| `status` | `TEXT` NOT NULL | `pending`, `running`, `completed`, or `failed` (default: `pending`) |
| `session_id` | `TEXT` | Claude Code session ID |
| `output` | `TEXT` | Full stdout from Claude Code |
| `error` | `TEXT` | stderr if execution failed |
| `result` | `TEXT` | Parsed result from JSON output |
| `cost_usd` | `REAL` | API usage cost |
| `duration_ms` | `INTEGER` | Execution time in milliseconds |
| `num_turns` | `INTEGER` | Number of Claude Code interaction turns |
| `started_at` | `INTEGER` | Execution start timestamp |
| `completed_at` | `INTEGER` | Execution end timestamp |
| `created_at` | `INTEGER` NOT NULL | Record creation timestamp |

## inbox

Stores notification items created on run completion.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `TEXT` PRIMARY KEY | Unique identifier (nanoid) |
| `title` | `TEXT` | Notification title |
| `summary` | `TEXT` | First 500 characters of run result |
| `run_id` | `TEXT` | Foreign key to `runs.id` |
| `read_at` | `INTEGER` | Timestamp when marked as read |
| `created_at` | `INTEGER` NOT NULL | Creation timestamp |

## Relationships

```
automations 1 ──→ * runs 1 ──→ * inbox
```

- An automation has many runs
- A run has many inbox items
- Deleting an automation cascades: removes runs and their inbox items

## Database Configuration

- **Journal mode**: WAL (Write-Ahead Logging) for concurrent reads
- **Foreign keys**: Enabled
- **Timestamps**: All stored as Unix epoch integers (milliseconds)
- **IDs**: Generated with nanoid
