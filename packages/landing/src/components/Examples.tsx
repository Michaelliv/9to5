import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface Example {
	name: string;
	file: string;
	schedule: string;
	description: string;
}

const EXAMPLES: Example[] = [
	{
		name: "Morning briefing",
		file: "morning-briefing",
		schedule: "Daily 7am",
		description: "Summarize last 24h of commits, PRs, issues, CI status",
	},
	{
		name: "Security scan",
		file: "security-scan",
		schedule: "Daily",
		description:
			"Check recent commits for hardcoded secrets and vulnerability patterns",
	},
	{
		name: "Test gap finder",
		file: "test-gap-finder",
		schedule: "Nightly",
		description: "Find untested code in recent commits, suggest test skeletons",
	},
	{
		name: "API contract watchdog",
		file: "api-contract-watchdog",
		schedule: "Every 2h",
		description: "Hit API endpoints, compare responses to spec, flag drift",
	},
	{
		name: "Project health check",
		file: "project-health-check",
		schedule: "Every 6h",
		description: "Run tests, measure build times, track repo metrics over time",
	},
	{
		name: "Ecosystem watch",
		file: "ecosystem-watch",
		schedule: "Every 12h",
		description: "Check for new releases of dependencies and breaking changes",
	},
	{
		name: "Reddit trend scout",
		file: "reddit-trend-scout",
		schedule: "Every 4h",
		description: "Scout trending posts and draft blog content",
	},
	{
		name: "TODO tracker",
		file: "todo-tracker",
		schedule: "Weekly",
		description: "Inventory TODO/FIXME comments, track additions and removals",
	},
	{
		name: "Stale branch archaeologist",
		file: "stale-branch-archaeologist",
		schedule: "Weekly",
		description: "Assess old branches and recommend which are safe to delete",
	},
	{
		name: "Dependency deep audit",
		file: "dependency-deep-audit",
		schedule: "Weekly",
		description:
			"Analyze actual usage of deps, flag unmaintained or replaceable ones",
	},
	{
		name: "Refactor spotter",
		file: "refactor-spotter",
		schedule: "Weekly",
		description: "Find emerging code patterns worth extracting",
	},
	{
		name: "License compliance",
		file: "license-compliance-checker",
		schedule: "Weekly",
		description: "Scan dependency tree for copyleft or problematic licenses",
	},
	{
		name: "Drift detector",
		file: "drift-detector",
		schedule: "Daily",
		description: "Compare IaC config against actual running state",
	},
	{
		name: "Competitor comparison",
		file: "competitor-comparison-pages",
		schedule: "Weekly",
		description:
			"Research competitors and generate comparison docs via worktree PR",
	},
];

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			/* clipboard not available */
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="text-text-faint hover:text-text-muted transition-colors cursor-pointer"
			title="Copy import command"
		>
			{copied ? (
				<svg
					className="w-3.5 h-3.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<title>Copied</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			) : (
				<svg
					className="w-3.5 h-3.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<title>Copy</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			)}
		</button>
	);
}

export function Examples() {
	const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

	return (
		<section className="py-20 px-6" id="examples">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-12">
					<p className="text-sm uppercase tracking-widest text-text-muted mb-2 font-mono">
						Examples
					</p>
					<h2 className="text-2xl md:text-3xl font-semibold mb-4">
						What people automate
					</h2>
					<p className="text-text-secondary max-w-xl mx-auto">
						Ready-to-import agents. Pick one, tweak the prompt, done.
					</p>
				</div>

				<div
					ref={ref}
					className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children ${isVisible ? "visible" : ""}`}
				>
					{EXAMPLES.map((ex) => (
						<div
							key={ex.file}
							className="p-4 rounded-lg border border-border-subtle bg-bg-card card-hover"
						>
							<div className="flex items-start justify-between gap-2 mb-2">
								<h3 className="font-medium text-sm text-text-primary">
									{ex.name}
								</h3>
								<CopyButton text={`9to5 import examples/${ex.file}.json`} />
							</div>
							<span className="inline-block text-xs font-mono px-2 py-0.5 rounded bg-accent-dim text-accent mb-2">
								{ex.schedule}
							</span>
							<p className="text-xs text-text-muted leading-relaxed">
								{ex.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
