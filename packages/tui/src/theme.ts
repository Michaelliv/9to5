import { RGBA, SyntaxStyle } from "@opentui/core";

// Ember theme — polarized warmth: bright content glows against deep darks
export const t = {
	// Accent — desaturated so it doesn't compete with error
	accent: "#d08040", // warm amber — selection, hotkeys, highlights
	accentDim: "#8a5828", // dimmed ember

	// Semantic — error is the loudest, seen rarely, must notice instantly
	running: "#e0a040", // golden amber
	success: "#80c860", // warm green
	warning: "#d4b050", // gold
	error: "#f04040", // vivid fire red — loudest color on screen
	errorDim: "#b03030", // dimmed red

	// Surfaces — dark band, stays below L*30
	border: "#d08040", // bright amber — matches accent
	borderActive: "#e0a050", // hot amber

	// Text — bright band, polarized against darks
	text: "#f0dcc0", // warm glowing cream
	textSecondary: "#b0a088", // dusty tan
	textMuted: "#705840", // warm brown — lowest visible tier

	// Status dot
	dot: "#80c860", // green when active
};

let _mdStyle: SyntaxStyle | null = null;

export function getMdStyle(): SyntaxStyle {
	if (!_mdStyle) {
		_mdStyle = SyntaxStyle.fromStyles({
			default: { fg: RGBA.fromInts(240, 220, 192, 255) },
			"markup.heading.1": { fg: RGBA.fromInts(208, 128, 64, 255), bold: true },
			"markup.heading.2": { fg: RGBA.fromInts(208, 128, 64, 255), bold: true },
			"markup.heading.3": { fg: RGBA.fromInts(224, 160, 80, 255), bold: true },
			"markup.heading": { fg: RGBA.fromInts(208, 128, 64, 255), bold: true },
			"markup.strong": { bold: true },
			"markup.italic": { italic: true },
			"markup.strikethrough": { dim: true },
			"markup.raw": { fg: RGBA.fromInts(176, 160, 136, 255) },
			"markup.link.label": {
				fg: RGBA.fromInts(208, 128, 64, 255),
				underline: true,
			},
			"markup.link.url": { fg: RGBA.fromInts(112, 88, 64, 255) },
			"markup.link": { fg: RGBA.fromInts(112, 88, 64, 255) },
			"markup.list": { fg: RGBA.fromInts(208, 128, 64, 255) },
			"punctuation.special": { fg: RGBA.fromInts(138, 88, 40, 255) },
			conceal: { fg: RGBA.fromInts(112, 88, 64, 255) },
		});
	}
	return _mdStyle;
}
