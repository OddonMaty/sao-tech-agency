import { useState } from "react"
import { Boxes, FileText, GraduationCap, Users, Check, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import PageHero from "@/components/PageHero"
import { Field, Status, useSend } from "@/components/Field"
import { wa } from "@/data/site"
import { useI18n } from "@/lib/i18n"

const icons = [FileText, Users, Boxes, GraduationCap]

export default function Produits() {
  const { content, lang } = useI18n()
  const [f, setF] = useState({ name: "", email: "", subject: content.produits[0]?.nom ?? "", message: "", website: "" })
  const { state, error, send } = useSend()
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  return (
    <>
      <PageHero
        img="/img/hero-1.webp"
        kicker={lang === "en" ? "Productivity Software" : "Produits de productivité"}
        titre={lang === "en" ? "Everyday Business Tools, Coming Soon" : "Les outils du quotidien, bientôt disponibles"}
        texte={lang === "en" ? "Invoicing, CRM, inventory, training: we design simple, reliable software tailored for local African businesses." : "Facturation, clients, stock, formation : nous concevons des outils simples, pensés pour la réalité des organisations de la région."}
        btns={[
          { label: lang === "en" ? "Join Launch Waitlist" : "Être prévenu du lancement", href: "#liste" },
          { label: lang === "en" ? "Suggest a Feature" : "Proposer une idée", href: wa("Bonjour, j'ai une idée d'outil à vous proposer."), outline: true }
        ]}
      />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{lang === "en" ? "Currently in Development" : "En cours de conception"}</p>
        <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">{lang === "en" ? "Software Built to Save You Time" : "Une gamme d'outils pour gagner du temps"}</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{lang === "en" ? "Our software suite is in active development. Features below are indicative and will evolve ahead of commercial release." : "Nos produits sont en développement. Les fonctionnalités ci-dessous sont indicatives et peuvent évoluer avant le lancement."}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {content.produits.map((p, k) => {
            const I = icons[k % icons.length]
            return (
              <article key={k} className="group relative overflow-hidden rounded-2xl border bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-lg"><I className="h-6 w-6" /></span>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">{p.statut}</span>
                </div>
                <h3 className="mt-5 text-2xl">{p.nom}</h3>
                <p className="mt-1 font-semibold text-primary">{p.tagline}</p>
                <p className="mt-3 text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">{p.features.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{x}</li>)}</ul>
              </article>
            )
          })}
        </div>
      </section>
      <section id="liste" className="scroll-mt-20 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brandlight">{lang === "en" ? "Priority Waitlist" : "Liste d'attente"}</p>
            <h2 className="text-3xl leading-tight md:text-4xl">{lang === "en" ? "Be the First to Know" : "Soyez les premiers prévenus"}</h2>
            <p className="mt-4 text-primary-foreground/80">{lang === "en" ? "Enter your email and product of interest: we will notify you upon launch, strictly zero spam." : "Indiquez votre email et le produit qui vous intéresse : nous vous écrivons dès son lancement, sans spam."}</p>
          </div>
          <form className="relative grid gap-4 rounded-2xl bg-card p-6 text-card-foreground shadow-xl" onSubmit={(e) => { e.preventDefault(); send({ type: "produit", ...f }) }}>
            <input aria-hidden tabIndex={-1} autoComplete="off" name="website" value={f.website} onChange={set("website")} className="absolute -left-[9999px]" />
            <Field id="p-name" label={lang === "en" ? "Name" : "Nom"} icon={User}><Input id="p-name" required className="h-11 rounded-lg pl-10" value={f.name} onChange={set("name")} /></Field>
            <Field id="p-email" label={lang === "en" ? "Email" : "Email"} icon={Mail}><Input id="p-email" type="email" required className="h-11 rounded-lg pl-10" value={f.email} onChange={set("email")} /></Field>
            <Field id="p-sub" label={lang === "en" ? "Product of interest" : "Produit qui vous intéresse"}>
              <Select id="p-sub" className="h-11 rounded-lg" value={f.subject} onChange={set("subject")}>
                {content.produits.map((p) => <option key={p.nom}>{p.nom}</option>)}
                <option>{lang === "en" ? "Multiple products" : "Plusieurs produits"}</option>
              </Select>
            </Field>
            <Field id="p-msg" label={lang === "en" ? "Specific requirement? (optional)" : "Un besoin précis ? (optionnel)"}><Textarea id="p-msg" className="min-h-[90px] rounded-lg" value={f.message} onChange={set("message")} /></Field>
            <Button type="submit" variant="accent" size="lg" disabled={state === "sending"}>
              {state === "sending" ? (lang === "en" ? "Submitting..." : "Envoi…") : (lang === "en" ? "Notify Me at Launch" : "Me prévenir du lancement")}
            </Button>
            <Status state={state} error={error} />
          </form>
        </div>
      </section>
    </>
  )
}
