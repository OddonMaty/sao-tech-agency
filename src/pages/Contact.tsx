import { useRef, useState } from "react"
import { Building2, Mail, MapPin, MessageCircle, Phone, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import PageHero from "@/components/PageHero"
import Social from "@/components/Social"
import { Field, Status, useSend } from "@/components/Field"
import { wa } from "@/data/site"
import { useI18n } from "@/lib/i18n"

export default function Contact() {
  const { content, lang, t } = useI18n()
  const s = content.settings
  const unsureText = lang === "en" ? "Not sure yet (Advisory Session)" : "Je ne sais pas encore (Session Conseil)"
  const pole = [...content.poles.map((p: any) => `${p.nom} — ${p.verbe}`), unsureText]
  const plan = new URLSearchParams(typeof location !== "undefined" ? location.search : "").get("plan") ?? ""
  const [f, setF] = useState({
    name: "",
    org: "",
    email: "",
    phone: "",
    location: "",
    subject: pole[0],
    budget: "",
    message: plan ? (lang === "en" ? `I am interested in the ${plan}. ` : `Je suis intéressé par le ${plan}. `) : "",
    website: ""
  })
  const { state, error, send } = useSend()
  const form = useRef<HTMLFormElement>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  const msgWa = () => {
    if (lang === "en") {
      return `Hello, I am ${f.name} (${f.org}), from ${f.location}.\nService: ${f.subject}${plan ? `\nPlan: ${plan}` : ""}\nEstimated budget: ${f.budget || "to discuss"}\nContact: ${f.email}${f.phone ? " / " + f.phone : ""}\n\nProject brief: ${f.message}`
    }
    return `Bonjour, je suis ${f.name} (${f.org}), de ${f.location}.\nPôle : ${f.subject}${plan ? `\nPlan : ${plan}` : ""}\nBudget estimé : ${f.budget || "à discuter"}\nContact : ${f.email}${f.phone ? " / " + f.phone : ""}\n\nMon projet : ${f.message}`
  }

  const ic = "h-11 rounded-lg pl-10"

  return (
    <>
      <PageHero
        img="/img/hero-contact.webp"
        kicker={t("contact.hero_kicker")}
        titre={t("contact.hero_titre")}
        texte={t("contact.hero_texte")}
        btns={[
          { label: lang === "en" ? "Message on WhatsApp" : "Écrire sur WhatsApp", href: wa("Bonjour !") },
          { label: lang === "en" ? "Call" : "Appeler", href: `tel:${s.phone.replace(/\s/g, "")}`, outline: true },
          { label: lang === "en" ? "Map Location" : "Voir la carte", href: "#carte", outline: true }
        ]}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.5fr_1fr]">
        <form
          {...({
            toolname: "request_quote",
            tooldescription: "Envoyer une demande de devis à Sao Tech Agency (nom, organisation, email, ville, pôle et description du projet)."
          } as object)}
          ref={form}
          onSubmit={(e) => {
            e.preventDefault()
            send({ type: "devis", plan, ...f })
          }}
          className="relative overflow-hidden rounded-2xl border bg-card shadow-xl"
        >
          <input aria-hidden tabIndex={-1} autoComplete="off" name="website" value={f.website} onChange={set("website")} className="absolute -left-[9999px]" />
          <div className="bg-primary px-6 py-6 text-primary-foreground sm:px-8">
            <h2 className="text-2xl">{t("contact.form_titre")}</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">{t("contact.form_sub")}</p>
          </div>
          <div className="grid gap-5 p-6 sm:p-8">
            {plan && <p className="rounded-lg bg-accent/10 p-3 text-sm font-semibold">{lang === "en" ? "Selected plan: " : "Plan choisi : "} {plan}</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="nom" label={t("contact.name")} icon={User}><Input id="nom" required className={ic} value={f.name} onChange={set("name")} /></Field>
              <Field id="org" label={t("contact.org")} icon={Building2}><Input id="org" required className={ic} value={f.org} onChange={set("org")} /></Field>
              <Field id="email" label={t("contact.email")} icon={Mail}><Input id="email" type="email" required className={ic} value={f.email} onChange={set("email")} /></Field>
              <Field id="tel" label={t("contact.phone")} icon={Phone}><Input id="tel" type="tel" placeholder="+243 …" className={ic} value={f.phone} onChange={set("phone")} /></Field>
              <Field id="lieu" label={t("contact.location")} icon={MapPin}><Input id="lieu" required className={ic} value={f.location} onChange={set("location")} /></Field>
              <Field id="budget" label={t("contact.budget")} icon={Wallet}><Input id="budget" placeholder="Ex. 300 $" className={ic} value={f.budget} onChange={set("budget")} /></Field>
            </div>
            <Field id="pole" label={t("contact.pole_select")}><Select id="pole" className="h-11 rounded-lg" value={f.subject} onChange={set("subject")}>{pole.map((p) => <option key={p}>{p}</option>)}</Select></Field>
            <Field id="msg" label={t("contact.message")}><Textarea id="msg" required minLength={5} className="min-h-[140px] rounded-lg" value={f.message} onChange={set("message")} /></Field>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="accent" size="lg" disabled={state === "sending"}>
                <Mail className="h-5 w-5" />{state === "sending" ? t("contact.sending") : t("contact.send")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  if (form.current?.reportValidity()) window.open(wa(msgWa()), "_blank", "noopener")
                }}
              >
                <MessageCircle className="h-5 w-5" />{lang === "en" ? "Send on WhatsApp" : "Envoyer sur WhatsApp"}
              </Button>
            </div>
            <Status state={state} error={error} />
            <p className="text-xs text-muted-foreground">
              {lang === "en" ? (
                <>This brief constitutes neither an order nor a payment. Your data is handled in accordance with our <a href="/confidentialite" rel="privacy-policy" className="underline">privacy policy</a>.</>
              ) : (
                <>Ce brief ne constitue ni une commande ni un paiement. Vos données sont traitées selon notre <a href="/confidentialite" rel="privacy-policy" className="underline">politique de confidentialité</a>.</>
              )}
            </p>
          </div>
        </form>
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-card p-7 shadow-sm">
            <h2 className="text-2xl">{lang === "en" ? "Get in Touch" : "Nous joindre"}</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-accent" /><a href={wa("Bonjour !")} className="font-semibold hover:text-accent">WhatsApp : {s.phone}</a></li>
              {s.email && <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-accent" /><a href={`mailto:${s.email}`} className="break-all font-semibold hover:text-accent">{s.email}</a></li>}
              <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-accent" /><span>Sao Tech Agency (STA SARL)<br />{s.address}</span></li>
            </ul>
            <p className="mt-7 text-sm font-semibold">{lang === "en" ? "Follow Us" : "Suivez-nous"}</p>
            <div className="mt-3"><Social className="bg-primary text-primary-foreground hover:bg-accent" /></div>
          </div>
        </aside>
      </section>
    </>
  )
}
