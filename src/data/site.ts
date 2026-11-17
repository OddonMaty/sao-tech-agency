import { Palette, Code2, Network } from "lucide-react"
import { content } from "@/lib/content"
export const wa = (msg: string) => `https://wa.me/${content.settings.whatsapp}?text=${encodeURIComponent(msg)}`
export const poleIcon: Record<string, typeof Palette> = { studio: Palette, dev: Code2, reseau: Network }
