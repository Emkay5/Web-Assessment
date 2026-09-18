/* ==========================================================================
   NF COLLECTIONS NIGERIA - LOOKBOOK & GALLERY INTERACTIVE JAVASCRIPT
   Gallery rendering, category filtering, fullscreen lightbox viewer
   ========================================================================== */

const GALLERY_ITEMS = [
    {
        id: 'gal-01',
        title: 'Autumn / Winter ’26 Showcase',
        category: 'Runway',
        tag: 'Lagos Fashion Week',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Look 01: Double-faced cashmere coat with hand-sculpted sash.'
    },
    {
        id: 'gal-02',
        title: 'Presidential Gala Campaign',
        category: 'Campaign',
        tag: 'Abuja Editorial',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        caption: 'Model shot at Maitama Gala venue featuring modern structured tailoring.'
    },
    {
        id: 'gal-03',
        title: 'Master Silk Draping',
        category: 'Atelier',
        tag: 'Craftsmanship',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Hand-pleating pure organic silk at our Kaduna Atelier.'
    },
    {
        id: 'gal-04',
        title: 'Spring / Summer ’26 Runway',
        category: 'Runway',
        tag: 'West African Fashion Week',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Monochromatic architectural trench coat in warm champagne alabaster.'
    },
    {
        id: 'gal-05',
        title: 'Victoria Island Portrait',
        category: 'Campaign',
        tag: 'Lagos Editorial',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
        caption: 'NF Collections tailoring photographed against Lagos modern architecture.'
    },
    {
        id: 'gal-06',
        title: 'Handcrafted Leather Sculpting',
        category: 'Atelier',
        tag: 'Handcraft',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Saddle-stitching genuine leather handbags with waxed linen thread.'
    },
    {
        id: 'gal-07',
        title: 'Midnight Evening Silhouette',
        category: 'Runway',
        tag: 'Couture Line',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bias-cut Mulberry silk gown with low cowl open back.'
    },
    {
        id: 'gal-08',
        title: 'Kaduna Presentation',
        category: 'Campaign',
        tag: 'Atelier Showcase',
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Exclusive presentation at the NF Collections Kaduna Flagship.'
    },
    {
        id: 'gal-09',
        title: 'Pattern Cutting Precision',
        category: 'Atelier',
        tag: 'Sustainable Tech',
        image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Zero-waste pattern engineering by our Master Cutter.'
    }
];

let activeLightboxIndex = 0;
let currentFilteredGallery = [...GALLERY_ITEMS];

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
});

function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return; // Not on gallery page

    async function render(category = 'All') {
        try {
            const url = `api/get_gallery.php?category=${encodeURIComponent(category)}`;
            const response = await fetch(url);
            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    currentFilteredGallery = result.data;
                } else {
                    currentFilteredGallery = category === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === category);
                }
            } else {
                currentFilteredGallery = category === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === category);
            }
        } catch (e) {
            currentFilteredGallery = category === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === category);
        }

        galleryGrid.innerHTML = currentFilteredGallery.map((item, index) => `
            <div class="gallery-item" onclick="openLightbox(${index})">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-tag">${item.tag}</span>
                    <h3 class="gallery-caption">${item.title}</h3>
                </div>
            </div>
        `).join('');
    }

    // Gallery Category Buttons
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            render(category);
        });
    });

    render('All');
}

function openLightbox(index) {
    activeLightboxIndex = index;
    const item = currentFilteredGallery[activeLightboxIndex];
    if (!item) return;

    let lightboxModal = document.querySelector('.lightbox-modal');
    if (!lightboxModal) {
        lightboxModal = document.createElement('div');
        lightboxModal.className = 'lightbox-modal';
        document.body.appendChild(lightboxModal);
    }

    lightboxModal.innerHTML = `
        <button class="modal-close-btn" style="top: 2rem; right: 2rem; position: absolute;" onclick="closeLightbox()">✕</button>
        <button class="lightbox-nav-btn lightbox-prev" onclick="navigateLightbox(-1)">‹</button>
        
        <div class="lightbox-img-wrapper">
            <img src="${item.image}" alt="${item.title}">
            <div style="margin-top: 1rem; text-align: center; color: var(--color-white);">
                <span class="gallery-tag" style="color: var(--color-gold); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;">${item.tag}</span>
                <h3 style="font-family: var(--font-serif); font-size: 1.75rem; margin-top: 0.25rem;">${item.title}</h3>
                <p style="font-size: 0.875rem; color: var(--color-light-muted); margin-top: 0.5rem;">${item.caption}</p>
            </div>
        </div>

        <button class="lightbox-nav-btn lightbox-next" onclick="navigateLightbox(1)">›</button>
    `;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function navigateLightbox(direction) {
    activeLightboxIndex += direction;
    if (activeLightboxIndex < 0) {
        activeLightboxIndex = currentFilteredGallery.length - 1;
    } else if (activeLightboxIndex >= currentFilteredGallery.length) {
        activeLightboxIndex = 0;
    }

    const item = currentFilteredGallery[activeLightboxIndex];
    const imgWrapper = document.querySelector('.lightbox-img-wrapper');
    if (imgWrapper && item) {
        imgWrapper.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div style="margin-top: 1rem; text-align: center; color: var(--color-white);">
                <span class="gallery-tag" style="color: var(--color-gold); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;">${item.tag}</span>
                <h3 style="font-family: var(--font-serif); font-size: 1.75rem; margin-top: 0.25rem;">${item.title}</h3>
                <p style="font-size: 0.875rem; color: var(--color-light-muted); margin-top: 0.5rem;">${item.caption}</p>
            </div>
        `;
    }
}

function closeLightbox() {
    const lightboxModal = document.querySelector('.lightbox-modal');
    if (lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

window.openLightbox = openLightbox;
window.navigateLightbox = navigateLightbox;
window.closeLightbox = closeLightbox;
