# Runs View

The Runs tab shows the history of all automation executions.

## List Panel

Each run in the list shows:

- **Automation name** — Which automation was executed
- **Status** — `completed`, `failed`, `running`, or `pending`
- **Timestamp** — When the run started

Navigate with `↑`/`↓` or `j`/`k` keys, or click with the mouse.

## Detail Panel

When you select a run, the detail panel shows:

| Field | Description |
|-------|-------------|
| **Run ID** | Unique run identifier |
| **Automation** | Parent automation name and ID |
| **Status** | Current run status |
| **Started** | Execution start time |
| **Completed** | Execution end time |
| **Duration** | Total execution time |
| **Cost** | API usage cost in USD |
| **Turns** | Number of Claude Code interactions |
| **Result** | The run's output or error message |

## Status Colors

- **Completed** — Successful execution
- **Failed** — Execution encountered an error
- **Running** — Currently executing
- **Pending** — Queued but not yet started

## Tips

- Failed runs show the error message in the detail panel
- The result field shows the first portion of Claude Code's output — use the scrollable view to see more
- Switch to the [Automations view](./automations) with `←` to see automation configurations
