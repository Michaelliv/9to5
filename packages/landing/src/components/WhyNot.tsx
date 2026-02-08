import { useScrollAnimation } from "../hooks/useScrollAnimation";

const REASONS = [
	{
		title: "Budget caps per automation",
		desc: "It won't burn your API credits overnight",
	},
	{
		title: "Run history with cost and duration",
		desc: "Know what each run cost and how long it took",
	},
	{
		title: "Inbox",
		desc: "Read/unread notifications so you know what happened while you were away",
	},
	{
		title: "Session resume",
		desc: "Pick up where a run left off with 9to5 resume <run-id>",
	},
	{
		title: "Interactive TUI",
		desc: "Browse, run, pause, delete, and drill into output without leaving the terminal",
	},
	{
		title: "Export/import",
		desc: "Share automations as JSON, bring them to another machine",
	},
	{
		title: "Model and system prompt per automation",
		desc: "Different personas for different jobs",
	},
];

export function WhyNot() {
	const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

	return (
		<section className="py-20 px-6" id="why">
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-12">
					<p className="text-sm uppercase tracking-widest text-text-muted mb-2 font-mono">
						Why 9to5
					</p>
					<h2 className="text-2xl md:text-3xl font-semibold mb-4">
						You could just use cron +{" "}
						<code className="font-mono text-accent">claude -p</code>
					</h2>
					<p className="text-text-secondary">
						Here's what you'd end up building yourself.
					</p>
				</div>

				<div
					ref={ref}
					className={`space-y-3 stagger-children ${isVisible ? "visible" : ""}`}
				>
					{REASONS.map((r) => (
						<div
							key={r.title}
							className="flex items-start gap-3 p-4 rounded-lg border border-border-subtle bg-bg-card"
						>
							<span className="text-green mt-0.5 shrink-0">&#10003;</span>
							<div>
								<span className="font-medium text-text-primary">
									{r.title}
								</span>
								<span className="text-text-muted"> — {r.desc}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
