// Gallery State Variables
let currentImageIndex = 0;
let images = [];
let filteredImages = [];
let currentFilter = 'all';

// DOM Element Selectors
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeBtn = document.getElementById('closeBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const imageCounter = document.getElementById('imageCounter');
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

// Initialize the Gallery
function initGallery() {
    // Populate image data array
    images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt,
            category: item.dataset.category,
            element: item
        };
    });

    filteredImages = [...images];

    // Delegate clicks for performance rather than adding 50+ event listeners
    document.querySelector('.gallery-grid').addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        e.preventDefault();
        
        // Find the index of the clicked item relative to the currently filtered array
        const imgData = images.find(img => img.element === item);
        currentImageIndex = filteredImages.indexOf(imgData);
        
        openLightbox();
    });
}

// Lightbox Operations
function openLightbox() {
    lightbox.classList.add('active');
    displayImage(currentImageIndex);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function displayImage(index) {
    if (filteredImages.length === 0) return;
    
    // Wrap around logic
    if (index >= filteredImages.length) currentImageIndex = 0;
    else if (index < 0) currentImageIndex = filteredImages.length - 1;
    else currentImageIndex = index;

    const currentImageData = filteredImages[currentImageIndex];
    
    // Add small scale animation trick on source change
    lightboxImage.style.opacity = '0.5';
    lightboxImage.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        lightboxImage.src = currentImageData.src;
        lightboxImage.alt = currentImageData.alt;
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
    }, 150);
    
    imageCounter.textContent = `${currentImageIndex + 1} / ${filteredImages.length}`;
}

// Navigation
const showNextImage = () => displayImage(currentImageIndex + 1);
const showPrevImage = () => displayImage(currentImageIndex - 1);

// Filtering System
function filterGallery(category) {
    currentFilter = category;
    
    if (category === 'all') {
        filteredImages = [...images];
        images.forEach(img => {
            img.element.classList.remove('hidden');
            // Trigger reflow for animation
            void img.element.offsetWidth; 
            img.element.style.opacity = '1';
            img.element.style.transform = 'scale(1)';
        });
    } else {
        filteredImages = images.filter(img => img.category === category);
        
        images.forEach(img => {
            if (img.category === category) {
                img.element.classList.remove('hidden');
                setTimeout(() => {
                    img.element.style.opacity = '1';
                    img.element.style.transform = 'scale(1)';
                }, 50);
            } else {
                img.element.style.opacity = '0';
                img.element.style.transform = 'scale(0.9)';
                setTimeout(() => img.element.classList.add('hidden'), 300);
            }
        });
    }
}

// Event Listeners Binding
closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNextImage);
prevBtn.addEventListener('click', showPrevImage);

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterGallery(btn.dataset.filter);
        
        // Scroll slightly to grid if user is far down
        const gridTop = document.querySelector('.gallery-grid').offsetTop;
        if(window.scrollY > gridTop - 100) {
            window.scrollTo({ top: gridTop - 100, behavior: 'smooth' });
        }
    });
});

// Keyboard Accessibility
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'Escape') closeLightbox();
});

// Close when clicking the backdrop
lightbox.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
    }
});

// Mobile Swipe Support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    if (!lightbox.classList.contains('active')) return;
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!lightbox.classList.contains('active')) return;
    touchEndX = e.changedTouches[0].screenX;
    
    if (touchEndX < touchStartX - 50) showNextImage(); // Swipe left
    if (touchEndX > touchStartX + 50) showPrevImage(); // Swipe right
}, { passive: true });

// Boot the application
document.addEventListener('DOMContentLoaded', initGallery);