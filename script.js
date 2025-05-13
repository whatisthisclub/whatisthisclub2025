document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');
    const hiddenText = document.getElementById('hiddenText');
    let removedBubbles = 0;

    // Handle bubble interactions (both click and touch)
    bubbles.forEach(bubble => {
        const handleInteraction = (e) => {
            e.preventDefault();
            if (bubble.style.opacity === '0') return; // Prevent double-triggering
            
            bubble.style.opacity = '0';
            bubble.style.pointerEvents = 'none'; // Prevent further interactions
            
            setTimeout(() => {
                bubble.style.display = 'none';
                removedBubbles++;

                // Show text content when all bubbles are removed
                if (removedBubbles === bubbles.length) {
                    hiddenText.classList.add('visible');
                    // Track bubble completion in GA4
                    if (typeof gtag === 'function') {
                        gtag('event', 'bubbles_completed', {
                            'event_category': 'Engagement',
                            'event_label': 'All bubbles removed'
                        });
                    }
                }
            }, 300);
        };

        bubble.addEventListener('click', handleInteraction);
        bubble.addEventListener('touchend', handleInteraction);
    });

    // Optimized scroll handler with debounce
    let scrollTimeout;
    const content = document.querySelector('.content-container');

    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(() => {
            const windowHeight = window.innerHeight;
            
            // Only apply fade effects if text is visible
            if (hiddenText.classList.contains('visible')) {
                const paragraphs = hiddenText.querySelectorAll('p');
                
                paragraphs.forEach(p => {
                    const rect = p.getBoundingClientRect();
                    const distanceFromTop = rect.top;
                    const distanceFromBottom = windowHeight - rect.bottom;
                    
                    // Calculate opacity based on position
                    if (distanceFromTop < 100) {
                        const opacity = distanceFromTop / 100;
                        p.style.opacity = Math.max(0, opacity);
                    } else if (distanceFromBottom < 100) {
                        const opacity = distanceFromBottom / 100;
                        p.style.opacity = Math.max(0, opacity);
                    } else {
                        p.style.opacity = 1;
                    }
                });
            }
        });
    }, { passive: true }); // Add passive flag for better scroll performance

    // Track CTA button clicks
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', {
                    'event_category': 'Engagement',
                    'event_label': '사주 분석기 button clicked'
                });
            }
        });
    }
}); 