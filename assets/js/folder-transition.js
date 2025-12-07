/**
 * Folder Open Effect
 * Card tilts like a folder opening before navigating
 */

(function() {
    'use strict';
    
    const projectItems = document.querySelectorAll('.project-item');
    if (!projectItems.length) return;
    
    // Create simple fade overlay
    const overlay = document.createElement('div');
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
        transition: opacity 0.2s ease;
    `;
    document.body.appendChild(overlay);
    
    projectItems.forEach(item => {
        const links = item.querySelectorAll('a');
        if (!links.length) return;
        
        const href = links[0].getAttribute('href');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Add tilt animation class
                item.classList.add('folder-opening');
                
                // Fade to white
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 200);
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            });
        });
    });
    
    // Handle back/forward navigation (bfcache)
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            overlay.style.opacity = '0';
            document.querySelectorAll('.folder-opening').forEach(item => {
                item.classList.remove('folder-opening');
            });
        }
    });
    
    // Reset on load
    overlay.style.opacity = '0';
})();