
const config = {
    animations: {
        scrollRevealDistance: '50px',
        scrollRevealDuration: 600,
        scrollRevealDelay: 100,
        parallaxIntensity: 0.5,
        typingSpeed: 100,
        typingDelay: 2000
    },
    
    // Scroll settings
    scroll: {
        smoothScrollDuration: 800,
        progressBarSelector: '.scroll-progress-bar',
        navOffset: 100
    },
    
    // Form settings
    form: {
        submitDelay: 2000,
        successMessage: 'Message envoyé avec succès !',
        errorMessage: 'Une erreur est survenue. Veuillez réessayer.'
    }
};

const utils = {
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get scroll percentage
    getScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    },

    // Smooth scroll to element
    smoothScrollTo(target, duration = config.scroll.smoothScrollDuration) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - config.scroll.navOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
};

class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector(config.scroll.progressBarSelector);
        this.init();
    }

    init() {
        if (!this.progressBar) return;
        
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateProgress();
        }, 10));
    }

    updateProgress() {
        const scrollPercentage = utils.getScrollPercentage();
        this.progressBar.style.width = `${scrollPercentage}%`;
    }
}

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.activeSection = '';
        this.init();
    }

    init() {
        if (!this.navbar) return;

        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    utils.smoothScrollTo(targetElement);
                    this.setActiveLink(targetId);
                }
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateActiveNavigation();
        }, 100));

        // Initial active state
        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPos = window.pageYOffset + config.scroll.navOffset;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current !== this.activeSection) {
            this.activeSection = current;
            this.setActiveLink(`#${current}`);
        }
    }

    setActiveLink(targetId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
}

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.project-card, .skill-category');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if (!this.elements.length) return;

        // Set initial state
        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity ${config.animations.scrollRevealDuration}ms ease, transform ${config.animations.scrollRevealDuration}ms ease`;
        });

        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all elements
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    revealElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        this.observer.unobserve(element);
    }
}

class ParallaxEffect {
    constructor() {
        this.parallaxElement = document.querySelector('.animated-bg');
        this.init();
    }

    init() {
        if (!this.parallaxElement) return;

        window.addEventListener('scroll', utils.throttle(() => {
            this.updateParallax();
        }, 16)); 
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const speed = scrolled * config.animations.parallaxIntensity;
        this.parallaxElement.style.transform = `translateY(${speed}px)`;
    }
}
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitButton = null;
        this.originalButtonText = '';
        this.init();
    }

    init() {
        if (!this.form) return;

        this.submitButton = this.form.querySelector('button[type="submit"]');
        if (this.submitButton) {
            this.originalButtonText = this.submitButton.innerHTML;
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        if (!this.submitButton) return;

        // Disable button and show loading state
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        try {
            // Simulate form submission
            await this.simulateSubmission();
            
            // Show success state
            this.submitButton.innerHTML = '<i class="fas fa-check"></i> ' + config.form.successMessage;
            
            // Reset form after delay
            setTimeout(() => {
                this.resetForm();
            }, config.form.submitDelay);

        } catch (error) {
            // Show error state
            this.submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + config.form.errorMessage;
            
            // Reset button after delay
            setTimeout(() => {
                this.resetButton();
            }, config.form.submitDelay);
        }
    }

    simulateSubmission() {
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                // Simulate success (you can change this to test error handling)
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    resolve();
                } else {
                    reject(new Error('Simulation error'));
                }
            }, config.form.submitDelay);
        });
    }

    resetForm() {
        this.form.reset();
        this.resetButton();
    }

    resetButton() {
        if (this.submitButton) {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = this.originalButtonText;
        }
    }
}

class TypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: options.typeSpeed || config.animations.typingSpeed,
            deleteSpeed: options.deleteSpeed || 50,
            delayBetween: options.delayBetween || config.animations.typingDelay,
            loop: options.loop !== false
        };
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element || !this.texts.length) return;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.options.delayBetween;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            
            if (!this.options.loop && this.textIndex === 0) {
                return; 
            }
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.init();
    }

    init() {
        if (window.location.search.includes('debug=true')) {
            this.createDebugPanel();
            this.startMonitoring();
        }
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
        `;
        document.body.appendChild(panel);
        this.debugPanel = panel;
    }

    startMonitoring() {
        const monitor = () => {
            const currentTime = performance.now();
            this.frameCount++;

            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;

                if (this.debugPanel) {
                    this.debugPanel.innerHTML = `
                        FPS: ${this.fps}<br>
                        Memory: ${this.getMemoryUsage()}<br>
                        Scroll: ${Math.round(utils.getScrollPercentage())}%
                    `;
                }
            }

            requestAnimationFrame(monitor);
        };

        requestAnimationFrame(monitor);
    }

    getMemoryUsage() {
        if (performance.memory) {
            return `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB`;
        }
        return 'N/A';
    }
}

