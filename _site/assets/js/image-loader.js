/**
 * Image Loading Animation
 * Fades in images smoothly as they load
 */

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.content img');
    
    images.forEach(img => {
        // If image is already loaded (cached), show immediately
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            // Fade in when loaded
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            // Show on error too (better than staying invisible)
            img.addEventListener('error', () => {
                img.classList.add('loaded');
            });
        }
    });
});