import { Button } from "@/components/ui/button"
export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-28 text-center">
      <p className="font-display text-8xl text-accent">404</p>
      <h1 className="mt-4 text-3xl md:text-4xl">Cette page n'existe pas</h1>
      <p className="mt-3 text-muted-foreground">Le lien est peut-être incorrect ou la page a été déplacée.</p>
      <Button asChild variant="accent" size="lg" className="mt-8"><a href="/">Retour à l'accueil</a></Button>
    </section>
  )
}
