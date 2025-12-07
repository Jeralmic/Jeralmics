/**
 * Page Transitions - Simple Clean Fade
 */

(function() {
    'use strict';
    
    const transitionDuration = 200;
    
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity ${transitionDuration}ms ease;
    `;
    document.body.appendChild(overlay);
    
    document.addEventListener('click', (e) => {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (!target || target.tagName !== 'A') return;
        
        const href = target.getAttribute('href');
        
        // Skip external links, anchors, etc.
        if (!href ||
            href.startsWith('http') || 
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            target.getAttribute('target') === '_blank') {
            return;
        }
        
        e.preventDefault();
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            window.location.href = href;
        }, transitionDuration);
    });
    
    // Handle back/forward navigation (bfcache)
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            overlay.style.opacity = '0';
        }
    });
    
    // Reset on load
    overlay.style.opacity = '0';
})();