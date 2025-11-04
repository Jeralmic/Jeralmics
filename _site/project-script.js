document.addEventListener("DOMContentLoaded", function () {
    let currentImageIndex = 1;
    const totalImages = 6; // Maximum number of images per project
    const projectImage = document.getElementById("project-image");

    function updateImage() {
        projectImage.src = `images/${projectImage.dataset.projectName}Shot0${currentImageIndex}.jpg`;

        // Disable left arrow if at first image
        document.querySelector(".arrow-left").style.opacity = (currentImageIndex === 1) ? "0.5" : "1";
        document.querySelector(".arrow-left").style.pointerEvents = (currentImageIndex === 1) ? "none" : "auto";

        // Disable right arrow if at last image
        document.querySelector(".arrow-right").style.opacity = (currentImageIndex === totalImages) ? "0.5" : "1";
        document.querySelector(".arrow-right").style.pointerEvents = (currentImageIndex === totalImages) ? "none" : "auto";
    }

    window.nextImage = function () {
        if (currentImageIndex < totalImages) {
            currentImageIndex++;
            updateImage();
        }
    };

    window.prevImage = function () {
        if (currentImageIndex > 1) {
            currentImageIndex--;
            updateImage();
        }
    };

    // Initial image setup
    updateImage();

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
