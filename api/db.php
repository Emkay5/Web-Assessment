<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - PDO MYSQL DATABASE CONNECTION
   ========================================================================== */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'nfcollections_db';
$db_port = '3306';

function getPDOConnection() {
    global $db_host, $db_user, $db_pass, $db_name, $db_port;
    
    try {
        $dsn = "mysql:host={$db_host};dbname={$db_name};port={$db_port};charset=utf8mb4";
        $pdo = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Fallback: try connecting without dbname and auto-create
        try {
            $dsn_root = "mysql:host={$db_host};port={$db_port};charset=utf8mb4";
            $pdo_root = new PDO($dsn_root, $db_user, $db_pass);
            $pdo_root->exec("CREATE DATABASE IF NOT EXISTS `{$db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo_root->exec("USE `{$db_name}`");
            return $pdo_root;
        } catch (PDOException $e2) {
            return null;
        }
    }
}

function sendJsonResponse($success, $data = [], $message = '', $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
