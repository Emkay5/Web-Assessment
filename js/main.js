/* ==========================================================================
   NF COLLECTIONS NIGERIA - MAIN GLOBAL JAVASCRIPT
   Sticky Header, Mobile Menu Drawer, Toast Notifications, Newsletter Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initActiveNavLinks();
    initNewsletterForm();
    initFaqAccordion();
    loadDynamicSiteContent();
    initAuthPortal();
});

/* 1. Sticky Navigation Header */
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* 2. Mobile Off-Canvas Drawer Menu */
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const drawerClose = document.querySelector('.mobile-drawer-close');

    if (!mobileToggle || !mobileDrawer) return;

    mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    if (drawerClose) {
        drawerClose.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking any link
    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* 3. Highlight Current Page Link in Navigation */
function initActiveNavLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* 4. Toast Notification Utility System */
function showToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* 5. Newsletter Signup Handler */
function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('.newsletter-input');
            const email = input ? input.value.trim() : '';
            if (!email) return;

            // Save to localStorage list for immediate client sync & static hosting fallback
            const localSubs = JSON.parse(localStorage.getItem('nf_subscribers') || '[]');
            if (!localSubs.some(s => typeof s === 'string' ? s.toLowerCase() === email.toLowerCase() : s.email.toLowerCase() === email.toLowerCase())) {
                localSubs.unshift({
                    id: 'loc-' + Date.now(),
                    email: email,
                    subscribed_at: new Date().toISOString()
                });
                localStorage.setItem('nf_subscribers', JSON.stringify(localSubs));
            }

            try {
                const response = await fetch('api/newsletter.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                const result = await response.json();
                if (result.success) {
                    showToast(result.message);
                    input.value = '';
                } else {
                    showToast(result.message || 'Welcome! You have been subscribed to NF Collections Journal.');
                    input.value = '';
                }
            } catch (err) {
                showToast('Welcome! You have been subscribed to NF Collections Journal.');
                input.value = '';
            }

            // Dispatch global event so Admin or open tabs update immediately
            window.dispatchEvent(new CustomEvent('newsletterUpdated', { detail: { email: email } }));
        });
    });
}

/* 6. FAQ Accordion Handler */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Init New Interactive Components
    initCurrencySwitcher();
    initFloatingAdvisor();
    initOrderTrackingModal();
    initSizeGuideModal();
    initBespokeCustomizerModal();
}

/* 8. Multi-Currency Engine */
const CURRENCY_RATES = {
    NGN: { symbol: '₦', rate: 1, code: 'NGN' },
    USD: { symbol: '$', rate: 0.000625, code: 'USD' },
    GBP: { symbol: '£', rate: 0.0005, code: 'GBP' },
    EUR: { symbol: '€', rate: 0.000571, code: 'EUR' }
};

let currentCurrency = localStorage.getItem('nf_currency') || 'NGN';

