<?php
/* ==========================================================================
   NF COLLECTIONS NIGERIA - FULL EXECUTIVE ADMIN BACKEND API ENDPOINT
   ========================================================================== */

require_once __DIR__ . '/db.php';

$pdo = getPDOConnection();
if (!$pdo) {
    sendJsonResponse(false, [], "Database connection unavailable. Please start XAMPP MySQL.", 500);
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$action = isset($_GET['action']) ? trim($_GET['action']) : (isset($input['action']) ? trim($input['action']) : 'dashboard_stats');

switch ($action) {
    case 'dashboard_stats':
        getDashboardStats($pdo);
        break;

    case 'get_orders':
        getOrders($pdo);
        break;

    case 'get_inquiries':
        getInquiries($pdo);
        break;

    case 'get_subscribers':
        getSubscribers($pdo);
        break;

    case 'delete_subscriber':
        deleteSubscriber($pdo, $input);
        break;

    case 'get_clients':
        getClients($pdo);
        break;

    case 'update_order_status':
        updateOrderStatus($pdo, $input);
        break;

    case 'update_inquiry_status':
        updateInquiryStatus($pdo, $input);
        break;

    case 'save_product':
        saveProduct($pdo, $input);
        break;

    case 'delete_product':
        deleteProduct($pdo, $input);
        break;

    case 'save_site_setting':
        saveSiteSetting($pdo, $input);
        break;

    case 'save_boutique':
        saveBoutique($pdo, $input);
        break;

    case 'delete_boutique':
        deleteBoutique($pdo, $input);
        break;

    case 'save_faq':
        saveFaq($pdo, $input);
        break;

    case 'delete_faq':
        deleteFaq($pdo, $input);
        break;

    case 'save_milestone':
        saveMilestone($pdo, $input);
        break;

    case 'delete_milestone':
        deleteMilestone($pdo, $input);
        break;

    case 'save_gallery_item':
        saveGalleryItem($pdo, $input);
        break;

    case 'delete_gallery_item':
        deleteGalleryItem($pdo, $input);
        break;

    default:
        sendJsonResponse(false, [], "Invalid admin action requested.", 400);
        break;
}

// --------------------------------------------------------------------------
// ADMIN HANDLER FUNCTIONS
// --------------------------------------------------------------------------

function getDashboardStats($pdo) {
    try {
        $totalOrders = (int)$pdo->query("SELECT COUNT(*) FROM `orders`")->fetchColumn();
        $totalRevenue = (float)$pdo->query("SELECT COALESCE(SUM(`total_amount`), 0) FROM `orders`")->fetchColumn();
        $totalInquiries = (int)$pdo->query("SELECT COUNT(*) FROM `contact_inquiries`")->fetchColumn();
        $pendingStyling = (int)$pdo->query("SELECT COUNT(*) FROM `contact_inquiries` WHERE `form_type` = 'styling' AND `status` = 'Pending'")->fetchColumn();
        $totalSubscribers = (int)$pdo->query("SELECT COUNT(*) FROM `newsletter_subscribers`")->fetchColumn();
        $totalClients = (int)$pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
        $totalProducts = (int)$pdo->query("SELECT COUNT(*) FROM `products`")->fetchColumn();
        $totalGallery = (int)$pdo->query("SELECT COUNT(*) FROM `gallery_items`")->fetchColumn();

        sendJsonResponse(true, [
            'total_orders'      => $totalOrders,
            'total_revenue'     => $totalRevenue,
            'total_inquiries'   => $totalInquiries,
            'pending_styling'   => $pendingStyling,
            'total_subscribers' => $totalSubscribers,
            'total_clients'     => $totalClients,
            'total_products'    => $totalProducts,
            'total_gallery'     => $totalGallery
        ], "Dashboard statistics retrieved.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error fetching stats: " . $e->getMessage(), 500);
    }
}

function getClients($pdo) {
    try {
        $stmt = $pdo->query("SELECT `id`, `full_name`, `email`, `phone`, `address`, `created_at` FROM `users` ORDER BY `created_at` DESC");
        $clients = $stmt->fetchAll() ?: [];
        sendJsonResponse(true, array_values($clients), "Registered clients retrieved.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error fetching clients: " . $e->getMessage(), 500);
    }
}

function getOrders($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM `orders` ORDER BY `created_at` DESC");
        $orders = $stmt->fetchAll() ?: [];

        foreach ($orders as &$order) {
            $stmtItems = $pdo->prepare("SELECT * FROM `order_items` WHERE `order_id` = :order_id");
            $stmtItems->execute([':order_id' => $order['id']]);
            $order['items'] = $stmtItems->fetchAll() ?: [];
            $order['total_amount'] = (float)$order['total_amount'];
        }

        sendJsonResponse(true, array_values($orders), "Orders retrieved successfully.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error fetching orders: " . $e->getMessage(), 500);
    }
}

