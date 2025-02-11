(function(html) {
    'use strict';

    /* blog header manager
     * -------------------------------------------------- */
    const ssBlogManager = function() {
        const BlogTopics = {
            'pdf-extractor': {
                title: 'Building a PDF Table Extractor',
                subtitle: 'Using Azure Document Intelligence for Automated Table Extraction',
                badges: ['Python', 'Azure','Docker']
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
        const blogContents = document.querySelectorAll('.blog-content');

        if (!(headerTitle && headerSubtitle && headerBadges)) return;

        // Add back button
        const backButton = document.createElement('button');
        backButton.className = 'back-button btn btn-outline-primary position-fixed';
        backButton.style.cssText = 'top: 20px; left: 20px; z-index: 1000;';
        backButton.innerHTML = '<i class="fas fa-arrow-left me-2"></i>Back';
        backButton.addEventListener('click', () => {
            window.history.back();
        });
        document.body.appendChild(backButton);

        // Add copy functionality to code blocks
        function initializeCopyButtons() {
            const codeBlocks = document.querySelectorAll('.card-body code');
            codeBlocks.forEach(codeBlock => {
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-btn btn btn-sm btn-outline-secondary position-absolute d-flex align-items-center';
                copyButton.style.cssText = 'top: 5px; right: 5px; gap: 4px;';
                copyButton.innerHTML = '<i class="fas fa-copy"></i><span>Copy</span>';
                copyButton.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(codeBlock.textContent);
                        copyButton.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i><span>Copy</span>';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                });
                codeBlock.parentElement.style.position = 'relative';
                codeBlock.parentElement.appendChild(copyButton);
            });
        }

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

        function updateContent(topicId) {
            blogContents.forEach(content => {
                content.style.display = 'none';
            });
            
            const selectedContent = document.getElementById(`${topicId}-content`);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                // Reinitialize AOS for new content
                AOS.refresh();
                // Reinitialize copy buttons for new content
                initializeCopyButtons();
                // Scroll to top of content
                selectedContent.scrollIntoView({ behavior: 'smooth' });
            }
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
                const topicId = link.getAttribute('href').replace('#', '');
                
                // Update URL with the section hash without page reload
                window.history.pushState({}, '', `${window.location.pathname}#${topicId}`);
                
                updateHeader(topicId);
                updateContent(topicId);
                updateActiveCard(link);
            });
        });

        // Handle direct navigation to sections via URL hash
        window.addEventListener('load', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && BlogTopics[hash]) {
                updateHeader(hash);
                updateContent(hash);
                const link = document.querySelector(`a[href="#${hash}"]`);
                if (link) {
                    updateActiveCard(link);
                }
            }
            // Initialize copy buttons on page load
            initializeCopyButtons();
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
