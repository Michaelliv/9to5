import { useEffect, useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface TerminalLine {
	type: "command" | "comment";
	text: string;
	output?: string;
}

const LINES: TerminalLine[] = [
	{ type: "comment", text: "# Create an automation that runs daily at 9am" },
	{
		type: "command",
		text: '9to5 add "morning-review" --prompt "Review yesterday\'s commits and summarize changes" --rrule "FREQ=DAILY;BYHOUR=9" --max-budget-usd 0.25',
		output: "Created automation morning-review (id: 1)",
	},
	{ type: "comment", text: "# Run it immediately to see what you get" },
	{
		type: "command",
		text: "9to5 run 1",
		output: "Run completed — $0.12, 34s",
	},
	{ type: "comment", text: "# Start the daemon — it handles the rest" },
	{
		type: "command",
		text: "9to5 start",
		output: "Daemon started (pid: 48291)",
	},
	{ type: "comment", text: "# Or browse everything in the TUI" },
	{ type: "command", text: "9to5 ui" },
];

export function QuickStart() {
	const { ref, isVisible, hasTriggered } = useScrollAnimation({
		threshold: 0.3,
	});
	const [displayedLines, setDisplayedLines] = useState<
		Array<{ type: string; text: string; output?: string; typing: boolean }>
	>([]);
	const [currentLine, setCurrentLine] = useState(0);
	const [currentChar, setCurrentChar] = useState(0);
	const [showOutput, setShowOutput] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);

	useEffect(() => {
		if (!isVisible || hasStarted) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setDisplayedLines(LINES.map((l) => ({ ...l, typing: false })));
			return;
		}
		setHasStarted(true);
	}, [isVisible, hasStarted]);

	useEffect(() => {
		if (!hasStarted || currentLine >= LINES.length) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const line = LINES[currentLine];

		// Comments appear instantly
		if (line.type === "comment") {
			setDisplayedLines((prev) => {
				if (prev.length > currentLine) return prev;
				return [...prev, { ...line, typing: false }];
			});
			const timeout = setTimeout(() => {
				setCurrentLine((l) => l + 1);
				setCurrentChar(0);
				setShowOutput(false);
			}, 200);
			return () => clearTimeout(timeout);
		}

		// Start new command line
		if (currentChar === 0 && !showOutput) {
			setDisplayedLines((prev) => {
				if (prev.length > currentLine) return prev;
				return [...prev, { type: "command", text: "", typing: true }];
			});
		}

		// Type next character
		if (currentChar < line.text.length) {
			const timeout = setTimeout(
				() => {
					setDisplayedLines((prev) => {
						const updated = [...prev];
						if (updated[currentLine]) {
							updated[currentLine] = {
								...updated[currentLine],
								text: line.text.slice(0, currentChar + 1),
							};
						}
						return updated;
					});
					setCurrentChar((c) => c + 1);
				},
				20 + Math.random() * 15,
			);
			return () => clearTimeout(timeout);
		}

		// Show output
		if (currentChar >= line.text.length && !showOutput) {
			const timeout = setTimeout(() => {
				setDisplayedLines((prev) => {
					const updated = [...prev];
					if (updated[currentLine]) {
						updated[currentLine] = {
							...updated[currentLine],
							output: line.output,
							typing: false,
						};
					}
					return updated;
				});
				setShowOutput(true);
			}, 300);
			return () => clearTimeout(timeout);
		}

		// Next line
		if (showOutput || (!line.output && currentChar >= line.text.length)) {
			const timeout = setTimeout(() => {
				setCurrentLine((l) => l + 1);
				setCurrentChar(0);
				setShowOutput(false);
			}, 500);
			return () => clearTimeout(timeout);
		}
	}, [hasStarted, currentLine, currentChar, showOutput]);

	return (
		<section className="py-20 px-6 bg-bg-surface" id="quickstart">
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-10">
					<p className="text-sm uppercase tracking-widest text-text-muted mb-2 font-mono">
						Quick Start
					</p>
					<h2 className="text-2xl md:text-3xl font-semibold mb-4">
						Up and running in four commands
					</h2>
					<p className="text-text-secondary text-sm">
						Requires{" "}
						<a
							href="https://bun.sh"
							target="_blank"
							rel="noopener noreferrer"
							className="text-accent hover:underline"
						>
							Bun
						</a>{" "}
						v1.1+ and{" "}
						<a
							href="https://docs.anthropic.com/en/docs/claude-code"
							target="_blank"
							rel="noopener noreferrer"
							className="text-accent hover:underline"
						>
							Claude Code
						</a>{" "}
						installed and authenticated.
					</p>
				</div>

				<div
					ref={ref}
					className={`rounded-xl overflow-hidden border border-border-subtle scroll-fade-in ${hasTriggered ? "visible" : ""}`}
				>
					{/* Title bar */}
					<div className="flex items-center gap-2 px-4 py-3 bg-bg-elevated border-b border-border-subtle">
						<div className="flex gap-1.5">
							<div className="w-3 h-3 rounded-full bg-red-500/60" />
							<div className="w-3 h-3 rounded-full bg-yellow-500/60" />
							<div className="w-3 h-3 rounded-full bg-green/60" />
						</div>
						<span className="text-xs text-text-muted font-mono ml-2">
							terminal
						</span>
					</div>

					{/* Content */}
					<div className="p-4 font-mono text-sm bg-bg-deep min-h-[280px] overflow-x-auto">
						{displayedLines.map((line) => (
							<div key={line.text} className="mb-1.5">
								{line.type === "comment" ? (
									<div className="text-text-faint">{line.text}</div>
								) : (
									<>
										<div className="flex items-start gap-2">
											<span className="text-green select-none shrink-0">$</span>
											<span className="text-text-primary break-all">
												{line.text}
												{line.typing && <span className="cursor-blink" />}
											</span>
										</div>
										{line.output && (
											<div className="ml-4 text-text-muted mt-0.5">
												{line.output}
											</div>
										)}
									</>
								)}
							</div>
						))}
						{currentLine >= LINES.length && (
							<div className="flex items-center gap-2">
								<span className="text-green">$</span>
								<span className="cursor-blink" />
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
