import { ArrowRight, Check, FileText, MessageCircle, PackageCheck, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroCarousel from "@/components/HeroCarousel"
import Pourquoi from "@/components/Pourquoi"
import { wa, poleIcon } from "@/data/site"
import { content } from "@/lib/content"

const Head = ({ eyebrow, titre, texte, light }: { eyebrow: string; titre: string; texte?: string; light?: boolean }) => (
  <div className="max-w-2xl">
    <p className={`mb-2 text-sm font-semibold uppercase tracking-widest ${light ? "text-brandlight" : "text-accent"}`}>{eyebrow}</p>
    <h2 className="text-3xl leading-tight md:text-5xl">{titre}</h2>
    {texte && <p className={`mt-4 text-lg ${light ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{texte}</p>}
  </div>
)
const etapes = [
  [MessageCircle, "01", "Vous nous écrivez", "Décrivez votre projet sur WhatsApp, avec le brief du site."],
  [FileText, "02", "Nous établissons le devis", "Un plan clair, un prix, un périmètre précis."],
  [Rocket, "03", "Le projet démarre", "En général, un acompte de 50 % lance le travail ; le solde est réglé à la livraison."],
  [PackageCheck, "04", "Livraison et suivi", "Votre projet est livré, puis suivi pendant la période de support de votre plan."],
] as const

export default function Accueil() {
  const { poles, offres, realisations } = content
  return (
    <>
      <HeroCarousel />
      <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-5">
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border shadow-xl md:grid-cols-3">
          {[["Basés à Uvira", "Clients en RDC et dans la région"], ["Prix affichés", "Plans clairs, sans surprise"], ["Devis sur WhatsApp", "Une réponse directe de l'équipe"]].map(([t, d]) => (
            <div key={t} className="bg-card px-6 py-5"><p className="font-display text-xl text-primary">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </div>

      <section id="poles" className="mx-auto max-w-6xl px-5 py-24">
        <Head eyebrow="Ce que nous faisons" titre="Trois pôles, un seul interlocuteur" texte="Créer votre image, construire vos outils, connecter votre organisation : chaque pôle a ses plans et ses prix." />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {poles.map((p) => { const Icon = poleIcon[p.id] ?? Check
            return (
            <article key={p.id} className="group overflow-hidden rounded-xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden">
                <img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <p className="absolute bottom-3 left-5 font-display text-3xl text-primary-foreground">{p.verbe}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-accent"><Icon className="h-5 w-5" aria-hidden /><h3 className="text-xl text-foreground">{p.nom}</h3></div>
                <p className="mt-3 text-muted-foreground">{p.texte}</p>
                <ul className="mt-4 space-y-2 text-sm">{p.services.map((s) => <li key={s} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s}</li>)}</ul>
                <a href={`/offres#${p.id}`} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2">Voir les offres <ArrowRight className="h-4 w-4" /></a>
              </div>
            </article>) })}
        </div>
      </section>

      <Pourquoi />

      <section className="mx-auto max-w-6xl px-5 py-24">
        <Head eyebrow="Comment ça se passe" titre="De votre message à la livraison, en quatre étapes" />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {etapes.map(([Icon, n, t, d]) => (
            <li key={n} className="group relative overflow-hidden rounded-2xl border bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
              <span className="pointer-events-none absolute -right-1 -top-5 font-display text-8xl text-accent/10 transition group-hover:text-accent/20">{n}</span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-lg"><Icon className="h-6 w-6" /></span>
              <h3 className="relative mt-6 text-xl">{t}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition duration-300 group-hover:scale-x-100" />
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Head light eyebrow="Tarifs" titre="Des prix de départ affichés" texte="Chaque pôle commence par un prix clair. Pour un projet précis, nous établissons un devis sur WhatsApp." />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {poles.map((p) => (
              <div key={p.id} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-6">
                <h3 className="text-xl">{p.nom}</h3>
                <ul className="mt-4 divide-y divide-primary-foreground/15">
                  {offres.filter((o) => o.pole === p.id).slice(0, 3).map((o, k) => <li key={k} className="flex items-baseline justify-between py-3 text-sm"><span className="font-semibold">{o.name}</span><span><strong className="text-lg text-brandlight">{o.price}</strong> <span className="text-primary-foreground/70">{o.unit}</span></span></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4"><Button asChild variant="accent" size="lg"><a href="/offres">Voir toutes les offres</a></Button><span className="text-primary-foreground/80">Pas sûr de votre besoin ? Commencez par une Session Conseil.</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <Head eyebrow="Réalisations" titre="Ils nous ont confié leur projet" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {realisations.slice(0, 3).map((r) => (
            <a key={r.nom} href="/realisations" className="group rounded-xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-24 items-center rounded-lg bg-muted px-5">{r.logo ? <img src={r.logo} alt={`Logo ${r.nom}`} loading="lazy" className="max-h-16 w-auto object-contain" /> : <span className="font-display text-2xl text-primary">{r.nom}</span>}</div>
              <h3 className="mt-5 text-xl">{r.nom}</h3><p className="mt-1 text-sm text-muted-foreground">{r.livre}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2">Voir le projet <ArrowRight className="h-4 w-4" /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden text-primary-foreground">
        <img src="/img/cta.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-20 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl text-3xl leading-tight md:text-4xl">Dites-nous ce que vous voulez construire.</h2>
          <Button asChild variant="accent" size="lg"><a href={wa("Bonjour, je voudrais un devis.")}><MessageCircle className="h-5 w-5" />Écrire sur WhatsApp</a></Button>
        </div>
      </section>
    </>
  )
}
