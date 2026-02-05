# Daily Test Runner

Run your test suite every morning and get a summary of failures.

## CLI Command

```bash
9to5 add "daily-tests" \
  --prompt "Run the test suite with the project's test command. If any tests fail, analyze the failures and provide:
1. Which tests failed and their file locations
2. The error messages
3. A brief assessment of likely root causes
4. Whether these look like flaky tests or real regressions

If all tests pass, report the total count and execution time." \
  --cwd /path/to/project \
  --rrule "FREQ=DAILY;BYHOUR=8" \
  --model sonnet \
  --max-budget-usd 0.15
```

## JSON

```json
{
  "name": "daily-tests",
  "prompt": "Run the test suite with the project's test command. If any tests fail, analyze the failures and provide:\n1. Which tests failed and their file locations\n2. The error messages\n3. A brief assessment of likely root causes\n4. Whether these look like flaky tests or real regressions\n\nIf all tests pass, report the total count and execution time.",
  "status": "active",
  "cwd": "/path/to/project",
  "rrule": "FREQ=DAILY;BYHOUR=8",
  "model": "sonnet",
  "max_budget_usd": 0.15,
  "allowed_tools": null,
  "system_prompt": null
}
```

## How it works

1. Claude Code detects the project's test framework (Jest, Vitest, pytest, etc.)
2. Runs the test suite using the appropriate command
3. Parses the output for failures
4. Provides analysis distinguishing flaky tests from real regressions

## Customization

- Adjust `BYHOUR` to run at a different time
- Add `BYDAY=MO,TU,WE,TH,FR` to skip weekends
- Increase the budget if your test suite takes many turns to analyze
- Add `--allowed-tools "Bash,Read,Glob,Grep"` to prevent file modifications
