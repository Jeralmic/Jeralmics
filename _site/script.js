document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".content img");

    images.forEach(img => {
        const staticSrc = img.src;
        const gifSrc = img.getAttribute("data-gif");

        img.addEventListener("mouseenter", () => {
            img.src = gifSrc;
        });

        img.addEventListener("mouseleave", () => {
            img.src = staticSrc;
        });
    });

    // Animate the loading dots
    const dotsElement = document.querySelector(".loading-dots");
    if (dotsElement) {
        let dots = "";
        setInterval(() => {
            dots = dots.length < 3 ? dots + "." : "";
            dotsElement.textContent = dots;
        }, 500);
    }

    const text = "JERALMI C.S"; // The text to type
    const speed = 150; // Speed in milliseconds per letter
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            document.getElementById("typewriter").innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter(); // Start typing effect
});