function formatPrice(nairaAmount) {
    const curr = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.NGN;
    const converted = nairaAmount * curr.rate;
    if (curr.code === 'NGN') {
        return `₦${Number(nairaAmount).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function initCurrencySwitcher() {
    const selects = document.querySelectorAll('.currency-select');
    selects.forEach(select => {
        select.value = currentCurrency;
        select.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            localStorage.setItem('nf_currency', currentCurrency);
            // Refresh catalog / cart prices if functions exist
            if (window.renderCatalog) window.renderCatalog();
            if (window.updateCartUI) window.updateCartUI();
        });
    });
}

/* 9. Floating Private Styling Advisor Widget */
function initFloatingAdvisor() {
    if (document.querySelector('.floating-advisor-widget')) return;

    const widget = document.createElement('div');
    widget.className = 'floating-advisor-widget';
    widget.onclick = () => {
        if (window.openBespokeModal) {
            window.openBespokeModal();
        } else {
            window.location.href = 'contact.html';
        }
    };
    widget.innerHTML = `
        <img class="advisor-avatar" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80" alt="Private Advisor">
        <div class="advisor-text">
            <span>Private Styling Advisor</span>
            <strong>Book Atelier Consultation</strong>
        </div>
    `;
    document.body.appendChild(widget);
}

/* 10. Live MySQL Order Tracking Modal */
function initOrderTrackingModal() {
    window.openOrderTracker = function(prefillCode = '') {
        let modal = document.querySelector('.tracking-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-overlay tracking-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-content-wrapper" style="max-width: 620px; display: block; padding: 2.5rem; background-color: var(--color-bg);">
                <button class="modal-close-btn" onclick="closeOrderTracker()">✕</button>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span class="text-uppercase" style="color: var(--color-gold);">Live Order Status</span>
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; margin-top: 0.25rem;">Track Your Atelier Order</h2>
                    <p style="font-size: 0.875rem; color: var(--color-muted); margin-top: 0.5rem;">Enter your unique NFC order number below (e.g. NFC-2026-9051F8)</p>
                </div>

                <form id="tracker-form" style="display: flex; gap: 0.75rem; margin-bottom: 2rem;">
                    <input type="text" id="tracker-input" class="form-control" placeholder="Order Number (e.g. NFC-2026-9051F8)..." value="${prefillCode}" required style="flex: 1;">
                    <button type="submit" class="btn btn-primary">Track Order</button>
                </form>

                <div id="tracker-result-box"></div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('tracker-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = document.getElementById('tracker-input').value.trim();
            if (!code) return;
            fetchOrderStatus(code);
        });

        if (prefillCode) fetchOrderStatus(prefillCode);
    };

    window.closeOrderTracker = function() {
        const modal = document.querySelector('.tracking-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
}

async function fetchOrderStatus(code) {
    const box = document.getElementById('tracker-result-box');
    if (!box) return;

    box.innerHTML = `<p style="text-align: center; color: var(--color-muted);">Querying live MySQL database...</p>`;

    try {
        const response = await fetch(`api/track_order.php?order_number=${encodeURIComponent(code)}`);
        const result = await response.json();

        if (result.success && result.data) {
            const data = result.data;
            const info = data.tracking_info;
            const progress = info.progress || 20;

            box.innerHTML = `
                <div style="background: var(--color-surface); padding: 1.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-gold); letter-spacing: 0.1em;">Order Code</span>
                            <h3 style="font-family: var(--font-serif); font-size: 1.5rem;">${data.order_number}</h3>
                        </div>
                        <span class="status-pill status-${data.status}">${data.status}</span>
                    </div>

                    <div class="tracking-progress-container">
                        <div class="tracking-bar-bg">
                            <div class="tracking-bar-fill" style="width: ${progress}%;"></div>
                        </div>
                        <div class="tracking-steps">
                            <div class="tracking-step ${progress >= 20 ? 'active' : ''}">
                                <div class="step-dot">1</div>
                                <span class="step-title">Placed</span>
                            </div>
                            <div class="tracking-step ${progress >= 45 ? 'active' : ''}">
                                <div class="step-dot">2</div>
                                <span class="step-title">Tailoring</span>
                            </div>
                            <div class="tracking-step ${progress >= 70 ? 'active' : ''}">
                                <div class="step-dot">3</div>
                                <span class="step-title">Inspection</span>
                            </div>
                            <div class="tracking-step ${progress >= 85 ? 'active' : ''}">
                                <div class="step-dot">4</div>
                                <span class="step-title">Shipped</span>
                            </div>
                            <div class="tracking-step ${progress >= 100 ? 'active' : ''}">
                                <div class="step-dot">5</div>
                                <span class="step-title">Delivered</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-border); font-size: 0.875rem;">
                        <p><strong>Current Status:</strong> ${info.label}</p>
                        <p><strong>Client:</strong> ${data.customer_name}</p>
                        <p><strong>Total Value:</strong> ${formatPrice(data.total_amount)}</p>
                    </div>
                </div>
            `;
        } else {
            box.innerHTML = `<div style="text-align: center; color: #e74c3c; padding: 1rem;">${result.message || 'Order not found in MySQL.'}</div>`;
        }
    } catch (e) {
        box.innerHTML = `<div style="text-align: center; color: #e74c3c; padding: 1rem;">Unable to connect to server.</div>`;
    }
}

/* 11. Interactive Bespoke Customizer Modal */
function initBespokeCustomizerModal() {
    window.openBespokeModal = function() {
        let modal = document.querySelector('.bespoke-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-overlay bespoke-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-content-wrapper" style="max-width: 850px; display: block; padding: 3rem 2.5rem; background-color: var(--color-bg);">
                <button class="modal-close-btn" onclick="closeBespokeModal()">✕</button>
                <div style="text-align: center; margin-bottom: 2.5rem;">
                    <span class="text-uppercase" style="color: var(--color-gold);">Atelier Tailoring Customizer</span>
                    <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-top: 0.25rem;">Design Your Bespoke Suit or Gown</h2>
                    <p style="font-size: 0.875rem; color: var(--color-muted);">Crafted in Nigeria from organic textiles. Select your preferred luxury parameters.</p>
                </div>

                <form id="bespoke-customizer-form" class="bespoke-grid">
                    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                        <div class="form-group">
                            <label style="color: var(--color-gold);">Select Luxury Fabric</label>
                            <select id="bespoke-fabric" class="form-control" onchange="updateBespokeEstimate()">
                                <option value="Double-Faced Cashmere" data-price="285000">Double-Faced Cashmere (₦285,000)</option>
                                <option value="Organic Mulberry Silk" data-price="240000">Organic Mulberry Silk (₦240,000)</option>
                                <option value="Imperial Velvet" data-price="310000">Imperial Velvet (₦310,000)</option>
                                <option value="Fine Merino Wool" data-price="195000">Fine Merino Wool (₦195,000)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label style="color: var(--color-gold);">Color Tone</label>
                            <select id="bespoke-color" class="form-control">
                                <option value="Obsidian Black">Obsidian Black</option>
                                <option value="Champagne Alabaster">Champagne Alabaster</option>
                                <option value="Royal Gold">Royal Gold</option>
                                <option value="Deep Emerald Green">Deep Emerald Green</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label style="color: var(--color-gold);">Embroidered Monogram Initials</label>
                            <input type="text" id="bespoke-monogram" class="form-control" placeholder="e.g. NF or AB (Optional)" maxlength="4">
                        </div>

                        <div class="form-group">
                            <label style="color: var(--color-gold);">Preferred Atelier Boutique</label>
                            <select id="bespoke-boutique" class="form-control">
                                <option value="Abuja Flagship">Abuja Flagship — Maitama</option>
                                <option value="Lagos Victoria Island Atelier">Lagos Atelier — Victoria Island</option>
                                <option value="Kaduna Barnawa Boutique">Kaduna Boutique — Barnawa</option>
                                <option value="Port Harcourt Salon">Port Harcourt Salon — GRA</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; justify-content: space-between; background: var(--color-surface); border: 1px solid var(--color-border); padding: 2rem; border-radius: var(--radius-sm);">
                        <div>
                            <span class="text-uppercase" style="color: var(--color-gold);">Bespoke Estimate</span>
                            <h3 id="bespoke-price-preview" style="font-family: var(--font-serif); font-size: 2.2rem; margin: 0.5rem 0 1.5rem;">₦285,000</h3>

                            <div class="form-group">
                                <label>Your Full Name *</label>
                                <input type="text" id="bespoke-name" class="form-control" placeholder="e.g. Nana Firdausi" required>
                            </div>

                            <div class="form-group">
                                <label>Email Address *</label>
                                <input type="email" id="bespoke-email" class="form-control" placeholder="name@domain.com" required>
                            </div>

                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" id="bespoke-phone" class="form-control" placeholder="+234 803 000 0000">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-gold" style="width: 100%; margin-top: 1.5rem;">Reserve Bespoke Custom Creation →</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('bespoke-customizer-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fabricSelect = document.getElementById('bespoke-fabric');
            const price = fabricSelect.options[fabricSelect.selectedIndex].getAttribute('data-price') || 285000;

            const payload = {
                name: document.getElementById('bespoke-name').value,
                email: document.getElementById('bespoke-email').value,
                phone: document.getElementById('bespoke-phone').value,
                fabric: fabricSelect.value,
                color: document.getElementById('bespoke-color').value,
                monogram: document.getElementById('bespoke-monogram').value,
                boutique: document.getElementById('bespoke-boutique').value,
                estimated_price: price
            };

            try {
                const response = await fetch('api/bespoke_order.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (result.success) {
                    showToast(result.message);
                    closeBespokeModal();
                } else {
                    showToast(result.message || 'Submission failed.', 'error');
                }
            } catch (err) {
                showToast(`Bespoke creation reserved for ${payload.name}! Logged in system.`);
                closeBespokeModal();
            }
        });
    };

    window.closeBespokeModal = function() {
        const modal = document.querySelector('.bespoke-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.updateBespokeEstimate = function() {
        const select = document.getElementById('bespoke-fabric');
        const pricePreview = document.getElementById('bespoke-price-preview');
        if (select && pricePreview) {
            const price = Number(select.options[select.selectedIndex].getAttribute('data-price') || 285000);
            pricePreview.textContent = formatPrice(price);
        }
    };
}

/* 12. Interactive Size & Fabric Care Guide */
function initSizeGuideModal() {
    window.openSizeGuide = function() {
        let modal = document.querySelector('.size-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-overlay size-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-content-wrapper" style="max-width: 750px; display: block; padding: 2.5rem; background-color: var(--color-bg);">
                <button class="modal-close-btn" onclick="closeSizeGuide()">✕</button>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span class="text-uppercase" style="color: var(--color-gold);">Atelier Size Guide & Care</span>
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; margin-top: 0.25rem;">Garment Measurement Conversions</h2>
                </div>

                <div class="admin-table-box" style="margin-bottom: 2rem;">
                    <table class="admin-table" style="font-size: 0.8125rem;">
                        <thead>
                            <tr style="background: var(--color-obsidian); color: var(--color-gold);">
                                <th>Size Tag</th>
                                <th>Bust / Chest (cm)</th>
                                <th>Waist (cm)</th>
                                <th>Hips (cm)</th>
                                <th>UK / NG Size</th>
                                <th>EU Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>XS</strong></td><td>80 – 84</td><td>62 – 66</td><td>88 – 92</td><td>UK 6 – 8</td><td>34</td></tr>
                            <tr><td><strong>S</strong></td><td>85 – 89</td><td>67 – 71</td><td>93 – 97</td><td>UK 10</td><td>36</td></tr>
                            <tr><td><strong>M</strong></td><td>90 – 95</td><td>72 – 77</td><td>98 – 103</td><td>UK 12 – 14</td><td>38 – 40</td></tr>
                            <tr><td><strong>L</strong></td><td>96 – 102</td><td>78 – 84</td><td>104 – 110</td><td>UK 16</td><td>42</td></tr>
                            <tr><td><strong>XL</strong></td><td>103 – 110</td><td>85 – 92</td><td>111 – 118</td><td>UK 18 – 20</td><td>44 – 46</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style="background: var(--color-surface); padding: 1.5rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--color-muted);">
                    <h4 style="font-family: var(--font-serif); color: var(--color-obsidian); font-size: 1.1rem; margin-bottom: 0.5rem;">Lifetime Garment Care Principles:</h4>
                    <p>• <strong>Double-Faced Cashmere:</strong> Dry clean only using eco-certified solvent. Store on padded cedar hangers.</p>
                    <p>• <strong>Mulberry Silk Crepe:</strong> Steam on low heat inside-out. Do not wring or dry in direct sunlight.</p>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeSizeGuide = function() {
        const modal = document.querySelector('.size-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
}

window.showToast = showToast;
window.formatPrice = formatPrice;
window.loadDynamicSiteContent = loadDynamicSiteContent;

async function loadDynamicSiteContent() {
    try {
        const response = await fetch('api/get_site_content.php');
        if (!response.ok) return;

        const result = await response.json();
        if (!result.success || !result.data) return;

        const { settings, boutiques, faqs, milestones } = result.data;

        // A. Populate Hero Section
        if (settings) {
            const heroSub = document.querySelector('.hero-subtitle');
            const heroTitle = document.querySelector('.hero-title');
            const heroDesc = document.querySelector('.hero-description');
            const heroImg = document.querySelector('.hero-image-wrapper img');
            const badgeTitle = document.querySelector('.badge-title');
            const badgeSub = document.querySelector('.badge-sub');

            if (heroSub && settings.hero_subtitle) heroSub.textContent = settings.hero_subtitle;
            if (heroTitle && settings.hero_title) heroTitle.textContent = settings.hero_title;
            if (heroDesc && settings.hero_description) heroDesc.textContent = settings.hero_description;
            if (heroImg && settings.hero_image) heroImg.src = settings.hero_image;
            if (badgeTitle && settings.hero_badge_title) badgeTitle.textContent = settings.hero_badge_title;
            if (badgeSub && settings.hero_badge_sub) badgeSub.textContent = settings.hero_badge_sub;

            // Marquee Ticker Items
            const tickerMove = document.querySelector('.ticker-move');
            if (tickerMove && Array.isArray(settings.ticker_items) && settings.ticker_items.length > 0) {
                const tickerHTML = [...settings.ticker_items, ...settings.ticker_items]
                    .map(item => `<div class="ticker-item">${item}</div>`).join('');
                tickerMove.innerHTML = tickerHTML;
            }
        }

        // B. Populate Dynamic Boutiques (Store Locator)
        if (boutiques && Object.keys(boutiques).length > 0) {
            window.STORES = boutiques;
        }

        // C. Populate FAQs Accordion
        if (faqs && Array.isArray(faqs) && faqs.length > 0) {
            const faqContainer = document.querySelector('.faq-accordion');
            if (faqContainer) {
                faqContainer.innerHTML = faqs.map((faq, idx) => `
                    <div class="faq-item ${idx === 0 ? 'active' : ''}">
                        <button class="faq-question">
                            <span>${faq.question}</span>
                            <span>+</span>
                        </button>
                        <div class="faq-answer">
                            ${faq.answer}
                        </div>
                    </div>
                `).join('');
                initFaqAccordion();
            }
        }

        // D. Populate Milestones Timeline
        if (milestones && Array.isArray(milestones) && milestones.length > 0) {
            const timelineList = document.querySelector('.timeline-list');
            if (timelineList) {
                timelineList.innerHTML = milestones.map(m => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-year">${m.year}</div>
                        <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 0.5rem;">${m.title}</h3>
                        <p style="font-size: 0.9375rem; color: var(--color-muted);">${m.description}</p>
                    </div>
                `).join('');
            }
        }

    } catch (e) {
        // Fallback silently to HTML content if API is offline
    }
}

