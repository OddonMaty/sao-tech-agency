import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))
// Deux applications dans le même dossier : le site public (index.html) et l'administration (admin/index.html).
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": r("./src") } },
  build: { rollupOptions: { input: { main: r("./index.html"), admin: r("./admin/index.html") } } },
})
