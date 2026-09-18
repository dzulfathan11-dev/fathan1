(function(){
  "use strict";

  /* -------------------------------------------
     1. POPULATE CONTENT FROM config.js
  ------------------------------------------- */
   const cfg = (typeof portfolioConfig !== "undefined") ? portfolioConfig : {};
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };
  const setSrc = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.src = value;
  };

  document.getElementById("navLogo").textContent = (cfg.nickname || cfg.name || "P").charAt(0);

  setSrc("heroPhoto", cfg.profileImage);
  setText("heroName", cfg.name);
  setText("heroStatus", cfg.status);
  setText("heroBio", cfg.bio);

  setSrc("profilePhoto", cfg.profileImage);
  setText("profileQuote", cfg.quote ? `“${cfg.quote}”` : "");
  setText("profileBadgeStatus", cfg.status);
  setText("profileName", cfg.name);
  setText("profileNickname", cfg.nickname ? `@${cfg.nickname}` : "");
  setText("fieldSchool", cfg.school);
  setText("fieldClass", cfg.class);
  setText("fieldMajor", cfg.major);
  setText("fieldCity", cfg.city);
  setText("profileBio", cfg.bio);

  setText("aboutLead", cfg.about);
  setText("aboutInterests", cfg.interests);
  setText("aboutHobbies", cfg.hobbies);
  setText("aboutGoals", cfg.goals);
  setText("aboutDream", cfg.dream);

  // Social icons (simple text glyphs, no external icon dependency)
  const socialGlyphs = { instagram: "IG", github: "GH", tiktok: "TT", linkedin: "IN" };
  const socialWrap = document.getElementById("heroSocial");
  if (cfg.social && socialWrap) {
    Object.keys(cfg.social).forEach((key) => {
      const url = cfg.social[key];
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.textContent = socialGlyphs[key] || key.slice(0, 2).toUpperCase();
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      socialWrap.appendChild(a);
    });
  }

  /* -------------------------------------------
     2. LOADER
  ------------------------------------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader.classList.add("hidden"), 350);
  });

  /* -------------------------------------------
     3. TYPING GREETING
  ------------------------------------------- */
  const greetEl = document.getElementById("typedGreeting");
  const greetText = "Hello, I'm";
  let gi = 0;
  function typeGreeting() {
    if (gi <= greetText.length) {
      greetEl.textContent = greetText.slice(0, gi);
      gi++;
      setTimeout(typeGreeting, 65);
    } else {
      const caret = document.createElement("span");
      caret.className = "cursor-caret";
      greetEl.appendChild(caret);
    }
  }
  setTimeout(typeGreeting, 900);

  /* -------------------------------------------
     4. SCROLL REVEAL
  ------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("in"), i * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach((el) => io.observe(el));

  /* -------------------------------------------
     5. NAVBAR: active link on scroll + mobile menu
  ------------------------------------------- */
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link, .nav-mobile-link");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.5 });
  sections.forEach((s) => sectionObserver.observe(s));

  const burger = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("navMobile");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });

  /* -------------------------------------------
     6. CUSTOM CURSOR (desktop, pointer-fine only)
  ------------------------------------------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    });
    function animateRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll("a, button, .profile-card, .about-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.style.transform = "translate(-50%,-50%) scale(1.6)");
      el.addEventListener("mouseleave", () => ring.style.transform = "translate(-50%,-50%) scale(1)");
    });
  }

  /* -------------------------------------------
     7. PROFILE CARD 3D TILT + SHINE
  ------------------------------------------- */
  const tiltCard = document.getElementById("tiltCard");
  if (tiltCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotX = (py - 0.5) * -6;
      const rotY = (px - 0.5) * 8;
      tiltCard.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      tiltCard.style.setProperty("--mx", `${px * 100}%`);
      tiltCard.style.setProperty("--my", `${py * 100}%`);
    });
    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    });
  }

  /* -------------------------------------------
     8. PARTICLE BACKGROUND (lightweight canvas)
  ------------------------------------------- */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  function initParticles() {
    const count = Math.min(60, Math.floor(window.innerWidth / 22));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? "62,166,255" : "35,230,209"
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${p.o})`;
      ctx.fill();
      p.y -= p.vy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
    });
    if (!reduceMotion) requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

})();
