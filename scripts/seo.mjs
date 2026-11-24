// Après `vite build` : pages HTML par route, données structurées, versions Markdown, llms.txt, robots.txt,
// sitemap.xml, page 404 et carte du serveur MCP. Tout est généré depuis src/data/content.json.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const content = JSON.parse(readFileSync("src/data/content.json", "utf8"))
const extra = JSON.parse(readFileSync("src/data/seo-extra.json", "utf8"))
const { site } = content.seo
const routes = { ...content.seo.routes, ...extra }
const S = content.settings
const base = readFileSync("dist/index.html", "utf8")
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
const url = (r) => site + (r === "/" ? "/" : r)
const phone = "+" + S.whatsapp
const [city, region] = S.address.split(",").map((x) => x.trim())
const slogan = "Créer. Construire. Connecter."
const shortName = (r) => routes[r].title.split(" | ")[0]
const poleName = (p) => `${p.nom} — ${p.verbe}`

// ---------- Données structurées (JSON-LD) ----------
const orgId = `${site}/#organization`
const address = { "@type": "PostalAddress", addressLocality: city, addressRegion: region, addressCountry: "CD" }
const sameAs = content.socials.map((s) => s.url)
const email = S.email || undefined

const org = {
  "@type": "Organization",
  "@id": orgId,
  name: "Sao Tech Agency",
  legalName: "STA SARL",
  url: url("/"),
  logo: { "@type": "ImageObject", url: `${site}/icon-512.png`, width: 512, height: 512 },
  image: `${site}/og-image.png`,
  email,
  telephone: phone,
  slogan,
  description: "Agence digitale : image et marketing, sites et applications, réseaux et support technique.",
  address,
  areaServed: ["CD", "BI", "RW", "TZ"],
  sameAs,
  publishingPrinciples: `${site}/conditions`,
  termsOfService: `${site}/conditions`,
  privacyPolicy: `${site}/confidentialite`,
  contactPoint: [{
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: phone,
    email,
    url: `${site}/contact`,
    availableLanguage: ["fr", "en"],
    areaServed: "CD"
  }]
}

const local = {
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${site}/#localbusiness`,
  name: "Sao Tech Agency",
  url: url("/"),
  image: `${site}/og-image.png`,
  telephone: phone,
  email,
  address,
  areaServed: ["CD", "BI", "RW", "TZ"],
  sameAs,
  parentOrganization: { "@id": orgId },
  publishingPrinciples: `${site}/conditions`,
  termsOfService: `${site}/conditions`,
  privacyPolicy: `${site}/confidentialite`
}

const website = {
  "@type": "WebSite",
  "@id": `${site}/#website`,
  url: url("/"),
  name: "Sao Tech Agency",
  inLanguage: ["fr", "en"],
  publisher: { "@id": orgId }
}

const services = content.poles.map((p) => ({
  "@type": "Service",
  "@id": `${url("/offres")}#${p.id}`,
  name: poleName(p),
  description: p.texte,
  serviceType: p.nom,
  provider: { "@id": orgId },
  areaServed: "CD",
  url: `${url("/offres")}#${p.id}`
}))

const price = (o) => {
  const m = o.price.replace(/\s/g, "").replace(",", ".").match(/^([\d.]+)\$?$/)
  return m ? m[1] : undefined
}

const offer = (o, id) => ({
  "@type": "Offer",
  name: o.name,
  description: `${o.feats.join(" ; ")}${o.unit ? ` (${o.unit.replace("/", "").trim()})` : ""}`,
  price: price(o),
  priceCurrency: price(o) ? "USD" : undefined,
  url: `${url("/offres")}#${id}`,
  itemOffered: { "@type": "Service", name: o.name, provider: { "@id": orgId } }
})

const catalog = () => ({
  "@type": "OfferCatalog",
  "@id": `${url("/offres")}#catalogue`,
  name: "Offres et tarifs de Sao Tech Agency",
  itemListElement: [...content.poles.map((p) => ({ id: p.id, name: poleName(p) })), { id: "conseil", name: "Conseil" }].map((g) => ({
    "@type": "OfferCatalog",
    name: g.name,
    itemListElement: content.offres.filter((o) => o.pole === g.id).map((o) => offer(o, g.id))
  }))
})

const faqNode = (list, r) => ({
  "@type": "FAQPage",
  "@id": `${url(r)}#faq`,
  mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
})

const orgList = (id, name, items) => ({
  "@type": "ItemList",
  "@id": id,
  name,
  itemListElement: items.map((x, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Organization", name: x.nom, description: x.desc, logo: x.logo ? site + x.logo : undefined, url: x.url || undefined }
  }))
})

