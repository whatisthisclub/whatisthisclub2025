document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const overlay = document.querySelector('.overlay');
    const overlayImage = document.querySelector('.overlay-image');
    const productCards = document.querySelectorAll('.product-card');
    
    // Track scroll position
    let scrollPosition = 0;

    // Open overlay function
    const openOverlay = (imageSrc) => {
        // Store current scroll position
        scrollPosition = window.pageYOffset;
        
        // Set image source
        overlayImage.src = imageSrc;
        
        // Show overlay with animation
        overlay.classList.add('active');
        
        // Prevent background scrolling
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
    };

    // Close overlay function
    const closeOverlay = () => {
        // Hide overlay
        overlay.classList.remove('active');
        
        // Restore scrolling and position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosition);
        
        // Clear image source after animation
        setTimeout(() => {
            overlayImage.src = '';
        }, 300);
    };

    // Handle product card clicks
    productCards.forEach(card => {
        const productImage = card.querySelector('.product-image');
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openOverlay(productImage.src);
        });
    });

    // Close overlay when clicking outside the image
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    // Close overlay with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });

    // Handle touch events for mobile
    let touchStartY;
    
    overlay.addEventListener('touchstart', (e) => {
        if (e.target === overlay) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
        if (e.target === overlay && touchStartY) {
            const touchEndY = e.changedTouches[0].clientY;
            const touchDiff = touchEndY - touchStartY;
            
            // Close overlay if user swipes down more than 50px
            if (Math.abs(touchDiff) > 50) {
                closeOverlay();
            }
            touchStartY = null;
        }
    }, { passive: true });

    // Preload images for smoother experience
    const preloadImages = () => {
        productCards.forEach(card => {
            const img = card.querySelector('.product-image');
            if (img && img.src) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = img.src;
                document.head.appendChild(preloadLink);
            }
        });
    };

    // Initialize preloading
    preloadImages();
}); 