// ========== BACKGROUND ANIMATION (PARTICLES) ==========
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100;
let mouseX = 0;
let mouseY = 0;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Particle class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            this.x -= dx * 0.002;
            this.y -= dy * 0.002;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'dark' ? '255, 255, 255' : '108, 92, 231';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${this.opacity * 0.3})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

initParticles();

function drawLines() {
    const theme = document.documentElement.getAttribute('data-theme');
    const color = theme === 'dark' ? '255, 255, 255' : '108, 92, 231';
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${color}, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ========== DARK/LIGHT MODE TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    initParticles();
});

// ========== MOBILE NAVIGATION ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// ========== TYPING EFFECT ==========
const typedElement = document.getElementById('typed');
const words = ['Electronics Engineer', 'Electronics Technician', 'Safety Officer 2', 'Project Developer', 'AI Enthusiast', 'Tech Innovator', 'Sound Technician', 'Leader'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// ========== PROJECT DATA ==========
const projectsData = {
    soft1: {
        title: 'AZ Techworx Business Website',
        description: 'AZ Techworx is composed of Licensed Electronics and Communications Engineers (ECEs) providing professional services in PCB layout and fabrication, circuit design, IoT and embedded programming, AI-driven solutions, custom audio and signal processing, project consultation, and ECE review support.',
        type: 'expand',
        videoUrl: 'assets/videos/aztech.mp4',
        tech: ['HTML', 'CSS', 'JS', 'Zapier'],
        liveLink: 'https://aztechworx.xyz/',
        codeLink: 'https://github.com/aztechworx/AZ-Techworx-Website'
    },
    soft2: {
        title: 'HeatWatch',
        description: 'HeatWatch Rizal is an ML-powered GIS heat risk monitoring system that forecasts temperatures 6 hours ahead using three machine learning models (95.6% accuracy), visualizes real-time heat danger across 17 locations on an interactive map, and sends automated email alerts with predictive advisories.',
        type: 'expand',
        videoUrl: 'assets/videos/hw.mp4',
        tech: ['Python', 'Flask', 'PostgreSQL', 'SendGrid', 'Supabase'],
        liveLink: 'https://heatwatch-rizal-production.up.railway.app/',
        codeLink: 'https://github.com/brian-batalon/heatwatch-rizal'
    },
    soft3: {
        title: 'GradeMaster',
        description: 'GradeMaster — a multi-user grading system with customizable rubrics, auto-computed grades, attendance tracking, email reports, XLSX export, and a mobile-friendly live demo. Built with Flask, Supabase PostgreSQL, and SendGrid.',
        type: 'expand',
        videoUrl: 'assets/videos/gm.mp4',
        tech: ['Supabase', 'Python', 'Flask', 'PostgreSQL', 'SendGrid'],
        liveLink: 'https://grademaster-production.up.railway.app/login?next=%2F',
        codeLink: 'https://github.com/brian-batalon/grademaster'
    },
    soft4: {
        title: 'OTMSR Portal',
        description: 'OTMSR Portal — A biomedical equipment service management system for One Top Medical Systems Resources. Streamlines field operations with role-based dashboards, task scheduling via calendar, service report submissions, real-time team chat, document management, and data visualization with export capabilities.',
        type: 'expand',
        videoUrl: 'assets/videos/otmsr.mp4',
        tech: ['React.js', 'Supabase', 'Recharts', 'Vercel'],
        liveLink: 'https://otmsr-portal.vercel.app',
        codeLink: 'https://github.com/brian-batalon/otmsr-portal'
    },
    pcb1: {
        title: 'Arduino-based Medicine Reminder',
        description: 'This Arduino Nano-based medicine reminder uses an RTC DS1302 module for precise timekeeping, a 16x2 LCD and three navigation switches for user configuration, and an active buzzer with three LEDs to deliver audible and visual medication alerts.',
        type: 'image',
        image: 'assets/images/projects/pcb1.png',
        tech: ['EasyEDA', 'Arduino']
    },
    pcb2: {
        title: '2-Way RF Communication Board',
        description: 'This layout is for a 2-way communication device that uses a central microcontroller to control audio flow, a microphone with a pre-amplifier to capture speech, a power-amplified speaker to broadcast incoming audio, a push-button switch to toggle between modes, and a built-in voltage regulator to manage the power supply.',
        type: 'image',
        image: 'assets/images/projects/pcb2.png',
        tech: ['EasyEDA', 'Arduino', 'RF Design']
    },
    pcb3: {
        title: 'IoT-Based Shoes & Socks Drying System',
        description: 'An IoT-based automated drying and sanitization system built around a Raspberry Pi 4 and two Arduino-controlled compartments, each equipped with moisture sensors, DHT22 temperature/humidity sensors, UV light, heating element, misting relay, cooling fan, LED indicators, electronic locks, and USB cameras for YOLOv8 object detection to classify items before processing.',
        type: 'image',
        image: 'assets/images/projects/pcb3.png',
        tech: ['EasyEDA', 'Embedded Systems', 'Arduino', 'Raspberry Pi']
    },
    'thesis1-pdf': {
        title: 'Incuvision: An Enhanced Chicken Egg Incubator with Computer Vision for Fertility Detection',
        description: 'An automated chicken egg incubator system using computer vision and deep learning for fertility detection, combining embedded hardware with AI-powered image processing.',
        type: 'pdf',
        pdfUrl: 'assets/resume/Incuvision-Manuscript.pdf',
        tech: ['Computer Vision', 'Deep Learning', 'Python', 'Embedded Systems', 'Raspberry Pi', 'Yolov8']
    },
    'thesis1-video': {
        title: 'Incuvision - Demo Video',
        description: 'Video demonstration of the Incuvision thesis project showing the incubator system and computer vision detection in action.',
        type: 'thesis-video',
        videoUrl: 'assets/videos/incuvision.mp4',
        tech: ['Computer Vision', 'Deep Learning', 'Python', 'Embedded Systems']
    },
    'thesis2-pdf': {
        title: 'Smart LoBo Training Kit: Hands-on IoT-Based Logic Board Training Kit for ECE Students at the University of Rizal System - Morong Campus',
        description: 'An innovative IoT-based logic board training kit that modernizes ECE education by replacing traditional breadboard setups with an integrated ESP32-powered system, enabling students to perform digital logic experiments, real-time monitoring, and remote learning through a hands-on, portable platform.',
        type: 'pdf',
        pdfUrl: 'assets/resume/SmartLoBo-Manuscript.pdf',
        tech: ['IoT', 'Embedded Systems', 'ESP32', 'Logic Circuits']
    },
    'thesis2-video': {
        title: 'Smart LoBo Training Kit - Demo Video',
        description: 'Video demonstration of the Smart LoBo Training Kit showing the IoT-based logic board in action for ECE student training.',
        type: 'thesis-video',
        videoUrl: 'assets/videos/smartlobo.mp4',
        tech: ['IoT', 'Embedded Systems', 'ESP32', 'Logic Circuits']
    }
};

// ========== CERTIFICATE DATA ==========
const certificateData = {
    'safety-officer': { title: 'Safety Officer 2', issuer: 'Serendipity Multi-Purpose Cooperative', image: 'assets/images/certificates/safety-officer.jpg' },
    'ethical-hacker': { title: 'Ethical Hacker', issuer: 'DICT-ITU DTC Initiative | Cisco Networking Academy', image: 'assets/images/certificates/ethical-hacker.jpg' },
    'os-basics': { title: 'Operating Systems Basics', issuer: 'DICT-ITU DTC Initiative | Cisco Networking Academy', image: 'assets/images/certificates/os-basics.jpg' },
    'linux-unhatched': { title: 'Linux Unhatched', issuer: 'DICT-ITU DTC Initiative | Cisco Networking Academy', image: 'assets/images/certificates/linux-unhatched.jpg' },
    'apply-ai': { title: 'Apply AI: Analyze Customer Reviews', issuer: 'DICT-ITU DTC Initiative | Cisco Networking Academy', image: 'assets/images/certificates/apply-ai.jpg' },
    'modern-ai': { title: 'Introduction to Modern AI', issuer: 'DICT-ITU DTC Initiative | Cisco Networking Academy', image: 'assets/images/certificates/modern-ai.jpg' },
    'seminar1': { title: 'Cloud or Edge: Understanding the Network Environment', issuer: '', image: 'assets/images/certificates/seminar1.jpg' },
    'seminar2': { title: 'Exploring Ideas and Innovating Techniques In Forming a Technologically Inclined Future', issuer: '', image: 'assets/images/certificates/seminar2.jpg' },
    'seminar3': { title: 'Building Construction', issuer: '', image: 'assets/images/certificates/seminar3.jpg' },
    'seminar4': { title: 'Electronics Manufacturing', issuer: '', image: 'assets/images/certificates/seminar4.jpg' },
    'seminar5': { title: 'Radio Broadcasting', issuer: '', image: 'assets/images/certificates/seminar5.jpg' },
    'vice-president': { title: 'Vice President for Academic Affairs', issuer: 'IECEP - URS Morong Student Chapter', image: 'assets/images/certificates/vice-president.jpg' },
    'iecep-officer': { title: 'IECEP National Student Officer', issuer: 'Institute of Electronics Engineers of the Philippines', image: 'assets/images/certificates/iecep-officer.jpg' }
};

// ========== VIDEO HOVER AUTOPLAY ==========
document.querySelectorAll('.video-project-card').forEach(card => {
    const video = card.querySelector('.project-video');
    
    card.addEventListener('mouseenter', () => {
        if (video && !card.classList.contains('expanded')) {
            video.currentTime = 0;
            video.play().catch(err => console.log('Video play failed:', err));
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (video && !card.classList.contains('expanded')) {
            video.pause();
            video.currentTime = 0;
        }
    });
});

// ========== SOFTWARE PROJECT FULL VIEW ==========
document.querySelectorAll('.video-project-card .project-preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.video-project-card');
        const projectId = btn.getAttribute('data-project');
        const project = projectsData[projectId];
        
        if (project && project.type === 'expand') {
            const videoModal = document.getElementById('videoModal');
            const videoFrame = document.getElementById('videoFrame');
            if (videoFrame) {
                videoFrame.src = project.videoUrl;
                videoFrame.load();
                videoFrame.play();
            }
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// ========== PROJECT MODAL (FOR PCB) ==========
const projectModal = document.getElementById('projectModal');
const closeProjectModal = document.querySelector('#projectModal .close-modal');

document.querySelectorAll('.project-card:not(.video-project-card) .project-preview-btn, .overlay-buttons .project-preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.getAttribute('data-project');
        const project = projectsData[projectId];
        
        if (!project) return;
        
        if (project.type === 'thesis-video') {
            const videoModal = document.getElementById('videoModal');
            const videoFrame = document.getElementById('videoFrame');
            if (videoFrame) {
                videoFrame.src = project.videoUrl;
                videoFrame.load();
                videoFrame.play();
            }
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else if (project.type === 'pdf') {
            window.open(project.pdfUrl, '_blank');
        } else if (project.type === 'image') {
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('modalDescription').textContent = project.description;
            document.getElementById('modalPreviewImage').src = project.image;
            document.getElementById('modalPreviewImage').alt = project.title;
            
            const techContainer = document.getElementById('modalTech');
            techContainer.innerHTML = '';
            project.tech.forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech;
                techContainer.appendChild(span);
            });
            
            document.getElementById('modalLinks').innerHTML = '';
            
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeProjectModalFunction() {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (closeProjectModal) {
    closeProjectModal.addEventListener('click', closeProjectModalFunction);
}

projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeProjectModalFunction();
    }
});

// ========== VIDEO MODAL (FOR THESIS VIDEOS) ==========
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const closeVideo = document.querySelector('.close-video');

if (closeVideo) {
    closeVideo.addEventListener('click', () => {
        videoModal.classList.remove('active');
        if (videoFrame) {
            videoFrame.pause();
            videoFrame.src = '';
        }
        document.body.style.overflow = 'auto';
    });
}

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('active');
        if (videoFrame) {
            videoFrame.pause();
            videoFrame.src = '';
        }
        document.body.style.overflow = 'auto';
    }
});

