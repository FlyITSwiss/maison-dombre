/* ==========================================
   MAISON D'OMBRE - ENHANCEMENTS 2025
   Premium JavaScript Features
   ========================================== */

// ==========================================
// MOBILE PERFORMANCE UTILITIES
// ==========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                 window.innerWidth < 768 ||
                 ('ontouchstart' in window);

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// RequestAnimationFrame-based throttle for smoother animations
function rafThrottle(func) {
    let ticking = false;
    return function(...args) {
        if (!ticking) {
            requestAnimationFrame(() => {
                func.apply(this, args);
                ticking = false;
            });
            ticking = true;
        }
    };
}

// ==========================================
// 1. PRELOADER
// ==========================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    // Hide preloader after animations complete
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';

            // Remove from DOM after transition
            setTimeout(() => {
                preloader.remove();
            }, 800);
        }, 2500); // Wait for preloader animation
    });
}

// ==========================================
// 2. SCROLL PROGRESS BAR
// ==========================================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Use RAF throttle for smooth 60fps updates
    const throttledUpdate = rafThrottle(updateProgress);
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    updateProgress();
}

// ==========================================
// 3. INFINITE MARQUEE
// ==========================================
function initInfiniteMarquee() {
    const marqueeTrack = document.querySelector('.marquee-track');
    if (!marqueeTrack) return;

    // Clone content for seamless loop
    const content = marqueeTrack.querySelector('.marquee-content');
    if (content && !marqueeTrack.querySelector('.marquee-content:nth-child(2)')) {
        const clone = content.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marqueeTrack.appendChild(clone);
    }

    // Pause on hover
    marqueeTrack.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
}

// ==========================================
// 4. DARK MODE TOGGLE
// ==========================================
function initDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Animate toggle
        gsap.to(toggle, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
}

// ==========================================
// 5. FLOATING ELEMENTS PHYSICS
// ==========================================
function initFloatingElements() {
    const floatingContainer = document.querySelector('.floating-elements');
    if (!floatingContainer) return;

    // Skip parallax on mobile/touch devices (performance)
    if (isMobile || isReducedMotion) return;

    // Mouse parallax on floating elements (throttled)
    const handleMouseMove = rafThrottle((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        const shapes = floatingContainer.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 10;
            gsap.to(shape, {
                x: x * speed,
                y: y * speed,
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    });

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
}

// ==========================================
// 6. TEXT MASK REVEAL
// ==========================================
function initTextReveal() {
    // Clip path reveal
    const clipElements = document.querySelectorAll('.clip-reveal');
    clipElements.forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => el.classList.add('revealed'),
            once: true
        });
    });

    // Word by word reveal
    document.querySelectorAll('.word-reveal').forEach(container => {
        const text = container.textContent;
        container.innerHTML = text.split(' ').map(word =>
            `<span class="word"><span class="word-inner">${word}</span></span>`
        ).join(' ');

        ScrollTrigger.create({
            trigger: container,
            start: 'top 80%',
            onEnter: () => {
                container.classList.add('revealed');
                const words = container.querySelectorAll('.word-inner');
                gsap.to(words, {
                    y: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    });
}

// ==========================================
// 7. FORM MICRO-INTERACTIONS
// ==========================================
function initFormInteractions() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Input focus effects
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                y: -2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Add success state if valid
            if (input.value && input.checkValidity()) {
                input.parentElement.classList.add('success');
            } else {
                input.parentElement.classList.remove('success');
            }
        });
    });

    // Submit button animation
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Add loading state
            submitBtn.classList.add('btn-loading');
            const originalHTML = submitBtn.innerHTML;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.classList.remove('btn-loading');
                submitBtn.innerHTML = '<span>Message envoyé !</span>';
                submitBtn.style.background = '#10B981';

                // Success animation
                gsap.fromTo(submitBtn,
                    { scale: 0.95 },
                    { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
                );

                // Reset form
                form.reset();
                inputs.forEach(input => {
                    input.parentElement.classList.remove('success');
                });

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                }, 3000);
            }, 2000);
        });
    }
}

// ==========================================
// 8. PAGE TRANSITIONS
// ==========================================
function initPageTransitions() {
    const transition = document.querySelector('.page-transition');
    if (!transition) return;

    // Animate internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            // Smooth scroll with GSAP
            gsap.to(window, {
                scrollTo: { y: target, offsetY: 80 },
                duration: 1,
                ease: 'power3.inOut'
            });
        });
    });
}

// ==========================================
// 9. COUNTER ANIMATION
// ==========================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.feature-number');

    counters.forEach(counter => {
        const text = counter.textContent;
        const numMatch = text.match(/\d+/);
        if (!numMatch) return;

        const target = parseInt(numMatch[0]);
        const suffix = text.replace(/\d+/, '');

        // Set initial value
        counter.textContent = '0' + suffix;

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => {
                gsap.to({ value: 0 }, {
                    value: target,
                    duration: 2.5,
                    ease: 'power2.out',
                    onUpdate: function() {
                        counter.textContent = Math.round(this.targets()[0].value) + suffix;
                    }
                });
            },
            once: true
        });
    });
}

