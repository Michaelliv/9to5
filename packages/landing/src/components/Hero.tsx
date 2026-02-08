import { useState, useEffect, useRef } from "react";
import anime from "animejs";

export function Hero() {
	const [copied, setCopied] = useState(false);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const tl = anime.timeline({ easing: "easeOutQuad" });

		tl.add({
			targets: titleRef.current,
			translateY: [30, 0],
			opacity: [0, 1],
			duration: 600,
		});

		tl.add(
			{
				targets: subtitleRef.current,
				translateY: [20, 0],
				opacity: [0, 1],
				duration: 500,
			},
			"-=300",
		);

		tl.add(
			{
				targets: ctaRef.current,
				translateY: [20, 0],
				opacity: [0, 1],
				duration: 500,
			},
			"-=200",
		);
	}, []);

	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			/* clipboard not available */
		}
	};

	return (
		<section className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-20">
			<div className="max-w-3xl mx-auto text-center">
				<h1
					ref={titleRef}
					className="opacity-0 font-mono text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-text-primary"
				>
					Cron for Claude Code
				</h1>

				<p
					ref={subtitleRef}
					className="opacity-0 text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
				>
					Set a prompt, set a schedule, set a budget. A background daemon runs
					it while you're not looking. Results land in your inbox with cost,
					duration, and structured output.
				</p>

				<div ref={ctaRef} className="opacity-0 flex flex-col items-center gap-4">
					<button
						type="button"
						onClick={() => handleCopy("npm install -g 9to5")}
						className="group relative flex items-center gap-3 px-6 py-3 rounded-lg bg-bg-elevated border border-border-default hover:border-accent/50 transition-all cursor-pointer"
					>
						<span className="text-green font-mono text-sm">$</span>
						<code className="font-mono text-sm text-text-primary">
							npm install -g 9to5
						</code>
						<span className="text-text-faint group-hover:text-text-muted transition-colors">
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
						</span>
					</button>
					<span
						className={`text-sm transition-opacity duration-300 ${copied ? "text-green opacity-100" : "text-text-faint opacity-0"}`}
					>
						Copied to clipboard
					</span>

					<div className="flex items-center gap-6 mt-2">
						<a
							href="https://github.com/Michaelliv/9to5"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-text-muted hover:text-text-primary transition-colors"
						>
							GitHub
						</a>
						<span className="text-border-default">|</span>
						<a
							href="https://github.com/Michaelliv/9to5/blob/main/skills/9to5/SKILL.md"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-text-muted hover:text-text-primary transition-colors"
						>
							Agent skill &rarr;
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