// ========== CERTIFICATE MODAL ==========
const certModal = document.getElementById('certModal');
const closeCertModal = document.querySelector('.close-cert');
const certModalImage = document.getElementById('certModalImage');
const certModalTitle = document.getElementById('certModalTitle');
const certModalIssuer = document.getElementById('certModalIssuer');

document.querySelectorAll('button.cert-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const certCard = btn.closest('.cert-card');
        const certId = certCard.getAttribute('data-cert');
        const cert = certificateData[certId];
        
        if (cert) {
            certModalImage.src = cert.image;
            certModalImage.alt = cert.title;
            certModalTitle.textContent = cert.title;
            certModalIssuer.textContent = cert.issuer;
            
            certModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeCertModalFunction() {
    certModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (closeCertModal) {
    closeCertModal.addEventListener('click', closeCertModalFunction);
}

certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
        closeCertModalFunction();
    }
});

// ========== ESCAPE KEY CLOSES ALL ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const expandedCard = document.querySelector('.video-project-card.expanded');
        if (expandedCard) {
            const btn = expandedCard.querySelector('.project-preview-btn');
            const video = expandedCard.querySelector('.project-video');
            expandedCard.classList.remove('expanded');
            if (expandedOverlay) { expandedOverlay.remove(); expandedOverlay = null; }
            btn.innerHTML = '<i class="fas fa-expand"></i> Full View';
            video.pause();
            document.body.style.overflow = 'auto';
            expandedCard.style.top = '';
            expandedCard.style.left = '';
            return;
        }
        
        if (projectModal.classList.contains('active')) {
            closeProjectModalFunction();
        }
        if (videoModal.classList.contains('active')) {
            videoModal.classList.remove('active');
            if (videoFrame) { videoFrame.pause(); videoFrame.src = ''; }
            document.body.style.overflow = 'auto';
        }
        if (certModal.classList.contains('active')) {
            closeCertModalFunction();
        }
    }
});

