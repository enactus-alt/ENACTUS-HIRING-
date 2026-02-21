export default function initTeam() {
    const container = document.getElementById('team-container');
    const avatars = document.querySelectorAll('.team-avatar');

    if (!container || avatars.length === 0) return;

    // Scroll reveal for each avatar with stagger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    avatars.forEach((avatar, index) => {
        avatar.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(avatar);
    });

    console.log('✅ Team section initialized');
}
