/**
 * Video Ads Studio Portfolio
 * All animations and interactions
 */

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let lenis;
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize Lenis smooth scroll
    initLenis();
    
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Film Gate Reveal
    initFilmGate();
    
    // Mobile Menu
    initMobileMenu();
    
    // Hero Animations (after gate)
    initHeroAnimations();
    
    // Section Animations
    initWorkSection();
    initServicesSection();
    initManifestoSection();
    initStatsSection();
    initShowcaseSection();
    initContactSection();
    
    // Continuous Animations
    initOrbitAnimation();
    initFloatingCards();
    
    // Nav scroll behavior
    initNavScroll();
});

// ==========================================
// LENIS SMOOTH SCROLL
// ==========================================
function initLenis() {
    lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        wheelMultiplier: 1,
    });
    
    // Use standard rAF loop for Lenis (not GSAP ticker)
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Sync Lenis scroll with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    
    // Anchor link smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.2,
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                const menuBtn = document.getElementById('menuBtn');
                if (mobileMenu && !mobileMenu.classList.contains('pointer-events-none')) {
                    closeMobileMenu(mobileMenu, menuBtn);
                }
            }
        });
    });
}

// ==========================================
// FILM GATE REVEAL
// ==========================================
function initFilmGate() {
    if (isReducedMotion) {
        const overlay = document.getElementById('gateOverlay');
        if (overlay) overlay.style.display = 'none';
        triggerHeroEntrance();
        return;
    }
    
    const panels = document.querySelectorAll('.gate-panel');
    const overlay = document.getElementById('gateOverlay');
    
    // Wait for critical assets then animate
    setTimeout(() => {
        const tl = gsap.timeline();
        
        // Step 1: Panels shrink and move inward
        tl.to('.gate-panel-tl', {
            scale: 0.3,
            x: '35%',
            y: '35%',
            borderRadius: '60px',
            duration: 1.2,
            ease: 'power3.inOut'
        }, 0)
        .to('.gate-panel-tr', {
            scale: 0.3,
            x: '-35%',
            y: '35%',
            borderRadius: '60px',
            duration: 1.2,
            ease: 'power3.inOut'
        }, 0)
        .to('.gate-panel-bl', {
            scale: 0.3,
            x: '35%',
            y: '-35%',
            borderRadius: '60px',
            duration: 1.2,
            ease: 'power3.inOut'
        }, 0)
        .to('.gate-panel-br', {
            scale: 0.3,
            x: '-35%',
            y: '-35%',
            borderRadius: '60px',
            duration: 1.2,
            ease: 'power3.inOut'
        }, 0)
        .set(overlay, { display: 'none' })
        .add(() => {
            triggerHeroEntrance();
        }, '+=0.1');
    }, 300);
}

// ==========================================
// HERO ENTRANCE ANIMATIONS
// ==========================================
function triggerHeroEntrance() {
    if (isReducedMotion) {
        // Show everything immediately
        gsap.set('.hero-badge, .hero-headline, .hero-sub, .hero-cta, #mainNav', { 
            opacity: 1, 
            y: 0,
            scale: 1,
            rotateX: 0
        });
        return;
    }
    
    const tl = gsap.timeline();
    
    // 1. Nav fade in from top
    tl.to('#mainNav', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    })
    // 2. Badge scale + fade
    .to('.hero-badge', {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
    }, '-=0.3')
    // 3. Headlines staggered slide-up
    .to('.hero-headline', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
    }, '-=0.2')
    // 4. Subheadline fade
    .to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    // 5. CTAs scale + fade
    .to('.hero-cta', {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
    }, '-=0.3');
}

// ==========================================
// MOBILE MENU
// ==========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        if (mobileMenu.classList.contains('pointer-events-none')) {
            openMobileMenu(mobileMenu, menuBtn);
        } else {
            closeMobileMenu(mobileMenu, menuBtn);
        }
    });
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu(mobileMenu, menuBtn);
        });
    });
}

function openMobileMenu(menu, btn) {
    menu.classList.remove('opacity-0', 'pointer-events-none');
    menu.classList.add('opacity-100', 'pointer-events-auto');
    btn.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
    lenis.stop();
}

function closeMobileMenu(menu, btn) {
    menu.classList.add('opacity-0', 'pointer-events-none');
    menu.classList.remove('opacity-100', 'pointer-events-auto');
    btn.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
    lenis.start();
}

// ==========================================
// NAV SCROLL BEHAVIOR
// ==========================================
function initNavScroll() {
    const nav = document.getElementById('mainNav');
    let lastScroll = 0;
    
    lenis.on('scroll', ({ scroll }) => {
        // Add background on scroll
        if (scroll > 100) {
            nav.style.background = 'rgba(9, 9, 10, 0.9)';
        } else {
            nav.style.background = 'rgba(9, 9, 10, 0.7)';
        }
        lastScroll = scroll;
    });
}