const pageType = {
  "/a-propos": "AboutPage",
  "/contact": "ContactPage",
  "/realisations": "CollectionPage",
  "/produits": "CollectionPage"
}

function graph(r) {
  const g = [org, website]
  if (r === "/" || r === "/contact") g.push(local)
  if (r === "/") g.push(...services)
  g.push({
    "@type": pageType[r] ?? "WebPage",
    "@id": `${url(r)}#webpage`,
    url: url(r),
    name: routes[r].title,
    description: routes[r].description,
    inLanguage: "fr",
    isPartOf: { "@id": website["@id"] },
    about: { "@id": orgId },
    ...(r === "/contact" ? { mainEntity: { "@id": orgId } } : {})
  })
  if (r !== "/") {
    g.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: url("/") },
        { "@type": "ListItem", position: 2, name: shortName(r), item: url(r) }
      ]
    })
  }
  if (r === "/offres") g.push(catalog(), faqNode(content.faq, r))
  if (r === "/produits") {
    g.push({
      "@type": "ItemList",
      "@id": `${url(r)}#produits`,
      name: "Produits de productivité en développement",
      itemListElement: content.produits.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: p.nom,
          description: p.desc,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          featureList: p.features,
          url: p.url || undefined
        }
      }))
    })
  }
  if (r === "/partenaires") g.push(faqNode(content.partenariat.faq, r), orgList(`${url(r)}#partenaires`, "Partenaires de Sao Tech Agency", content.partenaires))
  if (r === "/realisations") g.push(orgList(`${url(r)}#clients`, "Clients de Sao Tech Agency", content.realisations.map((x) => ({ nom: x.nom, desc: x.desc, logo: x.logo, url: x.url }))))
  if (r === "/blog") g.push({ "@type": "Blog", "@id": `${url(r)}#blog`, name: "Blog Sao Tech Agency", url: url(r), inLanguage: "fr", publisher: { "@id": orgId } })
  return { "@context": "https://schema.org", "@graph": g }
}

// ---------- Versions Markdown ----------
const list = (a) => a.map((x) => `- ${x}`).join("\n")
const plans = (id) => content.offres.filter((o) => o.pole === id).map((o) => `- **${o.name}** — ${o.price} ${o.unit} : ${o.feats.join(" ; ")}`).join("\n")
const contactMd = `## Contact\n\n- WhatsApp : ${S.phone} (https://wa.me/${S.whatsapp})\n${S.email ? `- Email : ${S.email}\n` : ""}- Adresse : ${S.address}\n- Demande de devis : ${url("/contact")}\n- Demande de partenariat : ${url("/partenaires")}\n`
const head = (r, h1, intro) => `# ${h1}\n\n> ${intro ?? routes[r].description}\n\n`
const foot = (r) => `\n---\nPage HTML : ${url(r)}\n`
const sections = (arr) => arr.map((x) => `### ${x.titre}\n\n${x.texte}`).join("\n\n")

