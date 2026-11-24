import { useEffect, useState } from "react"
import { Globe, Linkedin } from "lucide-react"
import { content } from "@/lib/content"

type Brand = { t: string; p: string }
type Icons = Record<string, Brand>

// Reconnaissance du réseau : choix de l'admin, puis nom, puis adresse du lien (quel que soit le réseau ajouté).
const ALIAS: Record<string, string> = { twitter: "x", "x.com": "x", fb: "facebook", insta: "instagram", yt: "youtube", wa: "whatsapp", "t.me": "telegram", "wa.me": "whatsapp", "youtu.be": "youtube", maps: "googlemaps", googlebusiness: "googlemaps", "google maps": "googlemaps", playstore: "googleplay", "google play": "googleplay", "app store": "appstore", "ko-fi": "kofi", "buy me a coffee": "buymeacoffee" }
const HOSTS: [string, string][] = [["facebook.com", "facebook"], ["fb.com", "facebook"], ["instagram.com", "instagram"], ["linkedin.com", "linkedin"], ["tiktok.com", "tiktok"], ["twitter.com", "x"], ["x.com", "x"], ["youtube.com", "youtube"], ["youtu.be", "youtube"], ["wa.me", "whatsapp"], ["whatsapp.com", "whatsapp"], ["t.me", "telegram"], ["telegram.me", "telegram"], ["snapchat.com", "snapchat"], ["pinterest.", "pinterest"], ["threads.net", "threads"], ["github.com", "github"], ["gitlab.com", "gitlab"], ["discord.", "discord"], ["reddit.com", "reddit"], ["twitch.tv", "twitch"], ["medium.com", "medium"], ["behance.net", "behance"], ["dribbble.com", "dribbble"], ["vimeo.com", "vimeo"], ["spotify.com", "spotify"], ["soundcloud.com", "soundcloud"], ["tumblr.com", "tumblr"], ["viber.", "viber"], ["messenger.com", "messenger"], ["m.me", "messenger"], ["bsky.app", "bluesky"], ["patreon.com", "patreon"], ["ko-fi.com", "kofi"], ["maps.google", "googlemaps"], ["goo.gl/maps", "googlemaps"], ["play.google.com", "googleplay"], ["apps.apple.com", "appstore"], ["figma.com", "figma"], ["notion.", "notion"], ["tripadvisor.", "tripadvisor"], ["trustpilot.com", "trustpilot"], ["linktr.ee", "linktree"], ["substack.com", "substack"], ["wordpress.", "wordpress"], ["zoom.us", "zoom"], ["upwork.com", "upwork"], ["fiverr.com", "fiverr"], ["paypal.", "paypal"]]
const clean = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim()

export function detect(s: { nom: string; url: string; icone?: string }, icons: Icons | null): string {
  const pick = (k: string) => (k === "linkedin" || (icons && icons[k]) ? k : "")
  const byIcon = s.icone ? clean(s.icone) : ""
  const name = clean(s.nom)
  const host = (() => { try { return new URL(s.url).hostname.replace(/^www\./, "") + new URL(s.url).pathname } catch { return clean(s.url) } })()
  return pick(ALIAS[byIcon] ?? byIcon) || pick(ALIAS[name] ?? name.replace(/[^a-z0-9]/g, "")) || pick(HOSTS.find(([h]) => host.includes(h))?.[1] ?? "") || ""
}

export function useBrandIcons(): Icons | null {
  const [icons, setIcons] = useState<Icons | null>(null)
  useEffect(() => { import("@/data/brand-icons.json").then((m) => setIcons(m.default as unknown as Icons)) }, [])
  return icons
}

type SocialItem = { nom: string; url: string; icone?: string; logo?: string }
export function SocialIcon({ s, icons, className = "h-5 w-5" }: { s: SocialItem; icons: Icons | null; className?: string }) {
  const slug = icons ? detect(s, icons) : ""
  const brand = slug && slug !== "linkedin" && icons ? icons[slug] : null
  if (s.logo) return <img src={s.logo} alt="" loading="lazy" className={`${className} object-contain`} />
  if (brand) return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}><path d={brand.p} /></svg>
  if (slug === "linkedin") return <Linkedin className={className} aria-hidden />
  return icons ? <Globe className={className} aria-hidden /> : <span className={className} />
}

export default function Social({ className = "" }: { className?: string }) {
  const icons = useBrandIcons()
  return (
    <ul className="flex flex-wrap gap-3">
      {content.socials.map((s, k) => (
        <li key={`${s.nom}-${k}`}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.nom} title={s.nom} className={`flex h-10 w-10 items-center justify-center rounded-full transition hover:-translate-y-0.5 ${className}`}>
            <SocialIcon s={s} icons={icons} />
          </a>
        </li>
      ))}
    </ul>
  )
}
