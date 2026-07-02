/**
 * MUZAMMIL CREATIVES - MASTER JS SCRIPT
 */

// 1. PARTICLES ENGINE
class HighPerformanceParticlesEngine {
    constructor() {
        this.canvas = document.getElementById('background-particles-canvas-target');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particlePool = [];
        this.maxParticlesCount = 60;
        this.runtimeInitialization();
    }
    runtimeInitialization() {
        this.syncCanvasDimensions();
        window.addEventListener('resize', () => this.syncCanvasDimensions());
        this.populatePool();
        this.executionLoop();
    }
    syncCanvasDimensions() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    populatePool() {
        for (let index = 0; index < this.maxParticlesCount; index++) {
            this.particlePool.push({
                coordinateX: Math.random() * this.canvas.width,
                coordinateY: Math.random() * this.canvas.height,
                vectorVelocityX: (Math.random() - 0.5) * 0.4,
                vectorVelocityY: (Math.random() - 0.5) * 0.4,
                particleRadiusValue: Math.random() * 1.5 + 0.5,
                opacityValue: Math.random() * 0.3 + 0.1
            });
        }
    }
    executionLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        for (let i = 0; i < this.maxParticlesCount; i++) {
            let item = this.particlePool[i];
            item.coordinateX += item.vectorVelocityX;
            item.coordinateY += item.vectorVelocityY;
            if (item.coordinateX < 0 || item.coordinateX > this.canvas.width) item.vectorVelocityX *= -1;
            if (item.coordinateY < 0 || item.coordinateY > this.canvas.height) item.vectorVelocityY *= -1;
            this.ctx.beginPath();
            this.ctx.globalAlpha = item.opacityValue;
            this.ctx.arc(item.coordinateX, item.coordinateY, item.particleRadiusValue, 0, Math.PI * 2);
            this.ctx.fill();
        }
        requestAnimationFrame(() => this.executionLoop());
    }
}

// 2. COUNTER SYSTEM
function initializeNumericalCounterSystem() {
    const counterElements = document.querySelectorAll('.numeric-counter-trigger');
    const trackingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const node = entry.target;
                const dynamicTargetLimit = parseInt(node.getAttribute('data-target-count'), 10);
                let currentStartVal = 0;
                const incrementalStep = dynamicTargetLimit / (2000 / 16);

                const dynamicCounterTicker = () => {
                    currentStartVal += incrementalStep;
                    if (currentStartVal >= dynamicTargetLimit) {
                        node.textContent = dynamicTargetLimit;
                    } else {
                        node.textContent = Math.floor(currentStartVal);
                        requestAnimationFrame(dynamicCounterTicker);
                    }
                };
                requestAnimationFrame(dynamicCounterTicker);
                observer.unobserve(node);
            }
        });
    }, { threshold: 1.0, rootMargin: '0px 0px -20px 0px' });

    counterElements.forEach(counter => trackingObserver.observe(counter));
}

// 3. ANIMATION INFRASTRUCTURE (GSAP & LENIS)
function bootUpGlobalAnimationInfrastructure() {
    // Lenis Smooth Scroll 
    const lenisScrollInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function loopRenderTick(timeFrame) {
        lenisScrollInstance.raf(timeFrame);
        requestAnimationFrame(loopRenderTick);
    }
    requestAnimationFrame(loopRenderTick);

    // Progress Bar
    window.addEventListener('scroll', () => {
        const structuralWindowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progressCalculationPercentage = (window.scrollY / structuralWindowHeight) * 100;
        const targetDOMIndicator = document.querySelector('.global-scroll-progress-bar');
        if (targetDOMIndicator) targetDOMIndicator.style.width = `${progressCalculationPercentage}%`;
    });

    // Custom Cursor (GSAP) 
    const interactivePoint = document.querySelector('.custom-interactive-cursor');
    const outerFollowerPoint = document.querySelector('.custom-interactive-cursor-follower');
    if (interactivePoint && outerFollowerPoint) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(interactivePoint, { x: e.clientX, y: e.clientY, duration: 0.05 });
            gsap.to(outerFollowerPoint, { x: e.clientX - 12, y: e.clientY - 12, duration: 0.15 });
        });
    }

    // Glass Card Tilt
    document.querySelectorAll('.glass-card').forEach(cardElement => {
        cardElement.addEventListener('mousemove', (e) => {
            const boundaryRect = cardElement.getBoundingClientRect();
            const mouseCoordX = e.clientX - boundaryRect.left;
            const mouseCoordY = e.clientY - boundaryRect.top;
            const tiltX = (boundaryRect.height / 2 - mouseCoordY) / 15;
            const tiltY = (mouseCoordX - boundaryRect.width / 2) / 15;
            cardElement.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
        });
        cardElement.addEventListener('mouseleave', () => {
            cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// INITIALIZATION SEQUENCE
window.addEventListener('DOMContentLoaded', () => {
    new HighPerformanceParticlesEngine();
    bootUpGlobalAnimationInfrastructure();
    initializeNumericalCounterSystem();
    
    // Initialize AOS 
    if(typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
});