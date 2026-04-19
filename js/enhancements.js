/* ==========================================
   MAISON D'OMBRE - ENHANCEMENTS 2025
   Premium JavaScript Features
   ========================================== */

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

    window.addEventListener('scroll', updateProgress, { passive: true });
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

    // Mouse parallax on floating elements
    document.addEventListener('mousemove', (e) => {
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

    console.log('✨ Maison d\'Ombre - Premium Enhancements Loaded');
}

// Wait for DOM and GSAP
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
    initEnhancements();
}
