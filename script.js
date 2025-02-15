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
});
