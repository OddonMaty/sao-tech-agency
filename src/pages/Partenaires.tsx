import { useState } from "react"
import { Building2, Globe, Handshake, Mail, MapPin, MessageCircle, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PageHero from "@/components/PageHero"
import { Field, Status, useSend } from "@/components/Field"
import { wa } from "@/data/site"
import { useI18n } from "@/lib/i18n"

export default function Partenaires() {
  const { content, lang } = useI18n()
  const P = content.partenariat
  const [f, setF] = useState({ name: "", org: "", email: "", phone: "", location: "", subject: P.types[0]?.titre ?? "", message: "", website: "" })
  const { state, error, send } = useSend()
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })
  const ic = "h-11 rounded-lg pl-10"

  return (
    <>
      <PageHero
        img="/img/hero-4.webp"
        kicker={lang === "en" ? "Partnerships" : "Partenariats"}
        titre={lang === "en" ? "Building the Future Together" : "Construisons ensemble"}
        texte={P.intro}
        btns={[
          { label: lang === "en" ? "Become a Partner" : "Devenir partenaire", href: "#demande" },
          { label: lang === "en" ? "Our Partners" : "Voir nos partenaires", href: "#partenaires", outline: true }
        ]}
      />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{lang === "en" ? "Why Partner With Us" : "Pourquoi s'associer"}</p>
        <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">{lang === "en" ? "What Our Partnership Brings You" : "Ce qu'un partenariat vous apporte"}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {P.avantages.map((a, k) => (
            <div key={k} className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Handshake className="h-6 w-6" /></span>
              <h3 className="mt-4 text-lg">{a.titre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brandlight">{lang === "en" ? "Partnership Models" : "Formes de partenariat"}</p>
          <h2 className="max-w-2xl text-3xl leading-tight md:text-4xl">{lang === "en" ? "What Type of Partner Are You?" : "Quel partenaire êtes-vous ?"}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {P.types.map((t, k) => (
              <div key={k} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-6">
                <h3 className="text-xl text-brandlight">{t.titre}</h3>
                <p className="mt-2 text-primary-foreground/80">{t.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{lang === "en" ? "How It Works" : "Comment ça marche"}</p>
        <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">{lang === "en" ? "A Simple Process in Three Steps" : "Un processus simple, en trois étapes"}</h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {P.etapes.map((e, k) => (
            <li key={k} className="relative overflow-hidden rounded-2xl border bg-card p-7 shadow-sm">
              <span className="pointer-events-none absolute -right-1 -top-5 font-display text-8xl text-accent/10">{k + 1}</span>
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-xl text-accent-foreground">{k + 1}</span>
              <h3 className="relative mt-5 text-xl">{e.titre}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{e.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="partenaires" className="scroll-mt-20 border-t bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{lang === "en" ? "Ecosystem" : "Écosystème"}</p>
          <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">{lang === "en" ? "Our Network of Partners" : "Nos partenaires"}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.partenaires.map((p, k) => (
              <div key={k} className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                <img src={p.logo} alt="" className="h-12 w-12 rounded-lg object-contain" />
                <div>
                  <h3 className="font-semibold">{p.nom}</h3>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demande" className="scroll-mt-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl">{lang === "en" ? "Apply for a Partnership" : "Proposer un partenariat"}</h2>
            <p className="mt-3 text-primary-foreground/80">{lang === "en" ? "Tell us about your organization and how we can collaborate." : "Présentez-nous votre organisation et vos perspectives de collaboration."}</p>
          </div>
          <form className="mt-10 grid gap-4 rounded-2xl bg-card p-7 text-card-foreground shadow-2xl" onSubmit={(e) => { e.preventDefault(); send({ type: "partenariat", ...f }) }}>
            <input aria-hidden tabIndex={-1} autoComplete="off" name="website" value={f.website} onChange={set("website")} className="absolute -left-[9999px]" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="pa-nom" label={lang === "en" ? "Contact Name" : "Nom"} icon={User}><Input id="pa-nom" required className={ic} value={f.name} onChange={set("name")} /></Field>
              <Field id="pa-org" label={lang === "en" ? "Organization" : "Organisation"} icon={Building2}><Input id="pa-org" required className={ic} value={f.org} onChange={set("org")} /></Field>
              <Field id="pa-mail" label={lang === "en" ? "Email Address" : "Email"} icon={Mail}><Input id="pa-mail" type="email" required className={ic} value={f.email} onChange={set("email")} /></Field>
              <Field id="pa-tel" label={lang === "en" ? "Phone / WhatsApp" : "Téléphone / WhatsApp"} icon={Phone}><Input id="pa-tel" type="tel" className={ic} value={f.phone} onChange={set("phone")} /></Field>
            </div>
            <Field id="pa-lieu" label={lang === "en" ? "Location (City, Country)" : "Localisation (Ville, Pays)"} icon={MapPin}><Input id="pa-lieu" required className={ic} value={f.location} onChange={set("location")} /></Field>
            <Field id="pa-sub" label={lang === "en" ? "Partnership type" : "Type de partenariat"}>
              <Select id="pa-sub" className="h-11 rounded-lg" value={f.subject} onChange={set("subject")}>
                {P.types.map((t) => <option key={t.titre}>{t.titre}</option>)}
              </Select>
            </Field>
            <Field id="pa-msg" label={lang === "en" ? "Describe your collaboration proposal" : "Votre proposition de collaboration"}><Textarea id="pa-msg" required className="min-h-[120px] rounded-lg" value={f.message} onChange={set("message")} /></Field>
            <Button type="submit" variant="accent" size="lg" disabled={state === "sending"}>
              {state === "sending" ? (lang === "en" ? "Sending proposal..." : "Envoi en cours…") : (lang === "en" ? "Submit Partnership Proposal" : "Envoyer la proposition")}
            </Button>
            <Status state={state} error={error} />
          </form>
        </div>
      </section>

      <section className="border-t bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="text-2xl md:text-3xl">{lang === "en" ? "Partnership FAQ" : "Questions fréquentes"}</h2>
          <Accordion type="single" collapsible className="mt-6">
            {P.faq.map((q, i) => (
              <AccordionItem key={i} value={`p${i}`}>
                <AccordionTrigger>{q.q}</AccordionTrigger>
                <AccordionContent>{q.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
