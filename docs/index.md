---
layout: home

hero:
  name: "9to5"
  text: "Automate Claude Code"
  tagline: Schedule recurring tasks, track runs, and manage results — all from your terminal
  image:
    src: /images/tui-automations.png
    alt: 9to5 TUI Dashboard
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/
    - theme: alt
      text: GitHub
      link: https://github.com/michaelliv/9to5

features:
  - title: Cron-like Scheduling
    details: Define recurring tasks with RRule syntax — hourly, daily, weekly, or any custom pattern.
  - title: Background Daemon
    details: Set it and forget it. The daemon polls every 30 seconds and triggers runs on schedule.
  - title: Interactive TUI
    details: LazyGit-style dashboard to browse automations, inspect runs, and review results.
  - title: Cost Tracking
    details: Per-run cost, duration, and turn metrics captured automatically from Claude Code output.
  - title: Budget Controls
    details: Set a max spend per automation to keep usage predictable and costs under control.
  - title: Import & Export
    details: Share automation templates as JSON files. Import community recipes in one command.
---

<div style="display: flex; gap: 16px; justify-content: center; max-width: 900px; margin: 0 auto 48px;">
  <img src="/images/tui-automations.png" style="width: 49%; border-radius: 8px; border: 1px solid #333; box-shadow: 0 4px 24px rgba(0,0,0,0.4);" alt="Automations view" />
  <img src="/images/tui-runs.png" style="width: 49%; border-radius: 8px; border: 1px solid #333; box-shadow: 0 4px 24px rgba(0,0,0,0.4);" alt="Runs view" />
</div>
