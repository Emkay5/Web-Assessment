<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - CUSTOMER LOGIN API
   ========================================================================== */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?: $_POST;

$email    = isset($input['email']) ? strtolower(trim($input['email'])) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

if (empty($email) || empty($password)) {
    sendJsonResponse(false, [], "Please provide both your email address and password.", 400);
}

try {
    $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `email` = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendJsonResponse(false, [], "Invalid email address or password. Please try again.", 401);
    }

    $_SESSION['user_id']   = (int)$user['id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_email']= $user['email'];

    $userData = [
        'id'        => (int)$user['id'],
        'full_name' => $user['full_name'],
        'email'     => $user['email'],
        'phone'     => $user['phone'] ?: '',
        'address'   => $user['address'] ?: ''
    ];

    sendJsonResponse(true, $userData, "Welcome back, {$user['full_name']}! You are signed in.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Login error: " . $e->getMessage(), 500);
}
