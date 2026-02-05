---
title: 9to5 vs Claude Agent Framework (agent-runner)
---

# 9to5 vs Claude Agent Framework (agent-runner)

Claude Agent Framework (BurtTheCoder/agent-runner) is a Python framework for running Claude agents in automated workflows. It supports one-off runs, continuous services, scheduled cron jobs, and webhook-triggered automation. Unlike 9to5's focus on scheduling Claude Code sessions, agent-runner is a full-featured framework for building custom Claude agent applications with AWS Bedrock support, cost tracking, Slack notifications, and an interactive TUI for configuration management.

## Feature Comparison

| Feature | 9to5 | Claude Agent Framework |
|---------|------|------------------------|
| Scheduling | rrule (RFC 5545) | Cron expressions |
| Budget Controls | Per-automation USD caps | Global budget cap (CAF_AGENT__MAX_BUDGET_USD) |
| System Prompts | Per-automation custom personas | YAML-based agent prompts with variable substitution |
| Model Selection | Per-automation (sonnet/opus/haiku) | Anthropic + AWS Bedrock models |
| Run Output | Structured JSON (cost, duration, turns) | JSONL traces + cost tracking |
| Results Inbox | Read/unread tracking | Slack webhook notifications |
| Interface | Interactive TUI + CLI | Python API + config TUI + CLI |
| Export/Import | JSON automation sharing | YAML config files |
| Storage | SQLite with full history | JSONL trace files + log directory |
| Allowed Tools | Per-automation whitelist | MCP server integration + sub-agents |

## Where 9to5 Wins

- **Simplicity for Claude Code workflows**: 9to5 is purpose-built for scheduling Claude Code tasks—one command to create an automation, one TUI to monitor runs. agent-runner is a general-purpose framework requiring Python code, YAML configs, and environment variable management.
- **rrule scheduling**: RFC 5545 recurrence rules offer more expressive scheduling than cron (e.g., "last Friday of the month", "every 3 months on the 15th").
- **Inbox system**: Built-in inbox with read/unread state for run results. agent-runner relies on Slack webhooks or manual log review for notifications.
- **Standalone TUI**: Full-featured interactive interface for managing automations, viewing run history, and reading output. agent-runner's TUI is for configuration management only, not runtime monitoring.

## Where Claude Agent Framework Wins

- **Flexibility**: Python framework with programmatic API for custom agent behaviors, sub-agents, and complex workflows. 9to5 focuses on scheduling existing Claude Code tasks—agent-runner lets you build custom agent applications.
- **AWS Bedrock support**: Native integration with AWS Bedrock for Claude model access via IAM, useful for enterprise environments that require AWS-based deployments.
- **Webhook triggers**: Inbound webhook mode with conditional routing by field values (assignee, priority, state). 9to5 is time-based only.
- **Service mode**: Run agents as long-running services with fixed intervals, not just scheduled cron jobs.
- **Slack notifications**: Built-in Slack webhook integration with token usage and duration metrics. 9to5 doesn't include notification integrations.
- **Structured tracing**: JSONL execution traces capture full agent context, tool calls, and results for debugging and analysis.

## Bottom Line

Choose 9to5 if you want a simple, focused tool for scheduling Claude Code tasks with cost controls, an interactive TUI, and an inbox for run results. Perfect for developers who need "cron for Claude Code" without writing Python code or managing YAML configs.

Choose Claude Agent Framework if you need a full-featured Python framework for building custom Claude agent applications with AWS Bedrock support, webhook triggers, service mode, Slack notifications, and complex sub-agent workflows. agent-runner is a platform for building agent applications; 9to5 is a tool for scheduling Claude Code sessions.
