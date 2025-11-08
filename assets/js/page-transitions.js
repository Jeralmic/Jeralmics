/**
 * Page Transitions - Simple Clean Fade
 * Minimal transition overlay
 */

document.addEventListener('DOMContentLoaded', () => {
    const transitionDuration = 200; // milliseconds
    
    // Create simple fade overlay
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
        // Find the link element
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (!target || target.tagName !== 'A') return;
        
        const href = target.getAttribute('href');
        
        // Skip external/special links
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
        
        // Simple fade
        overlay.style.opacity = '1';
        
        // Navigate
        setTimeout(() => {
            window.location.href = href;
        }, transitionDuration);
    });
});