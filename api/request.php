<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
guard_post();
$b = body();
if (!empty($b['website'])) out(['ok' => true]); // champ piège anti-robots
$type = (string)($b['type'] ?? '');
if (!in_array($type, ['devis', 'partenariat', 'contact', 'produit'], true)) out(['error' => 'type invalide'], 422);
$name = line((string)($b['name'] ?? ''), 160); $email = line((string)($b['email'] ?? ''), 190); $phone = line((string)($b['phone'] ?? ''), 60);
$msg = mb_substr(trim((string)($b['message'] ?? '')), 0, 4000);
if (mb_strlen($name) < 2) out(['error' => 'Indiquez votre nom.'], 422);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) out(['error' => 'Adresse email invalide.'], 422);
if ($email === '' && $phone === '') out(['error' => 'Indiquez un email ou un téléphone.'], 422);
if (in_array($type, ['partenariat', 'produit'], true) && $email === '') out(['error' => 'Indiquez votre email.'], 422);
if (in_array($type, ['devis', 'partenariat', 'contact'], true) && mb_strlen($msg) < 5) out(['error' => 'Décrivez votre demande.'], 422);
$ip = ip_hash();
$n = db()->prepare('SELECT COUNT(*) FROM requests WHERE ip_hash=? AND created_at>?');
$n->execute([$ip, date('Y-m-d H:i:s', time() - 600)]);
if ((int)$n->fetchColumn() >= 5) out(['error' => 'Trop de demandes, réessayez dans quelques minutes.'], 429);
$row = ['type' => $type, 'name' => $name, 'org' => line((string)($b['org'] ?? '')), 'email' => $email, 'phone' => $phone, 'location' => line((string)($b['location'] ?? ''), 160),
  'subject' => line((string)($b['subject'] ?? '')), 'budget' => line((string)($b['budget'] ?? ''), 80), 'plan' => line((string)($b['plan'] ?? ''), 160), 'message' => $msg];
db()->prepare('INSERT INTO requests (type,name,org,email,phone,location,subject,budget,plan,message,status,ip_hash,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
  ->execute([...array_values($row), 'new', $ip, date('Y-m-d H:i:s')]);
$labels = ['devis' => 'Devis', 'partenariat' => 'Partenariat', 'contact' => 'Contact', 'produit' => 'Liste d\'attente produit'];
$txt = "Nouvelle demande : {$labels[$type]}\n\n";
foreach (['name' => 'Nom', 'org' => 'Organisation', 'email' => 'Email', 'phone' => 'Téléphone', 'location' => 'Ville / pays', 'subject' => 'Sujet / pôle', 'plan' => 'Plan', 'budget' => 'Budget'] as $k => $l) if ($row[$k] !== '') $txt .= "$l : {$row[$k]}\n";
$txt .= "\nMessage :\n$msg\n\nGérer dans l'admin : " . rtrim(cfg()['site_url'] ?? '', '/') . "/admin/\n";
send_mail(cfg()['notify_email'], "[{$labels[$type]}] $name", $txt, $email ?: null);
try { push_all(); } catch (Throwable $e) { /* la demande est déjà enregistrée */ }
out(['ok' => true]);
