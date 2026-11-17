export async function sendRequest(data: Record<string, string>): Promise<void> {
  let j: { ok?: boolean; error?: string } = {}
  try {
    const r = await fetch("/api/request.php", { method: "POST", headers: { "Content-Type": "application/json", "X-STA": "1" }, body: JSON.stringify(data) })
    j = await r.json()
  } catch { /* réseau ou serveur indisponible */ }
  if (!j.ok) throw new Error(j.error || "Envoi impossible pour le moment. Utilisez WhatsApp.")
}
