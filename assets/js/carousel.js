/**
 * Carousel - Smart Image Detection
 * Tries both capitalized and lowercase filenames
 */

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Carousel loading...");
    
    const projectImage = document.getElementById("project-image");
    
    if (!projectImage) {
        console.error("❌ No project-image found");
        return;
    }
    
    const projectName = projectImage.dataset.projectName;
    const imageCount = parseInt(projectImage.dataset.imageCount) || 0;
    const videoUrl = projectImage.dataset.videoUrl || null;
    const previewImage = projectImage.src;
    
    console.log("📊 Project:", projectName, "| Images:", imageCount, "| Video:", !!videoUrl);
    
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
    
    // Detect images - try both capitalized and lowercase
    async function detectImages() {
        console.log("🔍 Detecting images...");
        const extensions = ['.jpg', '.png', '.jpeg'];
        const detectedImages = [];
        
        // Try different name variations
        const nameVariations = [
            projectName,                                                    // Original (e.g., "InfiniteRoads")
            projectName.toLowerCase(),                                      // All lowercase (e.g., "infiniteroads")
            projectName.charAt(0).toLowerCase() + projectName.slice(1)     // First letter lowercase (e.g., "infiniteRoads")
        ];
        
        for (let i = 1; i <= imageCount; i++) {
            let found = false;
            
            for (const nameVar of nameVariations) {
                if (found) break;
                
                for (const ext of extensions) {
                    const testSrc = `/images/${nameVar}Shot0${i}${ext}`;
                    const exists = await checkImageExists(testSrc);
                    
                    if (exists) {
                        console.log(`✅ Found: ${testSrc}`);
                        detectedImages.push({ type: 'image', src: testSrc, index: i });
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                console.log(`❌ Not found: Shot0${i}`);
            }
        }
        
        console.log(`📸 Detected ${detectedImages.length} images`);
        return detectedImages;
    }
    
    // Initialize carousel
    async function initCarousel() {
        const detectedImages = await detectImages();
        
        // Build media array: video first, then images
        if (videoUrl) {
            console.log("🎥 Adding video");
            media.push({ type: 'video', src: videoUrl });
        }
        
        media = media.concat(detectedImages);
        
        // Fallback to preview
        if (media.length === 0) {
            console.log("⚠️ No media, using preview");
            media.push({ type: 'image', src: previewImage });
        }
        
        console.log(`📦 Total media: ${media.length}`);
        
        if (media.length > 1) {
            setupNavigation();
            createThumbnails();
            createCounter();
        } else {
            console.log("ℹ️ Single item, no navigation needed");
        }
        
        updateDisplay();
        console.log("✅ Carousel ready!");
    }
    
    // Setup clickable navigation panels
    function setupNavigation() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        const leftPanel = document.createElement('div');
        leftPanel.className = 'nav-panel nav-panel-left';
        leftPanel.onclick = () => navigate(-1);
        container.appendChild(leftPanel);
        
        const rightPanel = document.createElement('div');
        rightPanel.className = 'nav-panel nav-panel-right';
        rightPanel.onclick = () => navigate(1);
        container.appendChild(rightPanel);
        
        console.log("✅ Navigation panels created");
    }
    
    // Create thumbnails
    function createThumbnails() {
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
                img.src = media.length > 1 && media[1].type === 'image' ? media[1].src : previewImage;
                img.alt = 'Video';
                thumb.appendChild(img);
            } else {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = `Thumbnail ${index + 1}`;
                thumb.appendChild(img);
            }
            
            thumb.onclick = () => goTo(index);
            strip.appendChild(thumb);
        });
        
        const container = document.querySelector('.image-container');
        if (container && container.parentNode) {
            container.parentNode.insertBefore(strip, container.nextSibling);
            console.log("✅ Thumbnails created");
        }
    }
    
    // Create counter
    function createCounter() {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.id = 'image-counter';
        counter.innerHTML = `<span id="currentIndex">1</span> / <span id="totalImages">${media.length}</span>`;
        
        const container = document.querySelector('.image-container');
        if (container) {
            container.appendChild(counter);
            console.log("✅ Counter created");
        }
    }
    
    // Update display
    function updateDisplay() {
        const container = document.querySelector('.image-container');
        if (!container) return;
        
        // Remove old media
        const old = container.querySelector('#mainImage');
        if (old) old.remove();
        
        const current = media[currentIndex];
        
        // Create new media
        if (current.type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.id = 'mainImage';
            iframe.src = current.src;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;';
            container.insertBefore(iframe, container.firstChild);
        } else {
            const img = document.createElement('img');
            img.id = 'mainImage';
            img.src = current.src;
            img.alt = 'Project Media';
            img.className = 'project-image';
            container.insertBefore(img, container.firstChild);
        }
        
        updateCounter();
        updateThumbnails();
        updatePanels();
    }
    
    // Update counter
    function updateCounter() {
        const counter = document.getElementById('currentIndex');
        if (counter) counter.textContent = currentIndex + 1;
    }
    
    // Update thumbnails
    function updateThumbnails() {
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            if (index === currentIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    // Update panels
    function updatePanels() {
        const left = document.querySelector('.nav-panel-left');
        const right = document.querySelector('.nav-panel-right');
        
        if (left) {
            currentIndex === 0 ? left.classList.add('disabled') : left.classList.remove('disabled');
        }
        
        if (right) {
            currentIndex >= media.length - 1 ? right.classList.add('disabled') : right.classList.remove('disabled');
        }
    }
    
    // Navigate
    function navigate(dir) {
        const newIndex = currentIndex + dir;
        if (newIndex < 0 || newIndex >= media.length) return;
        currentIndex = newIndex;
        updateDisplay();
    }
    
    // Go to index
    function goTo(index) {
        if (index < 0 || index >= media.length || index === currentIndex) return;
        currentIndex = index;
        updateDisplay();
    }
    
    // Keyboard
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            navigate(-1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            navigate(1);
        }
    });
    
    // Start
    initCarousel();
});