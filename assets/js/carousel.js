/**
 * Carousel Matching Prototype
 * - Thumbnails display below main image
 * - Invisible clickable panels on left/right (darken on hover)
 * - Counter showing current / total
 */

document.addEventListener("DOMContentLoaded", function () {
    const projectImage = document.getElementById("project-image");
    
    if (!projectImage) return;
    
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
    
    // Detect available images
    async function detectImages() {
        const extensions = ['.jpg', '.png', '.jpeg'];
        const detectedImages = [];
        
        for (let i = 1; i <= imageCount; i++) {
            for (const ext of extensions) {
                const testSrc = `/images/${projectName}Shot0${i}${ext}`;
                const exists = await checkImageExists(testSrc);
                
                if (exists) {
                    detectedImages.push({ type: 'image', src: testSrc, index: i });
                    break;
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
        
        // If no media, use preview image
        if (media.length === 0) {
            media.push({ type: 'image', src: previewImage });
        }
        
        console.log(`Carousel: ${media.length} items detected`, media);
        
        // Only create UI if we have more than 1 item
        if (media.length > 1) {
            setupClickablePanels();
            createThumbnailStrip();
            createImageCounter();
        } else {
            // Single item - hide navigation
            const arrows = document.querySelectorAll('.arrow');
            arrows.forEach(arrow => arrow.style.display = 'none');
        }
        
        // Display first item
        updateDisplay();
    }
    
    // Setup invisible clickable panels instead of arrows
    function setupClickablePanels() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        // Remove old arrows if they exist
        const oldArrows = container.querySelectorAll('.arrow');
        oldArrows.forEach(arrow => arrow.remove());
        
        // Create left panel
        const leftPanel = document.createElement('div');
        leftPanel.className = 'nav-panel nav-panel-left';
        leftPanel.onclick = () => navigate(-1);
        container.appendChild(leftPanel);
        
        // Create right panel
        const rightPanel = document.createElement('div');
        rightPanel.className = 'nav-panel nav-panel-right';
        rightPanel.onclick = () => navigate(1);
        container.appendChild(rightPanel);
    }
    
    // Create thumbnail strip below main image
    function createThumbnailStrip() {
        const thumbnailStrip = document.createElement('div');
        thumbnailStrip.className = 'carousel-thumbnails';
        thumbnailStrip.id = 'thumbnailStrip';
        
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
                const thumbImg = document.createElement('img');
                if (media.length > 1 && media[1].type === 'image') {
                    thumbImg.src = media[1].src;
                } else {
                    thumbImg.src = previewImage;
                }
                thumbImg.alt = 'Video';
                thumb.appendChild(thumbImg);
            } else {
                const thumbImg = document.createElement('img');
                thumbImg.src = item.src;
                thumbImg.alt = `Thumbnail ${index + 1}`;
                thumb.appendChild(thumbImg);
            }
            
            thumb.onclick = () => goToIndex(index);
            thumbnailStrip.appendChild(thumb);
        });
        
        // Insert after image container
        const imageContainer = document.querySelector('.image-container');
        if (imageContainer && imageContainer.parentNode) {
            imageContainer.parentNode.insertBefore(thumbnailStrip, imageContainer.nextSibling);
        }
    }
    
    // Create image counter (1 / 9 format)
    function createImageCounter() {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.id = 'image-counter';
        counter.innerHTML = `<span id="currentIndex">1</span> / <span id="totalImages">${media.length}</span>`;
        
        const imageContainer = document.querySelector('.image-container');
        if (imageContainer) {
            imageContainer.appendChild(counter);
        }
    }
    
    // Update display when index changes
    function updateDisplay() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        const currentMedia = media[currentIndex];
        
        // Remove existing media
        const existingMedia = container.querySelector('#mainImage');
        if (existingMedia) {
            existingMedia.remove();
        }
        
        // Create new media element
        if (currentMedia.type === 'video') {
            const videoFrame = document.createElement('iframe');
            videoFrame.id = 'mainImage';
            videoFrame.src = currentMedia.src;
            videoFrame.frameBorder = '0';
            videoFrame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            videoFrame.allowFullscreen = true;
            videoFrame.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;';
            
            container.insertBefore(videoFrame, container.firstChild);
        } else {
            const img = document.createElement('img');
            img.id = 'mainImage';
            img.src = currentMedia.src;
            img.alt = 'Project Media';
            img.className = 'project-image';
            
            container.insertBefore(img, container.firstChild);
        }
        
        // Update counter
        updateCounter();
        
        // Update active thumbnail
        updateThumbnails();
        
        // Update panel states
        updatePanels();
    }
    
    // Update counter display
    function updateCounter() {
        const counter = document.getElementById('currentIndex');
        if (counter) {
            counter.textContent = currentIndex + 1;
        }
    }
    
    // Update active thumbnail
    function updateThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === currentIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    // Update panel enabled/disabled states
    function updatePanels() {
        const leftPanel = document.querySelector('.nav-panel-left');
        const rightPanel = document.querySelector('.nav-panel-right');
        
        if (leftPanel) {
            if (currentIndex === 0) {
                leftPanel.classList.add('disabled');
            } else {
                leftPanel.classList.remove('disabled');
            }
        }
        
        if (rightPanel) {
            if (currentIndex >= media.length - 1) {
                rightPanel.classList.add('disabled');
            } else {
                rightPanel.classList.remove('disabled');
            }
        }
    }
    
    // Navigate by direction
    function navigate(direction) {
        const newIndex = currentIndex + direction;
        
        if (newIndex < 0 || newIndex >= media.length) return;
        
        currentIndex = newIndex;
        updateDisplay();
    }
    
    // Go to specific index
    function goToIndex(index) {
        if (index < 0 || index >= media.length || index === currentIndex) return;
        
        currentIndex = index;
        updateDisplay();
    }
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            navigate(-1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            navigate(1);
        }
    });
    
    // Initialize
    initCarousel();
});

