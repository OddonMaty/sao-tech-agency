import { useEffect } from "react"
import Layout from "@/components/Layout"
import { usePath } from "@/lib/router"
import { content } from "@/lib/content"
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
  "/": <Accueil />, "/offres": <Offres />, "/produits": <Produits />, "/realisations": <Realisations />, "/partenaires": <Partenaires />,
  "/blog": <Blog />, "/a-propos": <APropos />, "/contact": <Contact />, "/conditions": <Conditions />, "/confidentialite": <Confidentialite />, "/cookies": <Cookies />,
}
type Meta = { title: string; description: string }
const setMeta = (sel: string, attr: string, val: string) => document.querySelector(sel)?.setAttribute(attr, val)

export default function App() {
  useEffect(() => { registerWebMcp() }, [])
  const path = usePath().replace(/\/+$/, "") || "/"
  const known = path in pages
  const routes = { ...extra, ...content.seo.routes } as Record<string, Meta>
  const m = routes[known ? path : "/"]
  useEffect(() => {
    const url = content.seo.site + (path === "/" ? "/" : path)
    document.title = known ? m.title : "Page introuvable | Sao Tech Agency"
    setMeta('meta[name="description"]', "content", m.description)
    setMeta('link[rel="canonical"]', "href", known ? url : content.seo.site + "/")
    setMeta('meta[property="og:title"]', "content", m.title)
    setMeta('meta[property="og:description"]', "content", m.description)
    setMeta('meta[property="og:url"]', "content", url)
    document.querySelectorAll('meta[name="robots"]').forEach((e) => e.remove())
    if (!known) { const r = document.createElement("meta"); r.name = "robots"; r.content = "noindex"; document.head.appendChild(r) }
  }, [path, known, m])
  return <Layout path={path}>{known ? pages[path] : <NotFound />}</Layout>
}
