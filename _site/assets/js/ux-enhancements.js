/**
 * UX Enhancements
 * Lightweight polish and interactions
 */

(function() {
    'use strict';
    
    // ============ SCROLL PROGRESS BAR ============
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    let ticking = false;
    
    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgressBar);
            ticking = true;
        }
    }, { passive: true });
    
    // ============ BACK TO TOP BUTTON ============
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    let scrollTicking = false;
    
    function checkBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        scrollTicking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(checkBackToTop);
            scrollTicking = true;
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
        document.body.classList.add('rainbow-mode');
        
        const msg = document.createElement('div');
        msg.className = 'easter-egg-msg';
        msg.innerHTML = '🎮 KONAMI CODE ACTIVATED! 🎮';
        document.body.appendChild(msg);
        
        requestAnimationFrame(() => {
            msg.classList.add('show');
        });
        
        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => msg.remove(), 500);
        }, 3000);
        
        setTimeout(() => {
            document.body.classList.remove('rainbow-mode');
        }, 10000);
    }
    
    // ============ CLICK RIPPLE (Desktop only - better performance) ============
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .thumbnail, .project-item');
            if (!target) return;
            
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            document.body.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
})();