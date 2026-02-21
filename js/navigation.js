// ═══════════════════════════════════════════════════════════
//   ULTRA PREMIUM NAVIGATION SYSTEM - JavaScript
// ═══════════════════════════════════════════════════════════

export function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const nav = document.getElementById('premium-nav');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = hamburger.classList.contains('active');

        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';

        // Update aria attribute
        hamburger.setAttribute('aria-expanded', !isOpen);
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Event listeners
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();

            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    setTimeout(() => {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            }
        });
    });

    // Navbar scroll effect
    let lastScrollY = 0;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add scrolled class for styling
        if (nav) {
            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        lastScrollY = currentScrollY;
    }

    // Active section detection
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

    // Single throttled scroll handler for both nav styling and active section
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

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Initial state
    handleScroll();
    updateActiveLink();

    console.log('✨ Premium Navigation initialized');
}
