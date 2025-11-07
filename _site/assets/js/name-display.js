/**
 * Simple Name Display - No Animation
 * Just shows "JERALMI CANELA" directly
 */

document.addEventListener("DOMContentLoaded", () => {
    const nameElement = document.getElementById("typewriter");
    
    // Only run if element exists (homepage only)
    if (!nameElement) return;
    
    // Just display the name directly - no animation
    nameElement.textContent = "JERALMI CANELA";
});