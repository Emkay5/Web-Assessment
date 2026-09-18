-- ==========================================================================
-- NF COLLECTIONS NIGERIA - COMPLETE MYSQL DATABASE SCHEMA & SEED DATA
-- Database: nfcollections_db
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS `nfcollections_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nfcollections_db`;

-- 1. SITE SETTINGS & HERO CONTENT TABLE
CREATE TABLE IF NOT EXISTS `site_settings` (
    `setting_key` VARCHAR(100) PRIMARY KEY,
    `setting_value` LONGTEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(20) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `old_price` DECIMAL(12, 2) DEFAULT NULL,
    `badge` VARCHAR(50) DEFAULT NULL,
    `badge_color` VARCHAR(20) DEFAULT 'gold',
    `image1` TEXT NOT NULL,
    `image2` TEXT NOT NULL,
    `colors` JSON NOT NULL,
    `description` TEXT NOT NULL,
    `composition` VARCHAR(255) NOT NULL,
    `sizes` JSON NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. FLAGSHIP BOUTIQUES TABLE
CREATE TABLE IF NOT EXISTS `boutiques` (
    `id` VARCHAR(50) PRIMARY KEY,
    `city_name` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `sub_title` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `hours` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `maps_url` TEXT DEFAULT 'https://maps.google.com',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. FREQUENTLY ASKED QUESTIONS (FAQS) TABLE
CREATE TABLE IF NOT EXISTS `faqs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `display_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BRAND MILESTONE TIMELINE TABLE
CREATE TABLE IF NOT EXISTS `milestones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `year` VARCHAR(10) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. GALLERY LOOKBOOK TABLE
CREATE TABLE IF NOT EXISTS `gallery_items` (
    `id` VARCHAR(20) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `tag` VARCHAR(100) NOT NULL,
    `image` TEXT NOT NULL,
    `caption` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CONTACT INQUIRIES & STYLING APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `boutique_location` VARCHAR(100) NOT NULL DEFAULT 'Abuja',
    `form_type` ENUM('inquiry', 'styling') NOT NULL DEFAULT 'inquiry',
    `appointment_date` DATE DEFAULT NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(20) DEFAULT 'Pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. REGISTERED USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `address` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. ORDERS TABLE
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` INT DEFAULT NULL,
    `customer_name` VARCHAR(255) DEFAULT 'Guest Client',
    `customer_email` VARCHAR(255) DEFAULT NULL,
    `customer_phone` VARCHAR(50) DEFAULT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'Processing',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` VARCHAR(20) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================================
-- SEED DATA INSERTION
-- ==========================================================================

-- SITE SETTINGS SEED DATA
INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('hero_subtitle', 'Autumn / Winter ’26 Collection'),
('hero_title', 'The Art of Modern Elegance'),
('hero_description', 'Sculptural coats, fluid silk dresses, and uncompromised bespoke tailoring. Designed in Nigeria for the discerning modernist.'),
('hero_image', 'images/hero_nigerian.jpg'),
('hero_badge_title', 'Handcrafted Nigerian Agbada Coat'),
('hero_badge_sub', 'Limited Atelier Edition #04'),
('ticker_items', '["Handcrafted in Lagos & Kaduna", "100% Traceable Premium Wool & Silk", "Nationwide & Worldwide Express Delivery", "Private Styling Appointments Available"]'),
('atelier_headline', 'Sublime Luxury, Zero Waste'),
('atelier_description', 'Every garment bearing the NF Collections hallmark undergoes over 60 hours of precision pattern-making and hand-stitching by master artisans in Nigeria. We work exclusively with certified organic wool, fine silk, and eco-friendly packaging.')
ON DUPLICATE KEY UPDATE `setting_key`=`setting_key`;

-- BOUTIQUES SEED DATA
INSERT INTO `boutiques` (`id`, `city_name`, `title`, `sub_title`, `address`, `hours`, `phone`, `email`, `maps_url`) VALUES
('abuja', 'Abuja', 'Abuja Flagship', 'Flagship & Main Atelier', '12 Gana Street, Maitama<br>Abuja, FCT, Nigeria', 'Mon – Sat: 09:00 – 18:00', '+234 803 123 4567', 'abuja@nfcollections.ng', 'https://maps.google.com'),
('lagos', 'Lagos', 'Lagos Victoria Island Atelier', 'Commercial Salon', '24 Akin Adesola Street, Victoria Island<br>Lagos, Nigeria', 'Mon – Sat: 10:00 – 19:00', '+234 812 987 6543', 'lagos@nfcollections.ng', 'https://maps.google.com'),
('kaduna', 'Kaduna', 'Kaduna Barnawa Boutique', 'Founding Atelier', '18 Isa Kaita Road, Barnawa<br>Kaduna, Nigeria', 'Mon – Sat: 09:00 – 18:00', '+234 806 555 4321', 'kaduna@nfcollections.ng', 'https://maps.google.com'),
('portharcourt', 'Port Harcourt', 'Port Harcourt Salon', 'South-South Showroom', '10 Tombia Street, GRA Phase 2<br>Port Harcourt, Rivers State, Nigeria', 'Mon – Sat: 09:00 – 18:00', '+234 809 777 8899', 'portharcourt@nfcollections.ng', 'https://maps.google.com')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- FAQS SEED DATA
INSERT INTO `faqs` (`question`, `answer`, `display_order`) VALUES
('How do I arrange a private bespoke fitting appointment?', 'You can book directly via the contact form above by selecting \'Book Private Styling\' or by calling any of our flagship ateliers in Abuja, Lagos, Kaduna, or Port Harcourt. Personal fitting advisors are assigned to your session.', 1),
('What are NF Collections\' nationwide delivery timeframes?', 'We offer doorstep express shipping nationwide across Nigeria via DHL / GIG Logistics. Delivery takes 1–2 business days for Lagos & Abuja, and 2–3 business days for other states.', 2),
('What is your return and exchange policy?', 'We accept returns and size exchanges within 7 days of delivery. Garments must be unworn, in original condition with security tags intact.', 3),
('Are NF Collections garments eligible for lifetime repair?', 'Yes. True luxury endures. All NF Collections outerwear, silk garments, and bespoke tailoring include lifetime complimentary button re-stitching, lining restoration, and seam re-finishing at any of our flagship boutiques.', 4)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- MILESTONES SEED DATA
INSERT INTO `milestones` (`year`, `title`, `description`, `display_order`) VALUES
('2018', 'The Kaduna Atelier Launch', 'Nana Firdausi launches NF Collections in Kaduna with a capsule collection of 6 bespoke tailored pieces.', 1),
('2020', 'Abuja Flagship Showroom', 'Opening of our main flagship showroom in Maitama, Abuja, introducing private styling appointments for exclusive clientele.', 2),
('2022', '100% Organic Sourcing Charter', 'NF Collections transitions 100% of fabric supply to certified organic wool, fine silk, and eco-friendly packaging.', 3),
('2024', 'Lagos Victoria Island Atelier', 'Opening of our Victoria Island atelier in Lagos and winning the West African Sustainable Fashion Award.', 4),
('2026', 'Global Digital Atelier', 'Unveiling our high-end digital presence platform, allowing seamless nationwide delivery and worldwide private styling reservations.', 5)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- PRODUCTS SEED DATA
INSERT INTO `products` (`id`, `name`, `category`, `price`, `old_price`, `badge`, `badge_color`, `image1`, `image2`, `colors`, `description`, `composition`, `sizes`) VALUES
('nf-001', 'Sovereign Oversized Cashmere Agbada Coat', 'Outerwear', 245000.00, NULL, 'New Arrival', 'gold', 'images/outerwear_nigerian.jpg', 'images/hero_nigerian.jpg', '["#18181A", "#5C5449", "#E6E0D4"]', 'Meticulously tailored from double-faced cashmere and hand-embroidered in Lagos. Features a structured lapel and regal Nigerian silhouette.', '100% Double-Faced Cashmere. Lining: 100% Pure Silk.', '["XS", "S", "M", "L"]'),
('nf-002', 'Royal Silk Tailored Blazer', 'Tailoring', 185000.00, 210000.00, 'Limited Edition', 'dark', 'images/tailoring_nigerian.jpg', 'images/tailoring_nigerian.jpg', '["#0D0D0E", "#C2A661"]', 'Single-breasted architectural jacket styled with padded shoulders and handcrafted gold silk embroidery for a modern Nigerian silhouette.', '70% Heavy Silk, 30% Fine Wool.', '["S", "M", "L", "XL"]'),
('nf-003', 'Sculptural Nigerian Leather Handbag', 'Leather Goods', 168000.00, NULL, 'Best Seller', 'gold', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', '["#1A1816", "#7C6752"]', 'Handcrafted by Kaduna leather artisans from full-grain leather with a smooth matte finish and gold brass hardware.', '100% Full-Grain Genuine Nigerian Leather.', '["One Size"]'),
('nf-004', 'Bespoke Wool Pleated Trousers', 'Tailoring', 92000.00, NULL, 'Essential', 'dark', 'images/outerwear_nigerian.jpg', 'images/hero_nigerian.jpg', '["#18181A", "#9B958B"]', 'High-waisted trousers engineered with crisp forward deep pleats and wide leg profile for fluid motion and timeless comfort.', '100% Fine Merino Wool.', '["XS", "S", "M", "L", "XL"]'),
('nf-005', 'Midnight Silk Nigerian Evening Gown', 'Tailoring', 145000.00, NULL, 'New Season', 'gold', 'images/tailoring_nigerian.jpg', 'images/hero_nigerian.jpg', '["#0D0D0E", "#EAE6DF"]', 'Floor-sweeping bias-cut silk dress inspired by Nigerian royal court fashion featuring delicate gold accents.', '100% Mulberry Silk Crepe.', '["XS", "S", "M", "L"]'),
('nf-006', 'Handcrafted Kaduna Leather Ankle Boots', 'Footwear', 125000.00, 140000.00, 'Popular', 'dark', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80', '["#18181A"]', 'Handcrafted leather boot with a durable rubber sole, subtle debossed logo, and flexible side elastic gussets.', '100% Genuine Leather & Rubber Sole.', '["38", "39", "40", "41", "42", "43", "44"]'),
('nf-007', 'Heritage Nigerian Hammered Gold Cuff', 'Fine Accessories', 68000.00, NULL, 'Signature', 'gold', 'https://images.unsplash.com/photo-1611591475143-4f8a77391851?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', '["#C2A661"]', 'Hand-hammered 18k gold-plated brass cuff inspired by traditional Nigerian royal brass work.', '18k Gold Plated Recycled Brass.', '["S/M", "M/L"]'),
('nf-008', 'Imperial Silk & Velvet Agbada Coat', 'Outerwear', 320000.00, NULL, 'Luxury Edition', 'gold', 'images/hero_nigerian.jpg', 'images/outerwear_nigerian.jpg', '["#5C4D3C", "#18181A"]', 'Ultra-luxurious plush velvet statement coat featuring detailed Nigerian hand embroidery lapels and a refined inner silk lining.', '100% Premium Velvet & Silk Accent.', '["S", "M", "L", "XL"]')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- GALLERY SEED DATA
-- CONTACT INQUIRIES & STYLING APPOINTMENTS SEED DATA
INSERT INTO `contact_inquiries` (`full_name`, `email`, `phone`, `boutique_location`, `form_type`, `appointment_date`, `message`, `status`) VALUES
('Nana Firdausi', 'nana.firdausi@nfcollections.ng', '+234 803 123 4567', 'Abuja', 'styling', '2026-10-05', 'Requesting private styling suite appointment for Autumn/Winter outerwear fitting.', 'Confirmed'),
('Aisha Bello', 'aisha.bello@example.ng', '+234 812 987 6543', 'Lagos', 'inquiry', NULL, 'Inquiring about international express shipping rates to London for bespoke silk dress.', 'Pending')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- NEWSLETTER SUBSCRIBERS SEED DATA
INSERT INTO `newsletter_subscribers` (`email`) VALUES
('nana.firdausi@nfcollections.ng'),
('client@vogue.com'),
('fashion.editor@thisdaystyle.ng')
ON DUPLICATE KEY UPDATE `id`=`id`;
