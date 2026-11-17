import { Building2, Handshake, Landmark, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/PageHero"
import Pourquoi from "@/components/Pourquoi"
import { wa } from "@/data/site"
import { content } from "@/lib/content"

const publicIcons = [Building2, Handshake, Users, Landmark]

export default function APropos() {
  const a = content.apropos
  return (
    <>
      <PageHero img="/img/hero-apropos.webp" kicker="À propos" titre="L'excellence technologique au service de l'Afrique" texte="Une agence digitale basée à Uvira, qui rend la technologie simple et utile pour les organisations de la région."
        btns={[{ label: "Nous écrire sur WhatsApp", href: wa("Bonjour, je voudrais en savoir plus sur Sao Tech Agency.") }, { label: "Voir nos réalisations", href: "/realisations", outline: true }]} />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">{a.intro}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {a.blocs.map((b, k) => <div key={k} className="rounded-xl border border-t-4 border-t-accent bg-card p-7 shadow-sm"><h2 className="text-2xl">{b.titre}</h2><p className="mt-3 text-muted-foreground">{b.texte}</p></div>)}
        </div>
      </section>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brandlight">Nos principes</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl">Ce qui guide chacun de nos projets</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {a.principes.map((p, k) => <div key={k} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-5"><h3 className="text-xl text-brandlight">{p.titre}</h3><p className="mt-2 text-sm text-primary-foreground/80">{p.texte}</p></div>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Qui nous accompagnons</p>
        <h2 className="max-w-2xl text-3xl md:text-4xl">Des organisations de toutes tailles</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {a.publics.map((p, k) => { const I = publicIcons[k % 4]; return <div key={k} className="rounded-xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl"><span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary text-white"><I className="h-6 w-6" /></span><h3 className="mt-4 text-lg">{p.titre}</h3><p className="mt-1 text-sm text-muted-foreground">{p.texte}</p></div> })}
        </div>
      </section>
      <Pourquoi />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:justify-between"><p className="font-display text-2xl">Parlons de votre projet.</p><Button asChild variant="accent" size="lg"><a href={wa("Bonjour, je voudrais parler de mon projet.")}>Écrire sur WhatsApp</a></Button></div>
      </section>
    </>
  )
}
