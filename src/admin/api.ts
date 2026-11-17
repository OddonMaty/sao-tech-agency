export class AuthError extends Error {}

export async function api(path: string, body?: unknown, form?: FormData): Promise<any> {
  if (import.meta.env.DEV) return (await import("./mock")).mock(path, body)
  const o: RequestInit = { credentials: "same-origin", headers: { "X-STA": "1" } }
  if (form) { o.method = "POST"; o.body = form }
  else if (body !== undefined) { o.method = "POST"; o.headers = { "X-STA": "1", "Content-Type": "application/json" }; o.body = JSON.stringify(body) }
  const r = await fetch("/api/" + path, o)
  const j = await r.json().catch(() => ({}))
  if (r.status === 401) throw new AuthError(j.error || "auth")
  if (!r.ok) throw new Error(j.error || "Erreur serveur")
  return j
}
