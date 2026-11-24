import { useCallback, useEffect, useRef, useState } from "react"
import { BookOpen, Boxes, Briefcase, Menu, Bell, Download, ExternalLink, FileText, Handshake, HelpCircle, Image as Img, Inbox, Info, Layers, LayoutDashboard, LogOut, Save, Search, Settings2, Images, Star, Tag, Undo2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api, AuthError } from "./api"
import { defaultsEn } from "@/lib/content"
import Editor, { sections } from "./Editors"
import { Dashboard, Media, Requests, Settings } from "./Views"

declare global { interface Window { google?: any } }

const clean = (c: unknown) => JSON.parse(JSON.stringify(c, (_k, v) => (Array.isArray(v) && v.every((x) => typeof x === "string") ? v.filter(Boolean) : v)))
const icons: Record<string, any> = { infos: Settings2, slides: Images, poles: Layers, offres: Tag, produits: Boxes, realisations: Briefcase, partenaires: Handshake, partenariat: FileText, apropos: Info, pourquoi: Star, faq: HelpCircle, blog: BookOpen, seo: Search }
const useHash = () => { const [h, setH] = useState(location.hash.replace(/^#\/?/, "")); useEffect(() => { const f = () => setH(location.hash.replace(/^#\/?/, "")); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f) }, []); return h }

function Login({ onLogin }: { onLogin: (u: any) => void }) {
  const box = useRef<HTMLDivElement>(null); const [err, setErr] = useState(""); const [id, setId] = useState("")
  useEffect(() => { api("auth.php?a=config").then((r) => setId(r.clientId)).catch(() => setErr("Serveur injoignable.")) }, [])
  useEffect(() => {
    if (!id) return
    const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true
    s.onload = () => {
      window.google.accounts.id.initialize({ client_id: id, callback: (r: any) => api("auth.php?a=google", { credential: r.credential }).then((x) => onLogin(x.user)).catch((e) => setErr(e.message)) })
      if (box.current) window.google.accounts.id.renderButton(box.current, { theme: "filled_blue", size: "large", shape: "pill", text: "signin_with", locale: "fr", width: 280 })
    }
    document.head.appendChild(s); return () => { s.remove() }
  }, [id])
  return (
    <div className="admin grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <img src="/brand/logo-horizontal-inverse.webp" alt="Sao Tech Agency" className="h-16 w-auto self-start" />
        <div><h1 className="text-4xl leading-tight">Le tableau de bord de votre agence.</h1><p className="mt-4 max-w-md text-primary-foreground/75">Gérez le contenu du site, suivez les demandes de devis et de partenariat, et recevez des notifications en temps réel.</p></div>
        <p className="text-sm text-primary-foreground/60">Accès réservé à l'équipe Sao Tech Agency.</p>
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      </div>
      <div className="flex flex-col items-center justify-center bg-muted p-8">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-xl">
          <img src="/admin/icon-192.png" alt="" className="mx-auto h-16 w-16" />
          <h2 className="mt-4 text-2xl">Connexion</h2>
          <p className="mt-1 text-sm text-muted-foreground">Connectez-vous avec votre compte Google autorisé.</p>
          <div ref={box} className="mt-6 flex min-h-[44px] justify-center" />
          {import.meta.env.DEV && <Button className="mt-4 w-full" variant="outline" onClick={() => api("auth.php?a=google", {}).then((x) => onLogin(x.user))}>Entrer en mode démo (développement)</Button>}
          {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>}
        </div>
        <a href="/" className="mt-6 text-sm font-semibold text-accent hover:underline">← Retour au site</a>
      </div>
    </div>
  )
}

function Shell({ user, onLogout }: { user: any; onLogout: () => void }) {
  const route = useHash(); const [open, setOpen] = useState(false)
  const [c, setC] = useState<any>(null); const saved = useRef(""); const [toast, setToast] = useState(""); const [newCount, setNewCount] = useState(0)
  const [prompt, setPrompt] = useState<any>(null)
  const [lang, setLang] = useState<"fr" | "en">("fr")
  const loadContent = useCallback(() => api("admin.php?a=content_get").then((r) => { setC(r.content); saved.current = JSON.stringify(r.content) }).catch(() => setToast("Impossible de charger le contenu.")), [])
  const poll = useCallback(() => api("admin.php?a=latest").then((r) => setNewCount(r.new)).catch(() => {}), [])
  useEffect(() => { loadContent(); poll(); const t = setInterval(poll, 45000); const bip = (e: any) => { e.preventDefault(); setPrompt(e) }; addEventListener("beforeinstallprompt", bip); return () => { clearInterval(t); removeEventListener("beforeinstallprompt", bip) } }, [])
  useEffect(() => { document.title = (newCount ? `(${newCount}) ` : "") + "Administration · Sao Tech Agency" }, [newCount])
  const tree = c === null ? null : lang === "fr" ? c : (c.en ?? JSON.parse(JSON.stringify(defaultsEn)))
  const setTree = (t: any) => (lang === "fr" ? setC(t) : setC({ ...c, en: t }))
  const dirty = c !== null && JSON.stringify(c) !== saved.current
  useEffect(() => { const f = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault() }; addEventListener("beforeunload", f); return () => removeEventListener("beforeunload", f) }, [dirty])
  useEffect(() => { setOpen(false) }, [route])
  // Pastille sur l'icône de l'application (ordinateur) : nombre de demandes à traiter. Sur Android, le lanceur compte les notifications actives.
  useEffect(() => { const n = navigator as any; if (n.setAppBadge) (newCount > 0 ? n.setAppBadge(newCount) : n.clearAppBadge()).catch(() => {}) }, [newCount])
  // À l'ouverture de l'application, les notifications déjà vues sont retirées.
  useEffect(() => {
    const clear = () => { if (document.visibilityState === "visible" && "serviceWorker" in navigator) navigator.serviceWorker.ready.then((r) => r.getNotifications().then((ns) => ns.forEach((x) => x.close()))).catch(() => {}) }
    clear(); document.addEventListener("visibilitychange", clear); return () => document.removeEventListener("visibilitychange", clear)
  }, [])
  const publish = async () => { try { await api("admin.php?a=content_save", { content: clean(c) }); saved.current = JSON.stringify(c); setToast("Publié : les modifications sont en ligne.") } catch (e) { setToast((e as Error).message) } }
  const [sec, key] = route.split("/")
  const isEdit = sec === "c" && key in sections
  const title = route === "" ? "Tableau de bord" : sec === "demandes" ? "Demandes" : isEdit ? sections[key] : sec === "medias" ? "Médias" : sec === "parametres" ? "Notifications et compte" : "Page introuvable"
  const groups: [string, [string, string, any][]][] = [
    ["Pilotage", [["", "Tableau de bord", LayoutDashboard], ["demandes", "Demandes", Inbox]]],
    ["Contenu du site", Object.entries(sections).map(([k, l]) => [`c/${k}`, l, icons[k]] as [string, string, any])],
    ["Outils", [["medias", "Médias", Img], ["parametres", "Notifications et compte", Bell]]],
  ]
  const confirmNav = (e: React.MouseEvent) => { if (dirty && !confirm("Des modifications ne sont pas publiées. Quitter cette section quand même ?")) e.preventDefault() }
  return (
    <div className="admin flex min-h-screen bg-muted/60">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-primary text-primary-foreground transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`} aria-label="Menu latéral">
        <div className="flex h-16 items-center justify-between px-5"><img src="/brand/logo-horizontal-inverse.webp" alt="Sao Tech Agency" className="h-10 w-auto" /><button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="Fermer le menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {groups.map(([g, items]) => <div key={g}><p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground/45">{g}</p>
            {items.map(([r, l, I]) => { const on = route === r; return <a key={r} href={`#/${r}`} onClick={confirmNav} aria-current={on ? "page" : undefined} className={`mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${on ? "bg-white/15 text-white shadow-inner" : "text-primary-foreground/75 hover:bg-white/10 hover:text-white"}`}>{I && <I className="h-[18px] w-[18px] shrink-0" />}<span className="flex-1 truncate">{l}</span>{r === "demandes" && newCount > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{newCount}</span>}</a> })}</div>)}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4">
          {prompt && <Button variant="accent" className="w-full" onClick={() => { prompt.prompt(); setPrompt(null) }}><Download className="h-4 w-4" />Installer l'application</Button>}
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary-foreground/75 hover:bg-white/10"><ExternalLink className="h-4 w-4" />Voir le site</a>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 hover:bg-muted lg:hidden" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <h1 className="min-w-0 flex-1 truncate text-lg sm:text-xl">{title}</h1>
          {isEdit && <div role="group" aria-label="Langue du contenu" className="hidden overflow-hidden rounded-lg border text-sm font-semibold sm:flex">{(["fr", "en"] as const).map((l) => <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`px-3 py-2 ${lang === l ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{l === "fr" ? "Français" : "English"}</button>)}</div>}
          {isEdit && <div className="flex items-center gap-2">
            {dirty && <Button variant="outline" className="h-10 px-3" onClick={() => setC(JSON.parse(saved.current))} aria-label="Annuler les modifications"><Undo2 className="h-4 w-4" /><span className="hidden sm:inline">Annuler</span></Button>}
            <Button variant="accent" className="h-10" disabled={!dirty} onClick={publish}><Save className="h-4 w-4" /><span className="hidden sm:inline">Publier</span>{dirty && <span className="h-2 w-2 rounded-full bg-amber-300" aria-label="Modifications non publiées" />}</Button></div>}
          <a href="#/demandes" className="relative rounded-full p-2 hover:bg-muted" aria-label={`${newCount} nouvelle(s) demande(s)`}><Bell className="h-5 w-5" />{newCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{newCount}</span>}</a>
          <div className="flex items-center gap-2 border-l pl-3">
            {user.picture ? <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{(user.name || user.email)[0].toUpperCase()}</span>}
            <div className="hidden min-w-0 md:block"><p className="max-w-[160px] truncate text-sm font-semibold leading-tight">{user.name || user.email}</p><p className="max-w-[160px] truncate text-xs text-muted-foreground">{user.email}</p></div>
            <button className="rounded-lg p-2 hover:bg-muted" aria-label="Se déconnecter" onClick={onLogout}><LogOut className="h-5 w-5" /></button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
          {route === "" && <Dashboard />}
          {sec === "demandes" && <Requests onChange={poll} />}
          {isEdit && (tree ? <>{lang === "en" && <p className="mb-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">Vous modifiez la <strong>version anglaise</strong>, affichée aux visiteurs qui choisissent English. Les réglages et les réseaux sociaux restent communs.</p>}<Editor k={key} c={tree} setC={setTree} lang={lang} /></> : <p className="text-muted-foreground">Chargement…</p>)}
          {sec === "medias" && <Media />}
          {sec === "parametres" && <Settings user={user} onLogout={onLogout} install={prompt ? () => { prompt.prompt(); setPrompt(null) } : null} restored={() => { loadContent(); setToast("Version restaurée et publiée.") }} />}
          {route !== "" && !["demandes", "medias", "parametres"].includes(sec) && !isEdit && <p>Page introuvable. <a className="font-semibold text-accent" href="#/">Retour au tableau de bord</a></p>}
        </main>
      </div>
      {toast && <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-2xl" onAnimationEnd={() => {}}>{toast}<button className="ml-3 underline" onClick={() => setToast("")}>OK</button></div>}
    </div>
  )
}

export default function AdminApp() {
  const [user, setUser] = useState<any>(undefined)
  useEffect(() => { api("auth.php?a=me").then((r) => setUser(r.user)).catch(() => setUser(null)) }, [])
  useEffect(() => { const f = (e: PromiseRejectionEvent) => { if (e.reason instanceof AuthError) setUser(null) }; addEventListener("unhandledrejection", f); return () => removeEventListener("unhandledrejection", f) }, [])
  if (user === undefined) return <div className="admin flex min-h-screen items-center justify-center bg-primary text-primary-foreground">Chargement…</div>
  if (!user) return <Login onLogin={setUser} />
  return <Shell user={user} onLogout={() => api("auth.php?a=logout", {}).finally(() => setUser(null))} />
}
