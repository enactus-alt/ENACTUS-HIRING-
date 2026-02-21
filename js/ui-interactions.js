export default function initUI() {
    // ═══════════════════════════════════════════════════════════
    // SCROLL REVEAL (IntersectionObserver — zero dependencies)
    // ═══════════════════════════════════════════════════════════
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all revealable elements
    document.querySelectorAll('.glass-card, .section-title, .project-item, .reveal').forEach(el => {
        observer.observe(el);
    });

    // ═══════════════════════════════════════════════════════════
    // SMOOTH ANCHOR SCROLL (pure JS, no Lenis)
    // ═══════════════════════════════════════════════════════════
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

    console.log('✅ UI initialized (lightweight)');
}