/**
 * Homepage hover cycling (unchanged)
 */
document.addEventListener("DOMContentLoaded", () => {
    const gridImages = document.querySelectorAll(".content figure img");
    
    gridImages.forEach(img => {
        const figure = img.closest("figure");
        const link = figure.querySelector("a");
        
        if (!link) return;
        
        const href = link.getAttribute("href");
        let projectName = href.replace(".html", "").replace("/", "").trim();
        projectName = projectName.replace(/\s+/g, '');
        
        const originalSrc = img.src;
        let cycleInterval = null;
        let cycleTimeout = null;
        let currentCycleIndex = 0;
        const maxCycleImages = 10;
        let preloadedImages = [];
        let isPreloading = true;
        
        const projectNameVariations = [
            projectName,
            projectName.charAt(0).toUpperCase() + projectName.slice(1)
        ];
        
        function preloadImages() {
            let checkCount = 0;
            const totalChecks = maxCycleImages * projectNameVariations.length;
            
            for (let i = 1; i <= maxCycleImages; i++) {
                projectNameVariations.forEach(nameVar => {
                    const testSrc = `/images/${nameVar}Shot0${i}.jpg`;
                    const testImg = new Image();
                    
                    testImg.onload = function() {
                        if (!preloadedImages.find(p => p.index === i)) {
                            preloadedImages.push({ index: i, src: testSrc });
                            preloadedImages.sort((a, b) => a.index - b.index);
                        }
                        checkCount++;
                        if (checkCount >= totalChecks) {
                            isPreloading = false;
                        }
                    };
                    
                    testImg.onerror = function() {
                        checkCount++;
                        if (checkCount >= totalChecks) {
                            isPreloading = false;
                        }
                    };
                    
                    testImg.src = testSrc;
                });
            }
        }
        
        preloadImages();
        
        img.addEventListener("mouseenter", () => {
            if (cycleInterval) clearInterval(cycleInterval);
            if (cycleTimeout) clearTimeout(cycleTimeout);
            
            cycleTimeout = setTimeout(() => {
                const checkAndStart = () => {
                    if (isPreloading) {
                        cycleTimeout = setTimeout(checkAndStart, 100);
                        return;
                    }
                    
                    if (preloadedImages.length <= 1) return;
                    
                    currentCycleIndex = 0;
                    
                    cycleInterval = setInterval(() => {
                        currentCycleIndex = (currentCycleIndex + 1) % preloadedImages.length;
                        const imageData = preloadedImages[currentCycleIndex];
                        
                        if (imageData && imageData.src) {
                            img.src = imageData.src;
                        }
                    }, 800);
                };
                
                checkAndStart();
            }, 50);
        });
        
        img.addEventListener("mouseleave", () => {
            if (cycleInterval) {
                clearInterval(cycleInterval);
                cycleInterval = null;
            }
            if (cycleTimeout) {
                clearTimeout(cycleTimeout);
                cycleTimeout = null;
            }
            
            currentCycleIndex = 0;
            img.src = originalSrc;
        });
    });
});