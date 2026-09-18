<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - CONTACT & STYLING APPOINTMENT SUBMISSION API
   ========================================================================== */

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], "Only POST method is allowed.", 405);
}

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

// Support both JSON body and form-encoded POST
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$fullName         = isset($input['name']) ? trim($input['name']) : (isset($input['full_name']) ? trim($input['full_name']) : '');
$email            = isset($input['email']) ? trim($input['email']) : '';
$phone            = isset($input['phone']) ? trim($input['phone']) : '';
$boutiqueLocation = isset($input['boutique']) ? trim($input['boutique']) : 'Abuja';
$formType         = isset($input['form_type']) ? trim($input['form_type']) : 'inquiry';
$appointmentDate  = isset($input['appointment_date']) && !empty($input['appointment_date']) ? trim($input['appointment_date']) : null;
$message          = isset($input['message']) ? trim($input['message']) : '';

if (empty($fullName) || empty($email) || empty($message)) {
    sendJsonResponse(false, [], "Full name, email address, and message are required fields.", 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, [], "Please provide a valid email address.", 400);
}

try {
    $sql = "INSERT INTO `contact_inquiries` (`full_name`, `email`, `phone`, `boutique_location`, `form_type`, `appointment_date`, `message`) 
            VALUES (:full_name, :email, :phone, :boutique_location, :form_type, :appointment_date, :message)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name'         => $fullName,
        ':email'             => $email,
        ':phone'             => $phone,
        ':boutique_location' => $boutiqueLocation,
        ':form_type'         => $formType,
        ':appointment_date'  => $appointmentDate,
        ':message'          => $message
    ]);

    $id = $pdo->lastInsertId();

    sendJsonResponse(true, [
        'id'        => $id,
        'full_name' => $fullName,
        'email'     => $email
    ], "Thank you, {$fullName}! Your inquiry has been logged in our system and sent to NF Collections Client Relations.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Database error: " . $e->getMessage(), 500);
}
