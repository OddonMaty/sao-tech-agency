import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { wa } from "@/data/site"
import { content } from "@/lib/content"

const slides = content.slides
// Durée par diapositive : 5 s + 20 ms par caractère lu, bornée entre 6,5 s et 8,5 s
const ms = (s: { titre: string; texte: string }) => Math.min(8500, Math.max(6500, 5000 + (s.titre.length + s.texte.length) * 20))

export default function HeroCarousel() {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const n = slides.length
  const go = (k: number) => setI((k + n) % n)
  useEffect(() => {
    if (!playing || n < 2) return
    const t = setTimeout(() => setI((v) => (v + 1) % n), ms(slides[i]))
    return () => clearTimeout(t)
  }, [i, playing, n])
  return (
    <section aria-roledescription="carrousel" aria-label="Sao Tech Agency" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="relative min-h-[420px] md:min-h-[500px]">
        {slides.map((s, k) => (
          <div key={s.img} aria-hidden={k !== i} className={`absolute inset-0 transition-opacity duration-700 ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <img src={s.img} alt="" className="h-full w-full object-cover" loading={k === 0 ? "eager" : "lazy"} />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/25" />
            <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-center px-5 pb-14">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brandlight">{s.kicker}</p>
              {k === 0 ? <h1 className="max-w-3xl text-4xl leading-tight md:text-5xl">{s.titre}</h1> : <h2 className="max-w-3xl text-4xl leading-tight md:text-5xl">{s.titre}</h2>}
              <p className="mt-4 max-w-xl text-lg text-primary-foreground/85">{s.texte}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg"><a tabIndex={k === i ? 0 : -1} href={wa("Bonjour, je voudrais parler de mon projet.")}>Parler de mon projet</a></Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a tabIndex={k === i ? 0 : -1} href={s.lien}>{s.label}</a></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-12 mx-auto flex max-w-6xl items-center justify-between px-5">
        <div className="flex gap-2">{slides.map((s, k) => <button key={s.img} onClick={() => go(k)} aria-label={`Diapositive ${k + 1}`} aria-current={k === i} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-brandlight" : "w-2 bg-primary-foreground/50"}`} />)}</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Mettre en pause le défilement" : "Reprendre le défilement"} className="rounded-full border border-primary-foreground/40 p-2 hover:bg-primary-foreground/15">{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
          <button onClick={() => go(i - 1)} aria-label="Précédent" className="rounded-full border border-primary-foreground/40 p-2 hover:bg-primary-foreground/15"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => go(i + 1)} aria-label="Suivant" className="rounded-full border border-primary-foreground/40 p-2 hover:bg-primary-foreground/15"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-foreground/15"><span key={`${i}-${playing}`} className="hero-progress block h-full origin-left bg-brandlight" style={{ animationDuration: `${ms(slides[i])}ms`, animationPlayState: playing ? "running" : "paused" }} /></div>
    </section>
  )
}
