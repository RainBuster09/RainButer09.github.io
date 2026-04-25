/* ===================================================
   MINTYNEX LANDING PAGE - JavaScript
   Full HD Pokemon Character Floating Background
   =================================================== */

// High-quality official Pokemon artwork PNGs from PokeAPI
const POKEMON_CHARS = [
  { name:'pikachu',    src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
  { name:'charizard',  src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
  { name:'bulbasaur',  src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
  { name:'squirtle',   src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
  { name:'mewtwo',     src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
  { name:'eevee',      src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png' },
  { name:'snorlax',    src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' },
  { name:'gengar',     src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
  { name:'mew',        src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
  { name:'jigglypuff', src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
  { name:'psyduck',    src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
  { name:'lucario',    src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png' },
  { name:'dragonite',  src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
  { name:'umbreon',    src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png' },
  { name:'rayquaza',   src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png' },
  { name:'gardevoir',  src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png' },
  { name:'arcanine',   src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png' },
  { name:'vaporeon',   src:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png' },
];

// Positions spread evenly so no clustering
const POSITIONS = [
  { l:2,   t:5  }, { l:18,  t:72 }, { l:35,  t:8  }, { l:52,  t:68 },
  { l:68,  t:3  }, { l:82,  t:60 }, { l:8,   t:40 }, { l:44,  t:35 },
  { l:76,  t:28 }, { l:25,  t:52 }, { l:60,  t:45 }, { l:90,  t:80 },
  { l:14,  t:85 }, { l:48,  t:82 }, { l:72,  t:82 }, { l:38,  t:58 },
  { l:5,   t:58 }, { l:92,  t:18 },
];

const ANIMS = ['pkFloatA','pkFloatB','pkFloatC','pkFloatD','pkFloatE','pkFloatF'];
const GLOWS = [
  'drop-shadow(0 0 18px rgba(255,215,0,0.55))',
  'drop-shadow(0 0 18px rgba(255,90,30,0.55))',
  'drop-shadow(0 0 18px rgba(50,210,100,0.55))',
  'drop-shadow(0 0 18px rgba(80,160,255,0.55))',
  'drop-shadow(0 0 18px rgba(210,100,255,0.55))',
  'drop-shadow(0 0 18px rgba(255,160,200,0.55))',
  'drop-shadow(0 0 18px rgba(100,220,255,0.55))',
  'drop-shadow(0 0 18px rgba(255,200,80,0.55))',
];

function createFloatingPokemon() {
  const container = document.getElementById('pokemon-bg');
  if (!container) return;
  container.innerHTML = '';

  const isMobile = window.innerWidth < 768;
  const list = isMobile ? POKEMON_CHARS.slice(0, 8) : POKEMON_CHARS;

  list.forEach((pkm, i) => {
    const pos   = POSITIONS[i % POSITIONS.length];
    const anim  = ANIMS[i % ANIMS.length];
    const glow  = GLOWS[i % GLOWS.length];
    const dur   = (6 + (i * 1.3) % 6).toFixed(1);
    const del   = -((i * 1.7) % 7).toFixed(1);
    const size  = isMobile
      ? (70 + (i * 17) % 50)
      : (90 + (i * 23) % 80);

    const el = document.createElement('div');
    el.className = 'pkm-char';
    el.style.cssText = `
      position:absolute;
      left:${pos.l}%;
      top:${pos.t}%;
      width:${size}px;
      height:${size}px;
      pointer-events:none;
      user-select:none;
      animation:${anim} ${dur}s ease-in-out infinite;
      animation-delay:${del}s;
      will-change:transform;
      z-index:0;
    `;

    const img = document.createElement('img');
    img.src = pkm.src;
    img.alt = pkm.name;
    img.loading = 'lazy';
    img.style.cssText = `
      width:100%;
      height:100%;
      object-fit:contain;
      opacity:0;
      transition:opacity 0.8s ease, filter 0.5s ease;
      filter:${glow} brightness(1.05) saturate(1.15);
      -webkit-filter:${glow} brightness(1.05) saturate(1.15);
      image-rendering:auto;
    `;

    img.onload = () => {
      img.style.opacity = isMobile ? '0.22' : '0.18';
    };
    img.onerror = () => { el.style.display = 'none'; };

    el.appendChild(img);
    container.appendChild(el);
  });
}

// Same for CTA section
function createCtaPokemon() {
  const container = document.querySelector('.cta-pokemon-bg');
  if (!container) return;
  container.innerHTML = '';
  const mini = POKEMON_CHARS.slice(0, 6);
  mini.forEach((pkm, i) => {
    const el = document.createElement('div');
    const size = 80 + (i * 20) % 60;
    el.style.cssText = `
      position:absolute;
      left:${(i * 17) % 90}%;
      top:${(i * 23) % 80}%;
      width:${size}px;height:${size}px;
      pointer-events:none;user-select:none;
      animation:${ANIMS[i%ANIMS.length]} ${(5+i*1.2).toFixed(1)}s ease-in-out infinite;
      animation-delay:-${(i*1.5).toFixed(1)}s;
    `;
    const img = document.createElement('img');
    img.src = pkm.src;
    img.alt = pkm.name;
    img.loading = 'lazy';
    img.style.cssText = `width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity 0.8s;filter:drop-shadow(0 0 14px rgba(255,255,255,0.3)) brightness(1.1);`;
    img.onload = () => { img.style.opacity = '0.14'; };
    img.onerror = () => { el.style.display='none'; };
    el.appendChild(img);
    container.appendChild(el);
  });
}

// ============== NAVBAR SCROLL ==============
function initNavbar() {
  const nav = document.getElementById('mnav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

// ============== MOBILE MENU ==============
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => menu.classList.toggle('open'));
}
window.closeMobile = function() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
};

// ============== SCROLL REVEAL ==============
function initReveal() {
  const els = document.querySelectorAll(
    '.feat-card,.step-card,.cf-post,.trust-list li,.verify-card,.trust-badges .tb'
  );
  els.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.children;
        const idx = Array.from(siblings).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin:'0px 0px -30px 0px' });
  els.forEach(el => observer.observe(el));
}

// ============== PARALLAX CARDS ==============
function initParallax() {
  const cards = document.querySelectorAll('.showcase-card[data-depth]');
  if (!cards.length) return;
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX - window.innerWidth / 2)  / (window.innerWidth / 2);
    const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    cards.forEach(card => {
      const d = parseFloat(card.getAttribute('data-depth') || '0.2');
      card.style.transform = `translate(${dx*d*20}px,${dy*d*20}px)`;
    });
  });
}

// ============== COUNTER ANIM ==============
function initCounters() {
  const stats = document.querySelectorAll('.hstat-val');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent;
      const num = parseFloat(raw.replace(/[^0-9.]/g,''));
      const sfx = raw.replace(/[\d.]/g,'');
      const isF = raw.includes('.');
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1500, 1);
        const v = (1 - Math.pow(1-p, 3)) * num;
        el.textContent = (isF ? v.toFixed(1) : Math.floor(v)) + sfx;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(el => observer.observe(el));
}

// ============== SMOOTH LINKS ==============
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); closeMobile(); }
    });
  });
}

// ============== INIT ==============
document.addEventListener('DOMContentLoaded', () => {
  createFloatingPokemon();
  createCtaPokemon();
  initNavbar();
  initMobileMenu();
  initReveal();
  initParallax();
  initCounters();
  initSmoothLinks();
});
