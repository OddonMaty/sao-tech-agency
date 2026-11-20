<?php
declare(strict_types=1);
// Serveur MCP en lecture seule (JSON-RPC 2.0 sur HTTP) : informations publiques de Sao Tech Agency.
// Il ne modifie rien et ne demande aucune authentification. Adresse : /api/mcp.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Cache-Control: no-store');

function jout($data, int $code = 200): never {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}
function rpc_error($id, int $code, string $msg): array { return ['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => $code, 'message' => $msg]]; }
function site_content(): array {
  $root = dirname(__DIR__);
  foreach (['/live/content.json', '/data/content.default.json'] as $f) {
    if (is_file($root . $f)) { $j = json_decode((string)file_get_contents($root . $f), true); if (is_array($j)) return $j; }
  }
  return [];
}
function tools(): array {
  $none = ['type' => 'object', 'properties' => new stdClass()];
  $ro = ['readOnlyHint' => true, 'destructiveHint' => false, 'idempotentHint' => true, 'openWorldHint' => false];
  return [
    ['name' => 'get_company_info', 'description' => 'Présentation de Sao Tech Agency : adresse, mission et réseaux sociaux.', 'inputSchema' => $none, 'annotations' => $ro],
    ['name' => 'list_services', 'description' => 'Les trois pôles de services (Studio, Développement, Réseau & Support) et leurs prestations.', 'inputSchema' => $none, 'annotations' => $ro],
    ['name' => 'get_pricing', 'description' => 'Plans et prix de départ en dollars US, filtrables par pôle (studio, dev, reseau, conseil).', 'inputSchema' => ['type' => 'object', 'properties' => ['pole' => ['type' => 'string', 'description' => 'studio, dev, reseau ou conseil (facultatif)']]], 'annotations' => $ro],
    ['name' => 'get_faq', 'description' => 'Questions fréquentes sur les offres, les délais et le paiement.', 'inputSchema' => $none, 'annotations' => $ro],
    ['name' => 'get_contact_info', 'description' => 'Moyens de demander un devis ou un partenariat : WhatsApp, email, adresse et formulaires.', 'inputSchema' => $none, 'annotations' => $ro],
  ];
}
function call_tool(string $name, array $args): ?array {
  $c = site_content(); $s = $c['settings'] ?? []; $site = $c['seo']['site'] ?? '';
  switch ($name) {
    case 'get_company_info': return ['nom' => 'Sao Tech Agency (STA SARL)', 'adresse' => $s['address'] ?? '', 'mission' => $c['apropos']['blocs'][0]['texte'] ?? '', 'reseaux' => $c['socials'] ?? [], 'site' => $site];
    case 'list_services': return array_map(fn($p) => ['id' => $p['id'], 'pole' => $p['nom'] . ' — ' . $p['verbe'], 'description' => $p['texte'], 'services' => $p['services']], $c['poles'] ?? []);
    case 'get_pricing': $pole = (string)($args['pole'] ?? ''); return array_values(array_filter($c['offres'] ?? [], fn($o) => $pole === '' || $o['pole'] === $pole));
    case 'get_faq': return $c['faq'] ?? [];
    case 'get_contact_info': return ['whatsapp' => 'https://wa.me/' . ($s['whatsapp'] ?? ''), 'telephone' => $s['phone'] ?? '', 'email' => $s['email'] ?? '', 'adresse' => $s['address'] ?? '', 'formulaireDevis' => $site . '/contact', 'partenariat' => $site . '/partenaires'];
  }
  return null;
}
function handle($r): ?array {
  if (!is_array($r) || !isset($r['method']) || !is_string($r['method'])) return rpc_error($r['id'] ?? null, -32600, 'Requête invalide');
  $id = $r['id'] ?? null; $m = $r['method']; $p = is_array($r['params'] ?? null) ? $r['params'] : [];
  if (!array_key_exists('id', $r)) return null; // notification : pas de réponse
  switch ($m) {
    case 'initialize':
      $v = (string)($p['protocolVersion'] ?? ''); $ok = ['2025-06-18', '2025-03-26', '2024-11-05'];
      return ['jsonrpc' => '2.0', 'id' => $id, 'result' => ['protocolVersion' => in_array($v, $ok, true) ? $v : $ok[0], 'capabilities' => ['tools' => ['listChanged' => false]], 'serverInfo' => ['name' => 'sao-tech-agency', 'title' => 'Sao Tech Agency', 'version' => '1.0.0'], 'instructions' => 'Serveur en lecture seule : services, tarifs, FAQ et contact de Sao Tech Agency. Pour demander un devis, utilisez le formulaire ou WhatsApp indiqués par get_contact_info.']];
    case 'ping': return ['jsonrpc' => '2.0', 'id' => $id, 'result' => new stdClass()];
    case 'tools/list': return ['jsonrpc' => '2.0', 'id' => $id, 'result' => ['tools' => tools()]];
    case 'tools/call':
      $data = call_tool((string)($p['name'] ?? ''), is_array($p['arguments'] ?? null) ? $p['arguments'] : []);
      if ($data === null) return rpc_error($id, -32602, 'Outil inconnu');
      return ['jsonrpc' => '2.0', 'id' => $id, 'result' => ['content' => [['type' => 'text', 'text' => json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)]], 'isError' => false]];
  }
  return rpc_error($id, -32601, 'Méthode inconnue');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Allow: POST, OPTIONS'); jout(rpc_error(null, -32000, 'Utilisez POST (transport MCP HTTP, JSON-RPC 2.0).'), 405); }
$req = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($req) || $req === []) jout(rpc_error(null, -32700, 'JSON invalide'), 400);
$batch = array_is_list($req); $out = [];
foreach ($batch ? $req : [$req] as $item) { $res = handle($item); if ($res !== null) $out[] = $res; }
if (!$out) { http_response_code(202); exit; }
jout($batch ? $out : $out[0]);
