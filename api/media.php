<?php
declare(strict_types=1);
// Images téléversées depuis l'admin, stockées en base de données (elles survivent aux déploiements). Adresse publique : /media/<id>.<ext>
require_once __DIR__ . '/lib.php';
if (!preg_match('/^(\d+)\.(jpg|png|webp|gif)$/', (string)($_GET['f'] ?? ''), $m)) { http_response_code(404); exit; }
try {
  ensure_schema();
  $s = db()->prepare('SELECT mime, data FROM media WHERE id=?');
  $s->execute([(int)$m[1]]);
  $r = $s->fetch();
} catch (Throwable $e) { $r = false; }
if (!$r) { http_response_code(404); exit; }
$data = is_resource($r['data']) ? (string)stream_get_contents($r['data']) : (string)$r['data'];
header('Content-Type: ' . $r['mime']);
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
header('Content-Length: ' . strlen($data));
echo $data;
