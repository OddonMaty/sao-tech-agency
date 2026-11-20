import { MapPin, MessageCircle, Tag, Users } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const icons = [Users, Tag, MessageCircle, MapPin]

export default function Pourquoi() {
  const { content, t } = useI18n()

  return (
    <section className="bg-muted">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
        <div className="relative">
          <img src="/img/pourquoi.webp" alt="Sao Tech Agency team" loading="lazy" width={1000} height={571} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" />
          <div className="absolute -bottom-5 right-4 rounded-xl bg-accent px-5 py-4 text-accent-foreground shadow-lg"><p className="font-display text-xl">{t("footer.slogan")}</p></div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{t("home.what_we_do")}</p>
          <h2 className="max-w-2xl text-3xl leading-tight md:text-5xl">{content.apropos?.intro ? t("home.three_poles") : "Une agence qui vous simplifie la technologie"}</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {content.pourquoi.map((p, k) => {
              const I = icons[k % icons.length]
              return (
                <li key={k}>
                  <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground"><I className="h-5 w-5" /></span>
                  <h3 className="text-lg">{p.titre}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.texte}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
