/**
 * Enhanced Typewriter Effect with Randomization
 * Random greetings with rotating fonts, colors, effects, and animations
 */

document.addEventListener("DOMContentLoaded", () => {
    const typewriterElement = document.getElementById("typewriter");
    
    // Only run if typewriter element exists (homepage only)
    if (!typewriterElement) return;
    
    // Configuration
    const config = {
        greetings: [
            "HELLO",           // English
            "HOLA",            // Spanish
            "BONJOUR",         // French
            "CIAO",            // Italian
            "HALLO",           // German
            "OLÁ",             // Portuguese
            "ПРИВЕТ",          // Russian
            "你好",            // Chinese (Mandarin)
            "こんにちは",      // Japanese
            "안녕하세요",      // Korean
            "مرحبا",           // Arabic
            "नमस्ते",          // Hindi
            "ΓΕΙΑ ΣΟΥ",        // Greek
            "שלום",            // Hebrew
            "สวัสดี",          // Thai
            "MERHABA",         // Turkish
            "HALO",            // Indonesian
            "XIN CHÀO",        // Vietnamese
            "SAWUBONA",        // Zulu
            "JAMBO",           // Swahili
            "SALAM"            // Persian
        ],
        
        fonts: [
            'Bebas Neue, sans-serif',
            'Orbitron, sans-serif',
            'Rajdhani, sans-serif',
            'Audiowide, sans-serif',
            'Space Mono, monospace',
            'Syne, sans-serif',
            'Antonio, sans-serif',
            'Chakra Petch, sans-serif'
        ],
        
        size: 80, // Fixed size for consistency across devices
        
        colors: [
            { color: '#000000', weight: 30 },
            { color: '#ff0066', weight: 10 },
            { color: '#8b00ff', weight: 8 },
            { color: '#ff4500', weight: 5 },
            { color: '#e76ae1ff', weight: 4 },
            { color: '#ecd761ff', weight: 3 }
        ],
        
        effects: [
            { class: '', weight: 50 },
            { class: 'effect-shadow', weight: 30 },
        ],
        
        waves: [
            { name: 'wave-slow', duration: 3 },
            { name: 'wave-medium', duration: 2 },
            { name: 'wave-fast', duration: 1.5 },
            { name: 'wave-bouncy', duration: 2.5 }
        ],
        
        typewriterSpeeds: [50, 100, 150, 200],
        
        letterSpacing: [4, 8, 12, 16],
        
        rotations: [
            { deg: 0, weight: 70 },
            { deg: -1, weight: 10 },
            { deg: 1, weight: 10 },
            { deg: -2, weight: 5 },
            { deg: 2, weight: 5 }
        ]
    };
    
    // Weighted random selection
    function weightedRandom(items) {
        if (!items[0].weight) {
            return items[Math.floor(Math.random() * items.length)];
        }
        
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let item of items) {
            if (random < item.weight) return item;
            random -= item.weight;
        }
        return items[0];
    }
    
    // Cycling greeting logic - starts random, then cycles +1 each refresh
    let greetingIndex;
    const storedIndex = localStorage.getItem('greetingIndex');
    
    if (storedIndex === null) {
        // First visit or cleared cache - pick random starting point
        greetingIndex = Math.floor(Math.random() * config.greetings.length);
    } else {
        // Increment from last visit, wrap around to 0 if at end
        greetingIndex = (parseInt(storedIndex) + 1) % config.greetings.length;
    }
    
    // Store current index for next visit
    localStorage.setItem('greetingIndex', greetingIndex);
    
    // Select greeting and other random elements
    const greeting = config.greetings[greetingIndex];
    const font = config.fonts[Math.floor(Math.random() * config.fonts.length)];
    const color = weightedRandom(config.colors);
    const effect = weightedRandom(config.effects);
    const wave = config.waves[Math.floor(Math.random() * config.waves.length)];
    const speed = config.typewriterSpeeds[Math.floor(Math.random() * config.typewriterSpeeds.length)];
    const spacing = config.letterSpacing[Math.floor(Math.random() * config.letterSpacing.length)];
    const rotation = weightedRandom(config.rotations);
    
    // Apply styles to typewriter element
    typewriterElement.style.fontFamily = font;
    typewriterElement.style.fontSize = config.size + 'px';
    typewriterElement.style.color = color.color;
    typewriterElement.style.letterSpacing = spacing + 'px';
    typewriterElement.style.transform = `rotate(${rotation.deg}deg)`;
    typewriterElement.style.display = 'inline-flex';
    
    // Add effect class
    if (effect.class) {
        typewriterElement.classList.add(effect.class);
    }
    
    // Typewriter animation
    let index = 0;
    function typeWriter() {
        if (index < greeting.length) {
            const span = document.createElement('span');
            const char = greeting.charAt(index);
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.animation = `${wave.name} ${wave.duration}s ease-in-out infinite`;
            span.style.animationDelay = `${index * 0.1}s`;
            typewriterElement.appendChild(span);
            index++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
});