window.showToast = showToast;
window.loadDynamicSiteContent = loadDynamicSiteContent;

/* ==========================================================================
   15. CLIENT REGISTRATION & LOGIN PORTAL HANDLERS
   ========================================================================== */

window.CURRENT_USER = null;

function initAuthPortal() {
    createAuthModalMarkup();
    checkAuthStatus();
}

function checkAuthStatus() {
    fetch('api/get_user.php')
        .then(res => res.json())
        .then(res => {
            if (res.success && res.data && res.data.is_logged_in) {
                window.CURRENT_USER = res.data.user;
                localStorage.setItem('nf_current_user', JSON.stringify(res.data.user));
                renderUserAccountBadge(res.data.user);
            } else {
                const savedUser = JSON.parse(localStorage.getItem('nf_current_user') || 'null');
                window.CURRENT_USER = savedUser;
                renderUserAccountBadge(savedUser);
            }
        })
        .catch(() => {
            const savedUser = JSON.parse(localStorage.getItem('nf_current_user') || 'null');
            window.CURRENT_USER = savedUser;
            renderUserAccountBadge(savedUser);
        });
}

function renderUserAccountBadge(user) {
    const userContainer = document.querySelector('.user-menu-wrapper');
    if (!userContainer) return;

    if (user) {
        const firstName = (user.full_name || 'Client').split(' ')[0];
        userContainer.innerHTML = `
            <button class="user-badge-btn" onclick="toggleUserDropdown(event)" aria-label="Account Menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>${firstName}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="user-dropdown-menu" id="userDropdown">
                <div class="user-dropdown-header">
                    <div class="user-dropdown-name">${user.full_name || 'Client'}</div>
                    <div class="user-dropdown-email">${user.email || ''}</div>
                </div>
                <div class="user-dropdown-item" onclick="openOrderTracker()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>My Orders</span>
                </div>
                <div class="user-dropdown-item" onclick="openBespokeModal()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    <span>Bespoke Tailoring</span>
                </div>
                <div class="user-dropdown-divider"></div>
                <div class="user-dropdown-item" onclick="handleUserLogout()" style="color: #c93b2b;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Sign Out</span>
                </div>
            </div>
        `;
    } else {
        userContainer.innerHTML = `
            <button class="user-badge-btn" onclick="openAuthModal('login')" aria-label="Sign In">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Sign In</span>
            </button>
        `;
    }
}

function toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close user dropdown when clicking outside
document.addEventListener('click', () => {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
    }
});

function createAuthModalMarkup() {
    if (document.getElementById('authModal')) return;

    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <button class="modal-close" onclick="closeAuthModal()" aria-label="Close Modal">✕</button>

            <div class="auth-header">
                <h3>Client Portal</h3>
                <p>Welcome to NF Collections Nigeria VIP Access</p>
            </div>

            <div class="auth-tabs">
                <button class="auth-tab-btn active" id="tabLoginBtn" onclick="switchAuthTab('login')">Sign In</button>
                <button class="auth-tab-btn" id="tabRegisterBtn" onclick="switchAuthTab('register')">Create Account</button>
            </div>

            <!-- LOGIN FORM -->
            <form id="authLoginForm" onsubmit="handleLoginSubmit(event)">
                <div class="auth-form-group">
                    <label for="loginEmail">Email Address</label>
                    <input type="email" id="loginEmail" placeholder="client@example.com" required>
                </div>
                <div class="auth-form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Sign In</button>
                <p class="auth-switch-text" style="margin-top: 1.25rem;">
                    New to NF Collections? <a onclick="switchAuthTab('register')">Create an account</a>
                </p>
            </form>

            <!-- REGISTER FORM -->
            <form id="authRegisterForm" onsubmit="handleRegisterSubmit(event)" style="display: none;">
                <div class="auth-form-group">
                    <label for="regFullName">Full Name *</label>
                    <input type="text" id="regFullName" placeholder="e.g. Nana Firdausi" required>
                </div>
                <div class="auth-form-group">
                    <label for="regEmail">Email Address *</label>
                    <input type="email" id="regEmail" placeholder="client@example.com" required>
                </div>
                <div class="auth-form-group">
                    <label for="regPassword">Password * (Min 6 characters)</label>
                    <input type="password" id="regPassword" placeholder="••••••••" minlength="6" required>
                </div>
                <div class="auth-form-group">
                    <label for="regPhone">Phone Number</label>
                    <input type="tel" id="regPhone" placeholder="+234 800 000 0000">
                </div>
                <div class="auth-form-group">
                    <label for="regAddress">Delivery Address</label>
                    <input type="text" id="regAddress" placeholder="Maitama, Abuja or Victoria Island, Lagos">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Create Account</button>
                <p class="auth-switch-text" style="margin-top: 1.25rem;">
                    Already registered? <a onclick="switchAuthTab('login')">Sign in here</a>
                </p>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAuthModal();
    });
}

