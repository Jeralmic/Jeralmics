/**
 * PROJECT PAGE CAROUSEL
 * Optimized for mobile with touch support
 */

(function() {
    'use strict';
    
    const projectImage = document.getElementById("project-image");
    if (!projectImage) return;
    
    const projectName = projectImage.dataset.projectName;
    const imageCount = parseInt(projectImage.dataset.imageCount) || 0;
    const videoUrl = projectImage.dataset.videoUrl || null;
    const previewImage = projectImage.src;
    
    let currentIndex = 0;
    let media = [];
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-close">✕</div>
            <div class="lightbox-nav lightbox-prev">‹</div>
            <div class="lightbox-nav lightbox-next">›</div>
            <div class="lightbox-counter"></div>
            <div class="lightbox-hint">ESC to close • Arrow keys to navigate</div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    // Image existence check with caching
    const imageCache = new Map();
    
    function checkImageExists(url) {
        if (imageCache.has(url)) {
            return Promise.resolve(imageCache.get(url));
        }
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                imageCache.set(url, true);
                resolve(true);
            };
            img.onerror = () => {
                imageCache.set(url, false);
                resolve(false);
            };
            img.src = url;
        });
    }
    
    // Detect available images
    async function detectImages() {
        const extensions = ['.jpg', '.png', '.jpeg'];
        const detectedImages = [];
        
        const nameVariations = [
            projectName,
            projectName.toLowerCase(),
            projectName.charAt(0).toLowerCase() + projectName.slice(1),
            projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase()
        ];
        
        // Parallel checking for speed
        const checks = [];
        
        for (let i = 1; i <= imageCount; i++) {
            for (const nameVar of nameVariations) {
                for (const ext of extensions) {
                    checks.push({
                        src: `/images/${nameVar}Shot0${i}${ext}`,
                        index: i
                    });
                }
            }
        }
        
        // Check all in parallel
        const results = await Promise.all(
            checks.map(async (check) => ({
                ...check,
                exists: await checkImageExists(check.src)
            }))
        );
        
        // Group by index and take first valid
        const foundIndexes = new Set();
        for (const result of results) {
            if (result.exists && !foundIndexes.has(result.index)) {
                detectedImages.push({ type: 'image', src: result.src, index: result.index });
                foundIndexes.add(result.index);
            }
        }
        
        // Sort by index
        detectedImages.sort((a, b) => a.index - b.index);
        
        return detectedImages;
    }
    
    // Initialize carousel
    async function initCarousel() {
        const detectedImages = await detectImages();
        
        if (videoUrl) {
            media.push({ type: 'video', src: videoUrl });
        }
        
        media = media.concat(detectedImages);
        
        if (media.length === 0) {
            media.push({ type: 'image', src: previewImage });
        }
        
        if (media.length > 1) {
            createThumbnailStrip();
            createCounter();
        }
        
        setupLightbox();
        setupTouchHandlers();
        updateDisplay();
    }
    
    // Setup lightbox
    function setupLightbox() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        container.addEventListener('click', (e) => {
            if (media[currentIndex].type === 'video') return;
            openLightbox();
        });
        
        container.style.cursor = 'zoom-in';
    }
    
    // Touch handlers for swipe navigation
    function setupTouchHandlers() {
        const container = document.querySelector('.image-container');
        if (!container || media.length <= 1) return;
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // Lightbox swipe
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (lightbox.classList.contains('active')) {
                handleLightboxSwipe();
            }
        }, { passive: true });
    }
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) < threshold) return;
        
        if (diff > 0 && currentIndex < media.length - 1) {
            currentIndex++;
            updateDisplay();
        } else if (diff < 0 && currentIndex > 0) {
            currentIndex--;
            updateDisplay();
        }
    }
    
    function handleLightboxSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) < threshold) return;
        
        if (diff > 0) {
            lightboxNavigate(1);
        } else {
            lightboxNavigate(-1);
        }
    }
    
    // Open lightbox
    function openLightbox() {
        if (media[currentIndex].type !== 'image') return;
        
        lightboxImage.src = media[currentIndex].src;
        updateLightboxCounter();
        updateLightboxNav();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateLightboxCounter() {
        const imageMedia = media.filter(m => m.type === 'image');
        const imageIndex = imageMedia.findIndex(m => m.src === media[currentIndex].src);
        lightboxCounter.textContent = `${imageIndex + 1} / ${imageMedia.length}`;
    }
    
    function updateLightboxNav() {
        const imageMedia = media.filter(m => m.type === 'image');
        const imageIndex = imageMedia.findIndex(m => m.src === media[currentIndex].src);
        
        lightboxPrev.style.opacity = imageIndex === 0 ? '0.3' : '1';
        lightboxPrev.style.pointerEvents = imageIndex === 0 ? 'none' : 'auto';
        
        lightboxNext.style.opacity = imageIndex >= imageMedia.length - 1 ? '0.3' : '1';
        lightboxNext.style.pointerEvents = imageIndex >= imageMedia.length - 1 ? 'none' : 'auto';
    }
    
    function lightboxNavigate(direction) {
        const imageMedia = media.filter(m => m.type === 'image');
        const imageIndex = imageMedia.findIndex(m => m.src === media[currentIndex].src);
        const newImageIndex = imageIndex + direction;
        
        if (newImageIndex < 0 || newImageIndex >= imageMedia.length) return;
        
        const newMediaIndex = media.findIndex(m => m.src === imageMedia[newImageIndex].src);
        currentIndex = newMediaIndex;
        
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = media[currentIndex].src;
            lightboxImage.style.opacity = '1';
            updateLightboxCounter();
            updateLightboxNav();
            updateDisplay();
        }, 150);
    }
    
    // Lightbox events
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxNavigate(-1);
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxNavigate(1);
    });
    
    // Create thumbnail strip
    function createThumbnailStrip() {
        const strip = document.createElement('div');
        strip.className = 'carousel-thumbnails';
        strip.id = 'thumbnailStrip';
        
        media.forEach((item, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.setAttribute('role', 'button');
            thumb.setAttribute('tabindex', '0');
            thumb.setAttribute('aria-label', `View ${item.type === 'video' ? 'video' : 'image ' + (index + 1)}`);
            
            if (index === 0) thumb.classList.add('active');
            
            if (item.type === 'video') {
                thumb.classList.add('video');
                
                const playIcon = document.createElement('div');
                playIcon.className = 'video-play-icon';
                playIcon.innerHTML = '▶';
                thumb.appendChild(playIcon);
                
                const img = document.createElement('img');
                img.src = (media.length > 1 && media[1].type === 'image') ? media[1].src : previewImage;
                img.alt = 'Video';
                img.loading = 'lazy';
                thumb.appendChild(img);
            } else {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = `Screenshot ${index + 1}`;
                img.loading = 'lazy';
                thumb.appendChild(img);
            }
            
            // Click handler
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                goToIndex(index);
            });
            
            // Keyboard handler
            thumb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToIndex(index);
                }
            });
            
            strip.appendChild(thumb);
        });
        
        const mediaContainer = document.querySelector('.project-media');
        if (mediaContainer) {
            mediaContainer.appendChild(strip);
        }
    }
    
    // Create counter
    function createCounter() {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.id = 'image-counter';
        counter.innerHTML = `<span id="currentIndex">1</span>/<span id="totalImages">${media.length}</span>`;
        
        const container = document.querySelector('.image-container');
        if (container) {
            container.appendChild(counter);
        }
    }
    
    // Update main display
    function updateDisplay() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        const currentMedia = media[currentIndex];
        const oldMedia = container.querySelector('#mainImage');
        
        container.style.cursor = currentMedia.type === 'video' ? 'default' : 'zoom-in';
        
        let newMedia;
        
        if (currentMedia.type === 'video') {
            newMedia = document.createElement('iframe');
            newMedia.id = 'mainImage';
            newMedia.src = currentMedia.src;
            newMedia.frameBorder = '0';
            newMedia.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            newMedia.allowFullscreen = true;
            newMedia.loading = 'lazy';
            newMedia.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 2;
            `;
        } else {
            newMedia = document.createElement('img');
            newMedia.id = 'mainImage';
            newMedia.src = currentMedia.src;
            newMedia.alt = 'Project Screenshot';
            newMedia.className = 'project-image';
            newMedia.style.cssText = `
                opacity: 0;
                transition: opacity 0.3s ease;
                position: relative;
                z-index: 2;
            `;
        }
        
        if (oldMedia) {
            oldMedia.style.zIndex = '1';
            container.insertBefore(newMedia, oldMedia);
        } else {
            container.insertBefore(newMedia, container.firstChild);
        }
        
        // Use requestAnimationFrame for smooth transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newMedia.style.opacity = '1';
                if (oldMedia) {
                    setTimeout(() => oldMedia.remove(), 300);
                }
            });
        });
        
        updateCounter();
        updateActiveThumbnail();
    }
    
    function updateCounter() {
        const counter = document.getElementById('currentIndex');
        if (counter) {
            counter.textContent = currentIndex + 1;
        }
    }
    
    function updateActiveThumbnail() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === currentIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest', 
                    inline: 'center' 
                });
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    function goToIndex(index) {
        if (index < 0 || index >= media.length || index === currentIndex) return;
        currentIndex = index;
        updateDisplay();
    }
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        // Lightbox controls
        if (lightbox.classList.contains('active')) {
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                lightboxNavigate(-1);
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                lightboxNavigate(1);
            }
            return;
        }
        
        // Normal carousel controls
        if (!projectImage) return;
        
        if (e.key === "ArrowLeft" && currentIndex > 0) {
            e.preventDefault();
            currentIndex--;
            updateDisplay();
        } else if (e.key === "ArrowRight" && currentIndex < media.length - 1) {
            e.preventDefault();
            currentIndex++;
            updateDisplay();
        }
    });
    
    // Start
    initCarousel();
})();