# Sao Tech Agency — refonte (React + Tailwind + shadcn/ui)

    npm install
    npm run dev      # développement
    npm run build    # production (dossier dist/)

Pages : Accueil, Offres, Réalisations, À propos, Contact (routage par chemins, `public/_redirects` pour Netlify).
Données : `src/data/` (offres.json, faq.json, team.json extraits de l'ancien site ; « à vie » remplacé par « an »).
Composants shadcn/ui : Button, Card, Badge, Accordion, Input/Textarea/Select (`src/components/ui`).
Logos : `public/brand/` (horizontal couleur pour l'en-tête, horizontal inverse pour le pied de page), favicon, apple-touch-icon et og-image dans `public/`. Palette mesurée sur les nouveaux logos (variables dans `src/index.css`).
Pas encore repris : devis PDF, pages détaillées par service, SEO par page (JSON-LD, sitemap).

## Projet complet
- Site public : `index.html` + `src/` (React, Tailwind, shadcn/ui)
- Administration (PWA, connexion Google) : `admin/index.html` + `src/admin/`
- API PHP/MySQL : `public/api/` · contenu éditable : `src/data/content.json` (publié ensuite depuis l'admin)
- Déploiement Hostinger : voir `GUIDE-DEPLOIEMENT-HOSTINGER.md`
