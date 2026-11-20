import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PageHero from "@/components/PageHero"
import { wa } from "@/data/site"
import { useI18n } from "@/lib/i18n"

export default function Realisations() {
  const { content, lang } = useI18n()

  return (
    <>
      <PageHero
        img="/img/cta.webp"
        kicker={lang === "en" ? "Portfolio" : "Réalisations"}
        titre={lang === "en" ? "They Trusted Us With Their Vision" : "Ils nous ont confié leur projet"}
        texte={lang === "en" ? "Regional businesses and organizations that rely on us for their websites, digital marketing, and software tools." : "Des organisations de la région qui nous ont fait confiance pour leur site, leur marketing ou leurs outils."}
        btns={[
          { label: lang === "en" ? "Launch My Project" : "Lancer mon projet", href: wa("Bonjour, je voudrais lancer un projet avec vous.") },
          { label: lang === "en" ? "View Services" : "Voir les offres", href: "/offres", outline: true }
        ]}
      />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {content.realisations.map((r, k) => (
            <Card key={k}>
              <CardHeader>
                {r.logo ? <img src={r.logo} alt={`Logo ${r.nom}`} className="h-16 w-auto self-start object-contain" /> : <div className="h-16" />}
                <Badge variant="outline" className="w-fit">{lang === "en" ? "Case study coming soon" : "Étude de cas à venir"}</Badge>
                <CardTitle className="mt-1">{r.nom}</CardTitle>
                <CardDescription>{r.desc}</CardDescription>
                <p className="pt-2 text-sm"><strong>{lang === "en" ? "Delivered:" : "Réalisé :"}</strong> {r.livre}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-semibold">{lang === "en" ? "Your organization could be next." : "Votre organisation pourrait être la prochaine."}</p>
          <Button asChild variant="accent">
            <a href={wa("Bonjour, je voudrais lancer un projet avec vous.")}>
              {lang === "en" ? "Start My Project" : "Lancer mon projet"}
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
