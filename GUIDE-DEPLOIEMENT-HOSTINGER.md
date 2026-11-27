# Guide de déploiement pas à pas — Sao Tech Agency sur Hostinger

Ce guide met en ligne le site public, l'espace d'administration (PWA) et la base de données MySQL. Comptez environ 45 minutes la première fois.

## Ce que vous mettez en ligne

| Élément | Adresse | Rôle |
|---|---|---|
| Site public | `https://saotechagency.com` | Pages, formulaires de devis, de partenariat et de contact |
| Administration (PWA) | `https://saotechagency.com/admin/` | Tableau de bord, demandes, contenu, médias, notifications |
| API PHP | `https://saotechagency.com/api/` | Enregistre les demandes, envoie les emails et les notifications |
| Base de données MySQL | hPanel | Demandes, abonnements aux notifications, historique du contenu |

**Prérequis :** un hébergement Hostinger avec PHP 8.1 ou plus et MySQL (offres Premium, Business ou Cloud), le domaine `saotechagency.com` relié à l'hébergement, et un compte Gmail pour vous connecter à l'administration.

---

## Étape 1 — Préparer les fichiers

Vous avez deux possibilités :

- **Version prête à envoyer** : utilisez `site-pret-a-deployer.zip` (le site est déjà compilé). Passez à l'étape 2.
- **Depuis les sources** : dans le dossier du projet, lancez `npm install` puis `npm run build`. Le dossier `dist/` contient alors le site complet. Compressez **le contenu** de `dist/` (pas le dossier lui-même) en `.zip`.

Si vous utilisez un autre domaine que `saotechagency.com`, modifiez d'abord la ligne `site` dans `src/data/content.json` (section `seo`), puis recompilez.

## Étape 2 — Configurer l'hébergement dans hPanel

1. **SSL** : *Sécurité → SSL*. Vérifiez que le certificat du domaine est actif. L'administration et les notifications exigent HTTPS.
2. **PHP** : *Avancé → Configuration PHP*. Choisissez **PHP 8.1 ou supérieur**. Dans l'onglet *Extensions PHP*, vérifiez que sont activées : `curl`, `openssl`, `pdo_mysql`, `mbstring`, `json`, `fileinfo`.
3. **Base de données** : *Bases de données → Gestion*. Créez une base MySQL avec un nom, un utilisateur et un mot de passe robuste. **Notez les trois valeurs complètes** : Hostinger ajoute un préfixe du type `u123456789_`. L'hôte est `localhost`.
4. **Emails** : *Emails → Comptes email*. Créez deux boîtes :
   - `contact@saotechagency.com` : reçoit les demandes.
   - `no-reply@saotechagency.com` : adresse d'expédition des notifications.
   Si vous utilisez d'autres adresses, reportez-les à l'étape 5.

## Étape 3 — Déployer le site (depuis GitHub)

Le site est déployé automatiquement depuis la branche `main` du dépôt GitHub (menu *Sites web → Importer un projet GitHub* de hPanel). Chaque envoi sur `main` déclenche une nouvelle compilation sur Hostinger.

> **À retenir :** Hostinger **remplace tout le contenu de `public_html` à chaque déploiement**. Tout fichier qui n'est pas dans le dépôt y est supprimé. C'est pourquoi la configuration est placée **hors de `public_html`** (étape 5) et que le contenu publié et les images sont stockés **dans la base de données**.

## Étape 4 — Créer l'accès Google (connexion par Gmail)

1. Allez sur https://console.cloud.google.com et créez un projet (par exemple « Sao Tech Admin »).
2. *API et services → Écran de consentement OAuth* : type **Externe**, nom de l'application « Sao Tech Agency », votre email d'assistance. Passez l'état à **En production** (ou ajoutez votre Gmail comme utilisateur test).
3. *API et services → Identifiants → Créer des identifiants → ID client OAuth*, type **Application Web**.
4. Dans **Origines JavaScript autorisées**, ajoutez :
   - `https://saotechagency.com`
   - `https://www.saotechagency.com` (si vous utilisez le « www »)
5. Validez et **copiez l'ID client** (il se termine par `.apps.googleusercontent.com`). Aucun secret n'est nécessaire.

## Étape 5 — Créer le fichier de configuration (hors de `public_html`)

1. Dans hPanel, ouvrez **Fichiers → Gestionnaire de fichiers**. Remontez à la **racine de votre compte** (le dossier qui contient `domains`), pas dans `public_html`.
2. Créez un dossier nommé **`sta-data`** à cette racine.
3. Dans `sta-data`, créez un fichier nommé exactement **`config.php`** avec ce contenu, en remplaçant les valeurs en majuscules :

```php
<?php
return [
  'db_host' => 'localhost',
  'db_name' => 'u641852256_NOM_BASE',
  'db_user' => 'u641852256_UTILISATEUR',
  'db_pass' => 'MOT_DE_PASSE_BASE',
  'site_url' => 'https://saotechagency.com',
  'google_client_id' => 'VOTRE_ID.apps.googleusercontent.com',
  'admin_emails' => ['votre.gmail@gmail.com'],
  'notify_email' => 'VOTRE_EMAIL_PRO',
  'mail_from' => 'VOTRE_EMAIL_PRO',
  'vapid_subject' => 'mailto:VOTRE_EMAIL_PRO',
  'install_token' => 'UNE_LONGUE_PHRASE_ALEATOIRE_LETTRES_ET_CHIFFRES',
];
```

