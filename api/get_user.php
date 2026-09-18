<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - CURRENT USER PROFILE & ORDER HISTORY API
   ========================================================================== */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

$userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : (isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0);

if (!$userId) {
    sendJsonResponse(false, ['is_logged_in' => false], "No active user session found.", 200);
}

try {
    $stmt = $pdo->prepare("SELECT `id`, `full_name`, `email`, `phone`, `address`, `created_at` FROM `users` WHERE `id` = :id");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJsonResponse(false, ['is_logged_in' => false], "User profile not found.", 404);
    }

    // Fetch user order history
    $orderStmt = $pdo->prepare("SELECT * FROM `orders` WHERE `user_id` = :user_id OR `customer_email` = :email ORDER BY `created_at` DESC");
    $orderStmt->execute([':user_id' => $userId, ':email' => $user['email']]);
    $orders = $orderStmt->fetchAll() ?: [];

    // Attach order items for each order
    foreach ($orders as &$order) {
        $itemStmt = $pdo->prepare("SELECT * FROM `order_items` WHERE `order_id` = :order_id");
        $itemStmt->execute([':order_id' => $order['id']]);
        $order['items'] = $itemStmt->fetchAll() ?: [];
    }

    $responseData = [
        'is_logged_in' => true,
        'user'         => $user,
        'orders'       => $orders
    ];

    sendJsonResponse(true, $responseData, "User profile and order history retrieved.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Database error: " . $e->getMessage(), 500);
}
