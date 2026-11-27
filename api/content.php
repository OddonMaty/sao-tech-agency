<?php
declare(strict_types=1);
// Contenu du site publié depuis l'admin (lu par le site à chaque visite). Source : base de données.
require_once __DIR__ . '/lib.php';
try { $j = live_content(); } catch (Throwable $e) { $j = null; }
if ($j === null) out(['error' => 'aucun contenu publié'], 404);
$etag = '"' . md5($j) . '"';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30, must-revalidate');
header('ETag: ' . $etag);
if (($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) { http_response_code(304); exit; }
echo $j;
