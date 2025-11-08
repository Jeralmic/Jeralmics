/**
 * Page Transitions - Smooth Fade
 * Cinematic fade effect between page navigations
 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const transitionDuration = 250; // milliseconds
    
    // Ensure body starts at opacity 0 for fade in
    if (!body.style.opacity) {
        body.style.opacity = '0';
    }
    body.style.transition = `opacity ${transitionDuration}ms ease`;
    
    // Fade in on page load
    const fadeIn = () => {
        requestAnimationFrame(() => {
            body.style.opacity = '1';
        });
    };
    
    // Try to fade in immediately
    fadeIn();
    
    // Fallback: ensure page is visible after a short delay even if something fails
    setTimeout(() => {
        if (body.style.opacity !== '1') {
            body.style.opacity = '1';
        }
    }, 100);
    
    // Intercept all internal link clicks
    document.addEventListener('click', (e) => {
        // Find the link element (might be clicked on child element)
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (!target || target.tagName !== 'A') return;
        
        const href = target.getAttribute('href');
        
        // Skip if:
        // - External link (has http/https)
        // - Anchor link (starts with #)
        // - mailto/tel links
        // - Opens in new tab
        if (!href ||
            href.startsWith('http') || 
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            target.getAttribute('target') === '_blank') {
            return;
        }
        
        // Prevent default navigation
        e.preventDefault();
        
        // Fade out
        body.style.opacity = '0';
        
        // Navigate after fade completes
        setTimeout(() => {
            window.location.href = href;
        }, transitionDuration);
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('pageshow', (e) => {
        // If page is loaded from cache (back button), ensure it's visible
        if (e.persisted) {
            body.style.opacity = '1';
        }
    });
});