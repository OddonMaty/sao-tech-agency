import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSend } from "@/components/Field"
import { useI18n } from "@/lib/i18n"

export default function Newsletter() {
  const { lang } = useI18n()
  const en = lang === "en"
  const [email, setEmail] = useState("")
  const [hp, setHp] = useState("")
  const { state, error, send } = useSend()
  return (
    <form className="relative mx-auto mt-10 max-w-md text-left" onSubmit={(e) => { e.preventDefault(); send({ type: "newsletter", email, name: "", subject: "newsletter", website: hp }) }}>
      <p className="text-center font-display text-xl text-brandlight">{en ? "Stay informed" : "Restez informé"}</p>
      <p className="mt-1 text-center text-sm text-primary-foreground/75">{en ? "News, new offers and product launches, straight to your inbox." : "Actualités, nouvelles offres et lancements de produits, directement dans votre boîte mail."}</p>
      <input aria-hidden tabIndex={-1} autoComplete="off" name="website" value={hp} onChange={(e) => setHp(e.target.value)} className="absolute -left-[9999px]" />
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">Email</label>
        <input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={en ? "your@email.com" : "votre@email.com"} className="h-11 min-w-0 flex-1 rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 px-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandlight" />
        <Button type="submit" variant="accent" className="h-11" disabled={state === "sending"}>{state === "sending" ? "…" : en ? "Subscribe" : "S'abonner"}</Button>
      </div>
      <label className="mt-3 flex items-start gap-2 text-xs text-primary-foreground/70">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#52cba3]" />
        <span>{en ? <>I agree to receive the newsletter. See our <a href="/confidentialite" className="underline hover:text-primary-foreground">privacy policy</a>.</> : <>J'accepte de recevoir la newsletter. Voir notre <a href="/confidentialite" className="underline hover:text-primary-foreground">politique de confidentialité</a>.</>}</span>
      </label>
      <div aria-live="polite" className="mt-3 text-center text-sm font-semibold">
        {state === "ok" && <p className="text-brandlight">{en ? "Thank you, you are subscribed." : "Merci, votre inscription est enregistrée."}</p>}
        {state === "err" && <p className="text-red-300">{error}</p>}
      </div>
    </form>
  )
}
