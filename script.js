/* ════════════════════════════════════════════════════════════
   ALPHA DIGITAL SOLUTIONS — SEO AGENCY · SCRIPT
   Page routing, animations, carousels, counters, hero canvas.
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ──────────────────────────────────────
  // CONFIG
  // ──────────────────────────────────────
  const CONFIG = {
    whatsappNumber: '16473650782',
    whatsappMessage: "Hi — I'd like to discuss SEO for my domain.",
    formspreeEndpoint: 'https://formspree.io/f/xaqvnaap',
  };

  // ──────────────────────────────────────
  // 1. PAGE ROUTER
  // ──────────────────────────────────────
  window.showPage = function (id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + id);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navLink = document.getElementById('nav-' + id);
    if (navLink) navLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      initReveals();
      initFaq();
      initForms();
      initCounters();
    }, 50);

    closeMobileMenu();
  };

  // ──────────────────────────────────────
  // 2. MOBILE MENU
  // ──────────────────────────────────────
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toggle.classList.contains('open');
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    document.addEventListener('click', (e) => {
      if (!links.classList.contains('mobile-open')) return;
      if (e.target.closest('.nav-links') || e.target.closest('.menu-toggle')) return;
      closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMobileMenu();
    });
  }

  function openMobileMenu() {
    document.querySelector('.menu-toggle')?.classList.add('open');
    document.querySelector('.nav-links')?.classList.add('mobile-open');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    document.querySelector('.menu-toggle')?.classList.remove('open');
    document.querySelector('.nav-links')?.classList.remove('mobile-open');
    document.body.classList.remove('menu-open');
    document.querySelectorAll('.nav-links li.has-dropdown.open').forEach(li => li.classList.remove('open'));
  }

  // ──────────────────────────────────────
  // 3. ANNOUNCEMENT BAR
  // ──────────────────────────────────────
  function initAnnounce() {
    const bar = document.querySelector('.announce');
    if (!bar) return;
    if (sessionStorage.getItem('alpha-seo-announce-dismissed') === '1') {
      bar.style.display = 'none';
      return;
    }
    bar.querySelector('.announce-close')?.addEventListener('click', () => {
      bar.style.display = 'none';
      sessionStorage.setItem('alpha-seo-announce-dismissed', '1');
    });
  }

  // ──────────────────────────────────────
  // 4. FAQ ACCORDION
  // ──────────────────────────────────────
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
      if (item.dataset.bound) return;
      item.dataset.bound = '1';
      const btn = item.querySelector('.faq-question');
      btn?.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      item.querySelector('.faq-toggle')?.setAttribute('aria-hidden', 'true');
      btn?.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        item.parentElement.querySelectorAll('.faq-item.open').forEach(o => {
          o.classList.remove('open');
          o.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  // ──────────────────────────────────────
  // 5. SCROLL REVEAL
  // ──────────────────────────────────────
  let revealObserver = null;
  function initReveals() {
    const selectors = [
      '.section-head', '.service-card', '.review',
      '.work-card', '.process-row',
      '.value-card', '.feature-deep', '.methodology-step',
      '.faq-item', '.lm-text', '.lm-form', '.cta-band-inner > *',
      '.blog-card',
    ];
    const els = document.querySelectorAll(selectors.join(','));
    els.forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        if (i % 3 === 1) el.style.transitionDelay = '0.08s';
        if (i % 3 === 2) el.style.transitionDelay = '0.16s';
      }
    });

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    }

    els.forEach(el => {
      if (!el.classList.contains('in-view')) revealObserver.observe(el);
    });
  }

  // ──────────────────────────────────────
  // 6. WHATSAPP FAB
  // ──────────────────────────────────────
  function initWhatsapp() {
    if (document.querySelector('.whatsapp-fab')) return;
    const fab = document.createElement('a');
    fab.className = 'whatsapp-fab';
    fab.target = '_blank';
    fab.rel = 'noopener';
    // Page-aware WhatsApp message — Web Dev page asks about a project, SEO page about a domain
    const isWebDev = /web-development/.test(window.location.pathname);
    const message = isWebDev
      ? "Hi — I'd like to discuss a web development project."
      : "Hi — I'd like to discuss SEO for my domain.";
    fab.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    fab.setAttribute('aria-label', 'Chat on WhatsApp');
    fab.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.49 0 .14 5.34.14 11.91a11.86 11.86 0 0 0 1.6 5.95L0 24l6.31-1.66a11.93 11.93 0 0 0 5.74 1.46h.01c6.55 0 11.9-5.34 11.9-11.91a11.84 11.84 0 0 0-3.44-8.41zM12.05 21.78h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.85 9.85 0 0 1-1.5-5.24c0-5.45 4.43-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.89 9.88zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37c-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35z"/></svg>`;
    document.body.appendChild(fab);
  }

  // ──────────────────────────────────────
  // 7. FORMS
  // ──────────────────────────────────────
  async function submitForm(form) {
    const data = {};
    form.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.name) data[el.name] = el.value.trim();
    });
    data.submitted_at = new Date().toISOString();
    data.page_url = window.location.href;
    const res = await fetch(CONFIG.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Submit failed');
    return res.json();
  }

  function bindForm(form, successText, errorText) {
    const btn = form.querySelector('button[type="submit"], .btn-primary, button');
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('input:not([type=hidden]), select, textarea');
      let valid = true;
      fields.forEach(f => {
        if (f.required && !f.value.trim()) {
          f.style.borderColor = 'var(--error)';
          valid = false;
        } else {
          f.style.borderColor = '';
        }
      });
      if (!valid) return;

      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        await submitForm(form);
        btn.textContent = successText;
        btn.style.background = 'var(--success)';
        btn.style.color = '#fff';
        setTimeout(() => {
          fields.forEach(f => { f.value = ''; });
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 4000);
      } catch (err) {
        btn.textContent = errorText;
        btn.style.background = 'var(--error)';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3500);
      }
    });
  }

  function initForms() {
    document.querySelectorAll('.lm-form').forEach(f => bindForm(f, 'Audit requested ✓', 'Failed — try again'));
    document.querySelectorAll('.contact-form').forEach(f => bindForm(f, 'Message sent ✓', 'Failed — try again'));
    document.querySelectorAll('.audit-form').forEach(f => bindForm(f, 'Request received ✓', 'Failed — try again'));
  }

  // ──────────────────────────────────────
  // 8. COUNTER ANIMATION (for metrics bar / growth stats)
  // ──────────────────────────────────────
  let counterObserver = null;
  function initCounters() {
    const els = document.querySelectorAll('[data-target]');
    if (!counterObserver) {
      counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            counterObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
    }
    els.forEach(el => {
      if (!el.dataset.counted) counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix != null ? el.dataset.prefix : '';
    const duration = 1800;
    const startTime = performance.now();
    const startVal = 0;

    function format(v) {
      const rounded = Math.round(v);
      return prefix + rounded.toLocaleString() + suffix;
    }

    function step(now) {
      const elapsed = Math.min((now - startTime) / duration, 1);
      // easeOutExpo for a nice quick ramp + smooth deceleration
      const eased = elapsed === 1 ? 1 : 1 - Math.pow(2, -10 * elapsed);
      const value = startVal + (target - startVal) * eased;
      el.textContent = format(value);
      if (elapsed < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    }
    requestAnimationFrame(step);
  }

  // ──────────────────────────────────────
  // 9. SCROLL PROGRESS BAR
  // ──────────────────────────────────────
  function initScrollProgress() {
    if (document.querySelector('.scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = h.scrollHeight - h.clientHeight;
      const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      bar.style.transform = `scaleX(${pct})`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // ──────────────────────────────────────
  // INIT
  // ──────────────────────────────────────
  function init() {
    initMobileMenu();
    initAnnounce();
    initFaq();
    initWhatsapp();
    initForms();
    initReveals();
    initCounters();
    initScrollProgress();
    initClickableA11y();
  }

  function initClickableA11y() {
    const sel = '.service-card[onclick], .work-card[onclick], .blog-card[onclick], .service-list-card[onclick], .dropdown-item[onclick], .blog-featured[onclick], .footer-col li[onclick]';
    document.querySelectorAll(sel).forEach(el => {
      if (el.dataset.kbd) return;
      el.dataset.kbd = '1';
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'link');
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  }
  const _sp = window.showPage;
  if (_sp) window.showPage = function (id) { _sp(id); setTimeout(initClickableA11y, 60); };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ════════════════════════════════════════════════════════════
   CAROUSEL · HEADER SCROLL · DROPDOWN
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function initProjectsCarousel() {
    const track = document.getElementById('projects-track');
    if (!track) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;

    const viewport = track.parentElement;
    const dotsWrap = document.getElementById('projects-dots');
    const prev = document.getElementById('projects-prev');
    const next = document.getElementById('projects-next');
    if (!viewport || !dotsWrap || !prev || !next) return;

    let cardsPerView = 3;
    let totalPages = Math.ceil(cards.length / cardsPerView);
    let current = 0;

    const computeCardsPerView = () => {
      const w = window.innerWidth;
      if (w <= 768) return 1;
      if (w <= 1024) return 2;
      return 3;
    };

    const buildDots = () => {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'projects-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Go to page ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(btn);
      }
    };

    const update = () => {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      const shift = current * cardsPerView * (cardWidth + gap);
      track.style.transform = `translateX(-${shift}px)`;
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === current));
      prev.disabled = current === 0;
      next.disabled = current === totalPages - 1;
    };

    const goTo = (idx) => {
      current = Math.max(0, Math.min(idx, totalPages - 1));
      update();
    };

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    const recalc = () => {
      const newCpv = computeCardsPerView();
      if (newCpv !== cardsPerView) {
        cardsPerView = newCpv;
        totalPages = Math.ceil(cards.length / cardsPerView);
        current = 0;
        buildDots();
      }
      update();
    };

    window.addEventListener('resize', () => {
      clearTimeout(window.__projTimer);
      window.__projTimer = setTimeout(recalc, 120);
    });

    cardsPerView = computeCardsPerView();
    totalPages = Math.ceil(cards.length / cardsPerView);
    buildDots();
    update();

    let touchStartX = 0;
    viewport.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) goTo(current + 1);
        else goTo(current - 1);
      }
    }, { passive: true });
  }

  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    let ticking = false;
    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initDropdown() {
    document.querySelectorAll('.nav-links li.has-dropdown').forEach(li => {
      if (li.dataset.bound) return;
      li.dataset.bound = '1';
      const link = li.querySelector('a');
      link?.addEventListener('click', (e) => {
        if (window.innerWidth <= 980) {
          e.preventDefault();
          e.stopPropagation();
          const open = li.classList.toggle('open');
          link.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
      });
      li.addEventListener('focusin', () => { if (window.innerWidth > 980) link.setAttribute('aria-expanded','true'); });
      li.addEventListener('focusout', () => { if (window.innerWidth > 980 && !li.contains(document.activeElement)) link.setAttribute('aria-expanded','false'); });
      li.addEventListener('keydown', (e) => { if (e.key === 'Escape') { li.classList.remove('open'); link.setAttribute('aria-expanded','false'); link.focus(); } });
    });
  }

  function init() {
    initProjectsCarousel();
    initHeaderScroll();
    initDropdown();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ════════════════════════════════════════════════════════════
   SHOW SERVICE SECTION
   ════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════
   BLOG CATEGORY FILTER
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function initBlogFilter() {
    const pills = document.querySelectorAll('.blog-filter-pill');
    const cards = document.querySelectorAll('#page-blog .blog-card[data-cat]');
    if (!pills.length || !cards.length) return;
    pills.forEach(pill => {
      if (pill.dataset.bound) return;
      pill.dataset.bound = '1';
      pill.addEventListener('click', () => {
        const filter = pill.dataset.filter;
        pills.forEach(p => p.classList.toggle('active', p === pill));
        cards.forEach(c => {
          const match = filter === 'all' || c.dataset.cat === filter;
          c.style.display = match ? '' : 'none';
        });
      });
    });
    // Newsletter form binding (reuses existing form submit logic)
    const nl = document.querySelector('.blog-newsletter-form');
    if (nl && !nl.dataset.bound) {
      nl.dataset.bound = '1';
      nl.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = nl.querySelector('button');
        const input = nl.querySelector('input[name="email"]');
        if (!input.value.trim()) { input.focus(); return; }
        const orig = btn.textContent;
        btn.textContent = 'Subscribing…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Subscribed ✓';
          btn.style.background = 'var(--success)';
          btn.style.color = '#fff';
          input.value = '';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        }, 600);
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBlogFilter);
  else initBlogFilter();
  // Re-init when navigating to blog page
  const origSP = window.showPage;
  window.showPage = function (id) {
    origSP(id);
    setTimeout(initBlogFilter, 80);
  };
})();

window.showServiceSection = function (sectionId) {
  // Maps every supported sectionId (legacy + current) to its dedicated
  // service-detail page ID. Service-detail pages live as their own SPA
  // pages: page-service-technical, page-service-onpage, etc.
  const pageMap = {
    // SEO pillars (current)
    'sb-technical': 'service-technical',
    'sb-onpage':    'service-onpage',
    'sb-offpage':   'service-offpage',
    'sb-reddit':    'service-reddit',
    'sb-local':     'service-local',
    // SEO — legacy IDs (from when there were 10 services) → route to parent pillar
    'sb-audits':    'service-technical',
    'sb-cwv':       'service-technical',
    'sb-analytics': 'service-technical',
    'sb-keyword':   'service-onpage',
    'sb-content':   'service-onpage',
    'sb-link':      'service-offpage',
    // Web Dev pillars
    'sb-sites':     'service-sites',
    'sb-ecommerce': 'service-ecommerce',
    'sb-apps':      'service-apps',
    'sb-maintain':  'service-maintain',
  };
  const pageId = pageMap[sectionId];
  if (pageId) {
    showPage(pageId);
    return;
  }
  // Fallback: route to the services directory and scroll to the section
  showPage('services');
  setTimeout(function () {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

/* ════════════════════════════════════════════════════════════
   CASE STUDY DETAILS — SEO portfolio
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const PROJECTS = [
    {
      tag: 'B2B SaaS · 9 months',
      title: 'Series-B SaaS: organic became the largest acquisition channel',
      meta: 'Technical SEO &nbsp;·&nbsp; Content &nbsp;·&nbsp; Authority',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'B2B SaaS organic growth case study',
      highlights: [
        { label: 'Organic traffic', value: '+312%' },
        { label: 'Page-1 keywords', value: '+87' },
        { label: 'Qualified leads', value: '+218%' },
        { label: 'Timeline', value: '9 months' },
      ],
      body: `
        <h2>The Situation</h2>
        <p>A Series-B SaaS platform was acquiring customers almost exclusively through paid channels. Organic traffic had plateaued for 14 months — flat despite a content team publishing four articles a week. Search Console showed thousands of impressions but click-through rates well below category benchmarks, and a deep crawl revealed indexation chaos: 4,200 pages, 1,800 of them either canonicalised away or blocked at the robots.txt layer without intent.</p>

        <h2>Diagnostic Phase</h2>
        <p>We ran our full 200+ point audit across technical health, on-page coverage, content depth and the backlink profile. Log-file analysis surfaced the deepest issue — Googlebot was burning 60% of its crawl budget on parametrised URLs that should never have been crawlable. Schema markup existed but was malformed on 84% of templated pages. Internal linking was almost entirely dependent on the global navigation; orphan pages numbered in the hundreds.</p>

        <h2>Strategy</h2>
        <p>A three-pillar topical map was built around the platform's core jobs-to-be-done. Crawl budget was reclaimed through robots directives, canonical consolidation and parametrised URL parameter handling. The schema was rewritten as a JSON-LD graph linking Organization, SoftwareApplication, Product, FAQ and BreadcrumbList. Internal linking was rearchitected around the topical clusters with editorial cross-linking embedded into the brief workflow.</p>

        <h2>Execution</h2>
        <p>Technical fixes shipped across the first six weeks alongside a refreshed content production pipeline. 84 deep-dive articles were commissioned across the three pillars over the following six months, written with SME interviews and validated against SERP analysis. An editorial outreach programme placed 38 contextual links in DR60+ publications.</p>

        <h2>Outcome</h2>
        <p>By month nine, organic traffic was up 312%, the page-1 keyword count had increased by 87, and — most important — organic had overtaken paid as the largest source of qualified pipeline. The CAC blended across acquisition channels dropped 26%.</p>
      `
    },
    {
      tag: 'Ecommerce · 6 months',
      title: 'D2C retail brand: technical SEO unlocked 4.2x indexation',
      meta: 'Technical SEO &nbsp;·&nbsp; Schema &nbsp;·&nbsp; CWV',
      img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'D2C ecommerce technical SEO case study',
      highlights: [
        { label: 'Impressions', value: '+218%' },
        { label: 'Crawl errors', value: '−94%' },
        { label: 'Indexation', value: '4.2x' },
        { label: 'Timeline', value: '6 months' },
      ],
      body: `
        <h2>The Problem</h2>
        <p>A D2C retail brand with 14,000 SKUs had only 3,200 products indexed by Google. Many product pages were caught in duplicate-content loops thanks to faceted navigation, while category pages competed against each other for the same terms. PageSpeed scores hovered in the low 30s on mobile.</p>

        <h2>What We Fixed</h2>
        <p>We deconstructed the faceted navigation, separating crawlable and non-crawlable parameters at the URL level. Canonical tags were rewritten across the product catalogue. A Product schema graph was deployed including aggregateRating, offers and brand entities. The image pipeline was migrated to a responsive WebP/AVIF service with priority hints on LCP candidates.</p>

        <h2>Result</h2>
        <p>Indexation grew from 3,200 to 13,400 indexable URLs (a 4.2x lift). Search impressions rose 218% across six months. Crawl errors dropped 94%. Average mobile PageSpeed score moved from 31 to 84, and Core Web Vitals went from "poor" on 78% of URLs to "good" on 96%.</p>
      `
    },
    {
      tag: 'Local · 84 locations',
      title: '84-location service brand: local pack dominance, market by market',
      meta: 'Local SEO &nbsp;·&nbsp; Google Business Profile &nbsp;·&nbsp; Schema',
      img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Multi-location local SEO case study',
      highlights: [
        { label: 'Local pack views', value: '+412%' },
        { label: 'Call conversions', value: '+148%' },
        { label: 'Locations', value: '84' },
        { label: 'Timeline', value: '12 months' },
      ],
      body: `
        <h2>The Brief</h2>
        <p>A national service brand with 84 locations had inconsistent local search visibility — strong in five flagship cities, invisible in most others. Google Business Profile management had been delegated to local franchisees with no central template. Review volumes ranged from 8 to 2,400 across locations.</p>

        <h2>Solution</h2>
        <p>We standardised all 84 GBPs under a single optimisation playbook — categories, services, attributes, posts, Q&A. Location pages were rebuilt from a parameterised template with LocalBusiness and Service schema. A review velocity programme was launched centrally with NPS-trigger email automation. Citation cleanup ran across 76 directories.</p>

        <h2>Outcome</h2>
        <p>Local pack views grew 412% in aggregate. Call conversions tracked through GBP rose 148%. The previously invisible locations now generate measurable inbound enquiry volume; the flagship cities defended their share against new local entrants.</p>
      `
    },
    {
      tag: 'Core Web Vitals',
      title: 'Publisher network: every CWV metric in the green',
      meta: 'CWV Engineering &nbsp;·&nbsp; Performance &nbsp;·&nbsp; Edge',
      img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Core Web Vitals optimisation case study',
      highlights: [
        { label: 'PageSpeed', value: '92' },
        { label: 'LCP achieved', value: '1.6s' },
        { label: 'URLs in good', value: '100%' },
        { label: 'INP', value: '142ms' },
      ],
      body: `
        <h2>The Challenge</h2>
        <p>A publisher / media network with millions of monthly sessions was losing organic traffic on every Page Experience update. Field data in Search Console showed LCP averaging 4.8s, INP above 600ms on key article templates, and CLS issues across the ad layout.</p>

        <h2>Engineering</h2>
        <p>The critical render path was rebuilt: fonts preloaded with display: swap, render-blocking CSS inlined for above-the-fold, lazy-loading deferred for below-the-fold. Third-party scripts (analytics, consent, ads) were moved behind a deferred loader with a hard performance budget. Image priority hints, srcset and AVIF encoding were deployed via the CDN edge. The ad slot layout was rebuilt with reserved space to eliminate CLS.</p>

        <h2>Result</h2>
        <p>Field LCP dropped from 4.8s to 1.6s. INP dropped to 142ms. CLS to 0.04. PageSpeed Insights score moved from 28 to 92 on mobile. Critically, 100% of monitored URLs now sit in the "good" CWV cohort — and have stayed there across two subsequent core updates.</p>
      `
    },
    {
      tag: 'Authority · 12 months',
      title: 'Fintech category leader: 247 editorial placements, +38 DR',
      meta: 'Link Building &nbsp;·&nbsp; Digital PR &nbsp;·&nbsp; Authority',
      img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Fintech editorial link building case study',
      highlights: [
        { label: 'Editorial links', value: '247' },
        { label: 'Domain rating', value: '+38' },
        { label: 'Avg placement DR', value: 'DR82' },
        { label: 'Timeline', value: '12 months' },
      ],
      body: `
        <h2>The Position</h2>
        <p>A fintech with strong product and content had a backlink gap to two top-three competitors — both held DR80+ profiles built over five years of digital PR. Without authority, the content ceiling was always going to bind.</p>

        <h2>The Programme</h2>
        <p>A 12-month editorial outreach engine was set up: linkable-asset production (original research, sector reports, calculators), digital PR placements aligned to publisher news cycles, and a HARO/expert-quote system with senior team members as named contributors. No PBNs, no exchanges, no link farms — every placement editorially justified.</p>

        <h2>Outcome</h2>
        <p>247 editorial links earned across the year. Average referring domain DR of 82. Domain rating climbed 38 points — closing the gap to the category leader. Pages targeting head terms moved from positions 8–15 into the top three across the brand's commercial portfolio.</p>
      `
    },
    {
      tag: 'Content · 14 months',
      title: 'HR-tech platform: 184 expert-led articles, category leadership',
      meta: 'Content Strategy &nbsp;·&nbsp; Topical Authority &nbsp;·&nbsp; E-E-A-T',
      img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Topical authority content case study',
      highlights: [
        { label: 'Organic sessions', value: '+421%' },
        { label: 'Ranking keywords', value: '3,100' },
        { label: 'Articles shipped', value: '184' },
        { label: 'Timeline', value: '14 months' },
      ],
      body: `
        <h2>Backdrop</h2>
        <p>A saturated HR-tech category. The brand had a strong product but no topical authority — competitors with weaker products outranked them on every commercial term because they'd published broadly and deeply for years.</p>

        <h2>Strategy</h2>
        <p>Three topical pillars were chosen carefully — narrow enough to dominate, broad enough to map to real buyer journeys. A pillar-cluster content model was built mapping 184 article briefs across the three pillars. Every brief was anchored to SME interviews with the brand's internal experts; every article published with an author bio, credentials and primary research.</p>

        <h2>Outcome</h2>
        <p>Organic sessions up 421% over 14 months. 3,100 ranking keywords across the three pillars, with 410 on page one. Three SERP feature acquisitions per pillar (featured snippets, People Also Ask, AI Overview citations). The brand is now cited by competitors and analysts as a category authority.</p>
      `
    },
    {
      tag: 'Migration · Enterprise',
      title: 'Enterprise CMS migration: zero ranking loss across 12,000 URLs',
      meta: 'Migration &nbsp;·&nbsp; Redirect Mapping &nbsp;·&nbsp; Parity Testing',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Enterprise SEO migration case study',
      highlights: [
        { label: 'Ranking loss', value: '0%' },
        { label: 'URLs migrated', value: '12,000' },
        { label: 'Redirects clean', value: '100%' },
        { label: 'Downtime', value: '0 min' },
      ],
      body: `
        <h2>The Project</h2>
        <p>An enterprise client was migrating from a legacy CMS to a headless platform. Previous migrations across their business had cost 20–40% of organic traffic for six months while rankings recovered. The board was understandably nervous.</p>

        <h2>Approach</h2>
        <p>We ran a six-week pre-migration audit: every URL crawled, classified, mapped to a destination. Schema parity was tested in a staging environment. Internal linking graphs were compared pre/post. CWV regressions were caught in CI before the cutover. The redirect map was tested with synthetic monitors before going live.</p>

        <h2>Cutover</h2>
        <p>The cutover ran on a Thursday afternoon — deliberately, so any issues could be triaged with the full team present. Real-time monitoring tracked indexation, ranking and conversion through the first 72 hours. No emergency fixes were required.</p>

        <h2>Outcome</h2>
        <p>Zero ranking loss across 12,000 migrated URLs. Indexation recovered to parity within 18 days. Conversion rates uplifted 14% post-migration thanks to the parallel CWV improvements. The CMO sleeps better.</p>
      `
    },
    {
      tag: 'International · 14 markets',
      title: '14-market international SEO: hreflang &amp; geo-architecture rebuilt',
      meta: 'International SEO &nbsp;·&nbsp; hreflang &nbsp;·&nbsp; Localisation',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'International SEO hreflang case study',
      highlights: [
        { label: 'Markets aligned', value: '14' },
        { label: 'Non-EN traffic', value: '+167%' },
        { label: 'Canonical conflicts', value: '0' },
        { label: 'hreflang clusters', value: '14' },
      ],
      body: `
        <h2>The Situation</h2>
        <p>A B2B platform serving 14 international markets had inconsistent country/language targeting. Some markets were on subfolders, some on subdomains, some on ccTLDs. hreflang was implemented incorrectly on 11 of the 14 — creating canonical conflicts and Google serving the wrong language version in non-English markets.</p>

        <h2>Solution</h2>
        <p>The international architecture was rationalised onto subfolder structure with consistent country/language URL patterns. hreflang clusters were rebuilt and validated. Country-specific content was localised (not translated) by in-market editors. Local schema, currency markup and price localisation were deployed per market.</p>

        <h2>Outcome</h2>
        <p>Non-English traffic grew 167% within seven months. Canonical conflicts dropped to zero. Each market now serves the correct language version with no SERP visibility cannibalisation across markets.</p>
      `
    },
    {
      tag: 'Full programme · Ongoing',
      title: 'Multi-product SaaS: unified organic across three product lines',
      meta: 'Full SEO programme &nbsp;·&nbsp; Ongoing retainer',
      img: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Multi-product SaaS SEO case study',
      highlights: [
        { label: 'Cross-product traffic', value: '+289%' },
        { label: 'Blended CAC', value: '−42%' },
        { label: 'Products unified', value: '3' },
        { label: 'Reporting', value: 'Live dashboard' },
      ],
      body: `
        <h2>The Engagement</h2>
        <p>A SaaS holding company had three product lines on three siloed domains. Each was running its own SEO programme. None talked to each other. The same buyer was bouncing between products without recognising they were one company.</p>

        <h2>Unified Strategy</h2>
        <p>We consolidated the three product domains onto a unified topical model with shared authority engine. Cross-product internal linking surfaced relevant adjacent products at the right moment in the buyer journey. A shared Looker Studio dashboard gave leadership visibility into blended organic performance for the first time.</p>

        <h2>Outcome</h2>
        <p>Cross-product organic traffic grew 289% in twelve months. Blended CAC dropped 42% as cross-product internal linking lifted attach rates. The board now treats organic as a strategic moat across the portfolio — not three disconnected channels.</p>
      `
    },
  ];

  window.openProject = function (id) {
    // Use the per-site override (set by webdev-data.js on web-development.html)
    // if it exists; otherwise fall back to the default SEO PROJECTS array.
    const data = window.PROJECTS_OVERRIDE || PROJECTS;
    const p = data[id];
    if (!p) return;

    document.getElementById('project-tag').textContent = p.tag;
    document.getElementById('project-title').textContent = p.title;
    document.getElementById('project-meta').innerHTML = p.meta;

    const img = document.getElementById('project-img');
    img.src = p.img;
    img.alt = p.imgAlt;

    document.getElementById('project-highlights').innerHTML =
      p.highlights.map(h =>
        `<div class="highlight-chip"><span class="highlight-chip-label">${h.label}</span><span class="highlight-chip-value">${h.value}</span></div>`
      ).join('');

    document.getElementById('project-body').innerHTML = p.body;

    showPage('project-detail');
  };
})();

/* ════════════════════════════════════════════════════════════
   BLOG ARTICLES — SEO insights
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const BLOG_POSTS = [
    {
      category: 'Technical SEO',
      title: 'What Is Technical SEO? The 2026 Definitive Guide',
      meta: '12 min read &nbsp;·&nbsp; Updated 2026',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Technical SEO guide 2026',
      body: `
        <p>Technical SEO is the engineering discipline that ensures search engines can crawl, render, understand and trust a website. It's the foundation every other ranking signal depends on — and the layer most agencies still neglect. Here's how we think about it on enterprise accounts in 2026.</p>

        <h2>The Four Layers</h2>
        <p>We model technical SEO as four sequential layers: <strong>crawl</strong>, <strong>index</strong>, <strong>render</strong>, <strong>rank</strong>. Each layer depends on the one before. Skip a layer and the work above it is wasted.</p>

        <h2>Layer 1 — Crawlability</h2>
        <p>Can Googlebot reach your URLs efficiently? This is where crawl budget lives. Audit your robots.txt, your sitemap, your internal linking and your parametrised URL structure. Run a log-file analysis to see what Google actually crawls — versus what you think it crawls. The two are rarely the same.</p>

        <h2>Layer 2 — Indexation</h2>
        <p>Once crawled, can the URL be indexed? Audit canonical tags, meta robots directives, hreflang clusters and the indexable-vs-non-indexable ratio across your domain. Most enterprise sites have 30–60% indexation waste: duplicate variants, parameter-driven pages, soft 404s and orphan URLs. Reclaiming that budget is one of the highest-ROI exercises in technical SEO.</p>

        <h2>Layer 3 — Rendering</h2>
        <p>For JavaScript-heavy sites — SPAs, modern frameworks, SSR/CSR hybrids — rendering is where SEO programmes go to die. Google can render JavaScript, but it does so inconsistently and on a delayed crawl queue. Validate that your critical content is visible in the rendered HTML, not just the client-side DOM. SSR or static generation is almost always the right answer for content pages.</p>

        <h2>Layer 4 — Ranking Signals</h2>
        <p>Schema markup, internal linking architecture, Core Web Vitals, E-E-A-T signals. This is the layer that determines how well Google understands and ranks your indexed content. Each of these is a discipline in itself — covered in detail in our other guides.</p>

        <h2>The Diagnostics We Run</h2>
        <p>Screaming Frog for full-site crawls. Sitebulb for hint extraction. Search Console for index coverage and CWV field data. Log-file analysis (in BigQuery for enterprise volume). Schema validators for graph integrity. Lighthouse CI for regression guards. None of these on its own is sufficient — they triangulate to the truth.</p>

        <p>Technical SEO isn't glamorous. It's the unsexy engineering that decides whether all your content investment ever has a chance to rank. Get it right and everything else compounds. Get it wrong and nothing else matters.</p>
      `
    },
    {
      category: 'Core Web Vitals',
      title: 'Core Web Vitals Explained: LCP, INP &amp; CLS in Plain English',
      meta: '9 min read &nbsp;·&nbsp; Updated 2026',
      img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Core Web Vitals explained',
      body: `
        <p>Google's Core Web Vitals are a set of three field-measured performance metrics that contribute to ranking through the Page Experience signal. Here's what each one actually measures, what good looks like, and the engineering moves that shift them in the field — not just in a Lighthouse simulation.</p>

        <h2>Largest Contentful Paint (LCP)</h2>
        <p><strong>What it measures:</strong> the time until the largest visible element loads. Typically the hero image, hero video, or a large block of text. <strong>Good:</strong> under 2.5s in the 75th percentile of real user data. <strong>How to fix:</strong> identify the LCP candidate, preload it, eliminate render-blocking resources above it, optimise image format and dimensions, prioritise its position in the critical render path.</p>

        <h2>Interaction to Next Paint (INP)</h2>
        <p><strong>What it measures:</strong> the responsiveness of the page when a user interacts — click, tap, key press. INP replaced FID in 2024 and is significantly harder to optimise. <strong>Good:</strong> under 200ms. <strong>How to fix:</strong> reduce JavaScript main-thread work, defer non-critical scripts, use requestIdleCallback for low-priority work, break long tasks into chunks, audit event listeners for unnecessary work.</p>

        <h2>Cumulative Layout Shift (CLS)</h2>
        <p><strong>What it measures:</strong> how much the page layout jumps around during loading. <strong>Good:</strong> under 0.1. <strong>How to fix:</strong> reserve space for images with width/height attributes, reserve space for ad slots, avoid inserting content above existing content, use font-display: swap with size-adjust.</p>

        <h2>Lab vs Field Data</h2>
        <p>The trap most engineers fall into is optimising for Lighthouse scores (lab data) rather than CrUX (field data). CrUX is what Google uses for ranking. If your Lighthouse score is 95 but your field LCP is 4 seconds, you'll lose ranking signal. Optimise for real users — not synthetic tests.</p>

        <h2>The CI Discipline</h2>
        <p>Without CI guardrails, performance regresses every sprint. We deploy Lighthouse CI checks on every PR plus a synthetic-monitoring tier on production. Performance budgets break the build. This is the only way to keep CWV stable long-term.</p>
      `
    },
    {
      category: 'Strategy',
      title: 'The Complete SEO Strategy Guide for 2026',
      meta: '15 min read &nbsp;·&nbsp; New',
      img: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Complete SEO strategy guide',
      body: `
        <p>Most SEO programmes fail not because of execution but because of strategy. The wrong topical map, the wrong KPI, the wrong attribution model — and even excellent execution produces nothing that compounds. Here's the blueprint we use to scope every senior engagement.</p>

        <h2>1. Position</h2>
        <p>SEO is a positioning exercise before it's a content exercise. What category do you intend to own? What are the topical territories adjacent to that category? What are you uniquely qualified to say about them? Without a defensible position, every piece of content is a one-off rather than a compounding asset.</p>

        <h2>2. Topical Map</h2>
        <p>Choose three to five pillar topics. Narrow enough to dominate, broad enough to map to real buyer journeys. Around each pillar, build a cluster of supporting content covering the questions a buyer asks during awareness, consideration and decision. The topical map is the asset that compounds — not the individual articles.</p>

        <h2>3. Keyword Universe</h2>
        <p>From topical map to keyword universe. Every term your buyer might use across the funnel, classified by intent (informational, commercial, transactional), volume, difficulty and business value. This is the targeting layer — what you actually try to rank for.</p>

        <h2>4. Technical Foundation</h2>
        <p>None of the above matters if Google can't crawl, index and render your site. Run the audit first. Fix the foundation before you scale content. We've seen seven-figure content budgets evaporate because the underlying technical health was broken.</p>

        <h2>5. Authority Engine</h2>
        <p>Content earns visibility within your authority ceiling. To raise the ceiling, you need editorial placements, brand mentions and entity associations across the open web. This is the slow, expensive, durable work — and the moat that protects you against AI Overviews compressing organic clicks.</p>

        <h2>6. Reporting &amp; Attribution</h2>
        <p>If you can't tie organic to pipeline, your CFO will eventually defund it. Build the attribution model up front: GA4 + Search Console + your CRM + revenue. Live Looker Studio dashboards. Monthly readouts framed in business language. SEO is a strategic channel — report it like one.</p>

        <h2>7. Time Horizon</h2>
        <p>Compounding takes time. Early wins land in 30–60 days (technical fixes, indexation, vitals). Meaningful traffic compounds from month four. Real pipeline impact between months six and nine. If you can't commit to twelve months, don't start.</p>

        <p>Strategy is what makes SEO defensible. Execution is what makes it compound. Get both right and organic becomes the highest-ROI channel in your acquisition mix.</p>
      `
    },
    {
      category: 'On-Page',
      title: 'The Modern On-Page SEO Checklist (47 Items)',
      meta: '8 min read &nbsp;·&nbsp; Updated 2026',
      img: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'On-page SEO checklist',
      body: `
        <p>On-page SEO has matured well beyond "put keywords in headings." Modern ranking systems evaluate relevance through semantic embeddings, entity recognition and context modelling. Here's the checklist we use across every on-page audit.</p>

        <h2>Title &amp; Meta (1–6)</h2>
        <p>1. Primary keyword near the front of the title. 2. Brand at the end. 3. Title length under 60 characters. 4. Meta description that earns the click. 5. No duplicate titles across the domain. 6. Title matches the dominant search intent.</p>

        <h2>Heading Architecture (7–12)</h2>
        <p>7. One H1 per page. 8. H1 contains the primary topic. 9. H2s define logical sections. 10. H3s subdivide H2s — never skip levels. 11. Keywords in headings serve readers first, search second. 12. Headings reflect the SERP's question pattern.</p>

        <h2>Content (13–22)</h2>
        <p>13. Search intent aligned. 14. Topical coverage comparable to top-ranking pages. 15. Original analysis, data or perspective. 16. Author with credentials surfaced on page. 17. Date of last review visible. 18. Sources cited and linked. 19. Internal links to supporting content. 20. External links to authoritative sources. 21. Mobile-first reading experience. 22. Scannable formatting (short paras, lists, bolding).</p>

        <h2>Entity &amp; Semantic (23–30)</h2>
        <p>23. Primary entity clearly named. 24. Supporting entities co-occur naturally. 25. Schema markup matches content type. 26. Knowledge graph alignment. 27. Synonyms and related terms covered. 28. Topical clusters interlinked. 29. Breadcrumbs with markup. 30. Author / Organization schema present.</p>

        <h2>Technical &amp; UX (31–47)</h2>
        <p>31. Page indexable. 32. Canonical correct. 33. Mobile-friendly. 34. CWV in green. 35. HTTPS. 36. No render-blocking resources above the fold. 37. Images with descriptive alt. 38. Image dimensions specified. 39. Image format (WebP/AVIF). 40. Internal links visible in rendered HTML. 41. Anchor text descriptive. 42. No orphan pages. 43. No broken internal links. 44. URL structure clean. 45. Open Graph tags. 46. Twitter card tags. 47. Hreflang where applicable.</p>

        <p>None of these is exotic. The discipline is in shipping all 47 — not just the easy ones.</p>
      `
    },
    {
      category: 'Keyword Research',
      title: 'Advanced Keyword Research: Beyond Volume &amp; Difficulty',
      meta: '11 min read &nbsp;·&nbsp; Updated 2026',
      img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Advanced keyword research',
      body: `
        <p>Sorting Ahrefs by volume and picking the top results is not keyword research. Modern research is intent modelling, SERP feature analysis, opportunity scoring and topical clustering. Here's the workflow our strategists use when scoping new accounts.</p>

        <h2>1. Universe Construction</h2>
        <p>Start with seed terms from your existing rankings, competitor rankings (Ahrefs gap), AI Overview surface area and audience research. Don't filter yet — capture everything. Typical universe size for a B2B SaaS: 8,000–15,000 candidate keywords.</p>

        <h2>2. Intent Classification</h2>
        <p>Classify every term by intent — informational, commercial investigation, transactional, navigational. The SERP itself is the truth here: what types of results does Google rank? Tutorials? Comparisons? Product pages? Classify based on what's currently winning, not what you'd prefer.</p>

        <h2>3. SERP Feature Analysis</h2>
        <p>Featured snippets, AI Overviews, People Also Ask, image packs, video carousels — every feature compresses the click-through opportunity. Score each term by SERP feature density. A high-volume term with three SERP features sitting above the organic results is worth less than a lower-volume term with clean organic real estate.</p>

        <h2>4. Difficulty vs Opportunity</h2>
        <p>Don't trust the difficulty score in isolation. Combine it with your domain's current authority profile, content gap analysis and competitor weakness scoring. A "DR70" term might be reachable for a DR50 site if the ranking competition is weaker than the domain rating suggests.</p>

        <h2>5. Business Value</h2>
        <p>The most important filter, applied last. Tag every keyword with funnel stage, expected conversion behaviour and an estimated revenue contribution. This is the layer most agencies skip — and it's why so many SEO programmes deliver "traffic" that never becomes pipeline.</p>

        <h2>6. Topical Cluster Mapping</h2>
        <p>Group the final list into pillar/cluster relationships. Identify which pillars your domain can credibly own. Build the content map from the cluster, not the keyword.</p>
      `
    },
    {
      category: 'Local SEO',
      title: 'Local SEO Growth Strategies for Multi-Location Brands',
      meta: '10 min read &nbsp;·&nbsp; Updated 2026',
      img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Local SEO growth strategies',
      body: `
        <p>Multi-location SEO is unforgiving. Get the templating right and one campaign lifts 84 locations at once. Get it wrong and you've shipped the same mistake 84 times. Here's the operating model we deploy across multi-location accounts.</p>

        <h2>The Three Pillars</h2>
        <p>1. <strong>Google Business Profile management</strong> — categories, services, attributes, posts, photos, Q&A, reviews. Standardised centrally, executed locally. 2. <strong>Location pages on your domain</strong> — templated, scalable, locally relevant. 3. <strong>Citation management</strong> — NAP consistency across the citation universe.</p>

        <h2>Google Business Profile</h2>
        <p>Primary category is the single highest-impact field. Get it wrong and you don't rank locally for the queries that matter. Secondary categories cover adjacent intent. Services and attributes are the most underused fields — fill them all. Photos in the first 30 days are weighted unusually heavily. Posts maintain freshness signal. Q&A is a content opportunity many brands ignore entirely.</p>

        <h2>Location Page Templating</h2>
        <p>Build a parameterised template, not 84 hand-crafted pages. Variables: location name, address, phone, manager name, opening hours, local images, local reviews, embedded map. LocalBusiness schema with the full set of properties. The template lifts every location; the localised variables make each unique.</p>

        <h2>Review Velocity</h2>
        <p>Reviews influence both ranking and click-through. A central NPS-triggered review request system outperforms ad-hoc local effort. Respond to every review — positive and negative — within 48 hours. Surface reviews on the location page (with Review schema) for the conversion signal.</p>

        <h2>Citations</h2>
        <p>Citation cleanup is unsexy but high-impact. Audit your name/address/phone consistency across the 50 most-used directories in your geography. Inconsistencies confuse Google's local entity graph. BrightLocal or Yext for the audit; in-house for the fixes.</p>
      `
    },
    {
      category: 'Fundamentals',
      title: 'How Search Engines Actually Rank Websites in 2026',
      meta: '14 min read &nbsp;·&nbsp; Updated 2026',
      img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'How search engines rank',
      body: `
        <p>An executive-level explanation of the modern ranking pipeline. Useful for anyone signing off SEO budget who'd like to understand what they're paying for.</p>

        <h2>Stage 1 — Crawl</h2>
        <p>Googlebot discovers URLs through sitemaps, internal links, external links and submitted URLs. It downloads them subject to crawl budget — a per-site allocation based on site authority, server response speed and demand signals.</p>

        <h2>Stage 2 — Index</h2>
        <p>Crawled pages enter the indexing pipeline. Content is parsed, deduplicated, classified by topic and stored in a massive distributed index. Not every crawled URL is indexed — quality, duplication and relevance filters apply.</p>

        <h2>Stage 3 — Retrieval</h2>
        <p>When a query is issued, the system retrieves candidate pages from the index. This is broad-stroke matching — hundreds or thousands of potential candidates surface for any non-trivial query.</p>

        <h2>Stage 4 — Ranking</h2>
        <p>Candidates are scored against ranking signals. The exact signals are proprietary but include: content relevance (semantic, entity-based), authority (link signals), user signals (CTR, engagement), Core Web Vitals, freshness and dozens of others. Different queries weight signals differently — "best laptop 2026" weights freshness heavily; "what is technical seo" weights authority.</p>

        <h2>Stage 5 — Re-ranking &amp; Personalisation</h2>
        <p>The top candidates are re-ranked considering user context (location, device, query history) and SERP features (featured snippets, AI Overviews, People Also Ask). The final result you see is personalised — different users see different SERPs.</p>

        <h2>AI Overviews</h2>
        <p>Since 2024, AI-generated answers sit above traditional organic results for many queries. They draw from indexed content but compress click-through opportunity. Being cited in AI Overviews is a new ranking objective — and the signals that earn citation overlap with but aren't identical to traditional ranking signals.</p>

        <p>The whole pipeline takes milliseconds. The work that earns ranking in it takes months. That mismatch is why SEO compounds slowly and beats most channels long-term.</p>
      `
    },
    {
      category: 'Schema',
      title: 'The Practical Schema Markup Guide (with JSON-LD Examples)',
      meta: '9 min read &nbsp;·&nbsp; Updated 2026',
      img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&q=80&auto=format&fit=crop',
      imgAlt: 'Schema markup guide',
      body: `
        <p>Schema markup tells search engines what your content is — explicitly. Done well it earns rich results, AI Overview citations and knowledge graph alignment. Done poorly it warns and gets ignored. Here's the practical guide.</p>

        <h2>JSON-LD vs Microdata</h2>
        <p>Use JSON-LD. Microdata is legacy and harder to maintain. JSON-LD is a single self-contained block, easy to template, easy to validate, easy to debug.</p>

        <h2>The Core Types</h2>
        <p><strong>Organization</strong> — sitewide, in your global head. Establishes your entity. <strong>WebSite</strong> — sitewide, with optional SearchAction for sitelinks search box. <strong>BreadcrumbList</strong> — on every page with a breadcrumb. <strong>Article</strong> or <strong>BlogPosting</strong> — on every content page, with author and dateModified. <strong>Product</strong> — on commerce pages, with offers, aggregateRating, brand. <strong>FAQPage</strong> — for genuine FAQ content (don't fake it). <strong>HowTo</strong> — for genuine how-to content.</p>

        <h2>The Schema Graph</h2>
        <p>The advanced move: combine multiple types into a single graph using @graph syntax. Link entities together with @id references. This builds a richer entity model and significantly increases the chance of knowledge graph pickup.</p>

        <h2>Validation Workflow</h2>
        <p>Every schema deploy goes through three checks: Google's Rich Results Test (for eligible rich result types), the Schema Markup Validator (for syntax correctness), and a manual inspection in Search Console once indexed. Schema that doesn't pass these three gets removed — broken schema is worse than no schema.</p>

        <h2>Common Mistakes</h2>
        <p>Marking up content that doesn't exist on the page. Wrong type for the content. Missing required properties. Stale data. Faking ratings. Each of these gets you a Search Console warning or a manual action.</p>

        <p>Schema is invisible to users but it's a direct conversation with Google about what your content means. Have that conversation properly and you'll earn placements competitors never see.</p>
      `
    },
  ];

  window.openBlogPost = function (id) {
    const data = window.BLOG_POSTS_OVERRIDE || BLOG_POSTS;
    const p = data[id];
    if (!p) return;
    document.getElementById('article-category').textContent = p.category;
    document.getElementById('article-title').innerHTML = p.title;
    document.getElementById('article-meta').innerHTML = p.meta;
    const img = document.getElementById('article-img');
    img.src = p.img;
    img.alt = p.imgAlt;
    document.getElementById('article-body').innerHTML = p.body;
    showPage('blog-article');
  };
})();

/* ════════════════════════════════════════════════════════════
   REVIEWS CAROUSEL — Swiper-style slider (drag + arrows + autoplay)
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function initReviewsCarousel() {
    document.querySelectorAll('.reviews-carousel').forEach(function (car) {
      if (car.dataset.bound) return;
      car.dataset.bound = '1';
      var track = car.querySelector('.reviews-track');
      if (!track) return;
      var wrap = car.closest('section') || document;
      var prev = wrap.querySelector('[data-rev-prev]');
      var next = wrap.querySelector('[data-rev-next]');
      function step() {
        var card = track.querySelector('.review');
        return card ? card.getBoundingClientRect().width + 24 : 360;
      }
      if (prev) prev.addEventListener('click', function () { car.scrollBy({ left: -step(), behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { car.scrollBy({ left: step(), behavior: 'smooth' }); });
      var down = false, sx = 0, sl = 0, moved = false;
      car.addEventListener('pointerdown', function (e) { down = true; moved = false; sx = e.clientX; sl = car.scrollLeft; });
      car.addEventListener('pointermove', function (e) {
        if (!down) return;
        var d = e.clientX - sx;
        if (Math.abs(d) > 4) { moved = true; car.classList.add('dragging'); }
        car.scrollLeft = sl - d;
      });
      function end() { down = false; setTimeout(function () { car.classList.remove('dragging'); }, 30); }
      car.addEventListener('pointerup', end);
      car.addEventListener('pointercancel', end);
      car.addEventListener('pointerleave', function () { if (down) end(); });
      car.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        setInterval(function () {
          if (car.matches(':hover') || down) return;
          if (car.scrollLeft + car.clientWidth >= car.scrollWidth - 6) car.scrollTo({ left: 0, behavior: 'smooth' });
          else car.scrollBy({ left: step(), behavior: 'smooth' });
        }, 4800);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initReviewsCarousel);
  else initReviewsCarousel();
})();

/* ════════════════════════════════════════════════════════════
   ENTERPRISE MOTION — magnetic CTAs + hero orb parallax
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  function initMotion() {
    if (!reduce && fine) {
      document.querySelectorAll('.hero-cta .btn, .cta-band-inner .btn, .nav-cta-btn').forEach(function (b) {
        if (b.dataset.mag) return; b.dataset.mag = '1';
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.25;
          var y = (e.clientY - r.top - r.height / 2) * 0.35;
          b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
      });
    }
    if (!reduce) {
      var orb = document.querySelector('.hero-orb');
      if (orb) {
        var ticking = false;
        var upd = function () { orb.style.transform = 'translateY(calc(-50% + ' + (window.scrollY * 0.12).toFixed(1) + 'px))'; ticking = false; };
        window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, { passive: true });
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion);
  else initMotion();
})();


/* ════════════════════════════════════════════════════════════
   AUDIT MODAL — open/close, focus-trap, Esc, scroll-lock, ARIA
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var lastFocus = null;
  function modal(){ return document.getElementById('auditModal'); }
  function open(){
    var m = modal(); if(!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open'); m.setAttribute('aria-hidden','false');
    document.body.classList.add('menu-open');
    var f = m.querySelector('input,select,textarea,button');
    if(f) setTimeout(function(){ f.focus(); }, 40);
  }
  function close(){
    var m = modal(); if(!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden','true');
    document.body.classList.remove('menu-open');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function(e){
    if(e.target.closest('[data-open-audit]')){ e.preventDefault(); open(); return; }
    if(e.target.closest('[data-close-modal]')){ e.preventDefault(); close(); }
  });
  document.addEventListener('keydown', function(e){
    var m = modal(); if(!m || !m.classList.contains('open')) return;
    if(e.key === 'Escape'){ close(); return; }
    if(e.key === 'Tab'){
      var nodes = m.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
      var f = Array.prototype.filter.call(nodes, function(el){ return el.offsetParent !== null; });
      if(!f.length) return;
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });
  window.openAuditModal = open;
})();

/* ════════════════════════════════════════════════════════════
   ROUTE METADATA + HASH DEEP-LINKING
   Additive layer over window.showPage. Keeps <title>, meta
   description and OG/Twitter title+description in sync with the
   active SPA page, and makes pages shareable/bookmarkable via a
   URL hash (e.g. /#services). Canonical stays the site root —
   fragments are intentionally NOT separate indexable URLs, so
   this aids users & link previews, not duplicate indexing.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var HOME_TITLE = 'Alpha Digital Solutions | Premium SEO Agency · Technical SEO, Organic Growth & Search Visibility';

  // id -> { t: <title>, d: <meta description> }
  var META = {
    'home':             { t: HOME_TITLE, d: 'Alpha Digital Solutions is a Toronto SEO agency engineering measurable organic growth — technical SEO, on-page, off-page authority, local SEO and Reddit/AEO visibility.' },
    'services':         { t: 'SEO Services — Technical, On-Page, Off-Page, Local & Community | Alpha Digital Solutions', d: 'Five SEO pillars under one accountable team: technical & performance, on-page & content, off-page authority, local growth, and Reddit & community visibility with AEO.' },
    'service-technical':{ t: 'Technical SEO & Performance | Alpha Digital Solutions', d: 'Site audits, Core Web Vitals, crawl architecture, indexation and schema markup — the engineering foundation that lets every other SEO effort compound.' },
    'service-onpage':   { t: 'On-Page SEO & Content Strategy | Alpha Digital Solutions', d: 'Keyword mapping, content-gap analysis, optimised landing pages and metadata. Bring your own keywords or commission full-scale content strategy.' },
    'service-offpage':  { t: 'Off-Page SEO & Authority | Alpha Digital Solutions', d: 'White-hat link building, digital PR and brand mentions that build durable domain authority — no spam, no PBNs, no shortcuts.' },
    'service-reddit':   { t: 'Reddit & Community Visibility + AEO | Alpha Digital Solutions', d: 'Authentic placement on Reddit, Quora and industry communities, plus Answer Engine Optimisation so you surface inside AI overviews.' },
    'service-local':    { t: 'Local SEO & Regional Growth | Alpha Digital Solutions', d: 'Google Business Profile, local citations, geo-targeted landing pages and review velocity to win the map pack and nearby searches.' },
    'process':          { t: 'Our SEO Process | Alpha Digital Solutions', d: 'How we work: forensic audit, strategy, sprint-based execution and transparent reporting — with pre-approval on every change and no lock-in.' },
    'work':             { t: 'Case Studies & Results | Alpha Digital Solutions', d: 'Real SEO engagements and the organic growth they produced — migrations, technical recoveries and content programmes.' },
    'project-detail':   { t: 'Case Study | Alpha Digital Solutions', d: 'A detailed look at one Alpha Digital Solutions SEO engagement — the challenge, the work and the measurable results.' },
    'blog':             { t: 'SEO Insights & Resources | Alpha Digital Solutions', d: 'Practical, senior-led articles on technical SEO, content strategy, link building, local SEO and answer-engine optimisation.' },
    'blog-article':     { t: 'SEO Insight | Alpha Digital Solutions', d: 'An in-depth SEO article from the Alpha Digital Solutions team.' },
    'about':            { t: 'About Alpha Digital Solutions | Toronto SEO Agency', d: 'A senior-led, white-hat SEO agency in Toronto. Humble, results-over-hype, NDA-ready, with a 30-day rolling commitment and no lock-in.' },
    'contact':          { t: 'Contact & Free SEO Audit | Alpha Digital Solutions', d: 'Book a free SEO audit or talk to a senior strategist. Toronto-based, 24-hour email response, no obligation.' }
  };

  // Pages safe to restore directly from a hash (excludes home and the
  // detail pages, whose content is populated dynamically on navigation).
  var ROUTABLE = {};
  Object.keys(META).forEach(function (k) {
    if (k !== 'home' && k !== 'project-detail' && k !== 'blog-article') ROUTABLE[k] = true;
  });

  function setMetaTag(attr, key, value) {
    if (!value) return;
    var el = document.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function applyMeta(id) {
    var m = META[id] || META.home;
    if (m.t) {
      document.title = m.t;
      setMetaTag('property', 'og:title', m.t);
      setMetaTag('name', 'twitter:title', m.t);
    }
    if (m.d) {
      setMetaTag('name', 'description', m.d);
      setMetaTag('property', 'og:description', m.d);
      setMetaTag('name', 'twitter:description', m.d);
    }
  }

  var routing = false; // true while we're routing FROM the hash (suppresses write-back)
  var origShowPage = window.showPage;

  if (typeof origShowPage === 'function') {
    window.showPage = function (id) {
      origShowPage(id);
      applyMeta(id);
      if (!routing) {
        var url = ROUTABLE[id] ? ('#' + id) : (location.pathname + location.search);
        try { history.replaceState(null, '', url); } catch (e) { /* file:// etc. */ }
      }
    };
  }

  function routeFromHash() {
    var h = (location.hash || '').replace(/^#/, '').trim();
    if (!h || !ROUTABLE[h]) return;
    if (!document.getElementById('page-' + h)) return;
    if (typeof window.showPage !== 'function') return;
    routing = true;
    window.showPage(h);
    routing = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', routeFromHash);
  } else {
    routeFromHash();
  }
  window.addEventListener('hashchange', routeFromHash);
})();
