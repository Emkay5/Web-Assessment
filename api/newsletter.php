<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - NEWSLETTER SUBSCRIPTION API ENDPOINT
   ========================================================================== */

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

$email = isset($input['email']) ? trim($input['email']) : '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], "Please enter a valid email address.", 400);
}

try {
    $sql = "INSERT INTO `newsletter_subscribers` (`email`) VALUES (:email) 
            ON DUPLICATE KEY UPDATE `subscribed_at` = CURRENT_TIMESTAMP";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email' => $email]);

    sendJsonResponse(true, ['email' => $email], "Welcome! You have been subscribed to NF Collections Journal.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Database error: " . $e->getMessage(), 500);
}
