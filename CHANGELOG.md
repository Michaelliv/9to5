# Changelog

## 0.5.0

**Breaking:** CLI commands reorganized into subcommand groups for better discoverability.

### New structure

| Before | After |
|--------|-------|
| `9to5 add` | `9to5 agent add` |
| `9to5 edit` | `9to5 agent edit` |
| `9to5 list` | `9to5 agent list` |
| `9to5 run` | `9to5 agent run` |
| `9to5 remove` | `9to5 agent remove` |
| `9to5 restore` | `9to5 agent restore` |
| `9to5 hide` | `9to5 agent hide` |
| `9to5 unhide` | `9to5 agent unhide` |
| `9to5 export` | `9to5 agent export` |
| `9to5 import` | `9to5 agent import` |
| `9to5 start` | `9to5 daemon start` |
| `9to5 stop` | `9to5 daemon stop` |

Unchanged: `runs`, `inbox`, `resume`, `webhook`, `ui`, `onboard`.
