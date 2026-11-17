<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
header('Content-Type: text/html; charset=utf-8');
$lock = __DIR__ . '/.installed';
if (is_file($lock)) { http_response_code(403); exit('Déjà installé. Supprimez le fichier api/.installed pour relancer l\'installation.'); }
if (!hash_equals((string)(cfg()['install_token'] ?? ''), (string)($_GET['token'] ?? '')) || ($_GET['token'] ?? '') === '') { http_response_code(403); exit('Jeton invalide.'); }
$sq = is_sqlite();
$ai = $sq ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
$en = $sq ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
$t = [
  "CREATE TABLE IF NOT EXISTS requests (id $ai, type VARCHAR(20) NOT NULL, name VARCHAR(160) NOT NULL, org VARCHAR(200), email VARCHAR(190), phone VARCHAR(60), location VARCHAR(160), subject VARCHAR(200), budget VARCHAR(80), plan VARCHAR(160), message TEXT, status VARCHAR(20) NOT NULL DEFAULT 'new', note TEXT, ip_hash CHAR(64) NOT NULL, created_at DATETIME NOT NULL)$en",
  "CREATE TABLE IF NOT EXISTS push_subs (id $ai, endpoint TEXT NOT NULL, endpoint_hash CHAR(64) NOT NULL UNIQUE, email VARCHAR(190), created_at DATETIME NOT NULL)$en",
  "CREATE TABLE IF NOT EXISTS settings (k VARCHAR(80) NOT NULL PRIMARY KEY, v MEDIUMTEXT)$en",
  "CREATE TABLE IF NOT EXISTS content_versions (id $ai, body MEDIUMTEXT NOT NULL, email VARCHAR(190), created_at DATETIME NOT NULL)$en",
];
foreach ($t as $q) db()->exec($q);
vapid(); // génère la clé de notification
$def = base_dir() . '/data/content.default.json';
if (is_file($def)) {
  $json = (string)file_get_contents($def);
  if (!db()->query('SELECT COUNT(*) FROM content_versions')->fetchColumn()) db()->prepare('INSERT INTO content_versions (body,email,created_at) VALUES (?,?,?)')->execute([$json, 'installation', date('Y-m-d H:i:s')]);
  @mkdir(base_dir() . '/live', 0755, true);
  if (!is_file(base_dir() . '/live/content.json')) file_put_contents(base_dir() . '/live/content.json', $json);
}
@mkdir(base_dir() . '/uploads', 0755, true);
file_put_contents(base_dir() . '/uploads/.htaccess', "<FilesMatch \"\\.(php|phtml|phar|cgi)\$\">\n  Require all denied\n</FilesMatch>\n");
file_put_contents($lock, date('c'));
echo '<h1>Installation terminée</h1><p>Tables créées, clé de notification générée, contenu initial enregistré.</p><p>Ouvrez <a href="/admin/">/admin/</a> pour vous connecter avec Google.</p>';
