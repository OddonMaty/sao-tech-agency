import { useState } from "react"
import { sendRequest } from "@/lib/api"
export const Field = ({ id, label, icon: I, children }: { id: string; label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => (
  <div><label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label><div className="relative">{I && <I className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />}{children}</div></div>
)
// Envoi d'une demande par email (API) avec état d'avancement
export function useSend() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle")
  const [error, setError] = useState("")
  const send = async (data: Record<string, string>) => {
    setState("sending"); setError("")
    try { await sendRequest(data); setState("ok") } catch (e) { setError((e as Error).message); setState("err") }
  }
  return { state, error, send }
}
export const Status = ({ state, error }: { state: string; error: string }) => (
  <div aria-live="polite">
    {state === "ok" && <p className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm font-semibold">Merci, votre demande est bien envoyée. Nous revenons vers vous très vite.</p>}
    {state === "err" && <p className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
  </div>
)
