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
        image: 'images/hero_nigerian.jpg',
        caption: 'Look 01: Regal Nigerian Agbada coat with gold thread embroidery.'
    },
    {
        id: 'gal-02',
        title: 'Presidential Gala Campaign',
        category: 'Campaign',
        tag: 'Abuja Editorial',
        image: 'images/outerwear_nigerian.jpg',
        caption: 'Model shot at Maitama Gala venue featuring sovereign Nigerian tailoring.'
    },
    {
        id: 'gal-03',
        title: 'Master Silk & Velvet Craft',
        category: 'Atelier',
        tag: 'Craftsmanship',
        image: 'images/tailoring_nigerian.jpg',
        caption: 'Hand-tailoring pure organic silk at our Kaduna Atelier.'
    },
    {
        id: 'gal-04',
        title: 'Spring / Summer ’26 Runway',
        category: 'Runway',
        tag: 'West African Fashion Week',
        image: 'images/outerwear_nigerian.jpg',
        caption: 'Monochromatic architectural coat in warm champagne alabaster.'
    },
    {
        id: 'gal-05',
        title: 'Victoria Island Portrait',
        category: 'Campaign',
        tag: 'Lagos Editorial',
        image: 'images/hero_nigerian.jpg',
        caption: 'NF Collections tailoring photographed against Lagos modern architecture.'
    },
    {
        id: 'gal-06',
        title: 'Handcrafted Nigerian Leatherwork',
        category: 'Atelier',
        tag: 'Handcraft',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Saddle-stitching genuine Kaduna leather handbags with waxed linen thread.'
    },
    {
        id: 'gal-07',
        title: 'Midnight Evening Silhouette',
        category: 'Runway',
        tag: 'Couture Line',
        image: 'images/tailoring_nigerian.jpg',
        caption: 'Bias-cut Nigerian Mulberry silk gown with gold embroidery lapels.'
    },
    {
        id: 'gal-08',
        title: 'Kaduna Flagship Presentation',
        category: 'Campaign',
        tag: 'Atelier Showcase',
        image: 'images/outerwear_nigerian.jpg',
        caption: 'Exclusive presentation at the NF Collections Kaduna Flagship.'
    },
    {
        id: 'gal-09',
        title: 'Pattern Cutting Precision',
        category: 'Atelier',
        tag: 'Sustainable Tech',
        image: 'images/hero_nigerian.jpg',
        caption: 'Zero-waste pattern engineering by our Master Cutter in Lagos.'
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
