<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - PLACE ORDER API ENDPOINT
   ========================================================================== */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], "Only POST method is allowed.", 405);
}

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$userId        = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : (isset($input['user_id']) ? (int)$input['user_id'] : null);
$items         = isset($input['items']) && is_array($input['items']) ? $input['items'] : [];
$customerName  = isset($input['customer_name']) ? trim($input['customer_name']) : (isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Guest Client');
$customerEmail = isset($input['customer_email']) ? trim($input['customer_email']) : (isset($_SESSION['user_email']) ? $_SESSION['user_email'] : null);
$customerPhone = isset($input['customer_phone']) ? trim($input['customer_phone']) : null;

if (empty($items)) {
    sendJsonResponse(false, [], "Shopping bag is empty. Please add items before checking out.", 400);
}

$totalAmount = 0;
foreach ($items as $item) {
    $price = isset($item['price']) ? (float)$item['price'] : 0;
    $qty   = isset($item['quantity']) ? (int)$item['quantity'] : 1;
    $totalAmount += ($price * $qty);
}

$orderNumber = 'NFC-' . date('Y') . '-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));

try {
    $pdo->beginTransaction();

    $stmtOrder = $pdo->prepare("INSERT INTO `orders` (`order_number`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `total_amount`) VALUES (:order_number, :user_id, :customer_name, :customer_email, :customer_phone, :total_amount)");
    $stmtOrder->execute([
        ':order_number'   => $orderNumber,
        ':user_id'        => $userId,
        ':customer_name'  => $customerName,
        ':customer_email' => $customerEmail,
        ':customer_phone' => $customerPhone,
        ':total_amount'   => $totalAmount
    ]);

    $orderId = $pdo->lastInsertId();

    $stmtItem = $pdo->prepare("INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`) VALUES (:order_id, :product_id, :product_name, :price, :quantity)");

    foreach ($items as $item) {
        $stmtItem->execute([
            ':order_id'     => $orderId,
            ':product_id'   => isset($item['id']) ? $item['id'] : 'unknown',
            ':product_name' => isset($item['name']) ? $item['name'] : 'Atelier Piece',
            ':price'        => isset($item['price']) ? (float)$item['price'] : 0,
            ':quantity'     => isset($item['quantity']) ? (int)$item['quantity'] : 1
        ]);
    }

    $pdo->commit();

    sendJsonResponse(true, [
        'order_id'     => $orderId,
        'order_number' => $orderNumber,
        'total_amount' => $totalAmount
    ], "Order {$orderNumber} successfully placed! Thank you for shopping with NF Collections Nigeria.");

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJsonResponse(false, [], "Failed to record order: " . $e->getMessage(), 500);
}
