/**
 * Project Hero Overlay
 * Adds dramatic title overlay on first carousel image
 * Fades out on scroll for cinematic effect
 */

document.addEventListener('DOMContentLoaded', function() {
    const projectPage = document.querySelector('.project-page');
    const imageContainer = document.querySelector('.image-container');
    
    // Only run on project pages with image container
    if (!projectPage || !imageContainer) return;
    
    // Get project info from the figcaption
    const figcaption = document.querySelector('.project-details figcaption');
    if (!figcaption) return;
    
    const titleElement = figcaption.querySelector('.game-title');
    const companyElement = figcaption.querySelector('.company-name');
    
    if (!titleElement || !companyElement) return;
    
    const title = titleElement.textContent.trim();
    const company = companyElement.textContent.trim();
    
    // Create hero overlay
    const overlay = document.createElement('div');
    overlay.className = 'project-hero-overlay';
    overlay.innerHTML = `
        <h1 class="project-hero-title">${title}</h1>
        <p class="project-hero-company">${company}</p>
    `;
    
    // Add overlay to image container
    imageContainer.appendChild(overlay);
    
    // Fade out on scroll
    let hasScrolled = false;
    const fadeThreshold = 50; // pixels scrolled before fade
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > fadeThreshold && !hasScrolled) {
            overlay.classList.add('fade-out');
            hasScrolled = true;
        } else if (scrollTop <= fadeThreshold && hasScrolled) {
            overlay.classList.remove('fade-out');
            hasScrolled = false;
        }
    }
    
    // Listen for scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also fade out if user navigates carousel (they've engaged, remove overlay)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            overlay.classList.add('fade-out');
            hasScrolled = true;
        });
    });
});