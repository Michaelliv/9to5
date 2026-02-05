import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '9to5',
  description: 'Schedule and automate Claude Code tasks',
  base: '/9to5/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#111111' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '9to5 — Automate Claude Code' }],
    ['meta', { property: 'og:description', content: 'Schedule recurring tasks, track runs, and manage results — all from your terminal' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap', rel: 'stylesheet' }],
  ],

  themeConfig: {
    search: {
      provider: 'local',
    },

    nav: [
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'CLI Reference', link: '/cli/' },
      { text: 'TUI', link: '/tui/' },
      { text: 'Guides', link: '/guides/scheduling' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Comparisons', link: '/comparisons/' },
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation & Quickstart', link: '/getting-started/' },
            { text: 'Your First Automation', link: '/getting-started/first-automation' },
          ],
        },
      ],
      '/cli/': [
        {
          text: 'CLI Reference',
          items: [
            { text: 'Overview', link: '/cli/' },
            { text: '9to5 add', link: '/cli/add' },
            { text: '9to5 edit', link: '/cli/edit' },
            { text: '9to5 list', link: '/cli/list' },
            { text: '9to5 remove', link: '/cli/remove' },
            { text: '9to5 run', link: '/cli/run' },
            { text: '9to5 runs', link: '/cli/runs' },
            { text: '9to5 inbox', link: '/cli/inbox' },
            { text: '9to5 export', link: '/cli/export' },
            { text: '9to5 import', link: '/cli/import' },
            { text: '9to5 start', link: '/cli/start' },
            { text: '9to5 stop', link: '/cli/stop' },
            { text: '9to5 ui', link: '/cli/ui' },
          ],
        },
      ],
      '/tui/': [
        {
          text: 'TUI Dashboard',
          items: [
            { text: 'Overview', link: '/tui/' },
            { text: 'Automations View', link: '/tui/automations' },
            { text: 'Runs View', link: '/tui/runs' },
          ],
        },
      ],
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Scheduling', link: '/guides/scheduling' },
            { text: 'Budgets & Models', link: '/guides/budgets-models' },
            { text: 'System Prompts', link: '/guides/system-prompts' },
            { text: 'Import & Export', link: '/guides/import-export' },
            { text: 'Background Daemon', link: '/guides/daemon' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Reddit Trend Scout', link: '/examples/reddit-scout' },
            { text: 'Daily Test Runner', link: '/examples/daily-tests' },
            { text: 'Automated Code Review', link: '/examples/code-review' },
            { text: 'Report Generation', link: '/examples/report-gen' },
          ],
        },
      ],
      '/comparisons/': [
        {
          text: 'Comparisons',
          items: [
            { text: 'Overview', link: '/comparisons/' },
            { text: 'vs Claude Code Scheduler', link: '/comparisons/9to5-vs-claude-code-scheduler' },
            { text: 'vs Claude Tasks', link: '/comparisons/9to5-vs-claude-tasks' },
            { text: 'vs MCP Cron', link: '/comparisons/9to5-vs-mcp-cron' },
            { text: 'vs Claude MCP Scheduler', link: '/comparisons/9to5-vs-claude-mcp-scheduler' },
            { text: 'vs ClaudeCron', link: '/comparisons/9to5-vs-claudecron' },
            { text: 'vs Cron MCP Scheduler', link: '/comparisons/9to5-vs-cron-mcp-scheduler' },
            { text: 'vs Agent Runner', link: '/comparisons/9to5-vs-agent-runner' },
            { text: 'vs Scheduler MCP', link: '/comparisons/9to5-vs-scheduler-mcp' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Architecture', link: '/reference/architecture' },
            { text: 'Data Model', link: '/reference/data-model' },
            { text: 'Configuration', link: '/reference/configuration' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/michaelliv/9to5' },
    ],

    footer: {
      message: 'Released under the MIT License.',
    },

    editLink: {
      pattern: 'https://github.com/michaelliv/9to5/edit/main/docs/:path',
    },
  },
})
