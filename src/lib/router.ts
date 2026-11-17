import { useEffect, useState } from "react"
export function usePath() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => {
    const go = () => { setPath(location.pathname); const id = location.hash.slice(1); if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 80); else window.scrollTo(0, 0) }
    if (location.hash) go()
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a")
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return
      const h = a.getAttribute("href") || ""
      if (h.startsWith("/") && !h.startsWith("//")) { e.preventDefault(); history.pushState({}, "", h); go() }
    }
    addEventListener("popstate", go); document.addEventListener("click", click)
    return () => { removeEventListener("popstate", go); document.removeEventListener("click", click) }
  }, [])
  return path
}
