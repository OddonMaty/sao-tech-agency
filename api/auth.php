<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
$a = $_GET['a'] ?? '';
if ($a === 'config') out(['clientId' => cfg()['google_client_id'] ?? '']);
if ($a === 'me') { session_boot(); out(empty($_SESSION['email']) ? ['user' => null] : ['user' => admin()]); }
if ($a === 'google') {
  guard_post();
  $u = google_verify((string)(body()['credential'] ?? ''));
  if (!$u) out(['error' => 'Connexion Google refusée.'], 401);
  $allowed = array_map('strtolower', cfg()['admin_emails'] ?? []);
  if (!in_array($u['email'], $allowed, true)) out(['error' => "Ce compte Google n'est pas autorisé."], 403);
  session_boot(); session_regenerate_id(true);
  $_SESSION['email'] = $u['email']; $_SESSION['name'] = $u['name']; $_SESSION['picture'] = $u['picture'];
  out(['user' => admin()]);
}
if ($a === 'logout') { guard_post(); session_boot(); $_SESSION = []; session_destroy(); out(['ok' => true]); }
out(['error' => 'action inconnue'], 404);