// ==========================================
// WORK SECTION - DIAGONAL PANEL
// ==========================================
function initWorkSection() {
    // Diagonal panel entrance
    gsap.from('#diagonalPanel', {
        x: '100%',
        y: '100%',
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
            trigger: '#work',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Work cards hover effect
    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.03, duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.3 });
        });
    });
}

// ==========================================
// SERVICES SECTION - 3D CAROUSEL
// ==========================================
function initServicesSection() {
    const container = document.getElementById('services-canvas');
    if (!container) return;
    
    // Check for touch device - use fallback
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (isTouchDevice || isReducedMotion) {
        // Show fallback cards on mobile
        container.style.display = 'none';
        return;
    }
    
    // Try Three.js carousel on desktop
    try {
        initThreeCarousel(container);
    } catch (e) {
        console.warn('Three.js carousel failed, using fallback', e);
        container.style.display = 'none';
    }
}

function initThreeCarousel(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(0, 0, 500);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Service data
    const services = [
        { name: 'Social Media Video Ads', desc: 'High-impact creatives for TikTok, Meta, YouTube Shorts', color: '#e03000' },
        { name: 'SaaS & App Demos', desc: 'Engaging promotional videos for tech products', color: '#ccff00' },
        { name: 'UGC & Direct Response', desc: 'Raw footage into dynamic, high-converting ads', color: '#e03000' },
        { name: 'Motion Graphics', desc: 'Text animations, sound effects, visual FX', color: '#ccff00' },
        { name: 'E-commerce Ads', desc: 'Product-focused videos that drive purchases', color: '#e03000' },
        { name: 'Brand Storytelling', desc: 'Narrative-driven content that builds identity', color: '#ccff00' },
        { name: 'Hook Optimization', desc: 'First-3-second grabs that stop the scroll', color: '#e03000' },
        { name: 'Full Funnel Creative', desc: 'Ad sets for every stage of the journey', color: '#ccff00' },
    ];
    
    // Create cylinder group
    const cylinder = new THREE.Group();
    scene.add(cylinder);
    
    // Create cards
    const cardCount = services.length;
    const radius = 280;
    const angleStep = (2 * Math.PI) / cardCount;
    
    services.forEach((service, i) => {
        // Create card using canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Card background
        ctx.fillStyle = 'rgba(18, 18, 20, 0.9)';
        ctx.beginPath();
        ctx.roundRect(0, 0, 320, 200, 16);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = 'rgba(244, 244, 245, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(0, 0, 320, 200, 16);
        ctx.stroke();
        
        // Accent dot
        ctx.fillStyle = service.color;
        ctx.beginPath();
        ctx.arc(30, 40, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Title
        ctx.fillStyle = '#f4f4f5';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText(service.name, 30, 90);
        
        // Description
        ctx.fillStyle = '#8a8a93';
        ctx.font = '13px Inter, sans-serif';
        const words = service.desc.split(' ');
        let line = '';
        let y = 120;
        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 270 && line !== '') {
                ctx.fillText(line, 30, y);
                line = word + ' ';
                y += 20;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 30, y);
        
        // Number
        ctx.fillStyle = 'rgba(244, 244, 245, 0.05)';
        ctx.font = 'bold 72px Inter, sans-serif';
        ctx.fillText(`0${i + 1}`, 240, 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(160, 100);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const card = new THREE.Mesh(geometry, material);
        const angle = i * angleStep;
        card.position.x = radius * Math.cos(angle);
        card.position.z = radius * Math.sin(angle);
        card.rotation.y = -angle + Math.PI / 2;
        
        cylinder.add(card);
    });
    
    // Scroll-driven rotation
    gsap.to(cylinder.rotation, {
        y: Math.PI * 2,
        ease: 'none',
        scrollTrigger: {
            trigger: '#services',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5
        }
    });
    
    // Float animation
    gsap.to(cylinder.position, {
        y: 15,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
    });
    
    // Render loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    
    // Mark as having 3D
    document.body.classList.add('has-3d');
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
    
    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// ==========================================
// MANIFESTO SECTION - STICKY PINNING
// ==========================================
function initManifestoSection() {
    const blocks = document.querySelectorAll('.manifesto-block');
    if (blocks.length === 0) return;
    
    // Create scroll-driven manifesto animation
    blocks.forEach((block, index) => {
        const highlightWord = block.querySelector('.highlight-word');
        
        ScrollTrigger.create({
            trigger: block,
            start: 'top 60%',
            end: 'top 30%',
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Fade blocks in/out based on scroll
                blocks.forEach((b, i) => {
                    if (i === index) {
                        gsap.set(b, { opacity: progress });
                    } else if (i === index - 1) {
                        gsap.set(b, { opacity: 1 - progress });
                    }
                });
                
                // Highlight word
                if (highlightWord) {
                    if (progress > 0.5) {
                        highlightWord.classList.add('active');
                    } else {
                        highlightWord.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // Pin the sticky container
    ScrollTrigger.create({
        trigger: '#about',
        start: 'top top',
        end: 'bottom bottom',
        pin: '.manifesto-sticky',
        pinSpacing: false
    });
}

// ==========================================
// STATS SECTION - ANIMATED COUNTERS
// ==========================================
function initStatsSection() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach((item, index) => {
        const numberEl = item.querySelector('.stat-number');
        if (!numberEl) return;
        
        const value = parseFloat(numberEl.dataset.value);
        const prefix = numberEl.dataset.prefix || '';
        const suffix = numberEl.dataset.suffix || '';
        
        // Entrance animation
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#stats',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
        
        // Counter animation
        const counter = { val: 0 };
        
        gsap.to(counter, {
            val: value,
            duration: 2,
            delay: index * 0.15 + 0.3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#stats',
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            onUpdate: () => {
                let displayVal;
                if (value % 1 !== 0) {
                    displayVal = counter.val.toFixed(1);
                } else {
                    displayVal = Math.round(counter.val);
                }
                numberEl.textContent = `${prefix}${displayVal}${suffix}`;
            }
        });
    });
    
    // Accent line sweep
    gsap.to('.stat-line', {
        width: '100%',
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#stats',
            start: 'top 60%',
            toggleActions: 'play none none none'
        }
    });
}

// ==========================================
// SHOWCASE SECTION - DEVICE + FLOATING CARDS
// ==========================================
function initShowcaseSection() {
    // Device entrance
    gsap.from('.device-mockup', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#showcase',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });
    
    // Floating cards entrance
    const cards = document.querySelectorAll('.floating-card');
    const directions = [
        { x: -100, y: -100 },
        { x: 100, y: -100 },
        { x: -100, y: 100 },
        { x: 100, y: 100 }
    ];
    
    cards.forEach((card, i) => {
        gsap.from(card, {
            x: directions[i].x,
            y: directions[i].y,
            opacity: 0,
            rotation: 0,
            duration: 0.6,
            delay: 0.2 + i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#showcase',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Device Slideshow
    initDeviceSlideshow();
}

// Device Slideshow
function initDeviceSlideshow() {
    const slides = document.querySelectorAll('.device-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    setInterval(() => {
        slides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = '1';
    }, 3000);
}

// Floating Cards Continuous Animation
function initFloatingCards() {
    if (isReducedMotion) return;
    
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, i) => {
        gsap.to(card, {
            y: '+=8',
            rotation: `+=${(i % 2 === 0 ? 2 : -2)}`,
            duration: 4 + i,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    });
}

// ==========================================
// CONTACT SECTION - ORBITING ICONS
// ==========================================
function initContactSection() {
    // Headline character flip
    const headline = document.querySelector('.contact-headline');
    if (headline && !isReducedMotion) {
        gsap.from(headline, {
            rotateX: -45,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
    }
}

// Orbit Animation
function initOrbitAnimation() {
    if (isReducedMotion) return;
    
    const icons = document.querySelectorAll('.orbit-icon');
    const container = document.getElementById('orbitContainer');
    if (!container || icons.length === 0) return;
    
    let animationId;
    
    function animate() {
        const now = Date.now() / 1000;
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        
        icons.forEach(icon => {
            const radius = parseFloat(icon.dataset.radius);
            const speed = parseFloat(icon.dataset.speed);
            const startAngle = parseFloat(icon.dataset.angle) * (Math.PI / 180);
            
            const angle = (now / speed) * Math.PI * 2 + startAngle;
            const x = centerX + radius * Math.cos(angle) - icon.offsetWidth / 2;
            const y = centerY + radius * Math.sin(angle) - icon.offsetHeight / 2;
            
            icon.style.left = `${x}px`;
            icon.style.top = `${y}px`;
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Recalculate on resize
    window.addEventListener('resize', () => {
        // The animation loop will automatically adapt
    });
}

// ==========================================
// SERVICE CARDS FALLBACK ANIMATIONS
// ==========================================
// Animate service fallback cards on scroll
document.addEventListener('DOMContentLoaded', () => {
    const fallbackCards = document.querySelectorAll('.service-card-fallback');
    
    if (fallbackCards.length > 0) {
        gsap.from(fallbackCards, {
            opacity: 0,
            y: 40,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#services',
                start: 'top 60%',
                toggleActions: 'play none none none'
            }
        });
    }
});

// ==========================================
// PARALLAX EFFECTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Subtle parallax on hero elements
    if (!isReducedMotion) {
        gsap.to('.gradient-mesh', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
});

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

// Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// RESIZE HANDLER
// ==========================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
