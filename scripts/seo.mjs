// Après `vite build` : une page HTML par route (balises SEO propres), sitemap.xml, robots.txt et contenu par défaut pour l'installation.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
const content = JSON.parse(readFileSync("src/data/content.json", "utf8"))
const { site, routes } = content.seo
const base = readFileSync("dist/index.html", "utf8")
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
const nav = [["/", "Accueil"], ["/offres", "Offres"], ["/produits", "Produits"], ["/realisations", "Réalisations"], ["/partenaires", "Partenaires"], ["/blog", "Blog"], ["/a-propos", "À propos"], ["/contact", "Contact"], ["/confidentialite", "Politique de confidentialité"], ["/cookies", "Politique des cookies"]]
const h1 = { "/": "Vous gérez votre métier, nous gérons votre technologie.", "/offres": "Des offres claires, des prix affichés", "/produits": "Les outils du quotidien, bientôt disponibles", "/realisations": "Ils nous ont confié leur projet", "/partenaires": "Construisons ensemble", "/blog": "Le blog arrive bientôt", "/a-propos": "L'excellence technologique au service de l'Afrique", "/contact": "Parlons de votre projet", "/confidentialite": "Politique de confidentialité", "/cookies": "Politique des cookies" }
for (const [route, m] of Object.entries(routes)) {
  const url = site + (route === "/" ? "/" : route)
  let h = base
    .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(m.description)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(m.title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(m.description)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
  if (route === "/offres") {
    const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: content.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    h = h.replace("</head>", `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`)
  }
  if (route === "/partenaires") {
    const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: content.partenariat.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    h = h.replace("</head>", `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`)
  }
  const ns = `<noscript><h1>${esc(h1[route] ?? m.title)}</h1><p>${esc(m.description)}</p><nav>${nav.map(([p, l]) => `<a href="${p}">${l}</a>`).join(" ")}</nav></noscript>`
  h = h.replace("<!--NOSCRIPT-->", ns)
  writeFileSync(route === "/" ? "dist/index.html" : `dist${route}.html`, h)
}
const d = new Date().toISOString().slice(0, 10)
writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(routes).map((r) => `  <url><loc>${site}${r === "/" ? "/" : r}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`)
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`)
mkdirSync("dist/data", { recursive: true })
writeFileSync("dist/data/content.default.json", JSON.stringify(content))
console.log(`SEO : ${Object.keys(routes).length} pages, sitemap.xml, robots.txt et contenu par défaut générés`)
