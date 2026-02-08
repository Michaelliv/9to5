export function Footer() {
	return (
		<footer className="py-12 px-6 border-t border-border-subtle">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-center gap-8 mb-4">
					<a
						href="https://github.com/Michaelliv/9to5"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-text-muted hover:text-text-primary transition-colors"
					>
						GitHub
					</a>
					<a
						href="https://michaellivs.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-text-muted hover:text-text-primary transition-colors"
					>
						Blog
					</a>
				</div>
				<p className="text-center text-xs text-text-faint">
					MIT License
				</p>
			</div>
		</footer>
	);
}
