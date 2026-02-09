import type { Database } from "bun:sqlite";
import os from "node:os";
import { nanoid } from "nanoid";

const defaults: { name: string; prompt: string }[] = [
	{
		name: "daily-bug-scan",
		prompt: `Scan recent commits (since the last run or last 24h) for likely bugs and propose minimal fixes.

Grounding rules:
- Use ONLY concrete repo evidence (commit SHAs, PRs, file paths, diffs, failing tests, CI signals).`,
	},
	{
		name: "weekly-release-notes",
		prompt: `Draft weekly release notes from merged PRs (include links when available).

Scope & grounding:
- Stay strictly within the repo history for the week; do not add extra sections beyond what the data supports.
- Use PR numbers/titles; avoid claims about impact unless supported by PR description/tests/metrics in repo.`,
	},
	{
		name: "daily-standup",
		prompt: `Summarize yesterday's git activity for standup.

Grounding rules:
- Anchor statements to commits/PRs/files; do not speculate about intent or future work.
- Keep it scannable and team-ready.`,
	},
	{
		name: "nightly-ci-report",
		prompt: `Summarize CI failures and flaky tests from the last CI window; suggest top fixes.

Grounding rules:
- Cite specific jobs, tests, error messages, or log snippets when available.
- Avoid overconfident root-cause claims; separate "observed" vs "suspected."`,
	},
	{
		name: "skill-progression-map",
		prompt: `From recent PRs and reviews, suggest next skills to deepen.

Grounding rules:
- Anchor each suggestion to concrete evidence (PR themes, review comments, recurring issues).
- Avoid generic advice; make each recommendation actionable and specific.`,
	},
	{
		name: "weekly-engineering-summary",
		prompt: `Synthesize this week's PRs, rollouts, incidents, and reviews into a weekly update.

Grounding rules:
- Do not invent events; if data is missing, say that briefly.
- Prefer concrete references (PR #, incident ID, rollout note, file path) where available.`,
	},
	{
		name: "performance-regression-watch",
		prompt: `Compare recent changes to benchmarks or traces and flag regressions early.

Grounding rules:
- Ground claims in measurable signals (benchmarks, traces, timings, flamegraphs).
- If measurements are unavailable, state "No measurements found" rather than guessing.`,
	},
	{
		name: "dependency-sdk-drift",
		prompt: `Detect dependency and SDK drift and propose a minimal alignment plan.

Grounding rules:
- Cite current and target versions from the repo when possible (lockfiles, package manifests).
- Do not guess versions; if targets are unclear, propose options and label them as suggestions.`,
	},
	{
		name: "test-gap-detection",
		prompt: `Identify untested paths from recent changes; add focused tests and use $yeet for draft PRs.

Constraints:
- Keep scope tight to the changed areas; avoid broad refactors.
- Prefer small, reliable tests that fail before and pass after.`,
	},
	{
		name: "pre-release-check",
		prompt: `Before tagging, verify changelog, migrations, feature flags, and tests.

Grounding rules:
- Report ONLY what you can confirm from the repo and CI context.
- If a check cannot be verified, mark it explicitly as "Unknown."`,
	},
	{
		name: "claude-md-sync",
		prompt: `Update CLAUDE.md with newly discovered workflows and commands.

Constraints:
- Keep edits minimal, accurate, and grounded in repo usage.
- Do not touch unrelated sections or auto-generated files.
- If you are unsure, prefer adding a TODO with a short note rather than inventing.`,
	},
	{
		name: "weekly-pr-summary",
		prompt: `Summarize last week's PRs by teammate and theme; highlight risks.

Grounding rules:
- Use PR numbers/titles when available.
- Avoid speculation about impact; stick to what the PR changed.`,
	},
	{
		name: "issue-triage",
		prompt: `Triage new issues; suggest owner, priority, and labels.

Grounding rules:
- Base recommendations on issue content + repo context (CODEOWNERS, touched areas, prior similar issues).
- Do not guess owners without signals; if unclear, say "Owner: Unknown" and suggest a team instead.`,
	},
	{
		name: "ci-monitor",
		prompt: `Check CI failures; group by likely root cause and suggest minimal fixes.

Grounding rules:
- Cite jobs, tests, errors, and log evidence.
- Avoid overconfident root-cause claims; label uncertain items as "Suspected."`,
	},
	{
		name: "dependency-sweep",
		prompt: `Scan outdated dependencies; propose safe upgrades with minimal changes.

Rules:
- Prefer the smallest viable upgrade set.
- Explicitly call out breaking-change risks and required migrations.
- Do not propose upgrades without identifying current versions from the repo.`,
	},
	{
		name: "performance-audit",
		prompt: `Audit performance regressions and propose highest-leverage fixes.

Grounding rules:
- Ground claims in measurements/traces when available.
- If evidence is missing, state uncertainty briefly and suggest what to measure next.`,
	},
	{
		name: "changelog-update",
		prompt: `Update the changelog with this week's highlights and key PR links.

Constraints:
- Only include items supported by repo history.
- Keep structure simple and consistent with existing changelog format.`,
	},
];

export function seedDefaults(db: Database): void {
	const exists = db.prepare("SELECT 1 FROM automations WHERE name = ?");
	const insert = db.prepare(`
		INSERT INTO automations (id, name, prompt, status, cwd, rrule, model, created_at, updated_at)
		VALUES (?, ?, ?, 'paused', ?, NULL, 'sonnet', ?, ?)
	`);

	const home = os.homedir();
	const now = Date.now();

	for (const { name, prompt } of defaults) {
		if (!exists.get(name)) {
			insert.run(nanoid(), name, prompt, home, now, now);
		}
	}
}
