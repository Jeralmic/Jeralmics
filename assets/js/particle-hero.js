/**
 * Particle Network Hero
 * Organic particle animation for portfolio header
 * WHITE BACKGROUND VERSION
 */

class ParticleHero {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.time = 0;
        
        // Configuration - WHITE background with dark particles
        this.config = {
            particleColor: options.particleColor || '0, 0, 0', // Dark particles
            connectionColor: options.connectionColor || '0, 0, 0', // Dark connections
            particleOpacity: options.particleOpacity || 0.6,
            connectionOpacity: options.connectionOpacity || 0.15,
            backgroundColor: options.backgroundColor || '#ffffff', // WHITE background
            particleDensity: options.particleDensity || 0.7,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.initParticles();
        this.setupEvents();
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.initParticles();
    }
    
    initParticles() {
        this.particles = [];
        const spacing = 60;
        const cols = Math.ceil(this.canvas.width / spacing) + 2;
        const rows = Math.ceil(this.canvas.height / spacing) + 2;
        
        // Create a grid with some randomness
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (Math.random() > (1 - this.config.particleDensity)) {
                    const x = i * spacing + (Math.random() - 0.5) * spacing * 0.8;
                    const y = j * spacing + (Math.random() - 0.5) * spacing * 0.8;
                    this.particles.push(new Particle(x, y, this.canvas));
                }
            }
        }
        
        // Add some random particles for organic variety
        const randomCount = Math.floor(this.canvas.width / 20);
        for (let i = 0; i < randomCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.canvas
            ));
        }
    }
    
    setupEvents() {
        // Mouse tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Resize handling
        window.addEventListener('resize', () => this.resize());
    }
    
    connectParticles() {
        const maxDistance = 100;
        
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].connections = [];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    this.particles[i].connections.push({
                        particle: this.particles[j],
                        distance: distance,
                        maxDistance: maxDistance
                    });
                }
            }
        }
    }
    
    drawConnections() {
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let connection of this.particles[i].connections) {
                const opacity = (1 - (connection.distance / connection.maxDistance)) * this.config.connectionOpacity;
                this.ctx.strokeStyle = `rgba(${this.config.connectionColor}, ${opacity})`;
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(connection.particle.x, connection.particle.y);
                this.ctx.stroke();
            }
        }
    }
    
    animate() {
        this.time++;
        
        // Clear with WHITE background
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update particles
        this.particles.forEach(particle => particle.update(this.time, this.mouse));
        
        // Connect nearby particles
        this.connectParticles();
        
        // Draw connections first (behind particles)
        this.drawConnections();
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.draw(this.ctx, this.config.particleColor, this.config.particleOpacity);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.size = Math.random() * 1.5 + 0.8;
        this.connections = [];
        this.canvas = canvas;
        
        // Organic movement parameters
        this.offsetX = Math.random() * Math.PI * 2;
        this.offsetY = Math.random() * Math.PI * 2;
        this.moveRadius = Math.random() * 25 + 8;
        this.moveSpeed = Math.random() * 0.0008 + 0.0004;
    }

    update(time, mouse) {
        // Organic circular movement around base position
        this.x = this.baseX + Math.sin(time * this.moveSpeed + this.offsetX) * this.moveRadius;
        this.y = this.baseY + Math.cos(time * this.moveSpeed * 0.7 + this.offsetY) * this.moveRadius;
        
        // Slow drift
        this.baseX += this.vx;
        this.baseY += this.vy;
        
        // Wrap around edges smoothly
        if (this.baseX < -50) this.baseX = this.canvas.width + 50;
        if (this.baseX > this.canvas.width + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = this.canvas.height + 50;
        if (this.baseY > this.canvas.height + 50) this.baseY = -50;
        
        // Mouse interaction - gentle repulsion
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
                const force = (1 - dist / mouse.radius) * 1.5;
                this.baseX += (dx / dist) * force;
                this.baseY += (dy / dist) * force;
            }
        }
    }

    draw(ctx, colorRGB, opacity) {
        ctx.fillStyle = `rgba(${colorRGB}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroCanvas = document.getElementById('particle-hero-canvas');
    if (heroCanvas) {
        // WHITE background with dark particles
        new ParticleHero('particle-hero-canvas', {
            particleColor: '0, 0, 0',        // Black particles
            connectionColor: '0, 0, 0',       // Black connections
            particleOpacity: 0.6,
            connectionOpacity: 0.12,
            backgroundColor: '#ffffff',       // WHITE background
            particleDensity: 0.65
        });
    }
});