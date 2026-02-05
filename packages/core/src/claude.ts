import type { Automation } from "./types.ts";

export function buildClaudeArgs(
	automation: Automation,
	sessionId?: string,
): string[] {
	return [
		"claude",
		"-p",
		"--permission-mode",
		"bypassPermissions",
		"--output-format",
		"json",
		"--model",
		automation.model,
		...(sessionId ? ["--session-id", sessionId] : []),
		...(automation.max_budget_usd
			? ["--max-budget-usd", String(automation.max_budget_usd)]
			: []),
		...(automation.allowed_tools
			? ["--allowed-tools", ...JSON.parse(automation.allowed_tools)]
			: []),
		...(automation.system_prompt
			? ["--append-system-prompt", automation.system_prompt]
			: []),
		automation.prompt,
	];
}
