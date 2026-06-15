/* ========================================
   DOTEX Portfolio - Premium JavaScript
   Mercy Adedamola (Dotex)
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // LOADING SCREEN - FIXED
    // ========================================
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    let loadProgress = 0;
    let loadingComplete = false;

    function finishLoading() {
        if (loadingComplete) return;
        loadingComplete = true;

        // Force to 100%
        loadingBar.style.width = '100%';
        loadingPercentage.textContent = '100%';

        // Small delay for visual completion, then hide
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            // Initialize all animations after loading
            initAll();
        }, 400);
    }

    function simulateLoading() {
        const interval = setInterval(() => {
            loadProgress += Math.random() * 18 + 7;
            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(interval);
                finishLoading();
            }
            if (loadingBar) loadingBar.style.width = loadProgress + '%';
            if (loadingPercentage) loadingPercentage.textContent = Math.floor(loadProgress) + '%';
        }, 80);
    }

    // Fallback: always finish loading after max 3 seconds regardless
    const fallbackTimeout = setTimeout(() => {
        finishLoading();
    }, 3000);

    // Try to use window load event, but fallback is our safety net
    if (document.readyState === 'complete') {
        simulateLoading();
    } else {
        window.addEventListener('load', () => {
            clearTimeout(fallbackTimeout);
            simulateLoading();
        });
    }

    // Also start simulation on DOMContentLoaded as backup
    document.addEventListener('DOMContentLoaded', () => {
        if (!loadingComplete) {
            simulateLoading();
        }
    });

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-card, .testimonial-card, .swiper-button-prev, .swiper-button-next');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });

        document.addEventListener('mousedown', () => cursorOutline.classList.add('click'));
        document.addEventListener('mouseup', () => cursorOutline.classList.remove('click'));
    }

    // ========================================
    // SCROLL PROGRESS
    // ========================================
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ========================================
    // NAVBAR
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    function updateNavbar() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            if (navLinks) navLinks.classList.toggle('mobile-open');
            document.body.style.overflow = navLinks && navLinks.classList.contains('mobile-open') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('mobile-open');
            document.body.style.overflow = '';
        });
    });

    // Active section indicator
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ========================================
    // HERO PARTICLES
    // ========================================
    function createParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 30 + 10;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    }

    // ========================================
    // MAGNETIC BUTTONS
    // ========================================
    function initMagneticButtons() {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        if (window.matchMedia('(pointer: coarse)').matches) return;

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('about-stats')) {
                        animateCounters();
                    }

                    // Trigger skill bars
                    if (entry.target.classList.contains('about-skills')) {
                        animateSkillBars();
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.section-header, .about-text, .about-skills, .service-card, .portfolio-card, .contact-info, .contact-form-wrapper').forEach(el => {
            observer.observe(el);
        });
    }

    // ========================================
    // ANIMATED COUNTERS
    // ========================================
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);
                counter.textContent = current + (target === 100 ? '%' : '+');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (target === 100 ? '%' : '+');
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // ========================================
    // ANIMATED SKILL BARS
    // ========================================
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;
        skillsAnimated = true;

        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 150);
        });
    }

    // ========================================
    // SWIPER SLIDERS
    // ========================================
    function initSwipers() {
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper not loaded yet, retrying...');
            setTimeout(initSwipers, 500);
            return;
        }

        // Recent Projects Swiper
        const recentSwiperEl = document.querySelector('.recent-projects-swiper');
        if (recentSwiperEl) {
            new Swiper('.recent-projects-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                pagination: {
                    el: '.recent-projects-swiper .swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.recent-projects-swiper .swiper-button-next',
                    prevEl: '.recent-projects-swiper .swiper-button-prev'
                },
                effect: 'slide',
                speed: 800
            });
        }

        // Testimonials Swiper
        const testimonialsSwiperEl = document.querySelector('.testimonials-swiper');
        if (testimonialsSwiperEl) {
            new Swiper('.testimonials-swiper', {
                slidesPerView: 1,
                spaceBetween: 24,
                loop: true,
                autoplay: {
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                pagination: {
                    el: '.testimonials-swiper .swiper-pagination',
                    clickable: true
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 24
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                },
                speed: 700
            });
        }
    }

    // ========================================
    // HERO ANIMATIONS
    // ========================================
    function initHeroAnimations() {
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        const headlineLines = document.querySelectorAll('.headline-line');

        if (heroText) heroText.classList.add('visible');
        if (heroImage) setTimeout(() => heroImage.classList.add('visible'), 300);

        headlineLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, 400 + (index * 150));
        });
    }

    // ========================================
    // BACK TO TOP
    // ========================================
    const backToTop = document.getElementById('backToTop');

    function toggleBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (submitBtn) submitBtn.classList.add('loading');

            // Simulate form submission
            setTimeout(() => {
                if (submitBtn) submitBtn.classList.remove('loading');
                if (submitBtn) submitBtn.classList.add('success');

                setTimeout(() => {
                    if (submitBtn) submitBtn.classList.remove('success');
                    contactForm.reset();
                }, 2000);
            }, 2000);
        });
    }

    // ========================================
    // PARALLAX EFFECTS
    // ========================================
    function initParallax() {
        const heroImage = document.querySelector('.hero-image-wrapper');

        if (!heroImage || window.matchMedia('(pointer: coarse)').matches) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.15;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        }, { passive: true });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // STAGGER ANIMATION FOR GRIDS
    // ========================================
    function initStaggerAnimations() {
        const grids = document.querySelectorAll('.services-grid, .portfolio-grid');

        grids.forEach(grid => {
            grid.classList.add('stagger-children');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        grids.forEach(grid => observer.observe(grid));
    }

    // ========================================
    // TYPING EFFECT
    // ========================================
    function initTypingEffect() {
        const tagline = document.querySelector('.tagline-text');
        if (!tagline) return;

        const text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.opacity = '1';

        let i = 0;
        function type() {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        setTimeout(type, 1000);
    }

    // ========================================
    // MOUSE MOVE PARALLAX FOR HERO SHAPES
    // ========================================
    function initMouseParallax() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const shapes = document.querySelectorAll('.floating-shape');
        const heroSection = document.querySelector('.hero');

        if (!heroSection || shapes.length === 0) return;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 15;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // ========================================
    // SERVICE CARD HOVER GLOW
    // ========================================
    function initServiceCardGlow() {
        const cards = document.querySelectorAll('.service-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const glow = card.querySelector('.service-glow');
                if (glow) {
                    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(220, 38, 38, 0.08) 0%, transparent 60%)`;
                }
            });
        });
    }

    // ========================================
    // INITIALIZE ALL
    // ========================================
    function initAll() {
        createParticles();
        initHeroAnimations();
        initSwipers();
        initScrollReveal();
        initMagneticButtons();
        initParallax();
        initStaggerAnimations();
        initTypingEffect();
        initMouseParallax();
        initServiceCardGlow();
    }

})();