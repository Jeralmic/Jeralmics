/**
 * Simple Name Display - No Cursor
 * Just shows "JERALMI CANELA" scaled to fit particle box width
 */

document.addEventListener("DOMContentLoaded", () => {
    const typewriterElement = document.getElementById("typewriter");
    
    // Only run if typewriter element exists (homepage only)
    if (!typewriterElement) return;
    
    const name = "JERALMI CANELA";
    
    // Simple, clean styling - no cursor
    typewriterElement.style.fontFamily = '"DotMatri", -apple-system, monospace';
    typewriterElement.style.fontSize = '64px';
    typewriterElement.style.color = '#000';
    typewriterElement.style.letterSpacing = '8px';
    typewriterElement.style.fontWeight = 'normal';
    
    // Just display the name directly (no typewriter animation, no cursor)
    typewriterElement.textContent = name;
});