// ========== MUSIC PLAYER ==========
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicIcon = musicToggle.querySelector('i');

let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) { pauseMusic(); } else { playMusic(); }
});

function playMusic() {
    backgroundMusic.volume = 0.4;
    backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-volume-up');
    }).catch(() => {});
}

function pauseMusic() {
    backgroundMusic.pause();
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
    musicIcon.classList.remove('fa-volume-up');
    musicIcon.classList.add('fa-music');
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' }); }
    });
});

// ========== SCROLL REVEAL ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('section > *').forEach(element => {
    element.style.opacity = '0'; element.style.transform = 'translateY(30px)'; element.style.transition = 'all 0.6s ease'; observer.observe(element);
});

// ========== CONTACT FORM (FORMSPREE) ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        try {
            const response = await fetch('https://formspree.io/f/mzdqjblz', { method: 'POST', body: new FormData(contactForm), headers: { 'Accept': 'application/json' } });
            if (response.ok) { submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!'; submitBtn.style.background = '#00b894'; contactForm.reset(); }
            else { submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed'; submitBtn.style.background = '#d63031'; }
        } catch { submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed'; submitBtn.style.background = '#d63031'; }
        setTimeout(() => { submitBtn.innerHTML = originalText; submitBtn.style.background = ''; submitBtn.disabled = false; }, 3000);
    });
}

