<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - GET SITE CONTENT API ENDPOINT
   ========================================================================== */

require_once __DIR__ . '/db.php';

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable.", 500);
}

try {
    // 1. Site Settings Key-Value Map
    $stmtSettings = $pdo->query("SELECT `setting_key`, `setting_value` FROM `site_settings`");
    $rawSettings = $stmtSettings->fetchAll();
    $settings = [];
    foreach ($rawSettings as $row) {
        $key = $row['setting_key'];
        $val = $row['setting_value'];
        if ($key === 'ticker_items') {
            $settings[$key] = json_decode($val, true) ?: [];
        } else {
            $settings[$key] = $val;
        }
    }

    // 2. Boutiques / Store Locator
    $stmtBoutiques = $pdo->query("SELECT * FROM `boutiques` ORDER BY `created_at` ASC");
    $rawBoutiques = $stmtBoutiques->fetchAll();
    $boutiques = [];
    foreach ($rawBoutiques as $b) {
        $boutiques[$b['id']] = [
            'title'   => $b['title'],
            'sub'     => $b['sub_title'],
            'address' => $b['address'],
            'hours'   => $b['hours'],
            'phone'   => $b['phone'],
            'email'   => $b['email'],
            'maps'    => $b['maps_url']
        ];
    }

    // 3. FAQs
    $stmtFaqs = $pdo->query("SELECT * FROM `faqs` WHERE `is_active` = 1 ORDER BY `display_order` ASC, `id` ASC");
    $faqs = $stmtFaqs->fetchAll();

    // 4. Timeline Milestones
    $stmtMilestones = $pdo->query("SELECT * FROM `milestones` ORDER BY `display_order` ASC, `year` ASC");
    $milestones = $stmtMilestones->fetchAll();

    sendJsonResponse(true, [
        'settings'   => $settings,
        'boutiques'  => $boutiques,
        'faqs'       => $faqs,
        'milestones' => $milestones
    ], "Site content fetched successfully.");

} catch (PDOException $e) {
    sendJsonResponse(false, [], "Failed to fetch site content: " . $e->getMessage(), 500);
}
