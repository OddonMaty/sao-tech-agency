import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PageHero from "@/components/PageHero"
import { wa } from "@/data/site"
import { content } from "@/lib/content"

export default function Offres() {
  const groupes = [{ id: "conseil", titre: "Conseil", sous: "Un diagnostic avant de décider." }, ...content.poles.map((p) => ({ id: p.id, titre: `${p.nom} — ${p.verbe}`, sous: p.texte }))]
  return (
    <>
      <PageHero img="/img/hero-3.webp" kicker="Offres et tarifs" titre="Des offres claires, des prix affichés" texte="Choisissez un pôle, puis un plan. Pour un projet précis, nous établissons un devis sur WhatsApp."
        btns={[{ label: "Demander un devis", href: wa("Bonjour, je voudrais un devis.") }, { label: "Voir les plans", href: "#conseil", outline: true }]} />
      {groupes.map((g) => (
        <section key={g.id} id={g.id} className="mx-auto max-w-6xl scroll-mt-16 px-5 py-14">
          <h2 className="text-2xl md:text-3xl">{g.titre}</h2>
          <p className="text-muted-foreground">{g.sous}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.offres.filter((o) => o.pole === g.id).map((o, k) => (
              <Card key={k} className={`flex flex-col ${o.badge ? "border-accent" : ""}`}>
                <CardHeader>
                  {o.badge && <Badge className="w-fit">{o.badge}</Badge>}
                  <CardTitle>{o.name}</CardTitle>
                  <p><strong className="text-3xl">{o.price}</strong> <span className="text-sm text-muted-foreground">{o.unit}</span></p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-6">
                  <ul className="space-y-2 text-sm">{o.feats.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{f}</li>)}</ul>
                  <div className="grid gap-2"><Button asChild variant={o.badge ? "accent" : "outline"}><a href={wa(`Bonjour, je veux le ${o.name}.`)}>Choisir sur WhatsApp</a></Button><a href={`/contact?plan=${encodeURIComponent(o.name)}`} className="text-center text-sm font-semibold text-accent hover:underline">ou demander par email</a></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
      <section className="border-t bg-muted">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="text-2xl md:text-3xl">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="mt-6">{content.faq.map((f, i) => <AccordionItem key={i} value={`q${i}`}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>)}</Accordion>
        </div>
      </section>
    </>
  )
}
