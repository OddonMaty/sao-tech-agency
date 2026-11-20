import { useEffect } from "react"
import Layout from "@/components/Layout"
import { usePath } from "@/lib/router"
import { I18nProvider, useI18n } from "@/lib/i18n"
import Accueil from "@/pages/Accueil"
import Offres from "@/pages/Offres"
import Realisations from "@/pages/Realisations"
import APropos from "@/pages/APropos"
import Contact from "@/pages/Contact"
import Produits from "@/pages/Produits"
import Partenaires from "@/pages/Partenaires"
import Blog from "@/pages/Blog"
import { Conditions, Confidentialite, Cookies } from "@/pages/Legal"
import extra from "@/data/seo-extra.json"
import { registerWebMcp } from "@/lib/webmcp"
import NotFound from "@/pages/NotFound"

const pages: Record<string, React.ReactElement> = {
  "/": <Accueil />,
  "/offres": <Offres />,
  "/produits": <Produits />,
  "/realisations": <Realisations />,
  "/partenaires": <Partenaires />,
  "/blog": <Blog />,
  "/a-propos": <APropos />,
  "/contact": <Contact />,
  "/conditions": <Conditions />,
  "/confidentialite": <Confidentialite />,
  "/cookies": <Cookies />,
  // English aliases
  "/about": <APropos />,
  "/services": <Offres />,
  "/pricing": <Offres />,
  "/portfolio": <Realisations />,
  "/partners": <Partenaires />,
  "/terms": <Conditions />,
  "/privacy": <Confidentialite />,
  "/legal": <Conditions />,
}

type Meta = { title: string; description: string }
const setMeta = (sel: string, attr: string, val: string) => document.querySelector(sel)?.setAttribute(attr, val)

function AppContent() {
  useEffect(() => { registerWebMcp() }, [])
  const { content, lang } = useI18n()
  const rawPath = usePath().replace(/\/+$/, "") || "/"
  const aliasMap: Record<string, string> = {
    "/about": "/a-propos",
    "/services": "/offres",
    "/pricing": "/offres",
    "/portfolio": "/realisations",
    "/partners": "/partenaires",
    "/terms": "/conditions",
    "/privacy": "/confidentialite",
    "/legal": "/conditions",
  }
  const path = aliasMap[rawPath] ?? rawPath
  const known = path in pages
  const routes = { ...extra, ...content.seo.routes } as Record<string, Meta>
  const m = routes[known ? path : "/"]

  useEffect(() => {
    const url = content.seo.site + (path === "/" ? "/" : path)
    document.title = known ? m.title : (lang === "en" ? "Page Not Found | Sao Tech Agency" : "Page introuvable | Sao Tech Agency")
    setMeta('meta[name="description"]', "content", m.description)
    setMeta('link[rel="canonical"]', "href", known ? url : content.seo.site + "/")
    setMeta('meta[property="og:title"]', "content", m.title)
    setMeta('meta[property="og:description"]', "content", m.description)
    setMeta('meta[property="og:url"]', "content", url)
    document.querySelectorAll('meta[name="robots"]').forEach((e) => e.remove())
    if (!known) { const r = document.createElement("meta"); r.name = "robots"; r.content = "noindex"; document.head.appendChild(r) }
  }, [path, known, m, lang, content])

  return <Layout path={path}>{known ? pages[path] : <NotFound />}</Layout>
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}
