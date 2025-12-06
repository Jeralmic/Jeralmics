/**
 * UX Enhancements
 * Gamey interactions and polish
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============ SCROLL PROGRESS BAR ============
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
    
    // ============ BACK TO TOP BUTTON ============
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // ============ KONAMI CODE EASTER EGG ============
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        // Rainbow mode!
        document.body.classList.add('rainbow-mode');
        
        // Show message
        const msg = document.createElement('div');
        msg.className = 'easter-egg-msg';
        msg.innerHTML = '🎮 KONAMI CODE ACTIVATED! 🎮';
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => msg.remove(), 500);
        }, 3000);
        
        // Remove rainbow after 10 seconds
        setTimeout(() => {
            document.body.classList.remove('rainbow-mode');
        }, 10000);
    }
    
    // ============ CLICK RIPPLE EFFECT ============
    document.addEventListener('click', (e) => {
        // Only on interactive elements
        const target = e.target.closest('a, button, .thumbnail, .project-item');
        if (!target) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
    
});
