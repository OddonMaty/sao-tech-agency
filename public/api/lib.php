<?php
declare(strict_types=1);
// Fonctions communes de l'API Sao Tech Agency (PHP 8.1+, MySQL).

function cfg(): array {
  static $c = null;
  if ($c === null) {
    $f = getenv('STA_CONFIG') ?: __DIR__ . '/config.php';
    if (!is_file($f)) out(['error' => 'config.php manquant sur le serveur'], 500);
    $c = require $f;
  }
  return $c;
}
function base_dir(): string { return getenv('STA_BASE') ?: dirname(__DIR__); }
function out($d, int $code = 200): never {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}
function body(): array { $j = json_decode((string)file_get_contents('php://input'), true); return is_array($j) ? $j : []; }
function db(): PDO {
  static $p = null;
  if ($p === null) {
    $c = cfg();
    $dsn = $c['db_dsn'] ?? "mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4";
    $p = new PDO($dsn, $c['db_user'] ?? null, $c['db_pass'] ?? null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
  }
  return $p;
}
function is_sqlite(): bool { return db()->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite'; }
function guard_post(): void {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(['error' => 'POST requis'], 405);
  if (($_SERVER['HTTP_X_STA'] ?? '') !== '1') out(['error' => 'requête refusée'], 403);
}
function https(): bool { return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'); }
function session_boot(): void {
  if (session_status() === PHP_SESSION_ACTIVE) return;
  ini_set('session.gc_maxlifetime', '2592000');
  session_name('sta_admin');
  session_set_cookie_params(['lifetime' => 2592000, 'path' => '/', 'secure' => https(), 'httponly' => true, 'samesite' => 'Lax']);
  session_start();
}
function admin(): array {
  session_boot();
  if (empty($_SESSION['email'])) out(['error' => 'auth'], 401);
  return ['email' => $_SESSION['email'], 'name' => $_SESSION['name'] ?? '', 'picture' => $_SESSION['picture'] ?? ''];
}
function google_verify(string $t): ?array {
  if ($t === '') return null;
  $ch = curl_init('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($t));
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10]);
  $r = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
  if ($code !== 200) return null;
  $j = json_decode((string)$r, true);
  if (!is_array($j) || ($j['aud'] ?? '') !== (cfg()['google_client_id'] ?? '')) return null;
  if (!in_array($j['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true)) return null;
  if (($j['email_verified'] ?? '') !== 'true' && ($j['email_verified'] ?? false) !== true) return null;
  if ((int)($j['exp'] ?? 0) < time()) return null;
  return ['email' => strtolower((string)($j['email'] ?? '')), 'name' => (string)($j['name'] ?? ''), 'picture' => (string)($j['picture'] ?? '')];
}
function line(string $s, int $max = 200): string { return mb_substr(trim(preg_replace('/[\r\n\t]+/', ' ', $s) ?? ''), 0, $max); }
function send_mail(string $to, string $subject, string $text, ?string $reply = null): bool {
  $c = cfg(); $from = $c['mail_from'] ?? $c['notify_email'];
  $h = ["From: Sao Tech Agency <$from>", 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8'];
  if ($reply && filter_var($reply, FILTER_VALIDATE_EMAIL)) $h[] = "Reply-To: $reply";
  return @mail($to, '=?UTF-8?B?' . base64_encode(line($subject)) . '?=', $text, implode("\r\n", $h), '-f' . $from);
}
function ip_hash(): string { return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '0') . (cfg()['install_token'] ?? '')); }

// ---- Réglages et notifications Web Push (VAPID, sans charge utile) ----
function setting(string $k): ?string { $s = db()->prepare('SELECT v FROM settings WHERE k=?'); $s->execute([$k]); $r = $s->fetchColumn(); return $r === false ? null : (string)$r; }
function set_setting(string $k, string $v): void { $p = db(); $p->prepare('DELETE FROM settings WHERE k=?')->execute([$k]); $p->prepare('INSERT INTO settings (k,v) VALUES (?,?)')->execute([$k, $v]); }
function b64u(string $s): string { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }
function vapid(): array {
  $pem = setting('vapid_private');
  if (!$pem) {
    $k = openssl_pkey_new(['curve_name' => 'prime256v1', 'private_key_type' => OPENSSL_KEYTYPE_EC]);
    openssl_pkey_export($k, $pem); set_setting('vapid_private', $pem);
  }
  $k = openssl_pkey_get_private($pem); $d = openssl_pkey_get_details($k)['ec'];
  $pub = "\x04" . str_pad($d['x'], 32, "\0", STR_PAD_LEFT) . str_pad($d['y'], 32, "\0", STR_PAD_LEFT);
  return ['key' => $k, 'public' => b64u($pub)];
}
function der_to_raw(string $der): string {
  $o = 2; if (ord($der[1]) & 0x80) $o += ord($der[1]) & 0x7f;
  $parts = [];
  for ($i = 0; $i < 2; $i++) { $len = ord($der[$o + 1]); $int = ltrim(substr($der, $o + 2, $len), "\0"); $o += 2 + $len; $parts[] = str_pad($int, 32, "\0", STR_PAD_LEFT); }
  return $parts[0] . $parts[1];
}
function vapid_jwt(string $aud): array {
  $v = vapid(); $c = cfg();
  $h = b64u(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
  $p = b64u(json_encode(['aud' => $aud, 'exp' => time() + 43200, 'sub' => $c['vapid_subject'] ?? ('mailto:' . $c['notify_email'])]));
  openssl_sign("$h.$p", $sig, $v['key'], OPENSSL_ALGO_SHA256);
  return ["$h.$p." . b64u(der_to_raw($sig)), $v['public']];
}
function ensure_schema(): void {
  static $done = false;
  if ($done) return;
  $done = true;
  if (setting('schema') === '2') return;
  try { db()->exec('ALTER TABLE push_subs ADD COLUMN ua VARCHAR(255)'); } catch (Throwable $e) { /* colonne déjà présente */ }
  set_setting('schema', '2');
}
function push_one(string $endpoint): array {
  $u = parse_url($endpoint); if (!$u || empty($u['host'])) return [0, ''];
  [$jwt, $pub] = vapid_jwt(($u['scheme'] ?? 'https') . '://' . $u['host'] . (isset($u['port']) ? ':' . $u['port'] : ''));
  $ch = curl_init($endpoint);
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => '', CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => ["Authorization: vapid t=$jwt, k=$pub", 'TTL: 86400', 'Urgency: high', 'Content-Length: 0']]);
  $b = curl_exec($ch); $c = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
  return [$c, is_string($b) ? mb_substr(trim($b), 0, 160) : ''];
}
// Envoie une notification à chaque appareil abonné et renvoie le détail (code du service de notification) pour le diagnostic.
function push_results(): array {
  ensure_schema();
  $out = [];
  foreach (db()->query('SELECT id, endpoint, ua, created_at FROM push_subs ORDER BY id')->fetchAll() as $s) {
    [$c, $b] = push_one($s['endpoint']);
    if ($c === 404 || $c === 410) db()->prepare('DELETE FROM push_subs WHERE id=?')->execute([$s['id']]);
    $out[] = ['id' => (int)$s['id'], 'host' => parse_url($s['endpoint'], PHP_URL_HOST), 'ua' => (string)($s['ua'] ?? ''), 'created' => $s['created_at'], 'code' => $c, 'ok' => $c >= 200 && $c < 300, 'detail' => $b];
  }
  return $out;
}
function push_all(): int { return count(array_filter(push_results(), fn($r) => $r['ok'])); }
