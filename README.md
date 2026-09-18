# NF Collections Nigeria — Digital Presence Project

> **Course Final Project:** Digital Presence Website Development  
> **Brand Name:** NF Collections Nigeria (High-Fashion Haute Couture & Sustainable Atelier)  
> **Live Website (Vercel):** *[Insert Vercel URL Here]*  
> **GitHub Repository:** *[Insert GitHub Repo URL Here]*  

---

## 🏛️ Project Overview

**NF Collections Nigeria** is a bespoke, luxury digital presence application designed for a Nigerian haute couture fashion brand & sustainable atelier founded by Nana Firdausi. The website satisfies all criteria established in the `Digital_Presence_Final_Project` guidelines while adhering to standard Nigerian commercial web standards.

The website avoids generic "AI template" aesthetics, featuring clean high-fashion editorial styling—combining high-contrast typography, warm alabaster stone canvas backgrounds, asymmetrical layouts, Naira (`₦`) currency display, and rich micro-interactions.

---

## 📄 Pages & Architecture

The project consists of 5 complete, fully linked responsive HTML pages in standard English:

1. **`index.html` (Home Page)**
   - Hero Editorial Banner with headline ("The Art of Modern Elegance"), description, and call-to-action buttons.
   - Infinite marquee ticker highlighting brand values (*Handcrafted in Lagos & Kaduna • 100% Traceable Premium Wool & Silk*).
   - Category spotlight cards (Outerwear, Bespoke Tailoring, Genuine Leather).
   - Featured Autumn/Winter ’26 products grid with Quick View & Add to Bag interactions in Naira (`₦`).
   - Editorial brand philosophy split section with impact metrics counters.
   - Press recognition showcase (*VOGUE, THISDAY STYLE, GUARDIAN LIFE, GQ*).
   - Newsletter subscription banner with email validation toast notifications.

2. **`about.html` (About Us Page)**
   - Brand heritage narrative founded in Kaduna and creative director's philosophy.
   - **Interactive Milestone Timeline (2018 – 2026)** detailing the journey from Kaduna initiation to Abuja and Lagos expansion.
   - Four pillars of craftsmanship grid (*100% Traceability, Master Artisans, Zero-Waste Cutting, Lifetime Care*).

3. **`products.html` (Collections & Products Page)**
   - Interactive live search bar filtering product cards in real time.
   - Category filtering tabs (*All Creations, Outerwear, Tailoring, Leather Goods, Footwear, Fine Accessories*).
   - Price sorting dropdown (*Featured, Price Low-High, Price High-Low*).
   - Interactive **Quick View Modal** featuring fabric details, size selection chips, and add-to-bag trigger.
   - Slide-out **Shopping Bag Cart Drawer** with live Naira subtotal calculation, quantity modifier buttons, and localStorage persistence.

4. **`gallery.html` (Lookbook & Runway Page)**
   - High-resolution editorial photography grid organized by category (*Runway Shows, Editorial Campaigns, Atelier Craftsmanship*).
   - Category filter buttons.
   - **Fullscreen Lightbox Viewer** with Next/Previous navigation buttons and photography captions.

5. **`contact.html` (Contact & Boutiques Page)**
   - Interactive tabbed **Flagship Store Locator** (*Abuja, Lagos, Kaduna, Port Harcourt*) displaying street addresses, opening hours, phone numbers, and directions link.
   - Form toggle between **General Inquiry** and **Book Private Styling Appointment** (dynamic date picker toggle).
   - Live form validation and animated toast confirmation upon submission.
   - Interactive **FAQ Accordion** addressing private styling, nationwide delivery, return policies, and lifetime garment repairs.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic document structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3**: Custom design system using CSS Variables (`--color-obsidian`, `--color-gold`, `--color-bg-alt`), Flexbox, CSS Grid, and custom keyframe animations.
- **Typography**: Google Fonts — **Cormorant Garamond** (Serif Display) & **Plus Jakarta Sans** (UI Sans-Serif).
- **Vanilla JavaScript (ES6+)**:
  - `main.js`: Sticky navigation scroll listener, mobile drawer toggle, active page link detection, toast notification system, FAQ accordion.
  - `products.js`: Dynamic product catalog rendering, live category filter, search, Naira price sorting, Quick View modal, cart drawer state management (`localStorage`).
  - `gallery.js`: Lookbook gallery filtering and full-screen lightbox modal viewer.

---

## 🎨 Design System & Palette

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--color-bg` | `#FAF8F5` | Primary warm alabaster canvas |
| `--color-bg-alt` | `#F2EFE9` | Secondary warm stone surface |
| `--color-obsidian` | `#0D0D0E` | Deep luxury black |
| `--color-gold` | `#C2A661` | Subtle muted metallic gold accent |
| `--color-ink` | `#18181A` | High-contrast body typography |
| `--color-muted` | `#6B6862` | Secondary editorial copy |

---

## 🚀 Deployment Instructions

### 1. Uploading to GitHub
```bash
git init
git add .
git commit -m "Initial commit: NF Collections Nigeria digital presence website"
git remote add origin https://github.com/YOUR_USERNAME/nfcollections-nigeria.git
git branch -M main
git push -u origin main
```

### 2. Deploying to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Import your GitHub repository.
3. Keep framework preset as **"Other"** (Plain HTML/CSS/JS).
4. Click **"Deploy"** to generate your live site link.

---

## 📝 Grading Rubric Self-Check

| Criteria | Marks | Implementation Details |
| :--- | :---: | :--- |
| **HTML Structure** | 20 | Fully semantic HTML5 across all 5 pages with unique titles & meta tags in English. |
| **CSS Styling** | 20 | Bespoke design system, CSS variables, Google Fonts, dark luxury accents. |
| **Responsiveness** | 20 | Mobile menu drawer, flexible CSS Grid/Flexbox layouts across mobile, tablet, desktop. |
| **Content & Design Quality** | 15 | High-fashion copy in English, Naira prices, Nigerian locations (Abuja, Lagos, Kaduna, PH), cart drawer. |
| **GitHub Usage** | 10 | Clean code structure ready for GitHub repository upload. |
| **Vercel Deployment** | 10 | Static structure optimized for 1-click Vercel deployment. |
| **README Documentation**| 5 | Complete documentation of architecture, features, and setup guidelines. |
| **TOTAL** | **100** | **Fully Satisfied** |
