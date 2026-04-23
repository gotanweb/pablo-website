/**
 * Pablo Londero — Links Page
 * Cyber/Futuristic JS — particles, tilt, card effects
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------
   * 1. CANVAS — Floating particle network
   * ---------------------------------------------- */
  const canvas = document.getElementById('bgCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx    = canvas.getContext('2d');
    let W, H, particles, animId;

    const PARTICLE_COUNT  = 55;
    const MAX_DIST        = 130;
    const COLORS          = ['#00FFB2', '#00D4FF', '#00FFB2'];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.8 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.2,
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
            ctx.lineWidth   = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      animId = requestAnimationFrame(drawParticles);
    }

    function init() {
      resize();
      createParticles();
      if (animId) cancelAnimationFrame(animId);
      drawParticles();
    }

    init();
    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  /* ------------------------------------------------
   * 2. AVATAR TILT — 3D magnetic effect on desktop
   * ---------------------------------------------- */
  const tiltArea = document.getElementById('profileTiltArea');
  if (tiltArea && !prefersReducedMotion) {
    tiltArea.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 992) return;
      const rect    = tiltArea.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotX    = ((e.clientY - centerY) / rect.height) * -10;
      const rotY    = ((e.clientX - centerX) / rect.width)  *  10;
      tiltArea.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;
    });

    tiltArea.addEventListener('mouseleave', () => {
      tiltArea.style.transition = 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)';
      tiltArea.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      setTimeout(() => { tiltArea.style.transition = ''; }, 620);
    });
  }

  /* ------------------------------------------------
   * 3. LINK CARDS — spotlight radial + ripple
   * ---------------------------------------------- */
  const cards = document.querySelectorAll('.link-card');

  cards.forEach((card) => {
    // Track mouse for radial gradient spotlight
    card.addEventListener('mousemove', (e) => {
      if (prefersReducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });

    // Ripple on click
    card.addEventListener('click', (e) => {
      if (prefersReducedMotion) return;
      const rect   = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 1.6;
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        transform:scale(0);
        animation:ripple-expand 600ms ease forwards;
        background:rgba(0,255,178,0.15);
        width:${size}px;
        height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top  - size / 2}px;
        pointer-events:none;
        z-index:0;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 640);
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const styleEl = document.createElement('style');
    styleEl.id    = 'ripple-style';
    styleEl.textContent = `
      @keyframes ripple-expand {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  /* ------------------------------------------------
   * 4. HUD CLOCK — live time display (optional)
   * ---------------------------------------------- */
  const hudTags = document.querySelectorAll('.hud-tag--right');
  if (hudTags.length) {
    function updateTime() {
      const now = new Date();
      const hh  = String(now.getHours()).padStart(2, '0');
      const mm  = String(now.getMinutes()).padStart(2, '0');
      const ss  = String(now.getSeconds()).padStart(2, '0');
      // Only update the top-right HUD tag with time, keep bottom as BUILD info
      const topRight = document.querySelector('.hud-bar--top .hud-tag--right');
      if (topRight) {
        topRight.innerHTML = `STATUS: <em>ONLINE</em> &nbsp;|&nbsp; ${hh}:${mm}:${ss}`;
      }
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

});
