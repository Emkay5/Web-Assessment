<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - CUSTOMER REGISTRATION API
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

$fullName = isset($input['full_name']) ? trim($input['full_name']) : '';
$email    = isset($input['email']) ? strtolower(trim($input['email'])) : '';
$password = isset($input['password']) ? trim($input['password']) : '';
$phone    = isset($input['phone']) ? trim($input['phone']) : '';
$address  = isset($input['address']) ? trim($input['address']) : '';

if (empty($fullName) || empty($email) || empty($password)) {
    sendJsonResponse(false, [], "Please provide your full name, email address, and a password.", 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], "Please provide a valid email address.", 400);
}

if (strlen($password) < 6) {
    sendJsonResponse(false, [], "Password must be at least 6 characters in length.", 400);
}

try {
    // Check if email already registered
    $checkStmt = $pdo->prepare("SELECT `id` FROM `users` WHERE `email` = :email");
    $checkStmt->execute([':email' => $email]);
    if ($checkStmt->fetch()) {
        sendJsonResponse(false, [], "An account with this email address already exists. Please sign in instead.", 409);
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO `users` (`full_name`, `email`, `password_hash`, `phone`, `address`) VALUES (:full_name, :email, :password_hash, :phone, :address)");
    $stmt->execute([
        ':full_name'     => $fullName,
        ':email'         => $email,
        ':password_hash' => $passwordHash,
        ':phone'         => $phone,
        ':address'       => $address
    ]);

    $userId = (int)$pdo->lastInsertId();

    $_SESSION['user_id']   = $userId;
    $_SESSION['user_name'] = $fullName;
    $_SESSION['user_email']= $email;

    $userData = [
        'id'        => $userId,
        'full_name' => $fullName,
        'email'     => $email,
        'phone'     => $phone,
        'address'   => $address
    ];

    sendJsonResponse(true, $userData, "Welcome to NF Collections Nigeria! Your client account has been created successfully.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Registration error: " . $e->getMessage(), 500);
}
