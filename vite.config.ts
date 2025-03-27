import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: "@", replacement: path.resolve(__dirname, "src") },
			{
				find: "@components",
				replacement: path.resolve(__dirname, "src/components"),
			},
			{ find: "@layouts", replacement: path.resolve(__dirname, "src/layouts") },
			{ find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
			{ find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
			{ find: "@config", replacement: path.resolve(__dirname, "src/config") },
			{ find: "@hooks", replacement: path.resolve(__dirname, "src/hooks") },
			{ find: "@types", replacement: path.resolve(__dirname, "src/types") },
		],
	},
});
