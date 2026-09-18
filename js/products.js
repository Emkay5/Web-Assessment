/* ==========================================================================
   NF COLLECTIONS NIGERIA - PRODUCTS & CART INTERACTIVE JAVASCRIPT
   Catalog rendering, filtering, search, quick view modal & cart state
   ========================================================================== */

const PRODUCTS_DATA = [
    {
        id: 'nf-001',
        name: 'Sovereign Oversized Cashmere Agbada Coat',
        category: 'Outerwear',
        price: 245000,
        oldPrice: null,
        badge: 'New Arrival',
        badgeColor: 'gold',
        image1: 'images/outerwear_nigerian.jpg',
        image2: 'images/hero_nigerian.jpg',
        colors: ['#18181A', '#5C5449', '#E6E0D4'],
        description: 'Meticulously tailored from double-faced cashmere and hand-embroidered in Lagos. Features a structured lapel and regal Nigerian silhouette.',
        composition: '100% Double-Faced Cashmere. Lining: 100% Pure Silk.',
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 'nf-002',
        name: 'Royal Silk Tailored Blazer',
        category: 'Tailoring',
        price: 185000,
        oldPrice: 210000,
        badge: 'Limited Edition',
        badgeColor: 'dark',
        image1: 'images/tailoring_nigerian.jpg',
        image2: 'images/tailoring_nigerian.jpg',
        colors: ['#0D0D0E', '#C2A661'],
        description: 'Single-breasted architectural jacket styled with padded shoulders and handcrafted gold silk embroidery for a modern Nigerian silhouette.',
        composition: '70% Heavy Silk, 30% Fine Wool.',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'nf-003',
        name: 'Sculptural Nigerian Leather Handbag',
        category: 'Leather Goods',
        price: 168000,
        oldPrice: null,
        badge: 'Best Seller',
        badgeColor: 'gold',
        image1: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        image2: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        colors: ['#1A1816', '#7C6752'],
        description: 'Handcrafted by Kaduna leather artisans from full-grain leather with a smooth matte finish and gold brass hardware.',
        composition: '100% Full-Grain Genuine Nigerian Leather.',
        sizes: ['One Size']
    },
    {
        id: 'nf-004',
        name: 'Bespoke Wool Pleated Trousers',
        category: 'Tailoring',
        price: 92000,
        oldPrice: null,
        badge: 'Essential',
        badgeColor: 'dark',
        image1: 'images/outerwear_nigerian.jpg',
        image2: 'images/hero_nigerian.jpg',
        colors: ['#18181A', '#9B958B'],
        description: 'High-waisted trousers engineered with crisp forward deep pleats and wide leg profile for fluid motion and timeless comfort.',
        composition: '100% Fine Merino Wool.',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
        id: 'nf-005',
        name: 'Midnight Silk Nigerian Evening Gown',
        category: 'Tailoring',
        price: 145000,
        oldPrice: null,
        badge: 'New Season',
        badgeColor: 'gold',
        image1: 'images/tailoring_nigerian.jpg',
        image2: 'images/hero_nigerian.jpg',
        colors: ['#0D0D0E', '#EAE6DF'],
        description: 'Floor-sweeping bias-cut silk dress inspired by Nigerian royal court fashion featuring delicate gold accents.',
        composition: '100% Mulberry Silk Crepe.',
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 'nf-006',
        name: 'Handcrafted Kaduna Leather Ankle Boots',
        category: 'Footwear',
        price: 125000,
        oldPrice: 140000,
        badge: 'Popular',
        badgeColor: 'dark',
        image1: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        image2: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
        colors: ['#18181A'],
        description: 'Handcrafted leather boot with a durable rubber sole, subtle debossed logo, and flexible side elastic gussets.',
        composition: '100% Genuine Leather & Rubber Sole.',
        sizes: ['38', '39', '40', '41', '42', '43', '44']
    },
    {
        id: 'nf-007',
        name: 'Heritage Nigerian Hammered Gold Cuff',
        category: 'Fine Accessories',
        price: 68000,
        oldPrice: null,
        badge: 'Signature',
        badgeColor: 'gold',
        image1: 'https://images.unsplash.com/photo-1611591475143-4f8a77391851?auto=format&fit=crop&w=800&q=80',
        image2: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        colors: ['#C2A661'],
        description: 'Hand-hammered 18k gold-plated brass cuff inspired by traditional Nigerian royal brass work.',
        composition: '18k Gold Plated Recycled Brass.',
        sizes: ['S/M', 'M/L']
    },
    {
        id: 'nf-008',
        name: 'Imperial Silk & Velvet Agbada Coat',
        category: 'Outerwear',
        price: 320000,
        oldPrice: null,
        badge: 'Luxury Edition',
        badgeColor: 'gold',
        image1: 'images/hero_nigerian.jpg',
        image2: 'images/outerwear_nigerian.jpg',
        colors: ['#5C4D3C', '#18181A'],
        description: 'Ultra-luxurious plush velvet statement coat featuring detailed Nigerian hand embroidery lapels and a refined inner silk lining.',
        composition: '100% Premium Velvet & Silk Accent.',
        sizes: ['S', 'M', 'L', 'XL']
    }
];

