# Automations View

The Automations tab shows all configured automations with their details.

## List Panel

Each automation in the list shows:

- **Name** — The automation's display name
- **Status** — `active` or `paused`
- **Model** — The Claude model being used

Navigate with `↑`/`↓` or `j`/`k` keys, or click with the mouse.

## Detail Panel

When you select an automation, the detail panel shows:

| Field | Description |
|-------|-------------|
| **ID** | Unique identifier |
| **Status** | `active` or `paused` |
| **Model** | Claude model (e.g., `sonnet`) |
| **Working Directory** | Where Claude Code runs |
| **Schedule** | RRule pattern, if set |
| **Next Run** | Next scheduled execution time |
| **Last Run** | Most recent execution time |
| **Budget** | Max spend per run, if set |
| **Allowed Tools** | Restricted tool list, if set |
| **System Prompt** | Custom system prompt, if set |
| **Prompt** | The full prompt text |

## Tips

- The detail panel uses a scrollable view — scroll down to see the full prompt text
- Switch to the [Runs view](./runs) with `→` to see execution history
