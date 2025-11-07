/**
 * Letterbox Opening Animation
 * Cinematic white bars around particle hero that open on page load
 */

document.addEventListener("DOMContentLoaded", function() {
    const particleContainer = document.querySelector('.particle-hero-container');
    
    // Only run if particle hero exists
    if (!particleContainer) return;
    
    // Create letterbox bars inside particle container
    const topBar = document.createElement('div');
    topBar.className = 'letterbox-bar letterbox-bar-top';
    
    const bottomBar = document.createElement('div');
    bottomBar.className = 'letterbox-bar letterbox-bar-bottom';
    
    // Add bars to particle container
    particleContainer.appendChild(topBar);
    particleContainer.appendChild(bottomBar);
    
    // Small delay before opening (like a film starting)
    setTimeout(() => {
        particleContainer.classList.add('letterbox-open');
        
        // Mark animation as complete after it finishes
        setTimeout(() => {
            particleContainer.classList.add('letterbox-complete');
        }, 1300); // Slightly longer than transition duration
    }, 500); // 500ms delay before opening begins
});