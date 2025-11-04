/**
 * Typewriter Effect
 * Used on homepage for name animation
 */

document.addEventListener("DOMContentLoaded", () => {
    const typewriterElement = document.getElementById("typewriter");
    
    // Only run if typewriter element exists
    if (!typewriterElement) return;
    
    const text = "JERALMI CANELA";
    const speed = 150; // Speed in milliseconds per letter
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();

    // Animate the loading dots
    const dotsElements = document.querySelectorAll(".loading-dots");
    dotsElements.forEach(dotsElement => {
        let dots = "";
        setInterval(() => {
            dots = dots.length < 3 ? dots + "." : "";
            dotsElement.textContent = dots;
        }, 500);
    });
});