# TUI Dashboard

The 9to5 TUI is a full-screen terminal interface for managing automations and monitoring runs. Launch it with:

```bash
9to5 ui
```

## Layout

The TUI uses a LazyGit-style layout:

```
┌─────────────────────────────────────────────────┐
│  Automations │ Runs                             │
├──────────────┼──────────────────────────────────┤
│              │                                  │
│  List panel  │  Detail panel                    │
│  (35%)       │  (65%)                           │
│              │                                  │
│              │                                  │
├─────────────────────────────────────────────────┤
│  Status bar                                     │
└─────────────────────────────────────────────────┘
```

- **Tab bar** — Top row shows available views
- **List panel** — Left side shows items for the active tab
- **Detail panel** — Right side shows details for the selected item
- **Status bar** — Bottom row shows keyboard hints

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Switch between tabs |
| `↑` `↓` or `j` `k` | Navigate list items |
| `q` | Quit the TUI |

## Mouse Support

- Click on tab names to switch views
- Click on list items to select them

## Views

- [Automations View](./automations) — Browse and inspect automations
- [Runs View](./runs) — Browse run history with output and metrics
