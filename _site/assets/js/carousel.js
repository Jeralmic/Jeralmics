/**
 * PROJECT PAGE CAROUSEL
 * Thumbnails below main image
 * Click image to enlarge (lightbox)
 */

document.addEventListener("DOMContentLoaded", function () {
    const projectImage = document.getElementById("project-image");
    
    // Only run on project pages
    if (!projectImage) {
        return;
    }
    
    const projectName = projectImage.dataset.projectName;
    const imageCount = parseInt(projectImage.dataset.imageCount) || 0;
    const videoUrl = projectImage.dataset.videoUrl || null;
    const previewImage = projectImage.src;
    
    let currentIndex = 0;
    let media = [];
    
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
    
    // Check if image exists
    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
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
        
        for (let i = 1; i <= imageCount; i++) {
            let found = false;
            
            for (const nameVar of nameVariations) {
                if (found) break;
                
                for (const ext of extensions) {
                    const testSrc = `/images/${nameVar}Shot0${i}${ext}`;
                    const exists = await checkImageExists(testSrc);
                    
                    if (exists) {
                        detectedImages.push({ type: 'image', src: testSrc, index: i });
                        found = true;
                        break;
                    }
                }
            }
        }
        
        return detectedImages;
    }
    
    // Initialize carousel
    async function initCarousel() {
        const detectedImages = await detectImages();
        
        // Build media array: video first (if exists), then images
        if (videoUrl) {
            media.push({ type: 'video', src: videoUrl });
        }
        
        media = media.concat(detectedImages);
        
        // If no media found, use preview image
        if (media.length === 0) {
            media.push({ type: 'image', src: previewImage });
        }
        
        // Create thumbnail strip if more than 1 item
        if (media.length > 1) {
            createThumbnailStrip();
            createCounter();
        }
        
        // Make main image clickable for lightbox
        setupLightbox();
        
        // Display first item
        updateDisplay();
    }
    
    // Setup lightbox functionality
    function setupLightbox() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        // Click main image to open lightbox
        container.addEventListener('click', (e) => {
            // Don't open lightbox for videos
            if (media[currentIndex].type === 'video') return;
            
            openLightbox();
        });
        
        // Add cursor hint
        container.style.cursor = 'zoom-in';
        
        // Show keyboard hint briefly
        if (media.length > 1) {
            showKeyboardHint();
        }
    }
    
    // Show keyboard navigation hint
    function showKeyboardHint() {
        const hint = document.createElement('div');
        hint.className = 'keyboard-hint';
        hint.innerHTML = '← → Arrow keys to navigate';
        document.querySelector('.project-media').appendChild(hint);
        
        setTimeout(() => hint.classList.add('show'), 500);
        setTimeout(() => {
            hint.classList.remove('show');
            setTimeout(() => hint.remove(), 500);
        }, 4000);
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
    
    // Update lightbox counter
    function updateLightboxCounter() {
        const imageMedia = media.filter(m => m.type === 'image');
        const imageIndex = imageMedia.findIndex(m => m.src === media[currentIndex].src);
        lightboxCounter.textContent = `${imageIndex + 1} / ${imageMedia.length}`;
    }
    
    // Update lightbox navigation visibility
    function updateLightboxNav() {
        const imageMedia = media.filter(m => m.type === 'image');
        const imageIndex = imageMedia.findIndex(m => m.src === media[currentIndex].src);
        
        lightboxPrev.style.opacity = imageIndex === 0 ? '0.3' : '1';
        lightboxPrev.style.pointerEvents = imageIndex === 0 ? 'none' : 'auto';
        
        lightboxNext.style.opacity = imageIndex >= imageMedia.length - 1 ? '0.3' : '1';
        lightboxNext.style.pointerEvents = imageIndex >= imageMedia.length - 1 ? 'none' : 'auto';
    }
    
    // Lightbox navigation
    function lightboxNavigate(direction) {
        const imageMedia = media.filter(m => m.type === 'image');
        const imageIndex = imageMedia.findIndex(m => m.src === media[currentIndex].src);
        const newImageIndex = imageIndex + direction;
        
        if (newImageIndex < 0 || newImageIndex >= imageMedia.length) return;
        
        // Find the actual index in main media array
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
    
    // Lightbox event listeners
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
    
    // Create thumbnail strip below main image
    function createThumbnailStrip() {
        const strip = document.createElement('div');
        strip.className = 'carousel-thumbnails';
        strip.id = 'thumbnailStrip';
        
        media.forEach((item, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            if (index === 0) thumb.classList.add('active');
            
            if (item.type === 'video') {
                thumb.classList.add('video');
                
                const playIcon = document.createElement('div');
                playIcon.className = 'video-play-icon';
                playIcon.innerHTML = '▶';
                thumb.appendChild(playIcon);
                
                const img = document.createElement('img');
                if (media.length > 1 && media[1].type === 'image') {
                    img.src = media[1].src;
                } else {
                    img.src = previewImage;
                }
                img.alt = 'Video';
                thumb.appendChild(img);
            } else {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = `Screenshot ${index + 1}`;
                thumb.appendChild(img);
            }
            
            thumb.onclick = (e) => {
                e.stopPropagation();
                goToIndex(index);
            };
            strip.appendChild(thumb);
        });
        
        // Insert after image container, inside project-media
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
    function updateDisplay(direction = 1) {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        const currentMedia = media[currentIndex];
        const oldMedia = container.querySelector('#mainImage');
        
        // Update cursor based on media type
        container.style.cursor = currentMedia.type === 'video' ? 'default' : 'zoom-in';
        
        let newMedia;
        
        if (currentMedia.type === 'video') {
            newMedia = document.createElement('iframe');
            newMedia.id = 'mainImage';
            newMedia.src = currentMedia.src;
            newMedia.frameBorder = '0';
            newMedia.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            newMedia.allowFullscreen = true;
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
        }
        
        if (oldMedia) {
            container.insertBefore(newMedia, oldMedia);
        } else {
            container.insertBefore(newMedia, container.firstChild);
        }
        
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
        if (index < 0 || index >= media.length || index === currentIndex) {
            return;
        }
        
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
        
        // Normal carousel controls (thumbnails only now)
        if (!projectImage) return;
        
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                updateDisplay();
            }
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            if (currentIndex < media.length - 1) {
                currentIndex++;
                updateDisplay();
            }
        }
    });
    
    // Start
    initCarousel();
});