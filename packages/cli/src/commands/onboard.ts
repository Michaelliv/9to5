import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Command } from "commander";

const INSTRUCTIONS = `
## Task Scheduling (9to5)

Use **9to5** to create and manage automated Claude Code agents. Run \`9to5 --help\` or \`9to5 <command> --help\` for full usage.

Key commands: \`agent add\`, \`agent list\`, \`agent run\`, \`runs\`, \`inbox\`, \`agent edit\`, \`agent remove\`, \`agent restore\`, \`daemon start\`, \`daemon stop\`, \`agent export\`, \`agent import\`, \`ui\`, \`webhook\`.

\`agent remove\` soft-deletes (recoverable). Use \`agent remove --force\` to permanently delete. \`agent restore <id>\` brings back a deleted agent. \`agent list --deleted\` shows deleted agents.

### Options for \`agent add\` and \`agent edit\`

| Option | Default |
|--------|---------|
| \`--prompt <prompt>\` | Required |
| \`--cwd <dir>\` | Current directory |
| \`--rrule <rule>\` | None (manual only) |
| \`--model <model>\` | sonnet |
| \`--max-budget-usd <amount>\` | None |
| \`--allowed-tools <tools>\` | All tools |
| \`--system-prompt <prompt>\` | None |

### Scheduling (rrule)

The \`--rrule\` flag uses RFC 5545 recurrence rules:
- Daily at 9 AM: \`FREQ=DAILY;BYHOUR=9\`
- Every 4 hours: \`FREQ=HOURLY;INTERVAL=4\`
- Weekdays at 10 AM: \`FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=10\`
- Mondays at 9 AM: \`FREQ=WEEKLY;BYDAY=MO;BYHOUR=9\`

Without \`--rrule\`, agents are manual-only (\`9to5 agent run <id>\`) or webhook-triggered.

### Editing via file

\`\`\`bash
9to5 agent export <id> > agent.json
# edit the JSON file
9to5 agent import agent.json --update
\`\`\`

\`--update\` matches by name and applies changed fields.
`.trim();

const MARKER = "## Task Scheduling (9to5)";

export function registerOnboard(program: Command): void {
	program
		.command("onboard")
		.description("Add 9to5 instructions to ~/.claude/CLAUDE.md")
		.action(() => {
			const claudeDir = join(homedir(), ".claude");
			const claudeMd = join(claudeDir, "CLAUDE.md");

			if (!existsSync(claudeDir)) {
				mkdirSync(claudeDir, { recursive: true });
			}

			let existingContent = "";
			if (existsSync(claudeMd)) {
				existingContent = readFileSync(claudeMd, "utf-8");
			}

			if (existingContent.includes(MARKER)) {
				console.log("✓ Already onboarded");
				console.log(`  ${claudeMd}`);
				return;
			}

			if (existingContent) {
				const newContent = `${existingContent.trimEnd()}\n\n${INSTRUCTIONS}\n`;
				writeFileSync(claudeMd, newContent);
			} else {
				writeFileSync(claudeMd, `${INSTRUCTIONS}\n`);
			}

			console.log(`✓ Added 9to5 instructions to ${claudeMd}`);
			console.log();
			console.log("Your agent now knows how to use 9to5!");
			console.log();
		});
}
