import { useState } from "react"
import { Building2, Globe, Handshake, Mail, MapPin, MessageCircle, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PageHero from "@/components/PageHero"
import { Field, Status, useSend } from "@/components/Field"
import { wa } from "@/data/site"
import { content } from "@/lib/content"

export default function Partenaires() {
  const P = content.partenariat
  const [f, setF] = useState({ name: "", org: "", email: "", phone: "", location: "", subject: P.types[0]?.titre ?? "", message: "", website: "" })
  const { state, error, send } = useSend()
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })
  const ic = "h-11 rounded-lg pl-10"
  return (
    <>
      <PageHero img="/img/hero-4.webp" kicker="Partenariats" titre="Construisons ensemble" texte={P.intro}
        btns={[{ label: "Devenir partenaire", href: "#demande" }, { label: "Voir nos partenaires", href: "#partenaires", outline: true }]} />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Pourquoi s'associer</p>
        <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">Ce qu'un partenariat vous apporte</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {P.avantages.map((a, k) => (
            <div key={k} className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Handshake className="h-6 w-6" /></span><h3 className="mt-4 text-lg">{a.titre}</h3><p className="mt-1 text-sm text-muted-foreground">{a.texte}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brandlight">Formes de partenariat</p>
          <h2 className="max-w-2xl text-3xl leading-tight md:text-4xl">Quel partenaire êtes-vous ?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {P.types.map((t, k) => <div key={k} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-6"><h3 className="text-xl text-brandlight">{t.titre}</h3><p className="mt-2 text-primary-foreground/80">{t.texte}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Comment ça marche</p>
        <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">Un processus simple, en trois étapes</h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {P.etapes.map((e, k) => (
            <li key={k} className="relative overflow-hidden rounded-2xl border bg-card p-7 shadow-sm"><span className="pointer-events-none absolute -right-1 -top-5 font-display text-8xl text-accent/10">{k + 1}</span><span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-xl text-accent-foreground">{k + 1}</span><h3 className="relative mt-5 text-xl">{e.titre}</h3><p className="relative mt-2 text-sm text-muted-foreground">{e.texte}</p></li>
          ))}
        </ol>
      </section>

      <section id="partenaires" className="scroll-mt-20 bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Nos partenaires</p>
          <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">Ils collaborent avec nous</h2>
          <ul className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {content.partenaires.map((p, k) => {
              const inner = <><div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-3">{p.logo ? <img src={p.logo} alt={`Logo ${p.nom}`} loading="lazy" className="max-h-full w-auto max-w-full object-contain" /> : <Globe className="h-8 w-8 text-muted-foreground" />}</div><p className="mt-3 text-sm font-bold leading-tight">{p.nom}</p>{p.desc && <p className="text-xs text-muted-foreground">{p.desc}</p>}</>
              return <li key={k} className="rounded-xl border bg-card p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">{inner}</a> : inner}</li>
            })}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-3xl md:text-4xl">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="mt-6">{P.faq.map((q, i) => <AccordionItem key={i} value={`q${i}`}><AccordionTrigger>{q.q}</AccordionTrigger><AccordionContent>{q.a}</AccordionContent></AccordionItem>)}</Accordion>
      </section>

      <section id="demande" className="scroll-mt-20 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brandlight">Demande de partenariat</p>
            <h2 className="text-3xl leading-tight md:text-4xl">Parlons de ce que nous pouvons faire ensemble</h2>
            <p className="mt-4 text-primary-foreground/80">Présentez votre organisation et le type de partenariat qui vous intéresse. Votre demande nous arrive par email ; vous pouvez aussi nous écrire sur WhatsApp.</p>
            <Button asChild variant="outline" size="lg" className="mt-6 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href={wa("Bonjour, je voudrais discuter d'un partenariat avec Sao Tech Agency.")}><MessageCircle className="h-5 w-5" />Écrire sur WhatsApp</a></Button>
          </div>
          <form className="relative grid gap-4 rounded-2xl bg-card p-6 text-card-foreground shadow-xl sm:p-8" onSubmit={(e) => { e.preventDefault(); send({ type: "partenariat", ...f }) }}>
            <input aria-hidden tabIndex={-1} autoComplete="off" name="website" value={f.website} onChange={set("website")} className="absolute -left-[9999px]" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="pa-name" label="Nom complet" icon={User}><Input id="pa-name" required className={ic} value={f.name} onChange={set("name")} /></Field>
              <Field id="pa-org" label="Organisation" icon={Building2}><Input id="pa-org" required className={ic} value={f.org} onChange={set("org")} /></Field>
              <Field id="pa-email" label="Email" icon={Mail}><Input id="pa-email" type="email" required className={ic} value={f.email} onChange={set("email")} /></Field>
              <Field id="pa-phone" label="Téléphone (optionnel)" icon={Phone}><Input id="pa-phone" type="tel" className={ic} value={f.phone} onChange={set("phone")} /></Field>
              <Field id="pa-loc" label="Ville ou pays" icon={MapPin}><Input id="pa-loc" required className={ic} value={f.location} onChange={set("location")} /></Field>
              <Field id="pa-type" label="Type de partenariat"><Select id="pa-type" className="h-11 rounded-lg" value={f.subject} onChange={set("subject")}>{P.types.map((t) => <option key={t.titre}>{t.titre}</option>)}<option>Autre</option></Select></Field>
            </div>
            <Field id="pa-msg" label="Votre proposition"><Textarea id="pa-msg" required minLength={5} className="min-h-[130px] rounded-lg" value={f.message} onChange={set("message")} /></Field>
            <Button type="submit" variant="accent" size="lg" disabled={state === "sending"} className="w-full sm:w-fit"><Mail className="h-5 w-5" />{state === "sending" ? "Envoi…" : "Envoyer ma demande"}</Button>
            <Status state={state} error={error} />
          </form>
        </div>
      </section>
    </>
  )
}
