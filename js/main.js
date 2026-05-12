/* 
    CYBERPORTFOLIO 2026 - MAIN JS
    Handles: Loader, Navbar, GSAP Init
*/

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initGSAP();
    loadProjects();
});

// Load Projects Dinamicamente
async function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.desc}</p>
                    <ul class="project-tech">
                        ${project.tech.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                    <div class="project-links">
                        <a href="${project.github}" target="_blank"><i class="fab fa-github"></i></a>
                        <a href="${project.demo}" target="_blank"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Refresh ScrollTrigger since new elements were added
        ScrollTrigger.refresh();
    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
    }
}

// Loader Animation
function initLoader() {
    const loader = document.getElementById('loader');
    const progressFill = document.querySelector('.progress-fill');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        loader.style.display = 'none';
                        animateHero();
                    }
                });
            }, 500);
        }
    }, 150);
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-item');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active Link based on scroll
        let current = "";
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Simple toggle for now, can be improved with GSAP
        if (navList.style.display === 'flex') {
            navList.style.display = 'none';
        } else {
            navList.style.display = 'flex';
            navList.style.flexDirection = 'column';
            navList.style.position = 'absolute';
            navList.style.top = '100%';
            navList.style.left = '0';
            navList.style.width = '100%';
            navList.style.background = 'rgba(5, 5, 5, 0.95)';
            navList.style.padding = '2rem';
        }
    });
}

// GSAP Animations
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section.querySelectorAll('.section-header, .about-grid, .skills-grid, .projects-grid, .dashboard-grid, .timeline-item, .contact-wrapper'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    });

    // Skill bars animation
    gsap.utils.toArray('.fill').forEach(bar => {
        gsap.from(bar, {
            scrollTrigger: {
                trigger: bar,
                start: "top 90%"
            },
            width: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    });
}

function animateHero() {
    const tl = gsap.timeline();
    
    tl.from('.sub-headline', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    })
    .from('.headline', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.5")
    .from('.hero-description', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6")
    .from('.hero-cta .btn', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.6")
    .from('.scroll-indicator', {
        opacity: 0,
        duration: 1
    }, "-=0.2");
}