(function(html) {
    'use strict';

    /* blog header manager
     * -------------------------------------------------- */
    const ssBlogManager = function() {
        const BlogTopics = {
            'pdf-extractor': {
                title: 'Building a PDF Table Extractor',
                subtitle: 'Using Azure Document Intelligence for Automated Table Extraction',
                badges: ['Python', 'Azure']
            },
            'coming-soon-1': {
                title: 'Machine Learning Pipeline',
                subtitle: 'Building ML Pipelines with Azure ML',
                badges: ['Python', 'ML']
            },
            'coming-soon-2': {
                title: 'Cloud Architecture',
                subtitle: 'Designing Scalable Cloud Solutions',
                badges: ['Azure', 'Architecture']
            }
        };

        const headerTitle = document.getElementById('blogTitle');
        const headerSubtitle = document.getElementById('blogSubtitle');
        const headerBadges = document.getElementById('blogBadges');
        const topicLinks = document.querySelectorAll('.topic-link');

        if (!(headerTitle && headerSubtitle && headerBadges)) return;

        function updateHeader(topicId) {
            const topic = BlogTopics[topicId];
            if (!topic) return;

            // Add fade-out animation
            headerTitle.style.opacity = '0';
            headerSubtitle.style.opacity = '0';
            headerBadges.style.opacity = '0';

            setTimeout(() => {
                // Update content
                headerTitle.textContent = topic.title;
                headerSubtitle.textContent = topic.subtitle;
                headerBadges.innerHTML = topic.badges
                    .map(badge => `<span class="badge bg-${getBadgeColor(badge)}">${badge}</span>`)
                    .join(' ');

                // Add fade-in animation
                headerTitle.style.opacity = '1';
                headerSubtitle.style.opacity = '1';
                headerBadges.style.opacity = '1';
            }, 300);
        }

        function updateActiveCard(clickedLink) {
            topicLinks.forEach(link => {
                link.querySelector('.topic-card').classList.remove('active');
            });
            clickedLink.querySelector('.topic-card').classList.add('active');
        }

        function getBadgeColor(badge) {
            const colors = {
                'Python': 'primary',
                'Azure': 'info',
                'ML': 'success',
                'Architecture': 'warning'
            };
            return colors[badge] || 'secondary';
        }

        // Initialize event listeners
        topicLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const topicId = link.dataset.topic;
                updateHeader(topicId);
                updateActiveCard(link);
            });
        });
    };

    /* Initialize
     * ------------------------------------------------------ */
    (function ssBlogInit() {
        // Only initialize if we're on the blog page
        if (document.querySelector('.blog-header')) {
            ssBlogManager();
        }
    })();

})(document.documentElement);
