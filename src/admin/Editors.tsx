import { Input, Textarea } from "@/components/ui/input"
import ListEditor from "./ListEditor"
import brands from "@/data/brand-icons.json"

const NETWORKS = ["", "linkedin", ...Object.keys(brands).sort()]

const L = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-xs font-semibold text-muted-foreground">{children}</label>
const H = ({ children }: { children: React.ReactNode }) => <h2 className="mb-3 mt-8 text-lg font-bold first:mt-0">{children}</h2>
const TT = [{ k: "titre", l: "Titre" }, { k: "texte", l: "Texte", t: "area" as const }]

export const sections: Record<string, string> = {
  infos: "Informations et réseaux sociaux", slides: "Carrousel de l'accueil", poles: "Pôles de services", offres: "Offres et tarifs", produits: "Produits SaaS", realisations: "Réalisations",
  partenaires: "Nos partenaires", partenariat: "Page partenariat", apropos: "Page À propos", pourquoi: "Pourquoi nous choisir", faq: "Questions fréquentes", blog: "Blog", seo: "Référencement (SEO)",
}

export default function Editor({ k, c, setC, lang = "fr" }: { k: string; c: any; setC: (c: any) => void; lang?: "fr" | "en" }) {
  const put = (key: string, v: any) => setC({ ...c, [key]: v })
  const putIn = (key: string, k2: string, v: any) => put(key, { ...c[key], [k2]: v })
  const ids = [...c.poles.map((p: any) => p.id), "conseil"]
  switch (k) {
    case "infos": if (lang === "en") return <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">Les informations de contact et les réseaux sociaux sont communs aux deux langues : modifiez-les depuis la version française.</p>; return (<div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[["phone", "Téléphone affiché"], ["whatsapp", "Numéro WhatsApp (chiffres, avec indicatif)"], ["email", "Email public"], ["address", "Adresse affichée"], ["mapQuery", "Lieu de la carte (nom ou adresse Google Maps)"]].map(([key, l]) => <div key={key}><L>{l}</L><Input value={c.settings[key] ?? ""} onChange={(e) => putIn("settings", key, e.target.value)} /></div>)}
      </div>
      <div className="mt-4 max-w-sm"><L>Bouton WhatsApp flottant sur toutes les pages</L><select className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm" value={c.settings.whatsappFloat ?? "oui"} onChange={(e) => putIn("settings", "whatsappFloat", e.target.value)}><option value="oui">Affiché</option><option value="non">Masqué</option></select></div>
      <H>Réseaux sociaux</H>
      <ListEditor items={c.socials} set={(v) => put("socials", v)} titleKey="nom" blank={{ nom: "", url: "", icone: "", logo: "" }} fields={[{ k: "nom", l: "Nom du réseau (Facebook, Telegram, YouTube…)" }, { k: "url", l: "Lien de la page" }, { k: "icone", l: "Icône (laissez « automatique » : le réseau est reconnu par son nom ou son lien)", t: "select", o: NETWORKS }, { k: "logo", l: "Ou votre propre icône (image carrée, remplace l'icône ci-dessus)", t: "img" }]} />
    </div>)
    case "slides": return <ListEditor items={c.slides} set={(v) => put("slides", v)} titleKey="titre" blank={{ img: "/img/hero-1.webp", kicker: "", titre: "", texte: "", lien: "/offres", label: "Voir les offres" }} fields={[{ k: "img", l: "Image de fond", t: "img" }, { k: "kicker", l: "Sur-titre" }, { k: "titre", l: "Titre" }, { k: "texte", l: "Texte", t: "area" }, { k: "label", l: "Texte du bouton" }, { k: "lien", l: "Lien du bouton" }]} />
    case "poles": return <ListEditor items={c.poles} set={(v) => put("poles", v)} titleKey="nom" blank={{ id: "nouveau", verbe: "", nom: "", img: "", texte: "", services: [] }} fields={[{ k: "id", l: "Identifiant (sans espace, lié aux offres)" }, { k: "verbe", l: "Verbe (Créer…)" }, { k: "nom", l: "Nom du pôle" }, { k: "img", l: "Image", t: "img" }, { k: "texte", l: "Description", t: "area" }, { k: "services", l: "Services", t: "lines" }]} />
    case "offres": return <ListEditor items={c.offres} set={(v) => put("offres", v)} titleKey="name" blank={{ pole: ids[0], name: "", price: "", unit: "", badge: "", feats: [] }} fields={[{ k: "pole", l: "Pôle", t: "select", o: ids }, { k: "name", l: "Nom du plan" }, { k: "price", l: "Prix (ex. 80 $)" }, { k: "unit", l: "Unité (ex. / an)" }, { k: "badge", l: "Badge (optionnel)" }, { k: "feats", l: "Contenu du plan", t: "lines" }]} />
    case "produits": return <ListEditor items={c.produits} set={(v) => put("produits", v)} titleKey="nom" blank={{ nom: "", statut: "En développement", tagline: "", desc: "", features: [], url: "" }} fields={[{ k: "nom", l: "Nom du produit" }, { k: "statut", l: "Statut", t: "select", o: ["Idée", "En développement", "Bientôt disponible", "Disponible"] }, { k: "tagline", l: "Phrase d'accroche" }, { k: "desc", l: "Description", t: "area" }, { k: "features", l: "Fonctionnalités", t: "lines" }, { k: "url", l: "Lien vers le produit en ligne (la carte devient cliquable ; laissez vide tant qu'il n'est pas disponible)" }]} />
    case "realisations": return <ListEditor items={c.realisations} set={(v) => put("realisations", v)} titleKey="nom" blank={{ nom: "", desc: "", livre: "", logo: "", url: "" }} fields={[{ k: "nom", l: "Client" }, { k: "desc", l: "Description du client" }, { k: "livre", l: "Ce que nous avons réalisé" }, { k: "url", l: "Lien du projet réalisé (la carte devient cliquable ; laissez vide s'il n'y en a pas)" }, { k: "logo", l: "Logo", t: "img" }]} />
    case "partenaires": return <ListEditor items={c.partenaires} set={(v) => put("partenaires", v)} titleKey="nom" blank={{ nom: "", logo: "", url: "", desc: "" }} fields={[{ k: "nom", l: "Nom" }, { k: "desc", l: "Secteur ou précision" }, { k: "url", l: "Site web (optionnel)" }, { k: "logo", l: "Logo", t: "img" }]} />
    case "partenariat": return (<div>
      <L>Introduction</L><Textarea value={c.partenariat.intro} onChange={(e) => putIn("partenariat", "intro", e.target.value)} />
      {[["avantages", "Avantages d'un partenariat"], ["types", "Formes de partenariat"], ["etapes", "Étapes"]].map(([key, l]) => <div key={key}><H>{l}</H><ListEditor items={c.partenariat[key]} set={(v) => putIn("partenariat", key, v)} titleKey="titre" blank={{ titre: "", texte: "" }} fields={TT} /></div>)}
      <H>Questions fréquentes</H><ListEditor items={c.partenariat.faq} set={(v) => putIn("partenariat", "faq", v)} titleKey="q" blank={{ q: "", a: "" }} fields={[{ k: "q", l: "Question" }, { k: "a", l: "Réponse", t: "area" }]} />
    </div>)
    case "apropos": return (<div>
      <L>Introduction</L><Textarea value={c.apropos.intro} onChange={(e) => putIn("apropos", "intro", e.target.value)} />
      {[["blocs", "Mission, vision, objectif"], ["principes", "Principes"], ["publics", "Qui nous accompagnons"]].map(([key, l]) => <div key={key}><H>{l}</H><ListEditor items={c.apropos[key]} set={(v) => putIn("apropos", key, v)} titleKey="titre" blank={{ titre: "", texte: "" }} fields={TT} /></div>)}
    </div>)
    case "pourquoi": return <ListEditor items={c.pourquoi} set={(v) => put("pourquoi", v)} titleKey="titre" blank={{ titre: "", texte: "" }} fields={TT} />
    case "faq": return <ListEditor items={c.faq} set={(v) => put("faq", v)} titleKey="q" blank={{ q: "", a: "" }} fields={[{ k: "q", l: "Question" }, { k: "a", l: "Réponse", t: "area" }]} />
    case "blog": return <ListEditor items={c.blog.topics} set={(v) => putIn("blog", "topics", v)} titleKey="titre" blank={{ titre: "", texte: "" }} fields={TT} label="Ajouter un thème" />
    case "seo": return (<div className="space-y-4">
      <div><L>Adresse du site (sans « / » final)</L><Input value={c.seo.site} onChange={(e) => putIn("seo", "site", e.target.value)} /></div>
      {Object.entries(c.seo.routes as Record<string, { title: string; description: string }>).map(([path, m]) => {
        const upd = (f: string, v: string) => putIn("seo", "routes", { ...c.seo.routes, [path]: { ...m, [f]: v } })
        const t = m.title.length, d = m.description.length
        return (<div key={path} className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="mb-3 font-mono text-sm font-semibold text-accent">{path}</p>
          <L>Titre <span className={t > 60 ? "text-red-600" : "text-emerald-600"}>({t}/60)</span></L><Input value={m.title} onChange={(e) => upd("title", e.target.value)} />
          <div className="mt-3"><L>Description <span className={d > 160 ? "text-red-600" : "text-emerald-600"}>({d}/160)</span></L><Textarea value={m.description} onChange={(e) => upd("description", e.target.value)} /></div>
        </div>)
      })}
    </div>)
  }
  return null
}
