import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
export default function CookieBanner() {
  const [show, setShow] = useState(false)
  useEffect(() => { try { setShow(!localStorage.getItem("sta-cookies")) } catch { setShow(true) } }, [])
  if (!show) return null
  return (
    <div role="dialog" aria-label="Information sur les cookies" className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-2xl border bg-card p-4 shadow-2xl sm:flex sm:items-center sm:gap-4">
      <p className="text-sm text-muted-foreground">Ce site utilise uniquement des cookies et stockages techniques, nécessaires à son fonctionnement. Aucun cookie publicitaire. <a href="/cookies" className="font-semibold text-accent underline">En savoir plus</a></p>
      <Button className="mt-3 w-full shrink-0 sm:mt-0 sm:w-auto" onClick={() => { try { localStorage.setItem("sta-cookies", "1") } catch { /* ignore */ } setShow(false) }}>J'ai compris</Button>
    </div>
  )
}