// ========== NAVBAR SCROLL ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => { navbar.style.boxShadow = window.scrollY > 100 ? '0 5px 20px rgba(0, 0, 0, 0.1)' : 'none'; });

// ========== CARD CLICKS ==========
document.querySelectorAll('.project-card').forEach(card => { card.addEventListener('click', function() { const btn = this.querySelector('.project-preview-btn'); if (btn) btn.click(); }); });
document.querySelectorAll('.cert-verifiable').forEach(card => { card.addEventListener('click', function() { const btn = this.querySelector('button.cert-view-btn'); if (btn) btn.click(); }); });

// ========== THESIS SLIDER ==========
document.querySelectorAll('.thesis-slider').forEach(slider => {
    const slides = slider.querySelector('.thesis-slides');
    const images = slides.querySelectorAll('img');
    let currentSlide = 0, slideInterval;
    function goToSlide(i) { currentSlide = i; slides.style.transform = `translateX(-${currentSlide * 100}%)`; }
    function nextSlide() { currentSlide = (currentSlide + 1) % images.length; goToSlide(currentSlide); }
    slideInterval = setInterval(nextSlide, 3000);
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => { clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 3000); });
});

// ========== PERFORMANCE ==========
function debounce(fn, ms) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }; }
window.addEventListener('resize', debounce(() => { resizeCanvas(); initParticles(); }, 250));

