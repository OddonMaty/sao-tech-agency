import { useState } from "react"
import { Menu, X, MessageCircle, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Social from "@/components/Social"
import CookieBanner from "@/components/CookieBanner"
import LanguageSelector from "@/components/LanguageSelector"
import { wa } from "@/data/site"
import { useI18n } from "@/lib/i18n"

export default function Layout({ path, children }: { path: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { t, content } = useI18n()
  const s = content.settings

  const nav = [
    ["/offres", t("nav.offres")],
    ["/produits", t("nav.produits")],
    ["/realisations", t("nav.realisations")],
    ["/partenaires", t("nav.partenaires")],
    ["/blog", t("nav.blog")],
    ["/a-propos", t("nav.apropos")],
    ["/contact", t("nav.contact")]
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Aller au contenu</a>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="/" aria-label="Sao Tech Agency — accueil"><img src="/brand/logo-horizontal-couleur.webp" alt="Sao Tech Agency" width={144} height={44} className="h-11 w-auto" /></a>
          <nav className="hidden gap-6 text-sm font-semibold lg:flex" aria-label="Principal">
            {nav.map(([h, l]) => <a key={h} href={h} aria-current={path === h ? "page" : undefined} className={path === h ? "text-accent" : "hover:text-accent"}>{l}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSelector className="hidden sm:inline-flex" />
            <Button asChild variant="accent" className="hidden sm:inline-flex">
              <a href={wa("Bonjour, je voudrais parler de mon projet.")}>
                <MessageCircle className="h-4 w-4" />{t("cta.whatsapp")}
              </a>
            </Button>
            <LanguageSelector className="sm:hidden" />
            <button className="p-2 lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <nav className="border-t bg-background px-5 py-3 lg:hidden" aria-label="Mobile">
            {nav.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2.5 font-semibold">{l}</a>)}
            <div className="flex items-center justify-between pt-2">
              <a href={wa("Bonjour !")} className="block py-2 font-semibold text-accent">{t("cta.whatsapp")}</a>
              <LanguageSelector />
            </div>
          </nav>
        )}
      </header>
      <main id="contenu">{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="h-1 bg-gradient-to-r from-accent via-brandlight to-accent" />
        <div className="mx-auto max-w-4xl px-5 py-14 text-center">
          <img src="/brand/logo-horizontal-inverse.webp" alt="Sao Tech Agency" width={208} height={64} loading="lazy" className="mx-auto h-16 w-auto" />
          <p className="mt-4 font-display text-2xl text-brandlight">{t("footer.slogan")}</p>
          <nav aria-label="Pied de page" className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm font-semibold">{nav.map(([h, l]) => <a key={h} href={h} className="hover:text-brandlight">{l}</a>)}</nav>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brandlight" />{s.address}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brandlight" /><a href={wa("Bonjour !")} className="hover:text-primary-foreground">{s.phone}</a></li>
            {s.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brandlight" /><a href={`mailto:${s.email}`} className="hover:text-primary-foreground">{s.email}</a></li>}
          </ul>
          <div className="mt-8 flex justify-center"><Social className="bg-primary-foreground/10 text-primary-foreground hover:bg-accent" /></div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-5 py-5 text-center text-xs text-primary-foreground/70 md:flex-row md:gap-6">
            <p>© {new Date().getFullYear()} Sao Tech Agency (STA SARL). {t("footer.rights")}</p>
            <p className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              <a href="/a-propos" rel="about" className="hover:text-primary-foreground">{t("nav.apropos")}</a>
              <a href="/contact" rel="help" className="hover:text-primary-foreground">{t("nav.contact")}</a>
              <a href="/conditions" rel="terms-of-service" className="hover:text-primary-foreground">{t("legal.terms")}</a>
              <a href="/confidentialite" rel="privacy-policy" className="hover:text-primary-foreground">{t("legal.privacy")}</a>
              <a href="/cookies" className="hover:text-primary-foreground">{t("legal.cookies")}</a>
            </p>
          </div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  )
}
