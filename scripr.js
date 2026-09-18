// Tunggu hingga dokumen dimuat
document.addEventListener('DOMContentLoaded', () => {

    // 1. POPULATE DATA FROM CONFIG
    document.getElementById('brand-name').textContent = portfolioConfig.nickname;
    document.getElementById('dom-name').textContent = portfolioConfig.name;
    document.getElementById('dom-hero-bio').textContent = portfolioConfig.heroBio;
    document.getElementById('dom-profile-img1').src = portfolioConfig.profileImage;
    document.getElementById('dom-profile-img2').src = portfolioConfig.profileImage;
    document.getElementById('dom-quote').textContent = portfolioConfig.quote;
    
    // Profile Details
    document.getElementById('p-name').textContent = portfolioConfig.name;
    document.getElementById('p-nickname').textContent = portfolioConfig.nickname;
    document.getElementById('p-school').textContent = portfolioConfig.school;
    document.getElementById('p-class').textContent = portfolioConfig.class;
    document.getElementById('p-major').textContent = portfolioConfig.major;
    document.getElementById('p-city').textContent = portfolioConfig.city;
    document.getElementById('p-status').textContent = portfolioConfig.status;

    // About Section
    document.getElementById('dom-about').textContent = portfolioConfig.about;
    
    const interestsList = document.getElementById('dom-interests');
    portfolioConfig.interests.forEach(item => {
        let li = document.createElement('li');
        li.textContent = item;
        interestsList.appendChild(li);
    });

    const goalsList = document.getElementById('dom-goals');
    portfolioConfig.goals.forEach(item => {
        let li = document.createElement('li');
        li.textContent = item;
        goalsList.appendChild(li);
    });

    // Social Links
    const socialContainer = document.getElementById('dom-social-home');
    const socialIcons = {
        instagram: 'fab fa-instagram',
        github: 'fab fa-github',
        tiktok: 'fab fa-tiktok',
        linkedin: 'fab fa-linkedin-in'
    };
    
    for (const [key, url] of Object.entries(portfolioConfig.social)) {
        if (url && url !== "#") {
            let a = document.createElement('a');
            a.href = url;
            a.target = "_blank";
            a.innerHTML = `<i class="${socialIcons[key]}"></i>`;
            socialContainer.appendChild(a);
        }
    }

    // 2. LOADING SCREEN
    window.onload = () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 500); // Waktu animasi loader
    };

    // 3. CUSTOM CURSOR
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Hanya aktifkan jika bukan perangkat layar sentuh
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Efek delay halus untuk outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect untuk Link & Buttons
        const interactables = document.querySelectorAll('a, .glass');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 4. MOBILE MENU
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 5. STICKY NAVBAR & ACTIVE LINK PADA SCROLL
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // 6. SCROLL REVEAL ANIMATION
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // 7. 3D TILT EFFECT UNTUK GLASS CARD
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max rotasi 10 derajat
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            });
        });
    }

    // 8. BACKGROUND PARTICLES GENERATOR
    const particlesContainer = document.getElementById('particles-container');
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random ukuran, posisi, dan kecepatan
        const size = Math.random() * 5 + 2; // 2px - 7px
        const posX = Math.random() * window.innerWidth;
        const duration = Math.random() * 10 + 10; // 10s - 20s
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
        
        // Hapus elemen setelah animasi selesai agar DOM tidak berat
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    };
    
    // Buat partikel baru setiap 800ms
    setInterval(createParticle, 800);
});