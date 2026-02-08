import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/9to5/",
	server: {
		port: 4000,
	},
});