// ========== SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 't') { e.preventDefault(); themeToggle.click(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') { e.preventDefault(); musicToggle.click(); }
});

// ========== DATA VISUALIZATION DESKTOP NOTICE ==========
document.querySelectorAll('.dv-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-url');
        const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
        
        if (isMobile) {
            const overlay = document.createElement('div');
            overlay.className = 'dv-notice-overlay';
            overlay.innerHTML = `
                <div class="dv-notice-box">
                    <i class="fas fa-desktop"></i>
                    <h3>Desktop Only</h3>
                    <p>This dashboard is not available on mobile devices. Please open it on a desktop computer.</p>
                    <div class="dv-notice-btns">
                        <button class="dv-notice-cancel">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            overlay.querySelector('.dv-notice-cancel').onclick = () => overlay.remove();
            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        } else {
            window.open(url, '_blank');
        }
    });
});

document.querySelectorAll('.dv-live-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
        if (isMobile) {
            e.preventDefault();
            const overlay = document.createElement('div');
            overlay.className = 'dv-notice-overlay';
            overlay.innerHTML = `
                <div class="dv-notice-box">
                    <i class="fas fa-desktop"></i>
                    <h3>Desktop Only</h3>
                    <p>This dashboard is not available on mobile devices. Please open it on a desktop computer.</p>
                    <div class="dv-notice-btns">
                        <button class="dv-notice-cancel">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            overlay.querySelector('.dv-notice-cancel').onclick = () => overlay.remove();
            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        }
    });
});

// ========== ABOUT EXPAND ==========
document.getElementById('aboutExpandBtn').addEventListener('click', function() {
    this.classList.toggle('active');
    document.getElementById('aboutExpandContent').classList.toggle('open');
});

// ========== ABOUT MAP ==========
document.getElementById('aboutExpandBtn').addEventListener('click', function() {
    setTimeout(function() {
        if (!window.aboutMapLoaded) {
            const map = L.map('about-map').setView([14.525, 121.16], 13);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);
            L.marker([14.525, 121.16]).addTo(map)
                .bindPopup('<b>Angono, Rizal</b><br>Art Capital of the Philippines')
                .openPopup();
            window.aboutMapLoaded = true;
            setTimeout(function() { map.invalidateSize(); }, 100);
        }
    }, 500);
});

// ========== HERO IMAGE SLIDESHOW ==========
const heroImages = document.querySelectorAll('.hero-slideshow img');
let currentHeroImg = 0;
setInterval(() => {
    heroImages[currentHeroImg].classList.remove('active');
    currentHeroImg = (currentHeroImg + 1) % heroImages.length;
    heroImages[currentHeroImg].classList.add('active');
}, 3000);

// ========== INITIALIZATION ==========
console.log('%c Portfolio Website Ready! %c🚀', 'font-size: 20px; font-weight: bold; color: #6c5ce7;', 'font-size: 20px;');