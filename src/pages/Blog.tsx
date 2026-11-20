import { useState } from "react"
import { Mail, User, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageHero from "@/components/PageHero"
import { Field, Status, useSend } from "@/components/Field"
import { useI18n } from "@/lib/i18n"

export default function Blog() {
  const { content, lang } = useI18n()
  const [f, setF] = useState({ name: "", email: "", website: "" })
  const { state, error, send } = useSend()
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  return (
    <>
      <PageHero
        img="/img/hero-2.webp"
        kicker={lang === "en" ? "Blog" : "Blog"}
        titre={lang === "en" ? "The Blog is Launching Soon" : "Le blog arrive bientôt"}
        texte={lang === "en" ? "Actionable guides on IT, digital marketing, and software tools to scale your business." : "Des articles clairs sur l'informatique, le marketing digital et les outils pour votre organisation."}
        btns={[
          { label: lang === "en" ? "Get Notified of First Article" : "Être prévenu du premier article", href: "#abonnement" },
          { label: lang === "en" ? "View Services" : "Voir nos offres", href: "/offres", outline: true }
        ]}
      />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{lang === "en" ? "What to Expect" : "Ce que vous y trouverez"}</p>
        <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">{lang === "en" ? "Four Key Themes to Master Technology" : "Quatre thèmes pour mieux comprendre le numérique"}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.blog.topics.map((t, k) => (
            <div key={k} className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary text-white"><BookOpen className="h-6 w-6" /></span>
              <h3 className="mt-4 text-lg">{t.titre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.texte}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="abonnement" className="scroll-mt-20 bg-muted">
        <div className="mx-auto max-w-xl px-5 py-20">
          <h2 className="text-center text-3xl md:text-4xl">{lang === "en" ? "Be Notified on Launch" : "Soyez prévenu du premier article"}</h2>
          <form className="relative mt-8 grid gap-4 rounded-2xl bg-card p-6 shadow-xl" onSubmit={(e) => { e.preventDefault(); send({ type: "contact", name: f.name, email: f.email, website: f.website, subject: "Abonnement blog", message: "Je souhaite être prévenu des nouveaux articles du blog." }) }}>
            <input aria-hidden tabIndex={-1} autoComplete="off" name="website" value={f.website} onChange={set("website")} className="absolute -left-[9999px]" />
            <Field id="b-name" label={lang === "en" ? "First Name" : "Prénom"} icon={User}><Input id="b-name" required className="h-11 rounded-lg pl-10" value={f.name} onChange={set("name")} /></Field>
            <Field id="b-email" label={lang === "en" ? "Email Address" : "Email"} icon={Mail}><Input id="b-email" type="email" required className="h-11 rounded-lg pl-10" value={f.email} onChange={set("email")} /></Field>
            <Button type="submit" variant="accent" size="lg" disabled={state === "sending"}>
              {state === "sending" ? (lang === "en" ? "Sending..." : "Envoi…") : (lang === "en" ? "Notify Me" : "Me prévenir")}
            </Button>
            <Status state={state} error={error} />
          </form>
        </div>
      </section>
    </>
  )
}
