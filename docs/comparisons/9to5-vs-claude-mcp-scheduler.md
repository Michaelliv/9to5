---
title: 9to5 vs Claude MCP Scheduler
---

# 9to5 vs Claude MCP Scheduler

Claude MCP Scheduler (tonybentley/claude-mcp-scheduler) is a Node.js application that schedules Claude prompts at specific intervals while connecting to local MCP servers for tool access. It's designed for headless servers and VMs, saving prompt results to configured file paths. Unlike 9to5's interactive TUI and CLI, this tool operates entirely through JSON configuration files.

## Feature Comparison

| Feature | 9to5 | Claude MCP Scheduler |
|---------|------|----------------------|
| Scheduling | rrule (RFC 5545) | Cron expressions |
| Budget Controls | Per-automation USD caps | No budget controls |
| System Prompts | Per-automation custom personas | Single prompt per schedule |
| Model Selection | Per-automation (sonnet/opus/haiku) | Single model in config |
| Run Output | Structured JSON (cost, duration, turns) | Timestamped text files |
| Results Inbox | Read/unread tracking | No inbox (file-based output) |
| Interface | Interactive TUI + CLI | Headless (JSON config only) |
| Export/Import | JSON automation sharing | Manual JSON editing |
| Storage | SQLite with full history | Filesystem output only |
| Allowed Tools | Per-automation whitelist | MCP servers configured globally |

## Where 9to5 Wins

- **Interactive management**: The TUI and CLI (`9to5 add`, `9to5 list`, `9to5 run`) make it easy to create, edit, and manage automations without touching config files. Claude MCP Scheduler requires manual JSON editing for every change.
- **Cost controls**: Per-automation budget caps prevent runaway costs. Claude MCP Scheduler has no budget enforcement—a misconfigured prompt could drain your API quota.
- **Structured output and inbox**: Run results are parsed into structured JSON (cost, duration, success/failure, output) and displayed in an inbox with read/unread state. Claude MCP Scheduler writes raw text to files with no metadata or status tracking.
- **Run history and visibility**: SQLite storage preserves full run history with searchable output. You can review past runs, track patterns, and debug failures. Claude MCP Scheduler overwrites files on each run (or requires manual path templates).
- **Per-automation configuration**: Different automations can use different models, prompts, working directories, and tool whitelists. Claude MCP Scheduler uses a single global model and MCP server configuration.

## Where Claude MCP Scheduler Wins

- **Simplicity for static workloads**: If you have a fixed set of prompts that never change and don't need cost controls or interactive management, JSON config files can be simpler than CLI commands.
- **Test utility**: Includes `npm run test-prompt` for validating prompts before scheduling.

## Bottom Line

Choose 9to5 if you want an interactive, developer-focused tool with cost controls, structured output, and full visibility into your scheduled Claude Code tasks. The TUI and CLI make it easy to manage automations, and the inbox system keeps you informed of successes and failures.

Choose Claude MCP Scheduler if you prefer a headless, config-file-driven approach and don't need budget enforcement, structured output, or interactive management.
