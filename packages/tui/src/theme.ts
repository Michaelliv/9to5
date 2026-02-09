import { RGBA, SyntaxStyle } from "@opentui/core";

// Per-panel accent colors — each window gets its own identity
export const t = {
	// Left panel (list) — cyan
	listAccent: "#60f0ff", // vivid cyan — selections, badges
	listAccentDim: "#1a8898", // dim cyan — shimmer base
	listSelectBg: "#0a2830", // dark teal tint — selected row bg

	// Right panel (detail) — violet
	detailAccent: "#d8b0ff", // vivid violet — headers, links

	// Status bar — blue
	statusAccent: "#80b8ff", // vivid blue — hotkey labels

	// Semantic — vivid so they pop on dark backgrounds
	running: "#60a0ff", // bright blue
	success: "#50e060", // bright green
	warning: "#e8c030", // bright yellow
	error: "#ff5050", // bright red
	errorDim: "#c03030", // dim red

	// Borders
	border: "#ffffff", // default white
	borderFocused: "#f0d040", // yellow — active/clicked panel

	// Text — high contrast
	text: "#e8e8f0", // near-white
	textSecondary: "#a0a0b0", // light gray
	textMuted: "#b0b8c8", // light steel — clearly readable on dark bg

	// Status dot
	dot: "#50e060", // bright green
};

let _mdStyle: SyntaxStyle | null = null;

export function getMdStyle(): SyntaxStyle {
	if (!_mdStyle) {
		_mdStyle = SyntaxStyle.fromStyles({
			default: { fg: RGBA.fromInts(232, 232, 240, 255) },
			"markup.heading.1": { fg: RGBA.fromInts(216, 176, 255, 255), bold: true },
			"markup.heading.2": { fg: RGBA.fromInts(216, 176, 255, 255), bold: true },
			"markup.heading.3": { fg: RGBA.fromInts(192, 152, 240, 255), bold: true },
			"markup.heading": { fg: RGBA.fromInts(216, 176, 255, 255), bold: true },
			"markup.strong": { bold: true },
			"markup.italic": { italic: true },
			"markup.strikethrough": { dim: true },
			"markup.raw": { fg: RGBA.fromInts(160, 160, 176, 255) },
			"markup.link.label": {
				fg: RGBA.fromInts(216, 176, 255, 255),
				underline: true,
			},
			"markup.link.url": { fg: RGBA.fromInts(112, 120, 136, 255) },
			"markup.link": { fg: RGBA.fromInts(112, 120, 136, 255) },
			"markup.list": { fg: RGBA.fromInts(216, 176, 255, 255) },
			"punctuation.special": { fg: RGBA.fromInts(140, 110, 200, 255) },
			conceal: { fg: RGBA.fromInts(112, 120, 136, 255) },
		});
	}
	return _mdStyle;
}
