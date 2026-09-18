<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - GET PRODUCTS API ENDPOINT
   ========================================================================== */

require_once __DIR__ . '/db.php';

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

$category = isset($_GET['category']) ? trim($_GET['category']) : 'All';
$search   = isset($_GET['search']) ? trim($_GET['search']) : '';
$sort     = isset($_GET['sort']) ? trim($_GET['sort']) : 'featured';

$sql = "SELECT * FROM `products` WHERE 1=1";
$params = [];

if ($category !== '' && strtolower($category) !== 'all') {
    $sql .= " AND `category` = :category";
    $params[':category'] = $category;
}

if ($search !== '') {
    $sql .= " AND (`name` LIKE :search OR `category` LIKE :search OR `description` LIKE :search)";
    $params[':search'] = '%' . $search . '%';
}

if ($sort === 'price-low') {
    $sql .= " ORDER BY `price` ASC";
} elseif ($sort === 'price-high') {
    $sql .= " ORDER BY `price` DESC";
} else {
    $sql .= " ORDER BY `created_at` ASC";
}

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    // Format JSON string fields back to native arrays for JS compatibility
    foreach ($products as &$product) {
        $product['price'] = (float)$product['price'];
        $product['oldPrice'] = $product['old_price'] ? (float)$product['old_price'] : null;
        unset($product['old_price']);
        
        $product['colors'] = json_decode($product['colors'], true) ?: [];
        $product['sizes']  = json_decode($product['sizes'], true) ?: [];
        $product['badgeColor'] = $product['badge_color'];
        unset($product['badge_color']);
    }

    sendJsonResponse(true, $products, "Products fetched successfully.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Failed to fetch products: " . $e->getMessage(), 500);
}