class ProjectLoader {
    constructor() {
        this.projectsContainer = document.querySelector('.projects-grid');
        this.projects = [];
        this.init();
    }

    async init() {
        if (!this.projectsContainer) return;
        
        try {
            await this.loadProjects();
            this.renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    async loadProjects() {
        try {
            console.log('Attempting to fetch json/projets.json');
            const response = await fetch('json/projets.json');
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.projects = await response.json();
            console.log('Projects loaded:', this.projects.length);
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    renderProjects() {
        console.log('Rendering projects:', this.projects.length);
        if (!this.projects.length) {
            console.log('No projects to render');
            return;
        }

        this.projectsContainer.innerHTML = '';

        this.projects.forEach((project, index) => {
            console.log('Creating card for:', project.name);
            const projectCard = this.createProjectCard(project, index);
            this.projectsContainer.appendChild(projectCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const technologies = project.language ? project.language.split('/') : [];
        const techTags = technologies.map(tech => 
            `<span class="tech-tag">${tech.trim()}</span>`
        ).join('');

        const githubLink = project.depot ? 
            `<a href="${project.depot}" target="_blank" rel="noopener noreferrer" class="project-link">
                <i class="fab fa-github"></i>
                Code
            </a>` : '';

        const reportLink = project.rapport ? 
            `<a href="${project.rapport}" target="_blank" rel="noopener noreferrer" class="project-link">
                <i class="fas fa-file-pdf"></i>
                Rapport
            </a>` : '';

        card.innerHTML = `
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">
                ${project.cahierDesCharges || 'Description non disponible'}
            </p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links">
                ${reportLink}
                ${githubLink}
            </div>
        `;

        return card;
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
    }

    createThemeToggle() {
        // Only create toggle if explicitly needed
        if (window.location.search.includes('theme-toggle=true')) {
            const toggle = document.createElement('button');
            toggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            toggle.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                cursor: pointer;
                font-size: 20px;
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            document.body.appendChild(toggle);
            this.themeToggle = toggle;
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        if (this.themeToggle) {
            this.themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

class PortfolioApp {
    constructor() {
        this.components = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize core components
            this.components.push(new ScrollProgress());
            this.components.push(new Navigation());
            this.components.push(new ProjectLoader());
            this.components.push(new ScrollReveal());
            this.components.push(new ParallaxEffect());
            this.components.push(new ContactForm());
            this.components.push(new ThemeManager());
            this.components.push(new PerformanceMonitor());

            // Initialize typing effect if element exists
            const typingElement = document.querySelector('.typing-text');
            if (typingElement) {
                const texts = [
                    'Développeur Full-Stack',
                    'Créateur d\'Expériences',
                    'Passionné de Code',
                    'Innovateur Digital'
                ];
                new TypingEffect(typingElement, texts);
            }

            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }

    destroy() {
        this.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
    }
}
const portfolio = new PortfolioApp();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, utils, config };
}