4. Le serveur cherche ce fichier dans `sta-data/config.php`, puis dans `domains/saotechagency.com/sta-config.php`. Ne le placez jamais dans `public_html` : il serait supprimé au prochain déploiement.
5. Ne partagez jamais ce fichier. Il n'existe que sur le serveur.

## Étape 6 — Installer la base de données

1. Ouvrez dans le navigateur : `https://saotechagency.com/api/install.php?token=VOTRE_install_token`
2. Le message **« Installation terminée »** apparaît. Cette étape crée les tables (demandes, notifications, contenu, images), génère la clé des notifications et enregistre le contenu initial.
3. Vérifiez dans **phpMyAdmin** que les tables `requests`, `push_subs`, `settings`, `content_versions` et `media` existent.
4. **Ne supprimez pas `install.php`** : il est remis à chaque déploiement. Il reste protégé par votre jeton et par le verrou `sta-data/.installed`.
5. Une installation déjà faite n'est pas à refaire : si la base existe déjà, il suffit de recréer `sta-data/config.php` avec les mêmes identifiants.

## Étape 7 — Première connexion et notifications

1. Ouvrez `https://saotechagency.com/admin/` et cliquez sur **Se connecter avec Google**. Seuls les comptes listés dans `admin_emails` sont acceptés.
2. **Installer l'application** : sur Chrome ou Edge, bouton « Installer l'application » dans le menu latéral. Sur Android : menu du navigateur → *Installer l'application*. Sur iPhone : Safari → Partager → *Sur l'écran d'accueil*.
3. **Activer les notifications** : menu *Notifications et compte* → *Activer sur cet appareil* → autorisez, puis cliquez *Envoyer un test*. Faites-le sur chaque appareil (ordinateur et téléphone).
   - Sur iPhone, les notifications fonctionnent seulement si l'application est installée sur l'écran d'accueil (iOS 16.4 ou plus).

## Étape 8 — Tester le tout

1. Sur le site, ouvrez `/contact`, remplissez le brief et cliquez **Envoyer par email**.
2. Contrôlez : le message de confirmation s'affiche, l'email arrive dans `contact@saotechagency.com`, la demande apparaît dans *Demandes* et une notification arrive sur vos appareils.
3. Faites de même avec `/partenaires` (demande de partenariat).
4. Si l'email n'arrive pas : regardez les courriers indésirables et vérifiez que `mail_from` est une adresse existante du domaine.

## Étape 9 — Référencement (SEO)

1. Ouvrez https://search.google.com/search-console et ajoutez la propriété `https://saotechagency.com` (validation par DNS ou par balise).
2. Menu *Sitemaps* : soumettez `sitemap.xml`.
3. Dans l'administration, section *Référencement (SEO)*, vous pouvez ajuster le titre (60 caractères) et la description (160 caractères) de chaque page.
4. Créez aussi une fiche Google Business Profile à l'adresse de l'agence : c'est le meilleur levier pour apparaître sur « agence digitale Uvira ».

## Gérer le site au quotidien

- **Modifier le contenu** (textes, offres, FAQ, carrousel, partenaires, produits, réseaux, liens, images) : tout se fait dans `/admin/`, section *Contenu du site*, puis bouton **Publier**. Le contenu est enregistré dans la base de données : la modification est visible immédiatement et survit aux déploiements.
- **Historique** : *Notifications et compte* conserve les 30 dernières publications et permet de restaurer une version.
- **Modifier le code ou le design** : envoyez les modifications sur la branche `main` de GitHub ; Hostinger recompile et redéploie tout seul. Vos données (base, configuration `sta-data`, images) ne sont pas touchées.

## Sauvegardes

- *Fichiers → Sauvegardes* (hPanel) : activez les sauvegardes automatiques.
- Exportez régulièrement la base : phpMyAdmin → *Exporter*.
- Vos images et le contenu publié sont dans la base de données : l'export phpMyAdmin les contient. Gardez aussi une copie de `sta-data/config.php` dans un gestionnaire de mots de passe.

## Dépannage

| Symptôme | Cause probable et solution |
|---|---|
| `/offres` renvoie une erreur 404 | `.htaccess` absent : activez les fichiers cachés et renvoyez-le |
| Page blanche sur le site | Videz le cache du navigateur ; vérifiez que `assets/` est complet |
| « config.php manquant » | `sta-data/config.php` absent ou mal placé (étape 5). Il doit être à la racine du compte, pas dans `public_html` |
| Erreur 500 sur `/api/` | PHP inférieur à 8.1, ou extension manquante (étape 2) |
| Google : `origin_mismatch` | L'adresse du site n'est pas dans les *Origines JavaScript autorisées* (étape 4) |
| « Ce compte Google n'est pas autorisé » | Ajoutez l'adresse dans `admin_emails` |
| Bouton Google absent | Bloqueur de publicité, ou ID client incorrect dans `config.php` |
| Pas de notification | Notifications bloquées dans le navigateur ; sur iPhone, installez d'abord l'application |
| Envoi d'image refusé | Image de plus de 5 Mo ou format non pris en charge ; les images sont enregistrées en base de données (aucun droit de dossier à régler) |
| Emails reçus en spam | Utilisez des adresses du domaine (étape 2) et gardez les DNS chez Hostinger (SPF et DKIM automatiques) |

## Aperçu local (sans serveur)

`npm run dev` lance le site sur http://localhost:5173. L'administration est accessible sur http://localhost:5173/admin/ en **mode démonstration** (données factices, aucune connexion requise) : pratique pour voir le design. Le vrai fonctionnement (connexion, base de données, notifications) nécessite l'hébergement PHP/MySQL.
