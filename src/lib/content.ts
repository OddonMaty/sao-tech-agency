import defaults from "@/data/content.json"
import defaultsEn from "@/data/content.en.json"
export type Content = typeof defaults
export { defaults, defaultsEn }

// Contenu publié depuis l'admin : lu dans /api/content.php (base de données) ; à défaut, le contenu livré avec le site.
// Version française = contenu publié ; version anglaise = contenu publié sous la clé « en » (sinon contenu anglais livré).
// Réglages et réseaux sociaux sont communs aux deux langues.
export let content: Content = defaults
export let contentEn: Content = defaultsEn as unknown as Content

type Item = Record<string, unknown>
// Champs identiques dans toutes les langues (liens, images, prix, identifiants).
const NEUTRAL = ["url", "logo", "img", "icone", "price", "unit", "pole", "id", "lien"]
// Sections qui contiennent des listes d'éléments et la clé qui identifie chaque élément.
const LISTS: Record<string, string> = { realisations: "nom", produits: "nom", partenaires: "nom", slides: "titre", offres: "name", poles: "id" }
const frDefaults = defaults as unknown as Record<string, Item[]>
const enDefaults = defaultsEn as unknown as Record<string, Item[]>

// Version anglaise sans traduction publiée :
// - si la liste n'a pas changé depuis la livraison (mêmes éléments, même ordre), on garde les textes anglais livrés
//   et on reprend les champs communs publiés (liens, logos, prix…) ;
// - si un élément a été ajouté, retiré, réordonné ou renommé, on affiche la liste publiée telle quelle (en français)
//   jusqu'à ce qu'elle soit traduite dans l'admin (bouton « English »).
function listFor(k: string, fr: Item[]): Item[] {
  const key = LISTS[k]
  const def = frDefaults[k] ?? []
  const unchanged = fr.length === def.length && fr.every((x, i) => x[key] === def[i][key])
  if (!unchanged) return fr
  return fr.map((f, i) => {
    const out = { ...enDefaults[k][i] }
    for (const n of NEUTRAL) if (f[n] !== undefined) out[n] = f[n]
    return out
  })
}
function buildEn(live: Record<string, unknown>): Content {
  const frTree = { ...defaults, ...live } as unknown as Content
  const own = (live.en ?? null) as Record<string, unknown> | null
  const base = { ...(defaultsEn as unknown as Record<string, unknown>), ...(own ?? {}) } as Record<string, unknown>
  if (!own) for (const k of Object.keys(LISTS)) base[k] = listFor(k, (frTree as unknown as Record<string, Item[]>)[k] ?? [])
  base.settings = frTree.settings
  base.socials = frTree.socials
  base.seo = { ...(base.seo as object), site: frTree.seo.site }
  return base as unknown as Content
}

export async function loadContent(): Promise<void> {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 2500)
    const r = await fetch(`/api/content.php?v=${Math.floor(Date.now() / 60000)}`, { signal: ctl.signal, cache: "no-cache" })
    clearTimeout(t)
    if (r.ok && (r.headers.get("content-type") || "").includes("json")) {
      const live = await r.json()
      content = { ...defaults, ...live }
      contentEn = buildEn(live)
    }
  } catch { /* contenu par défaut */ }
}