function getInquiries($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM `contact_inquiries` ORDER BY `created_at` DESC");
        $inquiries = $stmt->fetchAll() ?: [];
        sendJsonResponse(true, array_values($inquiries), "Inquiries retrieved successfully.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error fetching inquiries: " . $e->getMessage(), 500);
    }
}

function getSubscribers($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM `newsletter_subscribers` ORDER BY `subscribed_at` DESC");
        $subscribers = $stmt->fetchAll() ?: [];
        sendJsonResponse(true, array_values($subscribers), "Subscribers retrieved successfully.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error fetching subscribers: " . $e->getMessage(), 500);
    }
}

function deleteSubscriber($pdo, $input) {
    $id    = isset($input['id']) ? (int)$input['id'] : 0;
    $email = isset($input['email']) ? trim($input['email']) : '';

    if (!$id && empty($email)) {
        sendJsonResponse(false, [], "Subscriber ID or Email is required for deletion.", 400);
    }

    try {
        if ($id > 0) {
            $stmt = $pdo->prepare("DELETE FROM `newsletter_subscribers` WHERE `id` = :id");
            $stmt->execute([':id' => $id]);
        } else {
            $stmt = $pdo->prepare("DELETE FROM `newsletter_subscribers` WHERE `email` = :email");
            $stmt->execute([':email' => $email]);
        }
        sendJsonResponse(true, ['id' => $id, 'email' => $email], "Subscriber removed from database.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error deleting subscriber: " . $e->getMessage(), 500);
    }
}

function updateOrderStatus($pdo, $input) {
    $orderId = isset($input['order_id']) ? (int)$input['order_id'] : 0;
    $status  = isset($input['status']) ? trim($input['status']) : 'Processing';

    if (!$orderId) sendJsonResponse(false, [], "Order ID is required.", 400);

    try {
        $stmt = $pdo->prepare("UPDATE `orders` SET `status` = :status WHERE `id` = :id");
        $stmt->execute([':status' => $status, ':id' => $orderId]);
        sendJsonResponse(true, ['order_id' => $orderId, 'status' => $status], "Order status updated to {$status}.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error updating order status: " . $e->getMessage(), 500);
    }
}

function updateInquiryStatus($pdo, $input) {
    $inquiryId = isset($input['inquiry_id']) ? (int)$input['inquiry_id'] : 0;
    $status    = isset($input['status']) ? trim($input['status']) : 'Pending';

    if (!$inquiryId) sendJsonResponse(false, [], "Inquiry ID is required.", 400);

    try {
        $stmt = $pdo->prepare("UPDATE `contact_inquiries` SET `status` = :status WHERE `id` = :id");
        $stmt->execute([':status' => $status, ':id' => $inquiryId]);
        sendJsonResponse(true, ['inquiry_id' => $inquiryId, 'status' => $status], "Inquiry status updated to {$status}.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error updating inquiry status: " . $e->getMessage(), 500);
    }
}

