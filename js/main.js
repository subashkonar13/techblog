// Module pattern for better organization
const BlogApp = {
    init() {
        this.initializeAOS();
        this.setupPreloader();
        this.setupBackToTop();
        this.setupTopicInteractions();
        this.setupLazyLoading();
    },

    initializeAOS() {
        AOS.init({
            duration: 800,
            once: true,
            disable: 'mobile'
        });
    },

    setupPreloader() {
        const preloader = document.querySelector('.preloader');
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 500);
        });
    },

    setupBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        const scrollThreshold = 20;

        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                backToTop.style.display = 
                    window.scrollY > scrollThreshold ? 'block' : 'none';
            });
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    setupTopicInteractions() {
        const topicCards = document.querySelectorAll('.topic-card');
        
        topicCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = card.closest('a').getAttribute('href');
                const targetSection = document.querySelector(targetId);

                // Remove active state from all cards
                topicCards.forEach(c => c.classList.remove('active'));
                
                // Add active state to clicked card
                card.classList.add('active');

                // Smooth scroll to content
                targetSection?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Show content with animation
                if (targetSection) {
                    targetSection.classList.add('fade-in');
                    this.updateURL(targetId);
                }
            });
        });
    },

    setupLazyLoading() {
        // Lazy load images and iframes
        const lazyElements = document.querySelectorAll('[data-src]');
        
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                    lazyLoadObserver.unobserve(element);
                }
            });
        });

        lazyElements.forEach(element => lazyLoadObserver.observe(element));
    },

    updateURL(hash) {
        history.pushState(null, null, hash);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => BlogApp.init());
