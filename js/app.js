// ═══════════════════════════════════════════════════════════
//   ENACTUS ISET DJERBA — Lightweight App (No Dependencies)
//   All modules bundled into one file to avoid CORS issues
//   when opening file:// directly.
// ═══════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────
    //  NAVIGATION
    // ─────────────────────────────────────────────────────────
    function initNavigation() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const nav = document.getElementById('premium-nav');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

        function toggleMobileMenu() {
            const isOpen = hamburger.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = isOpen ? '' : 'hidden';
            hamburger.setAttribute('aria-expanded', !isOpen);
        }

        function closeMobileMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }

        if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
        if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        setTimeout(() => {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                }
            });
        });

        function handleScroll() {
            if (nav) {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        }

        function updateActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 150;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    document.querySelectorAll(`.nav-link[data-section="${sectionId}"], .mobile-link[data-section="${sectionId}"]`)
                        .forEach(link => link.classList.add('active'));
                }
            });
        }

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                    updateActiveLink();
                    scrollTimeout = null;
                }, 30);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        handleScroll();
        updateActiveLink();
    }

    // ─────────────────────────────────────────────────────────
    //  UI — Scroll Reveal & Smooth Anchors
    // ─────────────────────────────────────────────────────────
    function initUI() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.glass-card, .section-title, .project-item, .reveal, .highlight-item').forEach(el => {
            observer.observe(el);
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ─────────────────────────────────────────────────────────
    //  MISSION — Staggered Card Reveal
    // ─────────────────────────────────────────────────────────
    function initMission() {
        const cards = document.querySelectorAll('.mission-card');
        if (cards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.15 });

        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
            observer.observe(card);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  TEAM — Staggered Avatar Reveal
    // ─────────────────────────────────────────────────────────
    function initTeam() {
        const avatars = document.querySelectorAll('.team-avatar');
        if (avatars.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        avatars.forEach((avatar, index) => {
            avatar.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(avatar);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  PROJECTS — Reveal + Before/After Slider
    // ─────────────────────────────────────────────────────────
    function initProjects() {
        const projectItems = document.querySelectorAll('.project-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        projectItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(item);
        });

        // Before/After Slider — Pure vanilla JS
        document.querySelectorAll('.ba-slider').forEach(slider => {
            const handle = slider.querySelector('.ba-handle');
            const beforeImg = slider.querySelector('.ba-before');
            if (!handle || !beforeImg) return;

            let isDragging = false;

            const updateSlider = (x) => {
                const rect = slider.getBoundingClientRect();
                let percent = ((x - rect.left) / rect.width) * 100;
                percent = Math.max(0, Math.min(100, percent));
                beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
                handle.style.left = `${percent}%`;
            };

            slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
            window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
            window.addEventListener('mouseup', () => { isDragging = false; });

            slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });
            window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, { passive: true });
            window.addEventListener('touchend', () => { isDragging = false; });
        });
    }

    // ─────────────────────────────────────────────────────────
    //  BOOT
    // ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        // Preloader fade-out
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => { preloader.style.display = 'none'; }, 500);
            }, 600);
        }

        initNavigation();
        initUI();
        initMission();
        initTeam();
        initProjects();

        console.log('✅ Enactus site ready — zero heavy dependencies');
    });

})();
