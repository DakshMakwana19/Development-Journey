(() => {
  'use strict';

  // ===== Quotes =====
  const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "What you seek is seeking you.", author: "Rumi" },
    { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
    { text: "Creativity takes courage.", author: "Henri Matisse" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Stars can't shine without darkness.", author: "D.H. Sidebottom" },
    { text: "Wherever you go, go with all your heart.", author: "Confucius" },
    { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" }
  ];

  const SEARCH_ENGINES = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q='
  };

  const DEFAULT_LINKS = [
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'Gmail', url: 'https://mail.google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
    { name: 'Reddit', url: 'https://reddit.com' }
  ];

  // ===== Storage Helpers =====
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('ambient_' + key);
        return v !== null ? JSON.parse(v) : fallback;
      } catch { return fallback; }
    },
    set(key, val) {
      localStorage.setItem('ambient_' + key, JSON.stringify(val));
    }
  };

  // ===== State =====
  let settings = {
    name: store.get('name', ''),
    theme: store.get('theme', 'aurora'),
    engine: store.get('engine', 'google'),
    showQuotes: store.get('showQuotes', true),
    clock24h: store.get('clock24h', false),
    showParticles: store.get('showParticles', true),
    links: store.get('links', DEFAULT_LINKS)
  };

  // ===== DOM =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== Init =====
  function init() {
    applyTheme(settings.theme);
    updateClock();
    setInterval(updateClock, 1000);
    updateGreeting();
    renderLinks();
    renderQuote();
    initSearch();
    initModals();
    initSettings();
    if (settings.showParticles) initParticles();
  }

  // ===== Clock =====
  function updateClock() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    if (!settings.clock24h) {
      h = h % 12 || 12;
    }
    $('#time').textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#date').textContent = now.toLocaleDateString('en-US', opts);
  }

  // ===== Greeting =====
  function updateGreeting() {
    const h = new Date().getHours();
    let period = 'evening';
    if (h >= 5 && h < 12) period = 'morning';
    else if (h >= 12 && h < 17) period = 'afternoon';
    const name = settings.name ? `, ${settings.name}` : '';
    $('#greeting').textContent = `Good ${period}${name}`;
  }

  // ===== Search =====
  function initSearch() {
    const input = $('#searchInput');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        const q = encodeURIComponent(input.value.trim());
        window.location.href = SEARCH_ENGINES[settings.engine] + q;
      }
    });
  }

  // ===== Links =====
  function renderLinks() {
    const grid = $('#linksGrid');
    grid.innerHTML = '';
    settings.links.forEach((link, i) => {
      const card = document.createElement('a');
      card.className = 'link-card';
      card.href = link.url;
      card.target = '_self';
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`;
      card.innerHTML = `
        <img class="link-favicon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">
        <span>${link.name}</span>
        <span class="link-delete" data-index="${i}">&times;</span>
      `;
      grid.appendChild(card);
    });

    // Delete handlers
    grid.querySelectorAll('.link-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        settings.links.splice(idx, 1);
        store.set('links', settings.links);
        renderLinks();
      });
    });
  }

  // ===== Quote =====
  function renderQuote() {
    const section = $('.quote-section');
    if (!settings.showQuotes) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    $('#quoteText').textContent = `"${q.text}"`;
    $('#quoteAuthor').textContent = `— ${q.author}`;
  }

  // ===== Modals =====
  function initModals() {
    const overlay = $('#modalOverlay');
    $('#addLinkBtn').addEventListener('click', () => {
      $('#linkName').value = '';
      $('#linkUrl').value = '';
      overlay.classList.add('active');
      setTimeout(() => $('#linkName').focus(), 100);
    });
    $('#modalCancel').addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
    $('#modalSave').addEventListener('click', () => {
      const name = $('#linkName').value.trim();
      let url = $('#linkUrl').value.trim();
      if (!name || !url) return;
      if (!url.startsWith('http')) url = 'https://' + url;
      settings.links.push({ name, url });
      store.set('links', settings.links);
      renderLinks();
      overlay.classList.remove('active');
    });
  }

  // ===== Settings =====
  function initSettings() {
    const overlay = $('#settingsOverlay');
    $('#settingsBtn').addEventListener('click', () => {
      overlay.classList.add('active');
      $('#userName').value = settings.name;
      $('#searchEngine').value = settings.engine;
      $('#showQuotes').checked = settings.showQuotes;
      $('#clock24h').checked = settings.clock24h;
      $('#showParticles').checked = settings.showParticles;
      $$('.theme-option').forEach(b => {
        b.classList.toggle('active', b.dataset.theme === settings.theme);
      });
    });
    $('#settingsClose').addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });

    // Name
    $('#userName').addEventListener('input', (e) => {
      settings.name = e.target.value.trim();
      store.set('name', settings.name);
      updateGreeting();
    });

    // Theme
    $$('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.theme-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.theme = btn.dataset.theme;
        store.set('theme', settings.theme);
        applyTheme(settings.theme);
      });
    });

    // Engine
    $('#searchEngine').addEventListener('change', (e) => {
      settings.engine = e.target.value;
      store.set('engine', settings.engine);
    });

    // Toggles
    $('#showQuotes').addEventListener('change', (e) => {
      settings.showQuotes = e.target.checked;
      store.set('showQuotes', settings.showQuotes);
      renderQuote();
    });
    $('#clock24h').addEventListener('change', (e) => {
      settings.clock24h = e.target.checked;
      store.set('clock24h', settings.clock24h);
      updateClock();
    });
    $('#showParticles').addEventListener('change', (e) => {
      settings.showParticles = e.target.checked;
      store.set('showParticles', settings.showParticles);
      if (settings.showParticles) initParticles();
      else clearParticles();
    });
  }

  // ===== Theme =====
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
  }

  // ===== Particles =====
  let particleAnim = null;
  function clearParticles() {
    if (particleAnim) cancelAnimationFrame(particleAnim);
    const canvas = $('#particleCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function initParticles() {
    const canvas = $('#particleCanvas');
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const COUNT = 50;

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.01 + 0.005
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const alpha = p.opacity + Math.sin(p.pulse) * 0.08;
        const pColor = getComputedStyle(document.body).getPropertyValue('--particle-color').trim() || '200, 180, 255';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pColor}, ${Math.max(0, alpha)})`;
        ctx.fill();
      });
      particleAnim = requestAnimationFrame(draw);
    }
    draw();
  }

  // ===== Start =====
  document.addEventListener('DOMContentLoaded', init);
})();
