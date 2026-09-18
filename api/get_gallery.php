<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - GET GALLERY API ENDPOINT
   ========================================================================== */

require_once __DIR__ . '/db.php';

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

$category = isset($_GET['category']) ? trim($_GET['category']) : 'All';

$sql = "SELECT * FROM `gallery_items` WHERE 1=1";
$params = [];

if ($category !== '' && strtolower($category) !== 'all') {
    $sql .= " AND `category` = :category";
    $params[':category'] = $category;
}

$sql .= " ORDER BY `created_at` ASC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $gallery = $stmt->fetchAll();

    sendJsonResponse(true, $gallery, "Gallery items fetched successfully.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Failed to fetch gallery items: " . $e->getMessage(), 500);
}