const mdPages = {
  "/": () => head("/", "Sao Tech Agency — Agence digitale à Uvira (RDC)") + `${content.slides[0].titre} ${content.slides[0].texte}\n\n## Trois pôles\n\n` + content.poles.map((p) => `### ${poleName(p)}\n\n${p.texte}\n\n${list(p.services)}`).join("\n\n") + `\n\n## Tarifs de départ\n\n` + content.poles.map((p) => `### ${p.nom}\n\n${content.offres.filter((o) => o.pole === p.id).slice(0, 3).map((o) => `- ${o.name} : ${o.price} ${o.unit}`).join("\n")}`).join("\n\n") + `\n\nTous les plans : ${url("/offres")}\n\n## Pourquoi nous choisir\n\n${sections(content.pourquoi)}\n\n${contactMd}`,
  "/offres": () => head("/offres", "Offres et tarifs") + [...content.poles.map((p) => ({ id: p.id, t: poleName(p) })), { id: "conseil", t: "Conseil" }].map((g) => `## ${g.t}\n\n${plans(g.id)}`).join("\n\n") + `\n\n## Questions fréquentes\n\n` + content.faq.map((f) => `**${f.q}**\n${f.a}`).join("\n\n") + `\n\n${contactMd}`,
  "/produits": () => head("/produits", "Produits de productivité (en développement)") + content.produits.map((p) => `## ${p.nom} (${p.statut})\n\n${p.tagline} ${p.desc}\n\n${list(p.features)}${p.url ? `\n\nAccès : ${p.url}` : ""}`).join("\n\n") + `\n\nListe d'attente : ${url("/produits")}#liste\n`,
  "/realisations": () => head("/realisations", "Réalisations") + content.realisations.map((x) => `## ${x.nom}\n\n${x.desc}. Réalisé : ${x.livre}.${x.url ? ` Projet en ligne : ${x.url}` : ""}`).join("\n\n") + "\n",
  "/partenaires": () => head("/partenaires", "Partenariats") + `${content.partenariat.intro}\n\n## Avantages\n\n${sections(content.partenariat.avantages)}\n\n## Formes de partenariat\n\n${sections(content.partenariat.types)}\n\n## Nos partenaires\n\n${list(content.partenaires.map((p) => `${p.nom}${p.desc ? ` — ${p.desc}` : ""}`))}\n\n## Questions fréquentes\n\n` + content.partenariat.faq.map((f) => `**${f.q}**\n${f.a}`).join("\n\n") + `\n\nDemande de partenariat : ${url("/partenaires")}#demande\n`,
  "/blog": () => head("/blog", "Blog") + `Le blog arrive bientôt. Thèmes prévus :\n\n${content.blog.topics.map((t) => `- **${t.titre}** : ${t.texte}`).join("\n")}\n`,
  "/a-propos": () => head("/a-propos", "À propos de Sao Tech Agency") + `${content.apropos.intro}\n\n## Mission, vision, objectif\n\n${sections(content.apropos.blocs.map((b) => ({ titre: b.titre, texte: b.texte })))}\n\n## Nos principes\n\n${sections(content.apropos.principes)}\n\n## Qui nous accompagnons\n\n${sections(content.apropos.publics)}\n`,
  "/contact": () => head("/contact", "Contact et devis") + `Envoyez votre brief par email via le formulaire du site, ou écrivez-nous sur WhatsApp.\n\n${contactMd}`,
}
const mdLegal = (r) => head(r, shortName(r)) + `Le texte complet est publié à l'adresse ${url(r)}.\n`

// ---------- Génération des pages ----------
const headLinks = `
<link rel="about" href="${site}/a-propos" />
<link rel="author" href="${site}/a-propos" />
<link rel="help" href="${site}/contact" />
<link rel="terms-of-service" href="${site}/conditions" />
<link rel="privacy-policy" href="${site}/confidentialite" />
<link rel="alternate" hreflang="fr" href="${site}/" />
<link rel="alternate" hreflang="en" href="${site}/" />
<link rel="alternate" hreflang="x-default" href="${site}/" />
`

const shell = `
<header>
  <nav aria-label="Menu principal">
    <a href="/">Accueil</a>
    <a href="/offres">Offres</a>
    <a href="/produits">Produits</a>
    <a href="/realisations">Réalisations</a>
    <a href="/partenaires">Partenaires</a>
    <a href="/blog">Blog</a>
    <a href="/a-propos" rel="about">À propos (About Us)</a>
    <a href="/contact" rel="help">Contact (Contact Us)</a>
  </nav>
</header>
<footer>
  <nav aria-label="Liens institutionnels et légaux">
    <a href="/a-propos" rel="about">About Us / À propos</a>
    <a href="/contact" rel="help">Contact Us / Contact</a>
    <a href="/conditions" rel="terms-of-service">Terms of Service / Conditions d'utilisation</a>
    <a href="/confidentialite" rel="privacy-policy">Privacy Policy / Politique de confidentialité</a>
    <a href="/cookies">Cookie Policy / Politique des cookies</a>
  </nav>
</footer>`

const h1s = {
  "/": content.slides[0].titre,
  "/offres": "Des offres claires, des prix affichés",
  "/produits": "Les outils du quotidien, bientôt disponibles",
  "/realisations": "Ils nous ont confié leur projet",
  "/partenaires": "Construisons ensemble",
  "/blog": "Le blog arrive bientôt",
  "/a-propos": "L'excellence technologique au service de l'Afrique",
  "/contact": "Parlons de votre projet"
}

for (const [route, m] of Object.entries(routes)) {
  let h = base
    .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(m.description)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url(route)}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(m.title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(m.description)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url(route)}"`)
    .replace("</head>", `${headLinks}\n<script type="application/ld+json">${JSON.stringify(graph(route))}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${shell}</div>`)
    .replace("<!--NOSCRIPT-->", `<noscript><h1>${esc(h1s[route] ?? shortName(route))}</h1><p>${esc(m.description)}</p></noscript>`)
  writeFileSync(route === "/" ? "dist/index.html" : `dist${route}.html`, h)
  writeFileSync(route === "/" ? "dist/index.md" : `dist${route}.md`, ((mdPages[route] ?? (() => mdLegal(route)))()) + foot(route))
}

