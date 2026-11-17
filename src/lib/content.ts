import defaults from "@/data/content.json"
export type Content = typeof defaults
export { defaults }
// Le contenu publié depuis l'admin est lu dans /live/content.json ; à défaut, le contenu livré avec le site est utilisé.
export let content: Content = defaults
export async function loadContent(): Promise<void> {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 2500)
    const r = await fetch(`/live/content.json?v=${Math.floor(Date.now() / 60000)}`, { signal: ctl.signal, cache: "no-cache" })
    clearTimeout(t)
    if (r.ok && (r.headers.get("content-type") || "").includes("json")) content = { ...defaults, ...(await r.json()) }
  } catch { /* contenu par défaut */ }
}
