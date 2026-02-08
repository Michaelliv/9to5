import type { ReactNode } from "react";
import { t } from "../theme.ts";

const MD_LINK_RE = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;
const URL_RE = /https?:\/\/[^\s)>\]"']+/g;
const PATH_RE = /(?:^|(?<=\s))((?:\/|~\/)[^\s:)>\]"']+)/g;

type Segment =
	| { type: "text"; value: string }
	| { type: "link"; value: string; href: string };

function parseSegments(text: string): Segment[] {
	const matches: {
		start: number;
		end: number;
		href: string;
		value: string;
	}[] = [];

	for (const m of text.matchAll(MD_LINK_RE)) {
		matches.push({
			start: m.index,
			end: m.index + m[0].length,
			href: m[2],
			value: m[1],
		});
	}

	for (const m of text.matchAll(URL_RE)) {
		const start = m.index;
		const end = m.index + m[0].length;
		const overlaps = matches.some((x) => start < x.end && end > x.start);
		if (overlaps) continue;

		matches.push({
			start,
			end,
			href: m[0],
			value: m[0],
		});
	}

	for (const m of text.matchAll(PATH_RE)) {
		const path = m[1];
		const start = m.index + m[0].indexOf(path);
		const end = start + path.length;
		const overlaps = matches.some((x) => start < x.end && end > x.start);
		if (!overlaps) {
			const expanded = path.startsWith("~")
				? path.replace("~", process.env.HOME ?? "~")
				: path;
			matches.push({
				start,
				end,
				href: `file://${expanded}`,
				value: path,
			});
		}
	}

	matches.sort((a, b) => a.start - b.start);

	const segments: Segment[] = [];
	let cursor = 0;
	for (const m of matches) {
		if (m.start > cursor) {
			segments.push({ type: "text", value: text.slice(cursor, m.start) });
		}
		segments.push({ type: "link", value: m.value, href: m.href });
		cursor = m.end;
	}
	if (cursor < text.length) {
		segments.push({ type: "text", value: text.slice(cursor) });
	}

	return segments;
}

export function LinkedText({
	children,
	fg: fgColor,
}: {
	children: string;
	fg?: string;
}) {
	const segments = parseSegments(children);
	if (segments.length === 1 && segments[0].type === "text") {
		return (
			<text selectable fg={fgColor}>
				{children}
			</text>
		);
	}

	const nodes: ReactNode[] = segments.map((seg) => {
		if (seg.type === "link") {
			return (
				<a key={seg.href + seg.value} href={seg.href}>
					<span fg={t.accent}>
						<u>{seg.value}</u>
					</span>
				</a>
			);
		}
		return seg.value;
	});

	return (
		<text selectable fg={fgColor}>
			{nodes}
		</text>
	);
}