// ==========================================
// 10. LIQUID BUTTON EFFECT
// ==========================================
function initLiquidButtons() {
    document.querySelectorAll('.hero-cta .btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
            btn.style.setProperty('--mouse-x', `${x}%`);
            btn.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

// ==========================================
// ENHANCED SECTION REVEALS
// ==========================================
function initEnhancedReveals() {
    // Section headers with clip reveal
    document.querySelectorAll('.section-header').forEach(header => {
        const elements = header.querySelectorAll('.section-label, .section-title, .section-subtitle');

        gsap.set(elements, {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            opacity: 0
        });

        ScrollTrigger.create({
            trigger: header,
            start: 'top 75%',
            onEnter: () => {
                gsap.to(elements, {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    });
}

// ==========================================
// INITIALIZE ALL ENHANCEMENTS
// ==========================================
function initEnhancements() {
    initPreloader();
    initScrollProgress();
    initInfiniteMarquee();
    initDarkMode();
    initFloatingElements();
    initTextReveal();
    initFormInteractions();
    initPageTransitions();
    initCounterAnimation();
    initLiquidButtons();
    initEnhancedReveals();

    // New premium features
    initGrainOverlay();
    initSplitText();
    initImageReveals();
    initCard3DReveals();
    initMorphingBlobs();

    console.log('✨ Maison d\'Ombre - Ultra Premium Enhancements Loaded');
}

// ==========================================
// 11. GRAIN TEXTURE OVERLAY
// ==========================================
function initGrainOverlay() {
    // Skip grain on mobile (expensive effect)
    if (isMobile) return;

    // Create grain overlay element
    const grain = document.createElement('div');
    grain.className = 'grain-overlay';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
}

// ==========================================
// 12. SPLIT TEXT ANIMATION
// ==========================================
function initSplitText() {
    const splitElements = document.querySelectorAll('.hero-title .title-line');

    splitElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        el.classList.add('split-text');

        // Split into characters
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--char-index', index);
            el.appendChild(span);
        });

        // Trigger reveal after preloader
        setTimeout(() => {
            el.classList.add('revealed');
        }, 2800 + (Array.from(splitElements).indexOf(el) * 200));
    });
}

// ==========================================
// 13. MORPHING BLOBS
// ==========================================
function initMorphingBlobs() {
    // Skip blobs on mobile (expensive animation)
    if (isMobile || isReducedMotion) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Add morphing blobs to hero
    const blobContainer = document.createElement('div');
    blobContainer.className = 'morphing-blobs';
    blobContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;';

    for (let i = 0; i < 3; i++) {
        const blob = document.createElement('div');
        blob.className = 'morphing-blob';
        blob.style.cssText = `
            position: absolute;
            ${i === 0 ? 'top: -20%; left: -10%;' : ''}
            ${i === 1 ? 'top: 30%; right: -15%;' : ''}
            ${i === 2 ? 'bottom: -10%; left: 30%;' : ''}
        `;
        blobContainer.appendChild(blob);
    }

    hero.insertBefore(blobContainer, hero.firstChild);
}

// ==========================================
// 14. IMAGE REVEAL MASKS
// ==========================================
function initImageReveals() {
    const galleryItems = document.querySelectorAll('.gallery-image');

    galleryItems.forEach((item, index) => {
        item.classList.add('image-reveal');
        // Alternate between reveal types
        if (index % 3 === 1) item.classList.add('diagonal');
        if (index % 3 === 2) item.classList.add('circle');

        ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            onEnter: () => item.classList.add('revealed'),
            once: true
        });
    });
}

// ==========================================
// 15. STAGGERED 3D CARD REVEALS
// ==========================================
function initCard3DReveals() {
    const featureCards = document.querySelectorAll('.feature-card');
    const expertiseCards = document.querySelectorAll('.expertise-card');

    [...featureCards, ...expertiseCards].forEach((card, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'card-3d-reveal';
        card.parentNode.insertBefore(wrapper, card);
        wrapper.appendChild(card);
        card.classList.add('card-inner');
        card.style.setProperty('--card-index', index % 4);

        ScrollTrigger.create({
            trigger: wrapper,
            start: 'top 85%',
            onEnter: () => wrapper.classList.add('revealed'),
            once: true
        });
    });
}

// Wait for DOM and GSAP
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
    initEnhancements();
}

// ==========================================
// LEGAL MODALS
// ==========================================
function initLegalModals() {
    // Close modal on button click
    document.querySelectorAll('.legal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.legal-modal');
            modal.classList.remove('active');
            history.pushState('', document.title, window.location.pathname);
        });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.legal-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                history.pushState('', document.title, window.location.pathname);
            }
        });
    });

    // Open modal from data-modal links
    document.querySelectorAll('[data-modal]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('href').replace('#', '');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.legal-modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// Add to init
document.addEventListener('DOMContentLoaded', initLegalModals);
