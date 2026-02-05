---
layout: home

hero:
  name: "9to5"
  text: "Automate Claude Code"
  tagline: Schedule recurring tasks, track runs, and manage results — all from your terminal
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

<div style="display: flex; gap: 12px; justify-content: center; margin: 24px 0;">
  <img src="./public/images/tui-automations.png" style="width: 49%; border-radius: 8px; border: 1px solid #333;" alt="Automations view" />
  <img src="./public/images/tui-runs.png" style="width: 49%; border-radius: 8px; border: 1px solid #333;" alt="Runs view" />
</div>

<div class="terminal-preview">
  <div class="terminal-chrome">
    <div class="terminal-dots">
      <span></span><span></span><span></span>
    </div>
    <div class="terminal-title">terminal</div>
  </div>
  <div class="terminal-body">
    <div class="terminal-line">
      <span class="terminal-prompt">$</span>
      <span class="terminal-cmd">9to5 add "daily-review"</span>
      <span class="terminal-flag"> \</span>
    </div>
    <div class="terminal-line terminal-continued">
      <span class="terminal-flag">--prompt</span>
      <span class="terminal-string"> "Review yesterday's commits for issues"</span>
      <span class="terminal-flag"> \</span>
    </div>
    <div class="terminal-line terminal-continued">
      <span class="terminal-flag">--rrule</span>
      <span class="terminal-string"> "FREQ=DAILY;BYHOUR=9"</span>
      <span class="terminal-flag"> \</span>
    </div>
    <div class="terminal-line terminal-continued">
      <span class="terminal-flag">--model</span>
      <span class="terminal-value"> sonnet</span>
    </div>
    <div class="terminal-line terminal-output">
      <span class="terminal-muted">Created automation</span>
      <span class="terminal-id"> a1b2c3</span>
      <span class="terminal-muted"> "daily-review"</span>
    </div>
    <div class="terminal-line" style="margin-top: 12px;">
      <span class="terminal-prompt">$</span>
      <span class="terminal-cmd">9to5 start</span>
    </div>
    <div class="terminal-line terminal-output">
      <span class="terminal-muted">Daemon started (PID 42069)</span>
    </div>
    <div class="terminal-line" style="margin-top: 12px;">
      <span class="terminal-prompt">$</span>
      <span class="terminal-cursor"></span>
    </div>
  </div>
</div>
