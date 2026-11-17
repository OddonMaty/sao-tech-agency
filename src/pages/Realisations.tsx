import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PageHero from "@/components/PageHero"
import { wa } from "@/data/site"
import { content } from "@/lib/content"

export default function Realisations() {
  return (
    <>
      <PageHero img="/img/cta.webp" kicker="Réalisations" titre="Ils nous ont confié leur projet" texte="Des organisations de la région qui nous ont fait confiance pour leur site, leur marketing ou leurs outils."
        btns={[{ label: "Lancer mon projet", href: wa("Bonjour, je voudrais lancer un projet avec vous.") }, { label: "Voir les offres", href: "/offres", outline: true }]} />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {content.realisations.map((r, k) => (
            <Card key={k}>
              <CardHeader>
                {r.logo ? <img src={r.logo} alt={`Logo ${r.nom}`} className="h-16 w-auto self-start object-contain" /> : <div className="h-16" />}
                <Badge variant="outline" className="w-fit">Étude de cas à venir</Badge>
                <CardTitle className="mt-1">{r.nom}</CardTitle>
                <CardDescription>{r.desc}</CardDescription>
                <p className="pt-2 text-sm"><strong>Réalisé :</strong> {r.livre}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-semibold">Votre organisation pourrait être la prochaine.</p>
          <Button asChild variant="accent"><a href={wa("Bonjour, je voudrais lancer un projet avec vous.")}>Lancer mon projet</a></Button>
        </div>
      </section>
    </>
  )
}
