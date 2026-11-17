import { Button } from "@/components/ui/button"
export type HeroBtn = { label: string; href: string; outline?: boolean }
export default function PageHero({ img, kicker, titre, texte, btns }: { img: string; kicker: string; titre: string; texte: string; btns: HeroBtn[] }) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/35" />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brandlight">{kicker}</p>
        <h1 className="max-w-3xl text-4xl leading-tight md:text-5xl">{titre}</h1>
        <p className="mt-4 max-w-xl text-lg text-primary-foreground/85">{texte}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {btns.map((b) => <Button key={b.label} asChild size="lg" variant={b.outline ? "outline" : "accent"} className={b.outline ? "border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary" : ""}><a href={b.href}>{b.label}</a></Button>)}
        </div>
      </div>
    </section>
  )
}
