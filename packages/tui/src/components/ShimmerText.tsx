import { useShimmer } from "../hooks/useShimmer.ts";

const SHIMMER_WIDTH = 3;

function lerpChannel(a: number, b: number, t: number): number {
	return Math.round(a + (b - a) * t);
}

function lerpHex(dimHex: string, brightHex: string, t: number): string {
	const dr = Number.parseInt(dimHex.slice(1, 3), 16);
	const dg = Number.parseInt(dimHex.slice(3, 5), 16);
	const db = Number.parseInt(dimHex.slice(5, 7), 16);
	const br = Number.parseInt(brightHex.slice(1, 3), 16);
	const bg = Number.parseInt(brightHex.slice(3, 5), 16);
	const bb = Number.parseInt(brightHex.slice(5, 7), 16);
	const r = lerpChannel(dr, br, t);
	const g = lerpChannel(dg, bg, t);
	const b = lerpChannel(db, bb, t);
	return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function ShimmerText({
	text,
	dim,
	bright,
	active,
	bold,
}: {
	text: string;
	dim: string;
	bright: string;
	active: boolean;
	bold?: boolean;
}) {
	const pos = useShimmer(active, text.length);

	if (!active) {
		return bold ? (
			<b>
				<span fg={dim}>{text}</span>
			</b>
		) : (
			<span fg={dim}>{text}</span>
		);
	}

	// biome-ignore lint/suspicious/noArrayIndexKey: stable character list, index is the only meaningful key
	const chars = [...text].map((ch, i) => {
		const dist = Math.abs(i - pos);
		const fade = dist < SHIMMER_WIDTH ? 1 - dist / SHIMMER_WIDTH : 0;
		const color = fade > 0 ? lerpHex(dim, bright, fade) : dim;
		return (
			<span key={`${ch}-${i}`} fg={color}>
				{ch}
			</span>
		);
	});

	return bold ? <b>{chars}</b> : <>{chars}</>;
}
