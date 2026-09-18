<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - AUTOMATED MYSQL DATABASE INITIALIZER & SEEDER
   ========================================================================== */

require_once __DIR__ . '/db.php';

try {
    $dsn_root = "mysql:host={$db_host};port={$db_port};charset=utf8mb4";
    $pdo = new PDO($dsn_root, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Read SQL Schema File
    $sqlFile = dirname(__DIR__) . '/database/schema.sql';
    if (!file_exists($sqlFile)) {
        sendJsonResponse(false, [], "Schema file not found at {$sqlFile}", 500);
    }

    $sql = file_get_contents($sqlFile);
    $pdo->exec($sql);

    // Ensure user_id column exists on orders table for existing installs
    $checkCol = $pdo->query("SHOW COLUMNS FROM `nfcollections_db`.`orders` LIKE 'user_id'")->fetch();
    if (!$checkCol) {
        $pdo->exec("ALTER TABLE `nfcollections_db`.`orders` ADD COLUMN `user_id` INT DEFAULT NULL AFTER `order_number`");
    }

    sendJsonResponse(true, [
        'database' => $db_name,
        'status'   => 'Database tables created and seed data populated successfully.'
    ], "Database initialization complete.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Database setup error: " . $e->getMessage(), 500);
}
