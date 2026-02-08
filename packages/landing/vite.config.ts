import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	base: "/9to5/",
	server: {
		port: 4000,
	},
});
