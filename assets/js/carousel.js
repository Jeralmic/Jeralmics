/**
 * PROJECT PAGE CAROUSEL
 * Steam-style with thumbnails below main image
 * Click thumbnails or left/right halves of image to navigate
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
    
    // Check if image exists
    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    // Detect available images (try different case variations)
    async function detectImages() {
        const extensions = ['.jpg', '.png', '.jpeg'];
        const detectedImages = [];
        
        // Try different name variations to handle case sensitivity
        const nameVariations = [
            projectName,                                                   // Original (e.g., "InfiniteRoads")
            projectName.toLowerCase(),                                     // all lowercase (e.g., "infiniteroads")
            projectName.charAt(0).toLowerCase() + projectName.slice(1),    // camelCase (e.g., "infiniteRoads")
            projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase() // Title case (e.g., "Infiniteroads")
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
        
        // Only create UI if we have more than 1 item
        if (media.length > 1) {
            createNavigationPanels();
            createThumbnailStrip();
            createCounter();
        }
        
        // Display first item
        updateDisplay();
    }
    
    // Create invisible clickable panels (left/right halves)
    function createNavigationPanels() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        // Left panel (previous)
        const leftPanel = document.createElement('div');
        leftPanel.className = 'nav-panel nav-panel-left';
        leftPanel.onclick = () => navigate(-1);
        container.appendChild(leftPanel);
        
        // Right panel (next)
        const rightPanel = document.createElement('div');
        rightPanel.className = 'nav-panel nav-panel-right';
        rightPanel.onclick = () => navigate(1);
        container.appendChild(rightPanel);
    }
    
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
                
                // Video play icon
                const playIcon = document.createElement('div');
                playIcon.className = 'video-play-icon';
                playIcon.innerHTML = '▶';
                thumb.appendChild(playIcon);
                
                // Use first image as video thumbnail, or preview
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
            
            // Click thumbnail to jump to that media
            thumb.onclick = () => goToIndex(index);
            strip.appendChild(thumb);
        });
        
        // Insert thumbnail strip after image container
        const container = document.querySelector('.image-container');
        if (container && container.parentNode) {
            container.parentNode.insertBefore(strip, container.nextSibling);
        }
    }
    
    // Create counter (e.g., "1 / 6")
    function createCounter() {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.id = 'image-counter';
        counter.innerHTML = `<span id="currentIndex">1</span> / <span id="totalImages">${media.length}</span>`;
        
        const container = document.querySelector('.image-container');
        if (container) {
            container.appendChild(counter);
        }
    }
    
    // Update main display
    function updateDisplay() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        // Remove existing media element
        const oldMedia = container.querySelector('#mainImage');
        if (oldMedia) {
            oldMedia.remove();
        }
        
        const currentMedia = media[currentIndex];
        
        // Create new media element
        if (currentMedia.type === 'video') {
            // Create video iframe
            const iframe = document.createElement('iframe');
            iframe.id = 'mainImage';
            iframe.src = currentMedia.src;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;';
            
            // Insert at the beginning (behind panels and counter)
            container.insertBefore(iframe, container.firstChild);
        } else {
            // Create image
            const img = document.createElement('img');
            img.id = 'mainImage';
            img.src = currentMedia.src;
            img.alt = 'Project Screenshot';
            img.className = 'project-image';
            
            // Insert at the beginning
            container.insertBefore(img, container.firstChild);
        }
        
        // Update UI
        updateCounter();
        updateActiveThumbnail();
        updateNavigationPanels();
    }
    
    // Update counter text
    function updateCounter() {
        const counter = document.getElementById('currentIndex');
        if (counter) {
            counter.textContent = currentIndex + 1;
        }
    }
    
    // Update which thumbnail has active state
    function updateActiveThumbnail() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === currentIndex) {
                thumb.classList.add('active');
                // Scroll thumbnail into view
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
    
    // Update navigation panel states (disable at boundaries and for videos)
    function updateNavigationPanels() {
        const leftPanel = document.querySelector('.nav-panel-left');
        const rightPanel = document.querySelector('.nav-panel-right');
        const currentMedia = media[currentIndex];
        
        // If current media is a video, hide navigation panels completely
        // so video controls are accessible
        if (currentMedia.type === 'video') {
            if (leftPanel) {
                leftPanel.style.pointerEvents = 'none';
                leftPanel.style.opacity = '0';
            }
            if (rightPanel) {
                rightPanel.style.pointerEvents = 'none';
                rightPanel.style.opacity = '0';
            }
            return;
        }
        
        // For images, restore normal navigation behavior
        if (leftPanel) {
            leftPanel.style.pointerEvents = 'auto';
            leftPanel.style.opacity = '1';
            
            if (currentIndex === 0) {
                leftPanel.classList.add('disabled');
            } else {
                leftPanel.classList.remove('disabled');
            }
        }
        
        if (rightPanel) {
            rightPanel.style.pointerEvents = 'auto';
            rightPanel.style.opacity = '1';
            
            if (currentIndex >= media.length - 1) {
                rightPanel.classList.add('disabled');
            } else {
                rightPanel.classList.remove('disabled');
            }
        }
    }
    
    // Navigate by direction (-1 for prev, +1 for next)
    function navigate(direction) {
        const newIndex = currentIndex + direction;
        
        // Check bounds
        if (newIndex < 0 || newIndex >= media.length) {
            return;
        }
        
        currentIndex = newIndex;
        updateDisplay();
    }
    
    // Go to specific index
    function goToIndex(index) {
        if (index < 0 || index >= media.length || index === currentIndex) {
            return;
        }
        
        currentIndex = index;
        updateDisplay();
    }
    
    // Keyboard navigation (arrow keys)
    document.addEventListener("keydown", (e) => {
        if (!projectImage) return;
        
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            navigate(-1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            navigate(1);
        }
    });
    
    // Start the carousel
    initCarousel();
});