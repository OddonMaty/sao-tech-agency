// Outils WebMCP : exposés aux agents du navigateur qui prennent en charge navigator.modelContext (lecture seule + ouverture du formulaire).
import { content } from "@/lib/content"

type Args = { pole?: string; plan?: string }
const text = (o: unknown) => ({ content: [{ type: "text", text: typeof o === "string" ? o : JSON.stringify(o, null, 2) }] })

export function registerWebMcp(): void {
  const mc = (navigator as unknown as { modelContext?: { registerTool?: (t: unknown) => void } }).modelContext
  if (!mc || typeof mc.registerTool !== "function") return
  const s = content.settings
  const empty = { type: "object", properties: {} }
  const tools = [
    { name: "get_company_info", description: "Présentation de Sao Tech Agency : agence digitale à Uvira (RDC), mission, adresse et réseaux sociaux.", inputSchema: empty, annotations: { readOnlyHint: true },
      execute: async () => text({ nom: "Sao Tech Agency (STA SARL)", adresse: s.address, mission: content.apropos.blocs[0]?.texte, reseaux: content.socials, site: content.seo.site }) },
    { name: "list_services", description: "Liste des trois pôles de services (Studio, Développement, Réseau & Support) et de leurs prestations.", inputSchema: empty, annotations: { readOnlyHint: true },
      execute: async () => text(content.poles.map((p) => ({ id: p.id, pole: `${p.nom} — ${p.verbe}`, description: p.texte, services: p.services }))) },
    { name: "get_pricing", description: "Plans et prix de départ (en dollars US). Filtrable par pôle : studio, dev, reseau ou conseil.", annotations: { readOnlyHint: true },
      inputSchema: { type: "object", properties: { pole: { type: "string", description: "Identifiant du pôle : studio, dev, reseau ou conseil (facultatif)" } } },
      execute: async ({ pole }: Args = {}) => text(content.offres.filter((o) => !pole || o.pole === pole)) },
    { name: "get_contact_info", description: "Moyens de contacter l'agence pour un devis ou un partenariat : WhatsApp, email, adresse et pages du site.", inputSchema: empty, annotations: { readOnlyHint: true },
      execute: async () => text({ whatsapp: `https://wa.me/${s.whatsapp}`, telephone: s.phone, email: s.email, adresse: s.address, formulaireDevis: `${content.seo.site}/contact`, partenariat: `${content.seo.site}/partenaires` }) },
    { name: "open_contact_form", description: "Ouvre le formulaire de devis du site, éventuellement pour un plan précis. L'utilisateur envoie lui-même le formulaire.",
      inputSchema: { type: "object", properties: { plan: { type: "string", description: "Nom du plan concerné (facultatif)" } } },
      execute: async ({ plan }: Args = {}) => { history.pushState({}, "", `/contact${plan ? `?plan=${encodeURIComponent(plan)}` : ""}`); dispatchEvent(new PopStateEvent("popstate")); return text("Formulaire de devis ouvert.") } },
  ]
  for (const t of tools) { try { mc.registerTool(t) } catch { /* déjà enregistré */ } }
}
