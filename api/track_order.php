<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - LIVE MYSQL ORDER TRACKING API
   ========================================================================== */

require_once __DIR__ . '/db.php';

$orderNumber = isset($_GET['order_number']) ? trim($_GET['order_number']) : (
                isset($_GET['code']) ? trim($_GET['code']) : (
                isset($_POST['order_number']) ? trim($_POST['order_number']) : (
                isset($_POST['code']) ? trim($_POST['code']) : '')));

if (empty($orderNumber)) {
    sendJsonResponse(false, [], "Please enter a valid order number (e.g. NFC-2026-9051F8).", 400);
}

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

try {
    $stmt = $pdo->prepare("SELECT * FROM `orders` WHERE `order_number` = :order_number OR `id` = :order_id");
    $stmt->execute([':order_number' => $orderNumber, ':order_id' => $orderNumber]);
    $order = $stmt->fetch();

    if (!$order) {
        sendJsonResponse(false, [], "No order found matching '{$orderNumber}'. Please check your order confirmation code.", 444);
    }

    $stmtItems = $pdo->prepare("SELECT * FROM `order_items` WHERE `order_id` = :order_id");
    $stmtItems->execute([':order_id' => $order['id']]);
    $items = $stmtItems->fetchAll() ?: [];

    // Order Stage Progress Map
    $statusMap = [
        'Processing' => ['step' => 1, 'label' => 'Order Received & Verified', 'progress' => 20],
        'Tailoring'  => ['step' => 2, 'label' => 'Master Artisan Hand-Tailoring', 'progress' => 45],
        'Inspection' => ['step' => 3, 'label' => 'Atelier Quality Inspection', 'progress' => 70],
        'Shipped'    => ['step' => 4, 'label' => 'Shipped via Express Courier', 'progress' => 85],
        'Delivered'  => ['step' => 5, 'label' => 'Delivered to Client', 'progress' => 100],
        'Cancelled'  => ['step' => 0, 'label' => 'Order Cancelled', 'progress' => 0]
    ];

    $currentStatus = $order['status'] ?: 'Processing';
    $trackingInfo = isset($statusMap[$currentStatus]) ? $statusMap[$currentStatus] : $statusMap['Processing'];

    sendJsonResponse(true, [
        'order_number'   => $order['order_number'],
        'customer_name'  => $order['customer_name'],
        'total_amount'   => (float)$order['total_amount'],
        'status'         => $currentStatus,
        'tracking_info'  => $trackingInfo,
        'created_at'     => $order['created_at'],
        'items'          => $items
    ], "Order status retrieved.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Database error: " . $e->getMessage(), 500);
}
