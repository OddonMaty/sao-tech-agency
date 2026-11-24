import { ArrowRight } from "lucide-react"
import { SocialIcon, useBrandIcons } from "@/components/Social"
import { content } from "@/lib/content"
import { useI18n } from "@/lib/i18n"

export default function SocialSection() {
  const { lang } = useI18n()
  const icons = useBrandIcons()
  const list = content.socials
  if (!list.length) return null
  return (
    <section className="bg-muted" aria-labelledby="follow-title">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{lang === "en" ? "Community" : "Communauté"}</p>
        <h2 id="follow-title" className="text-3xl leading-tight md:text-5xl">{lang === "en" ? "Follow us" : "Suivez-nous"}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{lang === "en" ? "News, projects and advice: find us on our social networks." : "Actualités, projets et conseils : retrouvez-nous sur nos réseaux."}</p>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((s, k) => (
            <li key={`${s.nom}-${k}`}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col items-center gap-3 rounded-2xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition group-hover:bg-accent"><SocialIcon s={s} icons={icons} className="h-6 w-6" /></span>
                <span className="font-semibold">{s.nom}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">{lang === "en" ? "Follow" : "Suivre"} <ArrowRight className="h-4 w-4" /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