function saveProduct($pdo, $input) {
    $id          = isset($input['id']) && !empty($input['id']) ? trim($input['id']) : 'nf-' . sprintf('%03d', rand(9, 999));
    $name        = isset($input['name']) ? trim($input['name']) : '';
    $category    = isset($input['category']) ? trim($input['category']) : 'Outerwear';
    $price       = isset($input['price']) ? (float)$input['price'] : 0;
    $oldPrice    = isset($input['old_price']) && !empty($input['old_price']) ? (float)$input['old_price'] : null;
    $badge       = isset($input['badge']) ? trim($input['badge']) : null;
    $badgeColor  = isset($input['badge_color']) ? trim($input['badge_color']) : 'gold';
    $image1      = isset($input['image1']) ? trim($input['image1']) : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80';
    $image2      = isset($input['image2']) ? trim($input['image2']) : $image1;
    $colors      = isset($input['colors']) ? (is_array($input['colors']) ? json_encode($input['colors']) : $input['colors']) : '["#18181A"]';
    $sizes       = isset($input['sizes']) ? (is_array($input['sizes']) ? json_encode($input['sizes']) : $input['sizes']) : '["S", "M", "L"]';
    $description = isset($input['description']) ? trim($input['description']) : '';
    $composition = isset($input['composition']) ? trim($input['composition']) : '100% Fine Organic Textile';

    if (empty($name) || $price <= 0) {
        sendJsonResponse(false, [], "Product name and valid price are required.", 400);
    }

    try {
        $sql = "INSERT INTO `products` (`id`, `name`, `category`, `price`, `old_price`, `badge`, `badge_color`, `image1`, `image2`, `colors`, `description`, `composition`, `sizes`) 
                VALUES (:id, :name, :category, :price, :old_price, :badge, :badge_color, :image1, :image2, :colors, :description, :composition, :sizes)
                ON DUPLICATE KEY UPDATE 
                `name` = VALUES(`name`), `category` = VALUES(`category`), `price` = VALUES(`price`), `old_price` = VALUES(`old_price`),
                `badge` = VALUES(`badge`), `badge_color` = VALUES(`badge_color`), `image1` = VALUES(`image1`), `image2` = VALUES(`image2`),
                `colors` = VALUES(`colors`), `description` = VALUES(`description`), `composition` = VALUES(`composition`), `sizes` = VALUES(`sizes`)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id'          => $id,
            ':name'        => $name,
            ':category'    => $category,
            ':price'       => $price,
            ':old_price'   => $oldPrice,
            ':badge'       => $badge,
            ':badge_color' => $badgeColor,
            ':image1'      => $image1,
            ':image2'      => $image2,
            ':colors'      => $colors,
            ':description' => $description,
            ':composition' => $composition,
            ':sizes'       => $sizes
        ]);

        sendJsonResponse(true, ['id' => $id, 'name' => $name], "Product {$name} saved to MySQL catalog.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error saving product: " . $e->getMessage(), 500);
    }
}

function deleteProduct($pdo, $input) {
    $id = isset($input['id']) ? trim($input['id']) : '';
    if (empty($id)) sendJsonResponse(false, [], "Product ID required.", 400);

    try {
        $stmt = $pdo->prepare("DELETE FROM `products` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        sendJsonResponse(true, ['id' => $id], "Product deleted from catalog.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error deleting product: " . $e->getMessage(), 500);
    }
}

function saveSiteSetting($pdo, $input) {
    $settings = isset($input['settings']) && is_array($input['settings']) ? $input['settings'] : [];
    if (empty($settings)) sendJsonResponse(false, [], "No settings provided.", 400);

    try {
        $stmt = $pdo->prepare("INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES (:key, :val) ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)");
        foreach ($settings as $key => $val) {
            $valueStr = is_array($val) ? json_encode($val) : (string)$val;
            $stmt->execute([':key' => $key, ':val' => $valueStr]);
        }
        sendJsonResponse(true, [], "Site settings updated successfully.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error saving settings: " . $e->getMessage(), 500);
    }
}

function saveBoutique($pdo, $input) {
    $id       = isset($input['id']) && !empty($input['id']) ? trim($input['id']) : strtolower(trim($input['city_name']));
    $cityName = isset($input['city_name']) ? trim($input['city_name']) : 'Boutique';
    $title    = isset($input['title']) ? trim($input['title']) : '';
    $subTitle = isset($input['sub_title']) ? trim($input['sub_title']) : '';
    $address  = isset($input['address']) ? trim($input['address']) : '';
    $hours    = isset($input['hours']) ? trim($input['hours']) : 'Mon – Sat: 09:00 – 18:00';
    $phone    = isset($input['phone']) ? trim($input['phone']) : '';
    $email    = isset($input['email']) ? trim($input['email']) : '';
    $mapsUrl  = isset($input['maps_url']) ? trim($input['maps_url']) : 'https://maps.google.com';

    try {
        $sql = "INSERT INTO `boutiques` (`id`, `city_name`, `title`, `sub_title`, `address`, `hours`, `phone`, `email`, `maps_url`) 
                VALUES (:id, :city_name, :title, :sub_title, :address, :hours, :phone, :email, :maps_url)
                ON DUPLICATE KEY UPDATE 
                `city_name` = VALUES(`city_name`), `title` = VALUES(`title`), `sub_title` = VALUES(`sub_title`),
                `address` = VALUES(`address`), `hours` = VALUES(`hours`), `phone` = VALUES(`phone`),
                `email` = VALUES(`email`), `maps_url` = VALUES(`maps_url`)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id'        => $id,
            ':city_name' => $cityName,
            ':title'     => $title,
            ':sub_title' => $subTitle,
            ':address'   => $address,
            ':hours'     => $hours,
            ':phone'     => $phone,
            ':email'     => $email,
            ':maps_url'  => $mapsUrl
        ]);

        sendJsonResponse(true, ['id' => $id], "Flagship boutique {$title} saved.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error saving boutique: " . $e->getMessage(), 500);
    }
}

