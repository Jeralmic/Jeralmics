/**
 * Page Transitions - Smooth Fade
 * Uses overlay instead of body opacity to avoid hiding content
 */

document.addEventListener('DOMContentLoaded', () => {
    const transitionDuration = 250; // milliseconds
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fafafa;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity ${transitionDuration}ms ease;
    `;
    document.body.appendChild(overlay);
    
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
        
        // Fade in overlay
        overlay.style.opacity = '1';
        
        // Navigate after fade completes
        setTimeout(() => {
            window.location.href = href;
        }, transitionDuration);
    });
});