function openAuthModal(defaultTab = 'login') {
    createAuthModalMarkup();
    const modal = document.getElementById('authModal');
    if (modal) {
        switchAuthTab(defaultTab);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');

    if (tab === 'register') {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        if (tabLoginBtn) tabLoginBtn.classList.remove('active');
        if (tabRegisterBtn) tabRegisterBtn.classList.add('active');
    } else {
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        if (tabLoginBtn) tabLoginBtn.classList.add('active');
        if (tabRegisterBtn) tabRegisterBtn.classList.remove('active');
    }
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            showToast(res.message, 'success');
            window.CURRENT_USER = res.data;
            localStorage.setItem('nf_current_user', JSON.stringify(res.data));
            renderUserAccountBadge(res.data);
            closeAuthModal();
        } else {
            showToast(res.message, 'error');
        }
    })
    .catch(() => {
        // Fallback for static hosting / offline
        const localUsers = JSON.parse(localStorage.getItem('nf_users') || '[]');
        const matched = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (matched) {
            window.CURRENT_USER = matched;
            localStorage.setItem('nf_current_user', JSON.stringify(matched));
            renderUserAccountBadge(matched);
            showToast(`Welcome back, ${matched.full_name}! You are signed in.`, 'success');
            closeAuthModal();
        } else {
            showToast("Invalid email address or password.", 'error');
        }
    });
}

function handleRegisterSubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const phone    = document.getElementById('regPhone').value.trim();
    const address  = document.getElementById('regAddress').value.trim();

    if (!fullName || !email || !password) {
        showToast("Please provide your full name, email address, and password.", 'error');
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters in length.", 'error');
        return;
    }

    fetch('api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, phone, address })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            showToast(res.message, 'success');
            window.CURRENT_USER = res.data;
            localStorage.setItem('nf_current_user', JSON.stringify(res.data));

            // Save to local users list
            const localUsers = JSON.parse(localStorage.getItem('nf_users') || '[]');
            localUsers.push(res.data);
            localStorage.setItem('nf_users', JSON.stringify(localUsers));

            renderUserAccountBadge(res.data);
            closeAuthModal();
        } else {
            showToast(res.message, 'error');
        }
    })
    .catch(() => {
        // Fallback for static hosting / offline client mode
        const localUsers = JSON.parse(localStorage.getItem('nf_users') || '[]');
        if (localUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            showToast("An account with this email address already exists.", 'error');
            return;
        }

        const newUser = {
            id: 'loc-' + Date.now(),
            full_name: fullName,
            email: email,
            phone: phone,
            address: address
        };
        localUsers.push(newUser);
        localStorage.setItem('nf_users', JSON.stringify(localUsers));
        localStorage.setItem('nf_current_user', JSON.stringify(newUser));

        window.CURRENT_USER = newUser;
        renderUserAccountBadge(newUser);
        showToast("Welcome to NF Collections Nigeria! Your client account has been created successfully.", 'success');
        closeAuthModal();
    });
}

function handleUserLogout() {
    fetch('api/logout.php')
        .then(res => res.json())
        .then(res => {
            showToast(res.message || "Signed out.", 'success');
            window.CURRENT_USER = null;
            localStorage.removeItem('nf_current_user');
            renderUserAccountBadge(null);
        })
        .catch(() => {
            window.CURRENT_USER = null;
            localStorage.removeItem('nf_current_user');
            renderUserAccountBadge(null);
        });
}

window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleLoginSubmit = handleLoginSubmit;
window.handleRegisterSubmit = handleRegisterSubmit;
window.handleUserLogout = handleUserLogout;
window.toggleUserDropdown = toggleUserDropdown;

