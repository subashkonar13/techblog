class MarkdownBlogParser {
    constructor() {
        this.topics = {};
        this.currentTopic = null;
    }

    async loadContent() {
        try {
            const response = await fetch('content/blog-topics.md');
            const markdown = await response.text();
            this.parseMarkdown(markdown);
            this.generateHTML();
        } catch (error) {
            console.error('Failed to load markdown content:', error);
        }
    }

    parseMarkdown(markdown) {
        const lines = markdown.split('\n');
        let currentSection = null;
        let currentContent = [];

        for (let line of lines) {
            // Topic header (## topic-id)
            if (line.startsWith('## ') && !line.includes('#')) {
                if (this.currentTopic) {
                    this.topics[this.currentTopic].content = currentContent.join('\n');
                }
                
                this.currentTopic = line.substring(3).trim();
                this.topics[this.currentTopic] = {
                    id: this.currentTopic,
                    content: '',
                    title: '',
                    subtitle: '',
                    badges: []
                };
                currentContent = [];
                continue;
            }

            // Metadata parsing
            if (line.startsWith('**title:**')) {
                this.topics[this.currentTopic].title = line.substring(10).trim();
                continue;
            }
            if (line.startsWith('**subtitle:**')) {
                this.topics[this.currentTopic].subtitle = line.substring(13).trim();
                continue;
            }
            if (line.startsWith('**badges:**')) {
                this.topics[this.currentTopic].badges = line.substring(11).trim().split(',');
                continue;
            }

            // Content
            if (this.currentTopic && !line.startsWith('**')) {
                currentContent.push(line);
            }
        }

        // Save last topic
        if (this.currentTopic) {
            this.topics[this.currentTopic].content = currentContent.join('\n');
        }
    }

    generateHTML() {
        this.generateTopicCards();
        this.generateArticles();
        this.updateBlogTopics();
    }

    generateTopicCards() {
        const container = document.querySelector('.topics-section .row');
        if (!container) return;

        container.innerHTML = '';
        
        Object.values(this.topics).forEach(topic => {
            const cardHTML = `
                <div class="col-md-3">
                    <a href="#${topic.id}" class="topic-link">
                        <div class="card topic-card">
                            <div class="card-body">
                                <h5 class="card-title">${topic.title}</h5>
                                <p class="card-text">${topic.subtitle}</p>
                                ${topic.badges.map(badge => 
                                    `<span class="badge bg-${this.getBadgeColor(badge.trim())}">${badge.trim()}</span>`
                                ).join(' ')}
                            </div>
                        </div>
                    </a>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    generateArticles() {
        const mainContainer = document.querySelector('main.container');
        if (!mainContainer) return;

        // Clear existing articles except references
        const existingArticles = mainContainer.querySelectorAll('article:not(#references-content)');
        existingArticles.forEach(article => article.remove());

        Object.values(this.topics).forEach(topic => {
            const articleHTML = this.markdownToHTML(topic.content, topic.id);
            const articleElement = document.createElement('article');
            articleElement.id = `${topic.id}-content`;
            articleElement.className = 'blog-content';
            articleElement.style.display = 'none';
            articleElement.innerHTML = articleHTML;
            
            // Insert before references
            const referencesArticle = document.getElementById('references-content');
            mainContainer.insertBefore(articleElement, referencesArticle);
        });
    }

    markdownToHTML(markdown, topicId) {
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
            
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                return `
                    <div class="card card-body">
                        <pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>
                        <button class="btn btn-outline-primary btn-sm copy-btn mt-2">
                            <i class="fas fa-copy me-1"></i>Copy
                        </button>
                    </div>
                `;
            })
            
            // Architecture diagrams
            .replace(/```architecture\n(.*?)\n```/g, (match, content) => {
                const steps = content.split('→').map(step => step.trim());
                return `
                    <div class="architecture-container">
                        <h3 class="text-center mb-4">Architecture Overview</h3>
                        ${steps.map(step => `<div class="architecture-step text-center">${step}</div>`).join('')}
                    </div>
                `;
            })
            
            // Mermaid diagrams
            .replace(/```mermaid\n([\s\S]*?)```/g, '<div class="mermaid">$1</div>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            
            // Lists
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
            
            // Paragraphs
            .replace(/^(?!<[h|l|d])(.*$)/gm, '<p>$1</p>')
            
            // Clean up empty paragraphs
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<[^>]+>)<\/p>/g, '$1');

        // Wrap in sections
        return `<section class="article-section" data-aos="fade-up">${html}</section>`;
    }

    updateBlogTopics() {
        // Update global BlogTopics object for existing functionality
        window.BlogTopics = {};
        Object.values(this.topics).forEach(topic => {
            window.BlogTopics[topic.id] = {
                title: topic.title,
                subtitle: topic.subtitle,
                badges: topic.badges
            };
        });
    }

    getBadgeColor(badge) {
        const colorMap = {
            'Python': 'primary',
            'Azure': 'secondary',
            'Git': 'success',
            'Jupyter': 'warning',
            'Databricks': 'info',
            'Workflow': 'dark',
            'Functions': 'primary'
        };
        return colorMap[badge] || 'secondary';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const parser = new MarkdownBlogParser();
    parser.loadContent();
});