function deleteBoutique($pdo, $input) {
    $id = isset($input['id']) ? trim($input['id']) : '';
    try {
        $stmt = $pdo->prepare("DELETE FROM `boutiques` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        sendJsonResponse(true, ['id' => $id], "Boutique deleted.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error deleting boutique: " . $e->getMessage(), 500);
    }
}

function saveFaq($pdo, $input) {
    $id       = isset($input['id']) ? (int)$input['id'] : 0;
    $question = isset($input['question']) ? trim($input['question']) : '';
    $answer   = isset($input['answer']) ? trim($input['answer']) : '';
    $order    = isset($input['display_order']) ? (int)$input['display_order'] : 1;

    if (empty($question) || empty($answer)) sendJsonResponse(false, [], "Question and Answer required.", 400);

    try {
        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE `faqs` SET `question` = :q, `answer` = :a, `display_order` = :o WHERE `id` = :id");
            $stmt->execute([':q' => $question, ':a' => $answer, ':o' => $order, ':id' => $id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO `faqs` (`question`, `answer`, `display_order`) VALUES (:q, :a, :o)");
            $stmt->execute([':q' => $question, ':a' => $answer, ':o' => $order]);
        }
        sendJsonResponse(true, [], "FAQ saved.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error saving FAQ: " . $e->getMessage(), 500);
    }
}

function deleteFaq($pdo, $input) {
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    try {
        $stmt = $pdo->prepare("DELETE FROM `faqs` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        sendJsonResponse(true, [], "FAQ deleted.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error deleting FAQ: " . $e->getMessage(), 500);
    }
}

function saveMilestone($pdo, $input) {
    $id          = isset($input['id']) ? (int)$input['id'] : 0;
    $year        = isset($input['year']) ? trim($input['year']) : '2026';
    $title       = isset($input['title']) ? trim($input['title']) : '';
    $description = isset($input['description']) ? trim($input['description']) : '';
    $order       = isset($input['display_order']) ? (int)$input['display_order'] : 1;

    try {
        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE `milestones` SET `year` = :y, `title` = :t, `description` = :d, `display_order` = :o WHERE `id` = :id");
            $stmt->execute([':y' => $year, ':t' => $title, ':d' => $description, ':o' => $order, ':id' => $id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO `milestones` (`year`, `title`, `description`, `display_order`) VALUES (:y, :t, :d, :o)");
            $stmt->execute([':y' => $year, ':t' => $title, ':d' => $description, ':o' => $order]);
        }
        sendJsonResponse(true, [], "Milestone saved.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error saving milestone: " . $e->getMessage(), 500);
    }
}

function deleteMilestone($pdo, $input) {
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    try {
        $stmt = $pdo->prepare("DELETE FROM `milestones` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        sendJsonResponse(true, [], "Milestone deleted.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error deleting milestone: " . $e->getMessage(), 500);
    }
}

function saveGalleryItem($pdo, $input) {
    $id       = isset($input['id']) && !empty($input['id']) ? trim($input['id']) : 'gal-' . sprintf('%02d', rand(10, 99));
    $title    = isset($input['title']) ? trim($input['title']) : '';
    $category = isset($input['category']) ? trim($input['category']) : 'Runway';
    $tag      = isset($input['tag']) ? trim($input['tag']) : 'Editorial';
    $image    = isset($input['image']) ? trim($input['image']) : '';
    $caption  = isset($input['caption']) ? trim($input['caption']) : '';

    try {
        $sql = "INSERT INTO `gallery_items` (`id`, `title`, `category`, `tag`, `image`, `caption`) 
                VALUES (:id, :title, :category, :tag, :image, :caption)
                ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `category` = VALUES(`category`), `tag` = VALUES(`tag`), `image` = VALUES(`image`), `caption` = VALUES(`caption`)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id, ':title' => $title, ':category' => $category, ':tag' => $tag, ':image' => $image, ':caption' => $caption]);
        sendJsonResponse(true, ['id' => $id], "Lookbook item saved.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error saving gallery item: " . $e->getMessage(), 500);
    }
}

function deleteGalleryItem($pdo, $input) {
    $id = isset($input['id']) ? trim($input['id']) : '';
    try {
        $stmt = $pdo->prepare("DELETE FROM `gallery_items` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        sendJsonResponse(true, [], "Gallery item deleted.");
    } catch (PDOException $e) {
        sendJsonResponse(false, [], "Error deleting gallery item: " . $e->getMessage(), 500);
    }
}
