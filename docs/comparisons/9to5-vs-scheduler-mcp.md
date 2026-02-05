---
title: 9to5 vs MCP Scheduler
---

# 9to5 vs MCP Scheduler

MCP Scheduler (PhialsBasement/scheduler-mcp) is a Python-based MCP server designed for Claude Desktop and other MCP-enabled clients. It schedules shell commands, API calls, AI content generation, and desktop notifications using standard cron expressions. Unlike 9to5, which focuses on automating Claude Code sessions, MCP Scheduler operates as a general-purpose task automation server that integrates with Claude Desktop.

## Feature Comparison

| Feature | 9to5 | MCP Scheduler |
|---------|------|---------------|
| Scheduling | rrule (RFC 5545) | Cron expressions |
| Budget Controls | Per-automation USD caps | No budget controls |
| System Prompts | Per-automation custom personas | AI tasks use OpenAI API (not Claude) |
| Model Selection | Per-automation (sonnet/opus/haiku) | OpenAI models only |
| Run Output | Structured JSON (cost, duration, turns) | SQLite execution history (success/failure) |
| Results Inbox | Read/unread tracking | No inbox system |
| Interface | Interactive TUI + CLI | MCP tools only (no standalone UI) |
| Export/Import | JSON automation sharing | No export/import |
| Storage | SQLite with full history | SQLite task execution log |
| Allowed Tools | Per-automation whitelist | Shell/API/AI/notifications (fixed types) |

## Where 9to5 Wins

- **Claude Code integration**: 9to5 automates full Claude Code sessions with access to all tools, MCP servers, and the Agent SDK. MCP Scheduler is limited to shell commands, API calls, and OpenAI-powered AI tasks—it doesn't run Claude Code at all.
- **Cost visibility and control**: Per-automation budget caps and structured cost tracking (dollars, tokens, turns) give you precise control over Claude spending. MCP Scheduler has no budget enforcement or cost tracking.
- **Developer-focused UI**: The interactive TUI with list + detail panels, inbox system with read/unread state, and full run history makes it easy to monitor and debug automations. MCP Scheduler requires Claude Desktop for interaction—no standalone interface.
- **rrule scheduling**: RFC 5545 recurrence rules offer more expressive scheduling than cron (e.g., "last Friday of the month", "every 3 months on the 15th").

## Where MCP Scheduler Wins

- **Desktop notifications**: MCP Scheduler can trigger native OS notifications with sound, useful for reminders or alerts. 9to5 focuses on development workflows and doesn't include notification features.
- **Multi-AI provider**: Supports OpenAI for AI tasks (though this means you can't use Claude models for automation).

## Bottom Line

Choose 9to5 if you're automating Claude Code tasks—code reviews, refactoring, test generation, dependency audits, or any workflow that needs Claude's coding expertise. 9to5 gives you cost controls, a developer-focused interface, and the full power of Claude Code on a schedule.

Choose MCP Scheduler if you need general-purpose task automation (shell scripts, API calls, notifications) within Claude Desktop and don't require Claude Code-specific features.
