/* ============================================
   MAISON D'OMBRE - Luxury Parallax Experience
   Premium Animation Suite v4.0

   Cinematic animations for 5-star luxury
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// PRELOADER & INITIAL SETUP
// ==========================================
document.body.style.overflow = 'hidden';

window.addEventListener('load', () => {
    // Small delay for dramatic effect
    setTimeout(() => {
        document.body.style.overflow = '';
        initAllAnimations();
    }, 300);
});

function initAllAnimations() {
    initCustomCursor();
    initNavigation();
    initHeroAnimations();
    initParallaxSections();
    initSectionReveals();
    initGalleryAnimations();
    initGallery3DTilt();
    initClientLogos();
    initSmoothHovers();
    initScrollIndicator();
    initKineticTypography();

    // Final refresh
    ScrollTrigger.refresh();
}

// ==========================================
// CUSTOM CURSOR - MAGNETIC EFFECT
// ==========================================
function initCustomCursor() {
    // Only on devices with fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Smooth cursor following
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor position with lerp
    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .gallery-item, .expertise-card, .filter-btn');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        target.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Text hover on headings
    const textTargets = document.querySelectorAll('h1, h2, h3, p');
    textTargets.forEach(target => {
        target.addEventListener('mouseenter', () => cursor.classList.add('text'));
        target.addEventListener('mouseleave', () => cursor.classList.remove('text'));
    });

    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));

    // Magnetic effect on buttons
    document.querySelectorAll('.btn, .nav-cta, .whatsapp-float').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ==========================================
// KINETIC TYPOGRAPHY - HERO
// ==========================================
function initKineticTypography() {
    const titleLines = document.querySelectorAll('.title-line');
    if (!titleLines.length) return;

    // Split text into characters for animation
    titleLines.forEach(line => {
        const text = line.textContent;
        line.innerHTML = '';
        line.setAttribute('aria-label', text);

        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(100px) rotateX(-90deg)';
            span.classList.add('char');
            line.appendChild(span);
        });
    });
}

// ==========================================
// GALLERY 3D TILT EFFECT
// ==========================================
function initGallery3DTilt() {
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
        const image = item.querySelector('.gallery-image');
        if (!image) return;

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(item, {
                rotationY: x * 15,
                rotationX: -y * 15,
                scale: 1.05,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformOrigin: 'center center'
            });

            // Parallax inner image
            gsap.to(image.querySelector('img'), {
                x: x * 20,
                y: y * 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotationY: 0,
                rotationX: 0,
                scale: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });

            gsap.to(image.querySelector('img'), {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ==========================================
// NAVIGATION - LUXURY STYLE
// ==========================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (nav) {
        // Smooth scroll detection
        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                nav.classList.toggle('scrolled', self.progress > 0);
            }
        });
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// ==========================================
// HERO - CINEMATIC ENTRANCE WITH KINETIC TYPOGRAPHY
// ==========================================
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Set initial states - everything hidden
    gsap.set('.hero-bg img', { scale: 1.4, opacity: 0, filter: 'blur(10px)' });
    gsap.set('.hero-overlay', { opacity: 0 });
    gsap.set('.hero-tagline', { y: 60, opacity: 0, filter: 'blur(5px)' });
    gsap.set('.hero-subtitle', { y: 40, opacity: 0 });
    gsap.set('.hero-cta', { y: 50, opacity: 0, scale: 0.9 });
    gsap.set('.scroll-indicator', { y: 30, opacity: 0 });

    // Master timeline for cinematic entrance
    const heroTL = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    // Cinematic image reveal with blur transition
    heroTL
        .to('.hero-bg img', {
            scale: 1.08,
            opacity: 1,
            filter: 'blur(0.3px)',
            duration: 2.5,
            ease: 'power2.out'
        })
        .to('.hero-overlay', {
            opacity: 1,
            duration: 2
        }, '-=2')

        // KINETIC TYPOGRAPHY - Letter by letter reveal
        .add(() => {
            const chars = document.querySelectorAll('.title-line .char');
            if (chars.length) {
                gsap.to(chars, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.8,
                    stagger: {
                        each: 0.04,
                        from: 'start'
                    },
                    ease: 'back.out(1.7)'
                });
            } else {
                // Fallback for non-split text
                gsap.to('.title-line', {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 1.4,
                    stagger: 0.15,
                    ease: 'power4.out'
                });
            }
        }, '-=1')

        // Tagline with blur reveal
        .to('.hero-tagline', {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out'
        }, '-=0.3')

        // Subtitle
        .to('.hero-subtitle', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.6')

        // CTA buttons with scale pop
        .to('.hero-cta', {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.5)'
        }, '-=0.4')

        // Scroll indicator
        .to('.scroll-indicator', {
            y: 0,
            opacity: 0.7,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.2');

    // Hero parallax on scroll
    gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    })
    .to('.hero-bg img', {
        y: '40%',
        scale: 1.1,
        ease: 'none'
    }, 0)
    .to('.hero-content', {
        y: '-30%',
        opacity: 0,
        ease: 'none'
    }, 0)
    .to('.scroll-indicator', {
        opacity: 0,
        y: -30
    }, 0);
}

// ==========================================
// PARALLAX SECTIONS - DEPTH EFFECT
// ==========================================
function initParallaxSections() {
    document.querySelectorAll('.parallax-section').forEach((section, index) => {
        const img = section.querySelector('.parallax-img');
        const container = section.querySelector('.parallax-img-container');
        const content = section.querySelector('.parallax-content');

        // Image reveal on scroll into view
        if (img) {
            gsap.set(img, { scale: 1.3, opacity: 0.5 });

            gsap.to(img, {
                scale: 1,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'top center',
                    scrub: 1
                }
            });

            // Deep parallax movement
            gsap.to(img, {
                y: '-30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        // Content reveal with stagger
        if (content) {
            const label = content.querySelector('.parallax-label');
            const heading = content.querySelector('h2');

            gsap.set([label, heading], { y: 60, opacity: 0 });

            ScrollTrigger.create({
                trigger: section,
                start: 'top 60%',
                onEnter: () => {
                    gsap.to(label, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out'
                    });
                    gsap.to(heading, {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        delay: 0.15,
                        ease: 'power3.out'
                    });
                },
                once: true
            });

            // Subtle content parallax
            gsap.to(content, {
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });
        }
    });
}

// ==========================================
// SECTION REVEALS - ELEGANT STAGGER
// ==========================================
function initSectionReveals() {
    document.querySelectorAll('.section').forEach(section => {
        const header = section.querySelector('.section-header');
        const cards = section.querySelectorAll('.expertise-card, .feature-card, .process-step');

        if (header) {
            const label = header.querySelector('.section-label');
            const title = header.querySelector('.section-title');
            const subtitle = header.querySelector('.section-subtitle');

            gsap.set([label, title, subtitle].filter(Boolean), {
                y: 80,
                opacity: 0
            });

            ScrollTrigger.create({
                trigger: header,
                start: 'top 75%',
                onEnter: () => {
                    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

                    if (label) tl.to(label, { y: 0, opacity: 1, duration: 0.8 });
                    if (title) tl.to(title, { y: 0, opacity: 1, duration: 1.2 }, '-=0.5');
                    if (subtitle) tl.to(subtitle, { y: 0, opacity: 1, duration: 1 }, '-=0.7');
                },
                once: true
            });
        }

        if (cards.length > 0) {
            gsap.set(cards, { y: 100, opacity: 0 });

            ScrollTrigger.create({
                trigger: cards[0],
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(cards, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: {
                            each: 0.15,
                            ease: 'power2.out'
                        },
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        }
    });
}

// ==========================================
// GALLERY - PREMIUM REVEAL
// ==========================================
function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Initial reveal
    gsap.set(galleryItems, { y: 80, opacity: 0, scale: 0.95 });

    ScrollTrigger.create({
        trigger: '.gallery-grid',
        start: 'top 80%',
        onEnter: () => {
            gsap.to(galleryItems, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: {
                    each: 0.1,
                    grid: 'auto',
                    from: 'start'
                },
                ease: 'power3.out'
            });
        },
        once: true
    });

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                gsap.to(item, {
                    opacity: match ? 1 : 0.15,
                    scale: match ? 1 : 0.95,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                item.style.pointerEvents = match ? 'auto' : 'none';
            });
        });
    });

    // Premium hover effects
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');

        item.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.1,
                duration: 0.8,
                ease: 'power2.out'
            });
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.4
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                duration: 0.8,
                ease: 'power2.out'
            });
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.4
            });
        });
    });
}

// ==========================================
// CLIENT LOGOS - ELEGANT REVEAL
// ==========================================
function initClientLogos() {
    const clientLogos = document.querySelectorAll('.client-logo');
    const clientsTitle = document.querySelector('.clients-title');

    if (clientsTitle) {
        gsap.set(clientsTitle, { y: 40, opacity: 0 });

        ScrollTrigger.create({
            trigger: '.clients-section',
            start: 'top 75%',
            onEnter: () => {
                gsap.to(clientsTitle, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    }

    if (clientLogos.length > 0) {
        gsap.set(clientLogos, { y: 50, opacity: 0 });

        ScrollTrigger.create({
            trigger: '.clients-grid',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(clientLogos, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: {
                        each: 0.08,
                        grid: 'auto',
                        from: 'start'
                    },
                    ease: 'power3.out'
                });
            },
            once: true
        });
    }
}

// ==========================================
// SMOOTH HOVER EFFECTS
// ==========================================
function initSmoothHovers() {
    // Buttons magnetic effect
    document.querySelectorAll('.btn, .expertise-link').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    // Expertise cards tilt effect
    document.querySelectorAll('.expertise-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotationY: x * 10,
                rotationX: -y * 10,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    });
}

// ==========================================
// SCROLL INDICATOR ANIMATION
// ==========================================
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    // Continuous bounce animation
    gsap.to(indicator, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}

// ==========================================
// SMOOTH SCROLL ANCHORS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                duration: 1.2,
                ease: 'power3.inOut'
            });
        }
    });
});

// ==========================================
// STATS COUNTER
// ==========================================
document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.dataset.target);

    ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(stat, {
                innerText: target,
                duration: 2.5,
                ease: 'power2.out',
                snap: { innerText: 1 },
                onUpdate: function() {
                    stat.innerText = Math.round(this.targets()[0].innerText);
                }
            });
        },
        once: true
    });
});

// ==========================================
// TESTIMONIALS
// ==========================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let currentTestimonial = 0;

function showTestimonial(index) {
    if (testimonialCards.length === 0) return;

    if (index < 0) index = testimonialCards.length - 1;
    if (index >= testimonialCards.length) index = 0;
    currentTestimonial = index;

    testimonialCards.forEach((card, i) => {
        gsap.to(card, {
            opacity: i === index ? 1 : 0,
            x: i === index ? 0 : (i < index ? -50 : 50),
            duration: 0.5,
            ease: 'power2.out'
        });
        card.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

if (prevBtn) prevBtn.addEventListener('click', () => showTestimonial(currentTestimonial - 1));
if (nextBtn) nextBtn.addEventListener('click', () => showTestimonial(currentTestimonial + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => showTestimonial(i)));

if (testimonialCards.length > 0) {
    setInterval(() => showTestimonial(currentTestimonial + 1), 6000);
}

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML;

        gsap.to(btn, {
            scale: 0.95,
            duration: 0.1
        });

        btn.innerHTML = '<span>Envoi...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Envoyé !</span>';
            btn.style.background = 'var(--color-accent)';
            contactForm.reset();

            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'back.out(2)'
            });

            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// ==========================================
// REDUCED MOTION SUPPORT
// ==========================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(10);
}

// ==========================================
// RESIZE HANDLER
// ==========================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
});

// ==========================================
// FEATURE CARDS MOUSE TRACKING
// ==========================================
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

// ==========================================
// ENHANCED SECTION REVEALS
// ==========================================
document.querySelectorAll('.section-header, .expertise-card, .feature-card, .process-step').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
            gsap.fromTo(el,
                {
                    y: 60,
                    opacity: 0,
                    rotationX: 5
                },
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 1,
                    ease: 'power3.out'
                }
            );
        },
        once: true
    });
});

// ==========================================
// PARALLAX DEPTH ON MOUSE MOVE
// ==========================================
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    // Subtle parallax on hero content
    gsap.to('.hero-content', {
        x: x * 15,
        y: y * 10,
        duration: 1,
        ease: 'power2.out'
    });

    // Counter-parallax on background
    gsap.to('.hero-bg img', {
        x: x * -10,
        y: y * -5,
        duration: 1.5,
        ease: 'power2.out'
    });
});

// ==========================================
// TEXT SCRAMBLE EFFECT ON HOVER
// ==========================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 20);
            const end = start + Math.floor(Math.random() * 20);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply to nav links on hover
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const originalText = link.textContent;
    const fx = new TextScramble(link);

    link.addEventListener('mouseenter', () => {
        fx.setText(originalText);
    });
});

console.log('✨ Maison d\'Ombre - Luxury Experience v5.0 SPECTACULAR');
