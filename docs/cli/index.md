# CLI Reference

9to5 is a command-line tool for scheduling and automating Claude Code tasks.

```bash
9to5 <command> [options]
```

## Commands

### Automation Management

| Command | Description |
|---------|-------------|
| [`add`](./add) | Create a new automation |
| [`list`](./list) | List all automations |
| [`remove`](./remove) | Remove an automation |
| [`export`](./export) | Export automations as JSON |
| [`import`](./import) | Import automations from JSON |

### Execution & History

| Command | Description |
|---------|-------------|
| [`run`](./run) | Trigger an automation immediately |
| [`runs`](./runs) | View run history |
| [`inbox`](./inbox) | View inbox items |

### Daemon

| Command | Description |
|---------|-------------|
| [`start`](./start) | Start the background daemon |
| [`stop`](./stop) | Stop the background daemon |

### Interface

| Command | Description |
|---------|-------------|
| [`ui`](./ui) | Launch the interactive TUI dashboard |

## Global Options

```bash
9to5 --version    # Show version number
9to5 --help       # Show help
9to5 <cmd> --help # Show help for a specific command
```
