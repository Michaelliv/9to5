# System Prompts

System prompts let you customize Claude's behavior for an automation. The prompt is appended to Claude Code's default system instructions.

## Setting a System Prompt

```bash
9to5 add "blog-scout" \
  --prompt "Find trending topics and draft a post" \
  --system-prompt "You are a content scout. Be direct, no fluff, no emojis. First person, direct voice."
```

## Use Cases

### Tone and style

```bash
--system-prompt "Write in a professional, concise style. No marketing language."
```

### Role assignment

```bash
--system-prompt "You are a senior security engineer reviewing code for vulnerabilities."
```

### Output format

```bash
--system-prompt "Always output results as a markdown table. Include severity ratings."
```

### Behavioral constraints

```bash
--system-prompt "Never modify files directly. Only suggest changes as diffs."
```

### Domain context

```bash
--system-prompt "This is a Next.js 14 app using the App Router. The database is PostgreSQL with Drizzle ORM."
```

## Tips

- The system prompt is **appended** to Claude Code's default system prompt, not replacing it
- Keep system prompts focused on behavior and style — put the actual task in `--prompt`
- System prompts persist across runs, so they're good for consistent behavior
- You can combine system prompts with [allowed tools](/guides/budgets-models#allowed-tools) for tighter control

## Example: Full Configuration

```bash
9to5 add "security-audit" \
  --prompt "Scan the codebase for OWASP Top 10 vulnerabilities. Report findings with severity, location, and suggested fix." \
  --system-prompt "You are a senior security engineer. Be thorough but avoid false positives. Rate severity as Critical, High, Medium, or Low." \
  --model opus \
  --max-budget-usd 1.00 \
  --allowed-tools "Read,Glob,Grep" \
  --rrule "FREQ=WEEKLY;BYDAY=MO"
```
