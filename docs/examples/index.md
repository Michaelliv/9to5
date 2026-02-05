# Examples

Ready-to-use automation recipes. Each example includes the CLI command to create it and the JSON for importing.

## Recipes

| Recipe | Description | Schedule |
|--------|-------------|----------|
| [Reddit Trend Scout](./reddit-scout) | Monitor subreddits for trending topics and draft blog posts | Every 4 hours |
| [Daily Test Runner](./daily-tests) | Run test suite and report failures | Daily at 8 AM |
| [Automated Code Review](./code-review) | Review recent commits for issues | Weekdays at 10 AM |
| [Report Generation](./report-gen) | Generate weekly project summaries | Mondays at 9 AM |

## Using These Recipes

### Option 1: CLI command

Copy the `9to5 add` command from any recipe page and adjust the `--cwd` to your project.

### Option 2: Import JSON

Save the JSON block from any recipe page to a file and import it:

```bash
9to5 import recipe.json --cwd /path/to/your/project
```

## Contributing Recipes

Have a useful automation? Export it and share:

```bash
9to5 export <id> > my-recipe.json
```
