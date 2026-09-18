<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - BESPOKE CUSTOMIZER SUBMISSION API
   ========================================================================== */

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, [], "Only POST method is allowed.", 405);
}

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$fullName  = isset($input['name']) ? trim($input['name']) : '';
$email     = isset($input['email']) ? trim($input['email']) : '';
$phone     = isset($input['phone']) ? trim($input['phone']) : '';
$fabric    = isset($input['fabric']) ? trim($input['fabric']) : 'Double-Faced Cashmere';
$color     = isset($input['color']) ? trim($input['color']) : 'Obsidian Black';
$monogram  = isset($input['monogram']) ? trim($input['monogram']) : '';
$silhouette= isset($input['silhouette']) ? trim($input['silhouette']) : 'Architectural Trench';
$boutique  = isset($input['boutique']) ? trim($input['boutique']) : 'Abuja Flagship';
$estimatedPrice = isset($input['estimated_price']) ? (float)$input['estimated_price'] : 285000;

if (empty($fullName) || empty($email)) {
    sendJsonResponse(false, [], "Full name and email address are required.", 400);
}

$message = "BESPOKE CUSTOM CREATION REQUEST:\n" .
           "- Fabric: {$fabric}\n" .
           "- Color Tone: {$color}\n" .
           "- Silhouette/Lapel: {$silhouette}\n" .
           "- Monogram Initials: " . ($monogram ? $monogram : 'None') . "\n" .
           "- Estimated Price: ₦" . number_format($estimatedPrice);

try {
    $sql = "INSERT INTO `contact_inquiries` (`full_name`, `email`, `phone`, `boutique_location`, `form_type`, `message`, `status`) 
            VALUES (:full_name, :email, :phone, :boutique, 'styling', :message, 'Pending')";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name' => $fullName,
        ':email'     => $email,
        ':phone'     => $phone,
        ':boutique'  => $boutique,
        ':message'   => $message
    ]);

    $id = $pdo->lastInsertId();

    sendJsonResponse(true, [
        'inquiry_id' => $id,
        'full_name'  => $fullName,
        'estimated_price' => $estimatedPrice
    ], "Thank you, {$fullName}! Your bespoke creation request (#{$id}) has been reserved. An atelier master tailor will contact you within 24 hours.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Database error: " . $e->getMessage(), 500);
}
