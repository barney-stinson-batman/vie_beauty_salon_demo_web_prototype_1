document.addEventListener('DOMContentLoaded', () => {

  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => setTimeout(() => preloader.classList.add('done'), 1200));
    setTimeout(() => preloader.classList.add('done'), 2800);
  }

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const burger = document.getElementById('burger');
  const menu   = document.getElementById('navMenu');
  let backdrop = null, menuOpen = false;
  let menuParent = menu ? menu.parentNode : null;

  const closeMenu = () => {
    menuOpen = false;
    burger && burger.classList.remove('open');
    if (menu) {
      menu.classList.remove('open');
      if (menu.parentNode === document.body && menuParent) menuParent.appendChild(menu);
    }
    document.body.style.overflow = '';
    if (backdrop && backdrop.parentNode) { backdrop.parentNode.removeChild(backdrop); backdrop = null; }
  };

  if (burger && menu) {
    burger.addEventListener('click', () => {
      if (!menuOpen) {
        menuOpen = true;
        burger.classList.add('open');
        document.body.appendChild(menu);
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.addEventListener('click', closeMenu);
        document.body.insertBefore(backdrop, menu);
      } else closeMenu();
    });
    menu.querySelectorAll('a[href]').forEach(l => {
      l.addEventListener('click', e => {
        const href = l.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) { closeMenu(); return; }
        e.preventDefault(); closeMenu();
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 300);
      });
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-right, .reveal-fade').forEach(el => observer.observe(el));

  const autoSelectors = ['.svc-card', '.rv-card', '.stat', '.av-item'];
  document.querySelectorAll(autoSelectors.join(', ')).forEach((el, i) => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-fade')) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = `${(i % 4) * 0.07}s`;
      observer.observe(el);
    }
  });

  const heroBg = document.querySelector('.hero-fallback-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `scale(1.03) translateY(${window.scrollY * 0.15}px)`;
    }, { passive: true });
  }

  const ticker = document.querySelector('.svc-ticker-track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  const badge = document.getElementById('openStatus');
  if (badge) {
    const now = new Date();
    const h   = now.getHours() + now.getMinutes() / 60;
    const open = h >= 8 && h < 22;
    if (open) {
      badge.innerHTML = '<span class="open-badge open">● Open Now</span>';
    } else if (h < 8) {
      badge.innerHTML = '<span class="open-badge closed">● Opens today at 8:00am</span>';
    } else {
      badge.innerHTML = '<span class="open-badge closed">● Closed · Opens tomorrow 8am</span>';
    }
  }

  const form = document.getElementById('contactForm');
  if (form) {
    const g = id => document.getElementById(id);
    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const err = (el, m) => { if (el) el.textContent = m; };
    const clr = el => { if (el) el.textContent = ''; };

    g('f-name') && g('f-name').addEventListener('blur', () =>
      g('f-name').value.trim().length < 2 ? err(g('nameErr'), 'Please enter your name') : clr(g('nameErr')));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      if (!g('f-name')?.value.trim() || g('f-name').value.trim().length < 2) { err(g('nameErr'), 'Please enter your name'); ok = false; } else clr(g('nameErr'));
      if (!ok) return;
      if (g('btnTxt')) g('btnTxt').style.display = 'none';
      if (g('btnLoad')) g('btnLoad').style.display = 'inline';
      const btn = g('submitBtn'); if (btn) btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        const s = g('formSuccess');
        if (s) { s.style.display = 'block'; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }, 1300);
    });
  }

  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.style.opacity = '1'; }));
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.closest('#navMenu')) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });

  document.querySelectorAll('[data-count]').forEach(el => {
    const co = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      let val = 0; const inc = target / 80;
      const timer = setInterval(() => {
        val += inc;
        if (val >= target) { val = target; clearInterval(timer); }
        el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
      }, 16);
      co.disconnect();
    }, { threshold: 0.5 });
    co.observe(el);
  });

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nm-link').forEach(l => { if (l.getAttribute('href') === page) l.classList.add('active'); });

});
