// Données de démonstration, uniquement en développement local (npm run dev), sans serveur PHP.
import { defaults } from "@/lib/content"
const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)
const reqs = [
  { id: 3, type: "devis", name: "Marie Kavira", org: "Coopérative Maendeleo", email: "marie@exemple.cd", phone: "+243 990 000 001", location: "Bukavu", subject: "Développement — Construire", budget: "400 $", plan: "Plan Pro", message: "Nous voulons un site pour présenter la coopérative et ses produits.", status: "new", note: "", created_at: new Date().toISOString().slice(0, 19).replace("T", " ") },
  { id: 2, type: "partenariat", name: "Jean Mutombo", org: "Agence Kivu Média", email: "jean@kivumedia.cd", phone: "", location: "Goma", subject: "Média et communauté", budget: "", plan: "", message: "Nous proposons un échange de visibilité et des contenus communs.", status: "new", note: "", created_at: `${day(1)} 10:12:00` },
  { id: 1, type: "produit", name: "Aline Neema", org: "", email: "aline@exemple.cd", phone: "", location: "", subject: "Facturation", budget: "", plan: "", message: "", status: "done", note: "Prévenue", created_at: `${day(3)} 16:40:00` },
]
export async function mock(path: string, body?: any): Promise<any> {
  await new Promise((r) => setTimeout(r, 120))
  if (path.includes("a=me")) return { user: { email: "demo@gmail.com", name: "Mode démo", picture: "" } }
  if (path.includes("a=config")) return { clientId: "" }
  if (path.includes("a=google") || path.includes("a=logout")) return { user: { email: "demo@gmail.com", name: "Mode démo", picture: "" } }
  if (path.includes("a=stats")) return { new: 2, total: 3, devis: 1, partenariat: 1, contact: 0, produit: 1, days: Array.from({ length: 14 }, (_, i) => ({ d: day(13 - i), n: [0, 1, 0, 2, 1, 0, 0, 3, 1, 0, 2, 1, 1, 2][i] })), last: reqs }
  if (path.includes("a=latest")) return { new: 2, last: { type: "devis", name: "Marie Kavira" } }
  if (path.includes("a=requests")) return { items: reqs }
  if (path.includes("a=content_get")) return { content: JSON.parse(JSON.stringify(defaults)) }
  if (path.includes("a=content_history")) return { items: [{ id: 1, email: "installation", created_at: `${day(0)} 09:00:00` }] }
  if (path.includes("a=media_list")) return { items: [] }
  if (path.includes("a=push_key")) return { key: "" }
  if (path.includes("a=upload")) return { url: "/img/hero-1.webp" }
  if (path.includes("a=push_test")) return { sent: 0 }
  console.info("[démo]", path, body)
  return { ok: true }
}
