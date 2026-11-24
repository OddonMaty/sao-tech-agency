import React, { createContext, useContext, useEffect, useState } from "react"
import defaultsFr from "@/data/content.json"
import { Content, content as liveFr, contentEn as liveEn } from "@/lib/content"

export type Lang = "fr" | "en"

interface I18nContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  content: Content
}

const uiTranslations: Record<Lang, Record<string, string>> = {
  fr: {
    "nav.accueil": "Accueil",
    "nav.offres": "Offres",
    "nav.produits": "Produits",
    "nav.realisations": "Réalisations",
    "nav.partenaires": "Partenaires",
    "nav.blog": "Blog",
    "nav.apropos": "À propos",
    "nav.contact": "Contact",
    "cta.whatsapp": "WhatsApp",
    "cta.viewOffers": "Voir les offres",
    "cta.seeDetails": "Voir les détails",
    "cta.startProject": "Démarrer un projet",
    "legal.terms": "Conditions d'utilisation",
    "legal.privacy": "Politique de confidentialité",
    "legal.cookies": "Politique des cookies",
    "footer.rights": "Tous droits réservés.",
    "footer.slogan": "Créer. Construire. Connecter.",
    "home.based": "Basés à Uvira",
    "home.based_sub": "Clients en RDC et dans la région",
    "home.prices": "Prix affichés",
    "home.prices_sub": "Plans clairs, sans surprise",
    "home.quote": "Devis sur WhatsApp",
    "home.quote_sub": "Une réponse directe de l'équipe",
    "home.what_we_do": "Ce que nous faisons",
    "home.three_poles": "Trois pôles, un seul interlocuteur",
    "home.poles_sub": "Créer votre image, construire vos outils, connecter votre organisation : chaque pôle a ses plans et ses prix.",
    "home.how_it_works": "Comment ça se passe",
    "home.four_steps": "De votre message à la livraison, en quatre étapes",
    "steps.1.t": "Vous nous écrivez",
    "steps.1.d": "Décrivez votre projet sur WhatsApp, avec le brief du site.",
    "steps.2.t": "Nous établissons le devis",
    "steps.2.d": "Un plan clair, un prix, un périmètre précis.",
    "steps.3.t": "Le projet démarre",
    "steps.3.d": "En général, un acompte de 50 % lance le travail ; le solde est réglé à la livraison.",
    "steps.4.t": "Livraison et suivi",
    "steps.4.d": "Votre projet est livré, puis suivi pendant la période de support de votre plan.",
    "cookie.text": "Nous utilisons des cookies essentiels pour assurer le bon fonctionnement du site.",
    "cookie.accept": "Accepter",
    "contact.hero_kicker": "Contact et devis",
    "contact.hero_titre": "Parlons de votre projet",
    "contact.hero_texte": "Envoyez votre brief par email ou directement sur WhatsApp : nous vous répondons avec un devis.",
    "contact.form_titre": "Votre brief de projet",
    "contact.form_sub": "Quelques lignes suffisent, nous revenons vers vous avec un devis.",
    "contact.send": "Envoyer la demande",
    "contact.sending": "Envoi en cours...",
    "contact.sent": "Demande envoyée ! Nous vous répondrons très rapidement.",
    "contact.error": "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter sur WhatsApp.",
    "contact.name": "Votre nom complet *",
    "contact.org": "Organisation / Entreprise *",
    "contact.email": "Votre adresse email *",
    "contact.phone": "Numéro de téléphone / WhatsApp *",
    "contact.location": "Votre ville / Localisation *",
    "contact.budget": "Budget estimé (en $ USD)",
    "contact.message": "Description de votre besoin / brief *",
    "contact.pole_select": "Pôle concerné"
  },
  en: {
    "nav.accueil": "Home",
    "nav.offres": "Services & Pricing",
    "nav.produits": "Products",
    "nav.realisations": "Portfolio",
    "nav.partenaires": "Partners",
    "nav.blog": "Blog",
    "nav.apropos": "About Us",
    "nav.contact": "Contact",
    "cta.whatsapp": "WhatsApp",
    "cta.viewOffers": "View Services",
    "cta.seeDetails": "View details",
    "cta.startProject": "Start a Project",
    "legal.terms": "Terms of Service",
    "legal.privacy": "Privacy Policy",
    "legal.cookies": "Cookie Policy",
    "footer.rights": "All rights reserved.",
    "footer.slogan": "Create. Build. Connect.",
    "home.based": "Based in Uvira",
    "home.based_sub": "Clients across DRC & East Africa",
    "home.prices": "Transparent Pricing",
    "home.prices_sub": "Fixed plans, zero surprises",
    "home.quote": "Quotes on WhatsApp",
    "home.quote_sub": "Direct response from our team",
    "home.what_we_do": "What We Do",
    "home.three_poles": "Three Divisions, One Partner",
    "home.poles_sub": "Branding, software engineering, IT networks: clear plans and transparent pricing for each division.",
    "home.how_it_works": "How It Works",
    "home.four_steps": "From your initial inquiry to final delivery, in four steps",
    "steps.1.t": "Get in touch",
    "steps.1.d": "Tell us about your project brief on WhatsApp or via our contact form.",
    "steps.2.t": "Quote & scope",
    "steps.2.d": "We define a clear plan, deliverables, and a transparent fixed price.",
    "steps.3.t": "Kickoff",
    "steps.3.d": "A 50% deposit begins the build; remaining balance upon final delivery.",
    "steps.4.t": "Delivery & support",
    "steps.4.d": "Your project is launched and backed by our dedicated support warranty.",
    "cookie.text": "We use strictly necessary cookies to ensure the website runs properly.",
    "cookie.accept": "Accept",
    "contact.hero_kicker": "Contact & Free Quote",
    "contact.hero_titre": "Let's discuss your project",
    "contact.hero_texte": "Send your brief by email or directly on WhatsApp: we will respond promptly with a tailored quote.",
    "contact.form_titre": "Your Project Brief",
    "contact.form_sub": "A few lines are enough to get started. We will get back to you with an estimate.",
    "contact.send": "Submit Inquiry",
    "contact.sending": "Sending...",
    "contact.sent": "Inquiry sent successfully! We will get back to you very soon.",
    "contact.error": "An error occurred while sending. Please try again or reach out directly on WhatsApp.",
    "contact.name": "Full Name *",
    "contact.org": "Company / Organization *",
    "contact.email": "Email Address *",
    "contact.phone": "Phone / WhatsApp *",
    "contact.location": "City / Location *",
    "contact.budget": "Estimated Budget (USD)",
    "contact.message": "Project brief / requirements *",
    "contact.pole_select": "Service Division"
  }
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr"
    const saved = localStorage.getItem("sta_lang") as Lang
    if (saved === "fr" || saved === "en") return saved
    return navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr"
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== "undefined") {
      localStorage.setItem("sta_lang", l)
      document.documentElement.lang = l
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang])

  const t = (key: string): string => {
    return uiTranslations[lang]?.[key] ?? uiTranslations.fr[key] ?? key
  }

  const content = (lang === "en" ? liveEn : liveFr) as unknown as Content

  return (
    <I18nContext.Provider value={{ lang, setLang, t, content }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    return {
      lang: "fr",
      setLang: () => {},
      t: (k: string) => uiTranslations.fr[k] ?? k,
      content: defaultsFr as unknown as Content
    }
  }
  return ctx
}
