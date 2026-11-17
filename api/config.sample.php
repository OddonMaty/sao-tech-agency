<?php
// Copiez ce fichier en « config.php » sur le serveur (ne le mettez jamais dans Git) puis remplissez les valeurs.
return [
  'db_host' => 'localhost',
  'db_name' => 'u123456789_sta',
  'db_user' => 'u123456789_sta',
  'db_pass' => 'MOT_DE_PASSE_BASE',
  'site_url' => 'https://saotechagency.com',
  'google_client_id' => 'XXXXXXXX.apps.googleusercontent.com',
  'admin_emails' => ['votre.adresse@gmail.com'],      // seules ces adresses Gmail peuvent entrer dans l'admin
  'notify_email' => 'contact@saotechagency.com',      // reçoit les demandes de devis et de partenariat
  'mail_from' => 'no-reply@saotechagency.com',        // adresse du même domaine, créée dans hPanel
  'vapid_subject' => 'mailto:contact@saotechagency.com',
  'install_token' => 'CHANGEZ-MOI-PAR-UN-LONG-TEXTE-ALEATOIRE',
];
