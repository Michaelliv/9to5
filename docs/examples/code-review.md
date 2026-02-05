# Automated Code Review

Review recent commits for potential issues, code smells, and improvement opportunities.

## CLI Command

```bash
9to5 add "code-review" \
  --prompt "Review the git commits from the last 24 hours:

1. Run git log --oneline --since='24 hours ago' to find recent commits
2. For each commit, review the diff with git show <hash>
3. Look for:
   - Bugs or logic errors
   - Security vulnerabilities (injection, auth issues, exposed secrets)
   - Performance concerns
   - Missing error handling
   - Code style inconsistencies
4. Provide a summary with:
   - Number of commits reviewed
   - Issues found (categorized by severity: critical, warning, info)
   - Specific file and line references for each issue
   - Suggested fixes where applicable

If no issues are found, confirm the review was clean." \
  --cwd /path/to/project \
  --rrule "FREQ=DAILY;BYHOUR=10;BYDAY=MO,TU,WE,TH,FR" \
  --model sonnet \
  --max-budget-usd 0.30 \
  --allowed-tools "Bash,Read,Glob,Grep" \
  --system-prompt "You are a senior code reviewer. Be thorough but practical — flag real issues, not style nitpicks. Prioritize security and correctness over aesthetics."
```

## JSON

```json
{
  "name": "code-review",
  "prompt": "Review the git commits from the last 24 hours:\n\n1. Run git log --oneline --since='24 hours ago' to find recent commits\n2. For each commit, review the diff with git show <hash>\n3. Look for:\n   - Bugs or logic errors\n   - Security vulnerabilities (injection, auth issues, exposed secrets)\n   - Performance concerns\n   - Missing error handling\n   - Code style inconsistencies\n4. Provide a summary with:\n   - Number of commits reviewed\n   - Issues found (categorized by severity: critical, warning, info)\n   - Specific file and line references for each issue\n   - Suggested fixes where applicable\n\nIf no issues are found, confirm the review was clean.",
  "status": "active",
  "cwd": "/path/to/project",
  "rrule": "FREQ=DAILY;BYHOUR=10;BYDAY=MO,TU,WE,TH,FR",
  "model": "sonnet",
  "max_budget_usd": 0.30,
  "allowed_tools": "Read,Glob,Grep,Bash",
  "system_prompt": "You are a senior code reviewer. Be thorough but practical — flag real issues, not style nitpicks. Prioritize security and correctness over aesthetics."
}
```

## How it works

1. Checks the git log for commits in the last 24 hours
2. Reviews each commit's diff for potential issues
3. Categorizes findings by severity
4. Reports with specific file and line references

## Customization

- Change `--since='24 hours ago'` to review a different time window
- Use `--model opus` for deeper analysis on critical projects
- Remove `Bash` from allowed tools to prevent any command execution
- Adjust the system prompt to focus on specific concern areas
