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

## Étape 3 — Envoyer les fichiers

1. *Fichiers → Gestionnaire de fichiers*, ouvrez `public_html`. Supprimez le fichier par défaut de Hostinger (`default.php`) s'il existe.
2. Cliquez sur *Téléverser*, envoyez votre `.zip`, puis clic droit → *Extraire* directement dans `public_html`.
3. Activez *Afficher les fichiers cachés* (roue dentée en haut à droite) et vérifiez que **`.htaccess`** est bien présent dans `public_html`. Sans lui, les adresses comme `/offres` donneront une erreur 404.
4. Vous devez voir : `index.html`, `offres.html`, `assets/`, `admin/`, `api/`, `img/`, `sitemap.xml`, `robots.txt`, `.htaccess`.

## Étape 4 — Créer l'accès Google (connexion par Gmail)

1. Allez sur https://console.cloud.google.com et créez un projet (par exemple « Sao Tech Admin »).
2. *API et services → Écran de consentement OAuth* : type **Externe**, nom de l'application « Sao Tech Agency », votre email d'assistance. Passez l'état à **En production** (ou ajoutez votre Gmail comme utilisateur test).
3. *API et services → Identifiants → Créer des identifiants → ID client OAuth*, type **Application Web**.
4. Dans **Origines JavaScript autorisées**, ajoutez :
   - `https://saotechagency.com`
   - `https://www.saotechagency.com` (si vous utilisez le « www »)
5. Validez et **copiez l'ID client** (il se termine par `.apps.googleusercontent.com`). Aucun secret n'est nécessaire.

## Étape 5 — Renseigner le fichier de configuration

1. Dans `public_html/api/`, copiez `config.sample.php` et nommez la copie **`config.php`**.
2. Modifiez-le (clic droit → *Modifier*) :

| Clé | Valeur |
|---|---|
| `db_host` | `localhost` |
| `db_name`, `db_user`, `db_pass` | Les valeurs notées à l'étape 2 |
| `site_url` | `https://saotechagency.com` |
| `google_client_id` | L'ID client de l'étape 4 |
| `admin_emails` | Vos adresses Gmail autorisées, par exemple `['vous@gmail.com', 'collegue@gmail.com']` |
| `notify_email` | `contact@saotechagency.com` |
| `mail_from` | `no-reply@saotechagency.com` |
| `vapid_subject` | `mailto:contact@saotechagency.com` |
| `install_token` | Un long texte aléatoire (30 caractères ou plus) |

3. Ne partagez jamais ce fichier. Il n'est pas inclus dans le projet, il n'existe que sur le serveur.

## Étape 6 — Installer la base de données

1. Ouvrez dans le navigateur : `https://saotechagency.com/api/install.php?token=VOTRE_install_token`
2. Le message **« Installation terminée »** apparaît. Cette étape crée les 4 tables (`requests`, `push_subs`, `settings`, `content_versions`), génère la clé des notifications et enregistre le contenu initial.
3. Vérifiez dans *Bases de données → phpMyAdmin* que les tables existent.
4. **Sécurité :** supprimez maintenant `api/install.php` depuis le gestionnaire de fichiers. Un fichier `api/.installed` empêche déjà de relancer l'installation.

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

- **Modifier le contenu** (textes, offres, FAQ, carrousel, partenaires, produits, réseaux, images) : tout se fait dans `/admin/`, section *Contenu du site*, puis bouton **Publier**. La modification est visible immédiatement, sans redéploiement.
- **Historique** : *Notifications et compte* conserve les 30 dernières publications et permet de restaurer une version.
- **Modifier le code ou le design** : changez les sources, lancez `npm run build`, puis renvoyez le contenu de `dist/` dans `public_html` en écrasant les fichiers. Vos données sont conservées, car `api/config.php`, `uploads/` et `live/` n'existent pas dans `dist/`.

## Sauvegardes

- *Fichiers → Sauvegardes* (hPanel) : activez les sauvegardes automatiques.
- Exportez régulièrement la base : phpMyAdmin → *Exporter*.
- Copiez de temps en temps les dossiers `uploads/` (vos images) et `live/` (le contenu publié).

## Dépannage

| Symptôme | Cause probable et solution |
|---|---|
| `/offres` renvoie une erreur 404 | `.htaccess` absent : activez les fichiers cachés et renvoyez-le |
| Page blanche sur le site | Videz le cache du navigateur ; vérifiez que `assets/` est complet |
| « config.php manquant » | L'étape 5 n'est pas faite, ou le fichier n'est pas dans `api/` |
| Erreur 500 sur `/api/` | PHP inférieur à 8.1, ou extension manquante (étape 2) |
| Google : `origin_mismatch` | L'adresse du site n'est pas dans les *Origines JavaScript autorisées* (étape 4) |
| « Ce compte Google n'est pas autorisé » | Ajoutez l'adresse dans `admin_emails` |
| Bouton Google absent | Bloqueur de publicité, ou ID client incorrect dans `config.php` |
| Pas de notification | Notifications bloquées dans le navigateur ; sur iPhone, installez d'abord l'application |
| Envoi d'image refusé | Image de plus de 5 Mo ou format non pris en charge ; vérifiez les droits du dossier `uploads/` (755) |
| Emails reçus en spam | Utilisez des adresses du domaine (étape 2) et gardez les DNS chez Hostinger (SPF et DKIM automatiques) |

## Aperçu local (sans serveur)

`npm run dev` lance le site sur http://localhost:5173. L'administration est accessible sur http://localhost:5173/admin/ en **mode démonstration** (données factices, aucune connexion requise) : pratique pour voir le design. Le vrai fonctionnement (connexion, base de données, notifications) nécessite l'hébergement PHP/MySQL.
