export default function initMission() {
    const cards = document.querySelectorAll('.mission-card');
    if (cards.length === 0) return;

    // Simple scroll reveal via IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach((card, index) => {
        // Stagger the reveal with CSS transition-delay
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    console.log('✅ Mission section initialized');
}