// English alias pages
const aliases = {
  "/about": "/a-propos",
  "/privacy": "/confidentialite",
  "/terms": "/conditions",
  "/legal": "/conditions",
  "/services": "/offres",
  "/pricing": "/offres",
  "/portfolio": "/realisations",
  "/partners": "/partenaires"
}
for (const [alias, target] of Object.entries(aliases)) {
  const targetHtml = readFileSync(`dist${target}.html`, "utf8")
  writeFileSync(`dist${alias}.html`, targetHtml)
}

// Page 404 (servie avec le vrai statut 404 par .htaccess)
writeFileSync("dist/404.html", base
  .replace(/<title>.*?<\/title>/, "<title>Page introuvable | Sao Tech Agency</title>")
  .replace(/<link rel="canonical"[^>]*>\n?/, "").replace(/<meta property="og:url"[^>]*>\n?/, "")
  .replace("</head>", '<meta name="robots" content="noindex" />\n</head>')
  .replace("<!--NOSCRIPT-->", '<noscript><h1>Page introuvable / Page Not Found</h1><p><a href="/">Retour à l\'accueil / Back to Home</a></p></noscript>'))

// ---------- llms.txt, robots.txt, sitemap.xml ----------
const link = (r, d) => `- [${shortName(r)}](${url(r === "/" ? "/index" : r)}.md): ${d ?? routes[r].description}`
writeFileSync("dist/llms.txt", `# Sao Tech Agency

> Agence digitale basée à Uvira (Sud-Kivu, RDC) : image et marketing (Studio), sites et applications (Développement), réseaux et support technique (Réseau & Support). Prix affichés, devis par email ou WhatsApp.
> Digital agency based in Uvira (DRC): branding & marketing, web & app development, networking & IT support.

Sao Tech Agency (STA SARL) accompagne les entreprises, ONG, coopératives et institutions de la RDC et de la région. Le site est disponible en français et en anglais. Chaque page existe en Markdown : ajoutez « .md » à son adresse, ou envoyez l'en-tête « Accept: text/markdown ».

## Services et tarifs
${link("/offres")}
${link("/produits")}

## L'agence
${link("/")}
${link("/a-propos")}
${link("/realisations")}
${link("/partenaires")}
${link("/blog")}

## Contact
${link("/contact", `WhatsApp ${S.phone}${S.email ? `, email ${S.email}` : ""}, demande de devis par formulaire`)}

## Informations légales
${link("/conditions")}
${link("/confidentialite")}
${link("/cookies")}

## Optional
- [Plan du site](${site}/sitemap.xml): liste de toutes les pages
- [Serveur MCP en lecture seule](${site}/.well-known/mcp/server-card.json): services, tarifs, FAQ et contact interrogeables par un agent
`)
writeFileSync("dist/robots.txt", `User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`)
const d = new Date().toISOString().slice(0, 10)
writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(routes).map((r) => `  <url><loc>${url(r)}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`)

// ---------- Carte du serveur MCP (brouillon SEP-1649) ----------
mkdirSync("dist/.well-known/mcp", { recursive: true })
writeFileSync("dist/.well-known/mcp/server-card.json", JSON.stringify({
  $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
  $comment: "Carte au format du brouillon SEP-1649 ; le schéma peut évoluer. Serveur en lecture seule.",
  version: "1.0", protocolVersion: "2025-06-18",
  serverInfo: { name: "sao-tech-agency", title: "Sao Tech Agency", version: "1.0.0", description: "Informations publiques de Sao Tech Agency : services, tarifs, FAQ et contact." },
  description: "Serveur MCP en lecture seule de Sao Tech Agency (agence digitale à Uvira, RDC).",
  documentationUrl: `${site}/llms.txt`, endpoint: `${site}/api/mcp.php`,
  transport: { type: "streamable-http", endpoint: "/api/mcp.php" },
  capabilities: { tools: { listChanged: false } }, authentication: { required: false },
}, null, 2))

// ---------- Contenu par défaut pour l'installation ----------
mkdirSync("dist/data", { recursive: true })
writeFileSync("dist/data/content.default.json", JSON.stringify(content))
console.log(`SEO : ${Object.keys(routes).length} pages (HTML + Markdown), JSON-LD, llms.txt, robots.txt, sitemap.xml, 404.html, carte MCP et alias`)