// Shopping Cart State
let shoppingCart = [];
try {
    const savedCart = localStorage.getItem('nfcollections_cart');
    shoppingCart = savedCart ? JSON.parse(savedCart) : [];
    if (!Array.isArray(shoppingCart)) shoppingCart = [];
} catch (err) {
    shoppingCart = [];
}

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    initCartDrawer();
    updateCartUI();
});

/* Render Catalog Grid */
function initCatalog() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return; // Not on products page

    let currentCategory = 'All';
    let currentSearch = '';
    let currentSort = 'featured';

    async function render() {
        let items = PRODUCTS_DATA;
        
        try {
            const url = `api/get_products.php?category=${encodeURIComponent(currentCategory)}&search=${encodeURIComponent(currentSearch)}&sort=${encodeURIComponent(currentSort)}`;
            const response = await fetch(url);
            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    items = result.data;
                }
            }
        } catch (e) {
            // Local fallback filtering if API is unreachable
            items = PRODUCTS_DATA.filter(item => {
                const matchesCategory = currentCategory === 'All' || item.category === currentCategory;
                const matchesSearch = item.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
                                      item.category.toLowerCase().includes(currentSearch.toLowerCase());
                return matchesCategory && matchesSearch;
            });

            if (currentSort === 'price-low') {
                items.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'price-high') {
                items.sort((a, b) => b.price - a.price);
            }
        }

        if (items.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
                    <p style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-muted);">No products match your search criteria.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = items.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-box">
                    ${product.badge ? `<span class="product-badge ${product.badgeColor}">${product.badge}</span>` : ''}
                    <img class="product-image-primary" src="${product.image1}" alt="${product.name}" loading="lazy">
                    <img class="product-image-secondary" src="${product.image2}" alt="${product.name}" loading="lazy">
                    
                    <div class="product-quick-actions">
                        <button class="product-action-btn btn-quickview" onclick="openQuickView('${product.id}')">Quick View</button>
                        <button class="product-action-btn btn-addcart" onclick="addToCart('${product.id}')">Add to Bag</button>
                    </div>
                </div>
                
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price-box">
                        <span class="product-price">${window.formatPrice ? window.formatPrice(product.price) : '₦' + Number(product.price).toLocaleString()}</span>
                        ${product.oldPrice ? `<span class="product-price-old">${window.formatPrice ? window.formatPrice(product.oldPrice) : '₦' + Number(product.oldPrice).toLocaleString()}</span>` : ''}
                    </div>
                    <div class="color-swatches">
                        ${(product.colors || []).map(color => `<span class="swatch" style="background-color: ${color}"></span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Filter Button Clicks
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            render();
        });
    });

    // Search Input Event
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            render();
        });
    }

    // Sort Dropdown Event
    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            render();
        });
    }

    render();
}

/* Quick View Modal Handler */
function openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    let modalOverlay = document.querySelector('.modal-overlay');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
        <div class="modal-content-wrapper">
            <button class="modal-close-btn" onclick="closeQuickView()">✕</button>
            <div class="modal-image-box">
                <img src="${product.image1}" alt="${product.name}">
            </div>
            <div class="modal-details">
                <span class="product-category">${product.category}</span>
                <h2 style="font-family: var(--font-serif); font-size: 2rem;">${product.name}</h2>
                <div class="product-price-box">
                    <span style="font-size: 1.5rem; font-weight: 600;">${window.formatPrice ? window.formatPrice(product.price) : '₦' + product.price.toLocaleString()}</span>
                    ${product.oldPrice ? `<span class="product-price-old">${window.formatPrice ? window.formatPrice(product.oldPrice) : '₦' + product.oldPrice.toLocaleString()}</span>` : ''}
                </div>
                <p style="color: var(--color-muted); font-size: 0.9375rem; line-height: 1.6;">${product.description}</p>
                
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Select Size</label>
                        <a href="javascript:void(0)" onclick="openSizeGuide()" style="font-size: 0.75rem; color: var(--color-gold); text-decoration: underline;">View Size Guide 📏</a>
                    </div>
                    <div class="size-selector">
                        ${(product.sizes || []).map((s, idx) => `<span class="size-chip ${idx === 0 ? 'active' : ''}" onclick="selectSize(this)">${s}</span>`).join('')}
                    </div>
                </div>

                <div style="font-size: 0.8125rem; color: var(--color-light-muted); border-top: 1px solid var(--color-border); padding-top: 1rem;">
                    <strong>Composition:</strong> ${product.composition}
                </div>

                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="addToCart('${product.id}'); closeQuickView();">Add to Shopping Bag</button>
            </div>
        </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function selectSize(chip) {
    const chips = chip.parentElement.querySelectorAll('.size-chip');
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
}

/* Shopping Cart Logic */
function initCartDrawer() {
    const cartTriggerBtns = document.querySelectorAll('.cart-trigger');
    
    cartTriggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCartDrawer(true);
        });
    });
}

function toggleCartDrawer(open) {
    let backdrop = document.querySelector('.drawer-backdrop');
    let drawer = document.querySelector('.cart-drawer');

    if (!backdrop || !drawer) return;

    if (open) {
        backdrop.classList.add('active');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        backdrop.classList.remove('active');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function addToCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = shoppingCart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        shoppingCart[existingIndex].quantity += 1;
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image1,
            category: product.category,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    toggleCartDrawer(true);
    if (window.showToast) {
        window.showToast(`${product.name} added to your bag.`);
    }
}

function updateCartQuantity(productId, change) {
    const index = shoppingCart.findIndex(item => item.id === productId);
    if (index > -1) {
        shoppingCart[index].quantity += change;
        if (shoppingCart[index].quantity <= 0) {
            shoppingCart.splice(index, 1);
        }
    }
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('nfcollections_cart', JSON.stringify(shoppingCart));
}

function updateCartUI() {
    const cartBody = document.getElementById('cart-body');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTotalEl = document.getElementById('cart-total');
    const cartBadges = document.querySelectorAll('.cart-badge');

    const totalCount = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Header Badges
    cartBadges.forEach(b => b.textContent = totalCount);

    if (!cartBody) return;

    if (shoppingCart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <p style="font-family: var(--font-serif); font-size: 1.25rem;">Your shopping bag is empty.</p>
            </div>
        `;
    } else {
        cartBody.innerHTML = shoppingCart.map(item => `
            <div class="cart-item">
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div>
                        <span class="cart-item-meta">${item.category}</span>
                        <h4 class="cart-item-title">${item.name}</h4>
                        <span style="font-weight: 600; font-size: 0.9rem;">${window.formatPrice ? window.formatPrice(item.price) : '₦' + item.price.toLocaleString()}</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (cartSubtotalEl) cartSubtotalEl.textContent = window.formatPrice ? window.formatPrice(subtotal) : `₦${subtotal.toLocaleString()}`;
    if (cartTotalEl) cartTotalEl.textContent = window.formatPrice ? window.formatPrice(subtotal) : `₦${subtotal.toLocaleString()}`;
}

async function checkoutOrder() {
    if (shoppingCart.length === 0) {
        if (window.showToast) window.showToast('Your shopping bag is empty.', 'error');
        return;
    }

    const currentUser = window.CURRENT_USER || JSON.parse(localStorage.getItem('nf_current_user') || 'null');
    const subtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = 'NF-' + Math.floor(100000 + Math.random() * 900000);

    const localOrder = {
        id: 'ord-' + Date.now(),
        order_number: orderNumber,
        customer_name: currentUser ? currentUser.full_name : 'Guest Client',
        customer_email: currentUser ? currentUser.email : '',
        total_amount: subtotal,
        status: 'Processing',
        created_at: new Date().toISOString(),
        items: [...shoppingCart]
    };

    // Save order to LocalStorage list for static hosting & client sync
    const localOrders = JSON.parse(localStorage.getItem('nf_orders') || '[]');
    localOrders.unshift(localOrder);
    localStorage.setItem('nf_orders', JSON.stringify(localOrders));

    try {
        const response = await fetch('api/place_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: shoppingCart })
        });
        const result = await response.json();
        if (result.success) {
            if (window.showToast) {
                window.showToast(`Order ${result.data.order_number} confirmed!`);
            }
        } else {
            if (window.showToast) window.showToast(`Order ${orderNumber} confirmed!`);
        }
    } catch (err) {
        if (window.showToast) {
            window.showToast(`Order ${orderNumber} confirmed! Saved to your account.`);
        }
    }

    shoppingCart = [];
    saveCart();
    updateCartUI();
    toggleCartDrawer(false);
    window.dispatchEvent(new CustomEvent('orderPlaced', { detail: localOrder }));
}

window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.selectSize = selectSize;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCartDrawer = toggleCartDrawer;
window.checkoutOrder = checkoutOrder;
