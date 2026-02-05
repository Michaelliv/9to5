# Import & Export

9to5 supports exporting automations as JSON and importing them back. This lets you share automation recipes, back up your configuration, and move automations between machines.

## Exporting

### Export all automations

```bash
9to5 export > my-automations.json
```

### Export a single automation

```bash
9to5 export abc123 > reddit-scout.json
```

### JSON format

```json
{
  "name": "Reddit trend scout",
  "prompt": "Fetch trending posts from r/ClaudeAI...",
  "status": "active",
  "cwd": "/Users/me/projects/blog",
  "rrule": "FREQ=HOURLY;INTERVAL=4",
  "model": "sonnet",
  "max_budget_usd": 0.5,
  "allowed_tools": null,
  "system_prompt": "You are a blog content scout..."
}
```

## Importing

### Import from a file

```bash
9to5 import recipes/reddit-scout.json
```

### Override the working directory

```bash
9to5 import recipes/test-runner.json --cwd /path/to/my/project
```

### Batch import

If the JSON file contains an array, all automations are imported:

```bash
9to5 import all-automations.json
```

## Workflow

### Sharing recipes

1. Create and test an automation locally
2. Export it: `9to5 export abc123 > recipe.json`
3. Share the JSON file (commit to repo, send to team, etc.)
4. Others import: `9to5 import recipe.json --cwd /their/project`

### Backup and restore

```bash
# Backup
9to5 export > backup-$(date +%Y%m%d).json

# Restore
9to5 import backup-20250115.json
```

### Migration between machines

```bash
# On old machine
9to5 export > automations.json

# On new machine
9to5 import automations.json --cwd /new/project/path
```

## Tips

- Imported automations always get a new unique ID
- The `--cwd` override is essential when importing recipes designed for a different directory
- Exported JSON does not include run history or inbox items — only the automation configuration
- Check the [Examples](/examples/) section for ready-to-import recipes
