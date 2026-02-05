# Report Generation

Generate a weekly project summary with commit activity, contributor stats, and highlights.

## CLI Command

```bash
9to5 add "weekly-report" \
  --prompt "Generate a weekly project report:

1. Run git log --since='7 days ago' --pretty=format:'%h %an %s' to get the week's commits
2. Run git shortlog -sn --since='7 days ago' for contributor stats
3. Run git diff --stat HEAD~$(git rev-list --count --since='7 days ago' HEAD)..HEAD for file change summary
4. Compile a report with:
   - Total commits this week
   - Contributors and their commit counts
   - Key changes grouped by area (features, fixes, refactoring, docs)
   - Files with the most changes
   - Notable highlights or concerns

Format the report as clean markdown." \
  --cwd /path/to/project \
  --rrule "FREQ=WEEKLY;BYDAY=MO;BYHOUR=9" \
  --model sonnet \
  --max-budget-usd 0.20 \
  --allowed-tools "Bash,Read,Glob,Grep" \
  --system-prompt "You are a technical project manager writing a weekly status update. Be concise and factual. Highlight what matters — don't pad the report."
```

## JSON

```json
{
  "name": "weekly-report",
  "prompt": "Generate a weekly project report:\n\n1. Run git log --since='7 days ago' --pretty=format:'%h %an %s' to get the week's commits\n2. Run git shortlog -sn --since='7 days ago' for contributor stats\n3. Run git diff --stat HEAD~$(git rev-list --count --since='7 days ago' HEAD)..HEAD for file change summary\n4. Compile a report with:\n   - Total commits this week\n   - Contributors and their commit counts\n   - Key changes grouped by area (features, fixes, refactoring, docs)\n   - Files with the most changes\n   - Notable highlights or concerns\n\nFormat the report as clean markdown.",
  "status": "active",
  "cwd": "/path/to/project",
  "rrule": "FREQ=WEEKLY;BYDAY=MO;BYHOUR=9",
  "model": "sonnet",
  "max_budget_usd": 0.20,
  "allowed_tools": "Bash,Read,Glob,Grep",
  "system_prompt": "You are a technical project manager writing a weekly status update. Be concise and factual. Highlight what matters — don't pad the report."
}
```

## How it works

1. Gathers git activity for the past 7 days
2. Compiles contributor statistics
3. Analyzes file change patterns
4. Groups changes by category (features, fixes, etc.)
5. Produces a markdown report

## Customization

- Change `BYDAY` to generate on a different day
- Use `--since='14 days ago'` for bi-weekly reports
- Add additional git commands to analyze branches, PRs, or tags
- Modify the system prompt to match your team's reporting style
