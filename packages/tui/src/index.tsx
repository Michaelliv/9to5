#!/usr/bin/env bun
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "./app.tsx";

const renderer = await createCliRenderer({
	exitOnCtrlC: true,
	useMouse: true,
});

createRoot(renderer).render(<App />);
