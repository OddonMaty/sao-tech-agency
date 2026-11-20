import { content } from "@/lib/content"

type Sec = { t: string; p?: string[]; li?: string[] }
const MAJ = "16 novembre 2026"

function Page({ titre, intro, secs, children }: { titre: string; intro: string; secs: Sec[]; children?: React.ReactNode }) {
  return (
    <>
      <section className="bg-primary text-primary-foreground"><div className="mx-auto max-w-3xl px-5 py-14"><h1 className="text-4xl md:text-5xl">{titre}</h1><p className="mt-3 text-primary-foreground/80">Dernière mise à jour : {MAJ}</p></div></section>
      <article className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-lg text-muted-foreground">{intro}</p>
        {secs.map((s, i) => (
          <section key={s.t} className="mt-10">
            <h2 className="text-2xl">{i + 1}. {s.t}</h2>
            {s.p?.map((x) => <p key={x} className="mt-3 leading-relaxed text-muted-foreground">{x}</p>)}
            {s.li && <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">{s.li.map((x) => <li key={x}>{x}</li>)}</ul>}
          </section>
        ))}
        {children}
      </article>
    </>
  )
}

export function Confidentialite() {
  const s = content.settings
  const contact = `${s.email ? `par email à ${s.email}, ` : ""}par WhatsApp au ${s.phone} ou via la page Contact du site`
  const secs: Sec[] = [
    { t: "Qui sommes-nous ?", p: [`Le site saotechagency.com est édité par Sao Tech Agency (STA SARL), agence digitale basée à ${s.address}. Sao Tech Agency est responsable du traitement des données personnelles collectées sur ce site.`, `Vous pouvez nous contacter ${contact}.`] },
    { t: "Les données que nous collectons", p: ["Nous ne collectons que les données que vous nous transmettez volontairement, ainsi que quelques données techniques indispensables."],
      li: ["Formulaires (devis, contact, partenariat, liste d'attente des produits, abonnement au blog) : nom, organisation, adresse email, téléphone, ville ou pays, budget estimé et contenu de votre message.", "Données techniques : une empreinte non réversible de votre adresse IP, utilisée uniquement pour limiter les envois abusifs, et les journaux de connexion de notre hébergeur.", "WhatsApp : si vous nous écrivez via WhatsApp, vos messages sont aussi soumis aux conditions de WhatsApp (Meta)."] },
    { t: "Pourquoi nous utilisons vos données", li: ["Répondre à vos demandes et établir vos devis (mesures précontractuelles et exécution du service).", "Étudier votre demande de partenariat et vous répondre.", "Vous informer du lancement d'un produit ou d'un article de blog lorsque vous en faites la demande (votre consentement).", "Protéger le site contre les abus et les robots (notre intérêt légitime à sécuriser le service)."], p: ["Nous ne vendons pas vos données et nous ne les utilisons pas pour de la publicité ciblée."] },
    { t: "Qui reçoit vos données ?", p: ["Vos données sont accessibles à l'équipe de Sao Tech Agency habilitée à traiter les demandes. Nous faisons appel à des prestataires techniques strictement nécessaires :"],
      li: ["Hostinger, notre hébergeur, qui stocke le site, la base de données et achemine les emails.", "Google, pour l'affichage des polices de caractères, de la carte de la page Contact et de la connexion à l'espace d'administration (réservé à l'équipe).", "WhatsApp (Meta), uniquement si vous choisissez ce canal pour nous écrire.", "Les autorités compétentes, si la loi nous y oblige."] },
    { t: "Transferts hors de la République démocratique du Congo", p: ["Nos prestataires peuvent stocker ou traiter des données dans d'autres pays. Nous choisissons des prestataires reconnus et nous limitons l'accès aux données au strict nécessaire."] },
    { t: "Combien de temps conservons-nous vos données ?", li: ["Demandes de devis, de contact et de partenariat : 24 mois après notre dernier échange, ou pendant la durée de la relation commerciale et des obligations légales si un projet est conclu.", "Inscriptions aux annonces (produits, blog) : jusqu'à votre désinscription.", "Empreintes techniques anti-abus : conservées avec la demande concernée."] },
    { t: "Vos droits", p: ["Vous pouvez à tout moment demander l'accès à vos données, leur rectification, leur effacement, la limitation ou l'opposition à leur traitement, et retirer votre consentement lorsqu'il a été donné.", `Pour exercer ces droits, écrivez-nous ${contact}. Nous répondons dans un délai raisonnable, en principe un mois. Il peut vous être demandé de justifier de votre identité.`, "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l'autorité compétente en matière de protection des données."] },
    { t: "Sécurité", p: ["Le site est servi en HTTPS. L'accès à l'espace d'administration est réservé aux comptes Google expressément autorisés. Nous prenons des mesures raisonnables pour protéger vos données, sans pouvoir garantir une sécurité absolue sur Internet."] },
    { t: "Mineurs", p: ["Ce site s'adresse aux professionnels et aux organisations. Il n'est pas destiné aux mineurs et nous ne collectons pas sciemment leurs données."] },
    { t: "Liens vers d'autres sites", p: ["Notre site contient des liens vers des réseaux sociaux et des services tiers (Facebook, Instagram, LinkedIn, TikTok, WhatsApp, Google Maps). Leurs pratiques relèvent de leurs propres politiques de confidentialité."] },
    { t: "Modification de cette politique", p: ["Nous pouvons mettre à jour cette politique pour refléter l'évolution du site ou de la loi. La date de dernière mise à jour figure en haut de cette page."] },
  ]
  return <Page titre="Politique de confidentialité" intro="Votre vie privée compte pour nous. Cette page explique, simplement, quelles données personnelles nous collectons sur ce site, pourquoi, et comment vous gardez la maîtrise." secs={secs} />
}

export function Cookies() {
  const secs: Sec[] = [
    { t: "Qu'est-ce qu'un cookie ?", p: ["Un cookie est un petit fichier enregistré sur votre appareil lorsque vous visitez un site. Le « stockage local » du navigateur fonctionne de façon comparable. Ces mécanismes permettent de mémoriser un choix ou de faire fonctionner un service."] },
    { t: "Ce que nous utilisons", p: ["Notre site n'utilise que des cookies et stockages techniques, nécessaires à son fonctionnement. Ils ne demandent pas de consentement préalable. Nous n'utilisons à ce jour aucun cookie publicitaire ni outil de mesure d'audience."] },
    { t: "Services tiers pouvant déposer des cookies", li: ["Google Fonts : les polices sont chargées depuis les serveurs de Google, qui reçoivent l'adresse IP de votre appareil.", "Google Maps (page Contact) : la carte intégrée peut déposer des cookies de Google lorsqu'elle s'affiche.", "WhatsApp, Facebook, Instagram, LinkedIn, TikTok : ces services ne déposent rien tant que vous restez sur notre site ; leurs cookies s'appliquent seulement si vous ouvrez leurs pages."] },
    { t: "Comment gérer les cookies ?", p: ["Vous pouvez supprimer ou bloquer les cookies à tout moment depuis les paramètres de votre navigateur (Chrome, Firefox, Safari, Edge). Bloquer les cookies techniques peut empêcher certaines fonctions, par exemple l'affichage de la carte de la page Contact."] },
    { t: "Questions", p: [`Pour toute question sur cette politique, contactez-nous ${content.settings.email ? `à ${content.settings.email} ou ` : ""}via la page Contact. Pour savoir comment nous traitons vos données personnelles, consultez notre politique de confidentialité.`] },
  ]
  return (
    <Page titre="Politique des cookies" intro="Cette page décrit les cookies et stockages utilisés par le site de Sao Tech Agency, leur utilité et la manière de les contrôler." secs={secs}>
      <section className="mt-10">
        <h2 className="text-2xl">Liste des éléments utilisés</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-muted"><tr><th className="p-3">Nom</th><th className="p-3">Finalité</th><th className="p-3">Durée</th><th className="p-3">Type</th></tr></thead>
            <tbody className="divide-y text-muted-foreground">
              <tr><td className="p-3 font-mono text-xs">sta-cookies</td><td className="p-3">Mémorise que vous avez lu l'information sur les cookies</td><td className="p-3">Jusqu'à suppression</td><td className="p-3">Stockage local, nécessaire</td></tr>
              <tr><td className="p-3 font-mono text-xs">sta_admin</td><td className="p-3">Session de l'espace d'administration (équipe uniquement, jamais déposé aux visiteurs)</td><td className="p-3">30 jours</td><td className="p-3">Cookie, nécessaire</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </Page>
  )
}

export function Conditions() {
  const s = content.settings
  const secs: Sec[] = [
    { t: "Éditeur et objet", p: [`Le site saotechagency.com est édité par Sao Tech Agency (STA SARL), agence digitale basée à ${s.address}. Les présentes conditions encadrent l'utilisation du site : en le consultant, vous les acceptez.`] },
    { t: "Accès au site", p: ["Le site est accessible gratuitement, sauf frais de connexion à votre charge. Nous faisons le nécessaire pour qu'il soit disponible en continu, sans pouvoir garantir l'absence d'interruptions liées à la maintenance ou à des incidents techniques."] },
    { t: "Offres, prix et devis", li: ["Les prix affichés sont des prix de départ indicatifs, exprimés en dollars américains.", "Seul un devis accepté par écrit (email ou WhatsApp) engage Sao Tech Agency et le client sur le contenu, le prix et les délais.", "Les formulaires du site ne constituent ni une commande, ni un paiement."] },
    { t: "Produits en développement", p: ["Les produits présentés dans la rubrique Produits sont en cours de conception. Les fonctionnalités indiquées sont informatives, non contractuelles, et peuvent évoluer ou ne pas être commercialisées."] },
    { t: "Propriété intellectuelle", p: ["Les textes, images, logos, éléments graphiques et le code du site appartiennent à Sao Tech Agency ou à ses partenaires, et sont protégés. Toute reproduction ou réutilisation sans autorisation écrite est interdite. Les logos de nos clients et partenaires restent la propriété de leurs titulaires."] },
    { t: "Utilisation conforme", li: ["Ne pas envoyer de messages abusifs, frauduleux ou automatisés en masse.", "Ne pas tenter de perturber le site, d'accéder aux espaces réservés ou de contourner les protections.", "Fournir des informations exactes dans les formulaires."] },
    { t: "Liens externes", p: ["Le site renvoie vers des services tiers (réseaux sociaux, WhatsApp, cartes). Nous ne contrôlons pas leur contenu et déclinons toute responsabilité à leur sujet."] },
    { t: "Responsabilité", p: ["Nous apportons le plus grand soin aux informations publiées, sans garantir leur exhaustivité ni leur exactitude permanente. Sao Tech Agency ne peut être tenue responsable des dommages indirects liés à l'utilisation du site."] },
    { t: "Données personnelles et cookies", p: ["Le traitement de vos données est décrit dans notre politique de confidentialité et notre politique des cookies, accessibles en bas de chaque page."] },
    { t: "Droit applicable", p: ["Les présentes conditions sont soumises au droit applicable en République démocratique du Congo. En cas de différend, nous privilégions d'abord une solution amiable."] },
    { t: "Modification des conditions", p: ["Nous pouvons modifier ces conditions à tout moment. La version en vigueur est celle publiée sur cette page, avec sa date de mise à jour."] },
  ]
  return <Page titre="Conditions d'utilisation" intro="Ces conditions expliquent les règles d'utilisation du site de Sao Tech Agency, en langage simple." secs={secs} />
}
