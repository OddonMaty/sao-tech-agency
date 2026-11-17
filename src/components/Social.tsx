import { Facebook, Instagram, Linkedin, Globe } from "lucide-react"
import { content } from "@/lib/content"
const Tiktok = (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
const icons: Record<string, React.ComponentType<{ className?: string }>> = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, tiktok: Tiktok }
export default function Social({ className = "" }: { className?: string }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {content.socials.map((s) => { const I = icons[s.nom.toLowerCase()] ?? Globe
        return <li key={s.nom}><a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.nom} title={s.nom} className={`flex h-10 w-10 items-center justify-center rounded-full transition hover:-translate-y-0.5 ${className}`}><I className="h-5 w-5" /></a></li> })}
    </ul>
  )
}
