import { Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n()

  return (
    <div
      role="group"
      aria-label="Select language"
      className={`inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/80 p-0.5 text-xs shadow-sm backdrop-blur ${className}`}
    >
      <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`rounded-full px-2 py-0.5 font-semibold transition ${
          lang === "fr"
            ? "bg-accent text-accent-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Français"
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-full px-2 py-0.5 font-semibold transition ${
          lang === "en"
            ? "bg-accent text-accent-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="English"
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  )
}
