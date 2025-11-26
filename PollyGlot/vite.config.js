import {defineConfig} from "vite"

export default defineConfig({
	plugins: [
		
	],
	server: {
		open: '/index.html',
		// No proxy needed - @huggingface/inference SDK handles CORS internally
	},
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				generate: './generate.html'
			}
		}
	}
})