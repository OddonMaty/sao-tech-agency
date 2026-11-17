<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
$me = admin();
$a = $_GET['a'] ?? '';
$B = base_dir();
$writes = ['request_update', 'request_delete', 'content_save', 'content_restore', 'upload', 'media_delete', 'push_subscribe', 'push_unsubscribe', 'push_test'];
if (in_array($a, $writes, true)) guard_post();

function publish_content(string $json, string $email): void {
  $d = json_decode($json, true);
  if (!is_array($d) || !isset($d['settings'], $d['slides'], $d['poles'], $d['offres']) || strlen($json) > 2000000) out(['error' => 'Contenu invalide'], 422);
  db()->prepare('INSERT INTO content_versions (body,email,created_at) VALUES (?,?,?)')->execute([$json, $email, date('Y-m-d H:i:s')]);
  db()->exec('DELETE FROM content_versions WHERE id NOT IN (SELECT id FROM (SELECT id FROM content_versions ORDER BY id DESC LIMIT 30) t)');
  @mkdir(base_dir() . '/live', 0755, true);
  $tmp = base_dir() . '/live/content.json.tmp';
  file_put_contents($tmp, $json); rename($tmp, base_dir() . '/live/content.json');
}

switch ($a) {
  case 'stats':
    $c = fn(string $w, array $p = []) => (function () use ($w, $p) { $s = db()->prepare("SELECT COUNT(*) FROM requests WHERE $w"); $s->execute($p); return (int)$s->fetchColumn(); })();
    $days = [];
    for ($i = 13; $i >= 0; $i--) { $d = date('Y-m-d', time() - $i * 86400); $days[] = ['d' => $d, 'n' => $c('created_at>=? AND created_at<?', [$d . ' 00:00:00', date('Y-m-d', strtotime($d . ' +1 day')) . ' 00:00:00'])]; }
    out(['new' => $c("status='new'"), 'total' => $c('1=1'), 'devis' => $c("type='devis'"), 'partenariat' => $c("type='partenariat'"), 'contact' => $c("type='contact'"), 'produit' => $c("type='produit'"),
      'days' => $days, 'last' => db()->query('SELECT id,type,name,status,created_at FROM requests ORDER BY id DESC LIMIT 6')->fetchAll()]);
  case 'requests':
    $w = ['1=1']; $p = [];
    if (in_array($_GET['type'] ?? '', ['devis', 'partenariat', 'contact', 'produit'], true)) { $w[] = 'type=?'; $p[] = $_GET['type']; }
    if (in_array($_GET['status'] ?? '', ['new', 'done', 'archived'], true)) { $w[] = 'status=?'; $p[] = $_GET['status']; }
    $s = db()->prepare('SELECT * FROM requests WHERE ' . implode(' AND ', $w) . ' ORDER BY id DESC LIMIT 200'); $s->execute($p);
    out(['items' => $s->fetchAll()]);
  case 'request_update':
    $b = body(); $st = $b['status'] ?? null;
    if ($st !== null && !in_array($st, ['new', 'done', 'archived'], true)) out(['error' => 'statut invalide'], 422);
    if ($st !== null) db()->prepare('UPDATE requests SET status=? WHERE id=?')->execute([$st, (int)($b['id'] ?? 0)]);
    if (array_key_exists('note', $b)) db()->prepare('UPDATE requests SET note=? WHERE id=?')->execute([mb_substr((string)$b['note'], 0, 2000), (int)($b['id'] ?? 0)]);
    out(['ok' => true]);
  case 'request_delete':
    db()->prepare('DELETE FROM requests WHERE id=?')->execute([(int)(body()['id'] ?? 0)]); out(['ok' => true]);
  case 'content_get':
    $f = $B . '/live/content.json'; $s = db()->query('SELECT body FROM content_versions ORDER BY id DESC LIMIT 1')->fetchColumn();
    out(['content' => json_decode($s !== false ? (string)$s : (is_file($f) ? (string)file_get_contents($f) : '{}'), true)]);
  case 'content_save':
    publish_content(json_encode(body()['content'] ?? null, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $me['email']); out(['ok' => true]);
  case 'content_history':
    out(['items' => db()->query('SELECT id,email,created_at FROM content_versions ORDER BY id DESC LIMIT 30')->fetchAll()]);
  case 'content_restore':
    $s = db()->prepare('SELECT body FROM content_versions WHERE id=?'); $s->execute([(int)(body()['id'] ?? 0)]); $j = $s->fetchColumn();
    if ($j === false) out(['error' => 'version introuvable'], 404);
    publish_content((string)$j, $me['email']); out(['ok' => true]);
  case 'upload':
    $f = $_FILES['file'] ?? null;
    if (!$f || $f['error'] !== UPLOAD_ERR_OK || $f['size'] > 5 * 1024 * 1024) out(['error' => 'Image invalide ou trop lourde (5 Mo max).'], 422);
    $i = @getimagesize($f['tmp_name']); $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'][$i['mime'] ?? ''] ?? null;
    if (!$ext) out(['error' => 'Formats acceptés : JPG, PNG, WebP, GIF.'], 422);
    $dir = $B . '/uploads/' . date('Y/m'); if (!is_dir($dir)) mkdir($dir, 0755, true);
    $name = bin2hex(random_bytes(8)) . '.' . $ext;
    if (!move_uploaded_file($f['tmp_name'], "$dir/$name") && !rename($f['tmp_name'], "$dir/$name")) out(['error' => 'Échec de l\'enregistrement'], 500);
    out(['url' => '/uploads/' . date('Y/m') . "/$name"]);
  case 'media_list':
    $it = [];
    foreach (glob($B . '/uploads/*/*/*.*') ?: [] as $p) $it[] = ['url' => substr($p, strlen($B)), 'size' => filesize($p), 'time' => filemtime($p)];
    usort($it, fn($x, $y) => $y['time'] <=> $x['time']); out(['items' => $it]);
  case 'media_delete':
    $u = (string)(body()['url'] ?? ''); $p = realpath($B . $u);
    if (!$p || !str_starts_with($p, realpath($B . '/uploads') . DIRECTORY_SEPARATOR) || !is_file($p)) out(['error' => 'fichier introuvable'], 404);
    unlink($p); out(['ok' => true]);
  case 'push_key': out(['key' => vapid()['public']]);
  case 'push_subscribe':
    $e = (string)(body()['subscription']['endpoint'] ?? '');
    if (!str_starts_with($e, 'https://')) out(['error' => 'abonnement invalide'], 422);
    $h = hash('sha256', $e); db()->prepare('DELETE FROM push_subs WHERE endpoint_hash=?')->execute([$h]);
    db()->prepare('INSERT INTO push_subs (endpoint,endpoint_hash,email,created_at) VALUES (?,?,?,?)')->execute([$e, $h, $me['email'], date('Y-m-d H:i:s')]);
    out(['ok' => true]);
  case 'push_unsubscribe':
    db()->prepare('DELETE FROM push_subs WHERE endpoint_hash=?')->execute([hash('sha256', (string)(body()['endpoint'] ?? ''))]); out(['ok' => true]);
  case 'push_test': out(['sent' => push_all()]);
  case 'latest':
    $r = db()->query("SELECT type,name FROM requests WHERE status='new' ORDER BY id DESC LIMIT 1")->fetch();
    out(['new' => (int)db()->query("SELECT COUNT(*) FROM requests WHERE status='new'")->fetchColumn(), 'last' => $r ?: null]);
}
out(['error' => 'action inconnue'], 404);
