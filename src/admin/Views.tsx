import { useEffect, useRef, useState } from "react"
import { Bell, BellOff, CalendarDays, Copy, Download, FileText, Handshake, Inbox, Mail, MessageCircle, Package, Send, Smartphone, Trash2, Upload, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { api } from "./api"
import { upload } from "./ListEditor"

export const TYPES: Record<string, { l: string; cls: string }> = {
  devis: { l: "Devis", cls: "bg-emerald-100 text-emerald-800" }, partenariat: { l: "Partenariat", cls: "bg-indigo-100 text-indigo-800" },
  contact: { l: "Contact", cls: "bg-sky-100 text-sky-800" }, produit: { l: "Liste d'attente", cls: "bg-amber-100 text-amber-800" },
}
const ST: Record<string, string> = { new: "Nouvelle", done: "Traitée", archived: "Archivée" }
const when = (s: string) => new Date(s.replace(" ", "T")).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
export const Badge = ({ t }: { t: string }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPES[t]?.cls ?? "bg-muted"}`}>{TYPES[t]?.l ?? t}</span>
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`rounded-2xl border bg-card p-5 shadow-sm ${className}`}>{children}</div>

export function Dashboard() {
  const [s, setS] = useState<any>(null)
  useEffect(() => { api("admin.php?a=stats").then(setS).catch(() => {}) }, [])
  if (!s) return <p className="text-muted-foreground">Chargement…</p>
  const max = Math.max(1, ...s.days.map((d: any) => d.n))
  const tiles = [[Inbox, "Nouvelles demandes", s.new, "from-accent to-emerald-700"], [FileText, "Devis", s.devis, "from-sky-500 to-sky-700"], [Handshake, "Partenariats", s.partenariat, "from-indigo-500 to-indigo-700"], [Package, "Liste d'attente produits", s.produit, "from-amber-500 to-amber-700"], [Mail, "Messages de contact", s.contact, "from-slate-500 to-slate-700"], [Users, "Total des demandes", s.total, "from-primary to-slate-800"]] as const
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map(([I, l, n, g]) => <Card key={l} className="flex items-center gap-4"><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${g} text-white shadow-lg`}><I className="h-6 w-6" /></span><div><p className="text-3xl font-extrabold">{n}</p><p className="text-sm text-muted-foreground">{l}</p></div></Card>)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold"><CalendarDays className="h-4 w-4 text-accent" />Demandes des 14 derniers jours</h2>
          <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-2" role="img" aria-label="Histogramme des demandes par jour">
            {s.days.map((d: any) => <div key={d.d} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${d.d} : ${d.n}`}><span className="text-[10px] font-semibold text-muted-foreground">{d.n || ""}</span><div className="w-full rounded-t-md bg-gradient-to-t from-accent to-brandlight" style={{ height: `${Math.max(d.n ? 6 : 2, (d.n / max) * 100)}%`, opacity: d.n ? 1 : 0.25 }} /><span className="text-[10px] text-muted-foreground">{d.d.slice(8)}</span></div>)}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between"><h2 className="text-base font-bold">Dernières demandes</h2><a href="#/demandes" className="text-sm font-semibold text-accent hover:underline">Tout voir</a></div>
          <ul className="mt-4 divide-y">
            {s.last.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Aucune demande pour l'instant.</li>}
            {s.last.map((r: any) => <li key={r.id}><a href="#/demandes" className="flex items-center justify-between gap-3 py-3"><span className="min-w-0"><span className="block truncate font-semibold">{r.name}</span><span className="text-xs text-muted-foreground">{when(r.created_at)}</span></span><span className="flex items-center gap-2"><Badge t={r.type} />{r.status === "new" && <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-label="Nouvelle" />}</span></a></li>)}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export function Requests({ onChange }: { onChange: () => void }) {
  const [items, setItems] = useState<any[]>([]); const [type, setType] = useState(""); const [status, setStatus] = useState(""); const [open, setOpen] = useState<number | null>(null); const [loading, setLoading] = useState(true)
  const load = () => api(`admin.php?a=requests&type=${type}&status=${status}`).then((r) => { setItems(r.items); setLoading(false) }).catch(() => setLoading(false))
  useEffect(() => { load() }, [type, status])
  const upd = async (id: number, data: any) => { await api("admin.php?a=request_update", { id, ...data }); await load(); onChange() }
  const del = async (id: number) => { if (confirm("Supprimer définitivement cette demande ?")) { await api("admin.php?a=request_delete", { id }); await load(); onChange() } }
  const pill = (v: string, cur: string, set: (s: string) => void, l: string) => <button key={v} onClick={() => set(v)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${cur === v ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-muted"}`}>{l}</button>
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">{pill("", type, setType, "Tous types")}{Object.entries(TYPES).map(([k, v]) => pill(k, type, setType, v.l))}</div>
      <div className="flex flex-wrap gap-2">{pill("", status, setStatus, "Tous statuts")}{Object.entries(ST).map(([k, l]) => pill(k, status, setStatus, l))}</div>
      {loading && <p className="text-muted-foreground">Chargement…</p>}
      {!loading && items.length === 0 && <Card className="py-12 text-center text-muted-foreground"><Inbox className="mx-auto mb-3 h-10 w-10 opacity-40" />Aucune demande ne correspond.</Card>}
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id}><Card className={`!p-0 overflow-hidden ${r.status === "new" ? "border-l-4 border-l-accent" : ""}`}>
            <button className="flex w-full items-start justify-between gap-3 p-4 text-left sm:p-5" onClick={() => setOpen(open === r.id ? null : r.id)} aria-expanded={open === r.id}>
              <span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><strong>{r.name}</strong><Badge t={r.type} /><span className="text-xs text-muted-foreground">{ST[r.status]}</span></span><span className="mt-1 block truncate text-sm text-muted-foreground">{r.org || r.subject || r.message}</span></span>
              <span className="shrink-0 text-xs text-muted-foreground">{when(r.created_at)}</span>
            </button>
            {open === r.id && <div className="space-y-4 border-t bg-muted/40 p-4 sm:p-5">
              <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {([["Organisation", r.org], ["Email", r.email], ["Téléphone", r.phone], ["Ville / pays", r.location], ["Sujet / pôle", r.subject], ["Plan", r.plan], ["Budget", r.budget]] as const).filter(([, v]) => v).map(([l, v]) => <div key={l}><dt className="text-xs font-semibold text-muted-foreground">{l}</dt><dd className="break-words">{v}</dd></div>)}
              </dl>
              {r.message && <div><p className="text-xs font-semibold text-muted-foreground">Message</p><p className="mt-1 whitespace-pre-wrap rounded-xl border bg-card p-3 text-sm">{r.message}</p></div>}
              <div><p className="mb-1 text-xs font-semibold text-muted-foreground">Note interne</p><Textarea defaultValue={r.note ?? ""} className="min-h-[70px]" onBlur={(e) => e.target.value !== (r.note ?? "") && upd(r.id, { note: e.target.value })} /></div>
              <div className="flex flex-wrap gap-2">
                {r.email && <Button asChild variant="outline"><a href={`mailto:${r.email}?subject=${encodeURIComponent("Votre demande à Sao Tech Agency")}`}><Mail className="h-4 w-4" />Répondre par email</a></Button>}
                {r.phone && <Button asChild variant="outline"><a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${r.phone.replace(/\D/g, "")}`}><MessageCircle className="h-4 w-4" />WhatsApp</a></Button>}
                {r.status !== "done" && <Button variant="accent" onClick={() => upd(r.id, { status: "done" })}>Marquer traitée</Button>}
                {r.status !== "new" && <Button variant="outline" onClick={() => upd(r.id, { status: "new" })}>Remettre en nouvelle</Button>}
                {r.status !== "archived" && <Button variant="outline" onClick={() => upd(r.id, { status: "archived" })}>Archiver</Button>}
                <Button variant="outline" className="text-red-600 hover:bg-red-600 hover:text-white" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" />Supprimer</Button>
              </div>
            </div>}
          </Card></li>
        ))}
      </ul>
    </div>
  )
}

export function Media() {
  const [items, setItems] = useState<any[]>([]); const [busy, setBusy] = useState(false); const ref = useRef<HTMLInputElement>(null)
  const load = () => api("admin.php?a=media_list").then((r) => setItems(r.items)).catch(() => {})
  useEffect(() => { load() }, [])
  const add = async (files: FileList | null) => { if (!files) return; setBusy(true); try { for (const f of Array.from(files)) await upload(f) } catch (e) { alert((e as Error).message) } setBusy(false); load() }
  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Téléversez vos images (JPG, PNG, WebP, GIF — 5 Mo max), puis copiez leur adresse dans les champs « Image » des sections.</p>
        <input ref={ref} type="file" multiple accept="image/*" className="hidden" onChange={(e) => add(e.target.files)} /><Button variant="accent" disabled={busy} onClick={() => ref.current?.click()}><Upload className="h-4 w-4" />{busy ? "Envoi…" : "Téléverser"}</Button></Card>
      {items.length === 0 && <Card className="py-12 text-center text-muted-foreground">Aucune image téléversée.</Card>}
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((m) => <li key={m.url}><Card className="!p-3"><img src={m.url} alt="" loading="lazy" className="aspect-video w-full rounded-lg bg-muted object-cover" /><p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{m.url}</p>
          <div className="mt-2 flex gap-2"><Button variant="outline" className="h-9 flex-1 px-2 text-xs" onClick={() => navigator.clipboard.writeText(m.url)}><Copy className="h-3.5 w-3.5" />Copier</Button><Button variant="outline" className="h-9 px-2 text-red-600" aria-label="Supprimer" onClick={async () => { if (confirm("Supprimer cette image ?")) { await api("admin.php?a=media_delete", { url: m.url }); load() } }}><Trash2 className="h-3.5 w-3.5" /></Button></div></Card></li>)}
      </ul>
    </div>
  )
}

const b64u = (s: string) => { const p = "=".repeat((4 - (s.length % 4)) % 4); const r = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(r, (c) => c.charCodeAt(0)) }

export function Settings({ user, onLogout, install, restored }: { user: any; onLogout: () => void; install: (() => void) | null; restored: () => void }) {
  const [msg, setMsg] = useState(""); const [on, setOn] = useState(false); const [hist, setHist] = useState<any[]>([])
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  useEffect(() => {
    api("admin.php?a=content_history").then((r) => setHist(r.items)).catch(() => {})
    if (supported && !import.meta.env.DEV) navigator.serviceWorker.ready.then((r) => r.pushManager.getSubscription()).then((s) => setOn(!!s)).catch(() => {})
  }, [])
  const enable = async () => {
    try {
      if (Notification.permission === "denied") throw new Error("Les notifications sont bloquées dans les réglages du navigateur pour ce site.")
      if ((await Notification.requestPermission()) !== "granted") throw new Error("Autorisation refusée.")
      const reg = await navigator.serviceWorker.ready; const { key } = await api("admin.php?a=push_key")
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(key) as BufferSource })
      await api("admin.php?a=push_subscribe", { subscription: sub.toJSON() }); setOn(true); setMsg("Notifications activées sur cet appareil.")
    } catch (e) { setMsg((e as Error).message) }
  }
  const disable = async () => { try { const reg = await navigator.serviceWorker.ready; const s = await reg.pushManager.getSubscription(); if (s) { await api("admin.php?a=push_unsubscribe", { endpoint: s.endpoint }); await s.unsubscribe() } setOn(false); setMsg("Notifications désactivées sur cet appareil.") } catch (e) { setMsg((e as Error).message) } }
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card><h2 className="flex items-center gap-2 text-lg font-bold"><Bell className="h-5 w-5 text-accent" />Notifications des demandes</h2>
        <p className="mt-2 text-sm text-muted-foreground">Recevez une notification sur cet appareil à chaque nouvelle demande de devis ou de partenariat. Activez-les sur chaque appareil (ordinateur, téléphone).</p>
        {!supported && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Ce navigateur ne gère pas les notifications. Sur iPhone, installez d'abord l'application (Partager, puis « Sur l'écran d'accueil »).</p>}
        <div className="mt-4 flex flex-wrap gap-2">{on ? <Button variant="outline" onClick={disable}><BellOff className="h-4 w-4" />Désactiver</Button> : <Button variant="accent" disabled={!supported} onClick={enable}><Bell className="h-4 w-4" />Activer sur cet appareil</Button>}
          <Button variant="outline" onClick={async () => { try { const r = await api("admin.php?a=push_test", {}); setMsg(r.sent ? `Notification envoyée à ${r.sent} appareil(s).` : "Aucun appareil abonné ou envoi refusé.") } catch (e) { setMsg((e as Error).message) } }}><Send className="h-4 w-4" />Envoyer un test</Button></div>
        {msg && <p role="status" className="mt-3 text-sm font-semibold text-accent">{msg}</p>}</Card>
      <Card><h2 className="flex items-center gap-2 text-lg font-bold"><Smartphone className="h-5 w-5 text-accent" />Installer l'application</h2>
        <p className="mt-2 text-sm text-muted-foreground">Installez ce tableau de bord comme une application, sur ordinateur ou téléphone.</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground"><li>Chrome / Edge : bouton ci-dessous ou icône d'installation dans la barre d'adresse.</li><li>Android : menu du navigateur, « Installer l'application ».</li><li>iPhone : Safari, Partager, « Sur l'écran d'accueil ».</li></ul>
        {install && <Button variant="accent" className="mt-4" onClick={install}><Download className="h-4 w-4" />Installer maintenant</Button>}</Card>
      <Card className="xl:col-span-2"><h2 className="text-lg font-bold">Historique des publications</h2><p className="mt-1 text-sm text-muted-foreground">Chaque publication est sauvegardée. Vous pouvez restaurer une ancienne version du contenu.</p>
        <ul className="mt-4 divide-y">{hist.map((h, i) => <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span>{when(h.created_at)} · <span className="text-muted-foreground">{h.email}</span>{i === 0 && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">En ligne</span>}</span>{i > 0 && <Button variant="outline" className="h-9" onClick={async () => { if (confirm("Restaurer cette version ?")) { await api("admin.php?a=content_restore", { id: h.id }); restored() } }}>Restaurer</Button>}</li>)}</ul></Card>
      <Card className="xl:col-span-2 flex flex-wrap items-center justify-between gap-3"><p className="text-sm">Connecté en tant que <strong>{user.email}</strong></p><Button variant="outline" onClick={onLogout}>Se déconnecter</Button></Card>
    </div>
  )
}
