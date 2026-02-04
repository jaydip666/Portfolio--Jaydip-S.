// Simple interactions: menu toggle, contact mailto, year injection, smooth scroll
(function(){
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');

  // Toggle mobile nav by adding/removing class 'open' (better for transitions)
  const body = document.body;
  const main = document.querySelector('main');
  const navClose = document.querySelector('.nav-close');

  function openNav(){
    nav.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded','true');
    if(main) main.setAttribute('aria-hidden','true');
    body.style.overflow = 'hidden';
    nav.setAttribute('aria-hidden','false');
    // shift focus to first link
    const firstLink = nav.querySelector('a');
    firstLink && firstLink.focus();
  }
  function closeNav(){
    nav.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    if(main) main.setAttribute('aria-hidden','false');
    body.style.overflow = '';
    nav.setAttribute('aria-hidden','true');
    menuBtn.focus();
  }

  menuBtn && menuBtn.addEventListener('click', ()=>{
    if(nav.classList.contains('open')) closeNav(); else openNav();
  });

  // Close via close button
  navClose && navClose.addEventListener('click', closeNav);

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e)=>{
    if(!nav || !menuBtn) return;
    if(!nav.classList.contains('open')) return;
    if(menuBtn.contains(e.target) || nav.contains(e.target)) return;
    closeNav();
  });

  // Close with Escape key
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && nav.classList.contains('open')){
      closeNav();
    }
  });

  // Contact form fallback using mailto
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const subject = encodeURIComponent(`Contact from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} <${data.email}>`);
      window.location.href = `mailto:you@domain.com?subject=${subject}&body=${body}`;
    });
  }

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Profile image fallback: prefer user-uploaded jpg/png at assets/profile.jpg or .png, fallback to svg
  (function(){
    const img = document.querySelector('.profile-card img');
    if(!img) return;
    const trySrc = ['assets/profile.jpg','assets/profile.png'];
    let tried = 0;
    function tryNext(){
      if(tried >= trySrc.length){
        // final fallback is existing svg already in src
        return;
      }
      img.src = trySrc[tried];
      img.onerror = ()=>{ tried++; tryNext(); };
    }
    // only attempt fallback if the current src looks like the placeholder svg
    if(img && img.src && img.src.endsWith('profile.svg')){
      tryNext();
    }
  })();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile nav after navigation
        if(nav && nav.classList.contains('open')){
          nav.classList.remove('open');
          menuBtn && menuBtn.setAttribute('aria-expanded','false');
          menuBtn && menuBtn.classList.remove('open');
        }
      }
    });
  });

  // Reveal-on-scroll using IntersectionObserver
  document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    // Stagger project card animations
    document.querySelectorAll('.projects .project').forEach((el, i)=>{
      el.style.transitionDelay = `${i * 120}ms`;
    });

    const observer = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin: '0px 0px -8% 0px'});

    reveals.forEach(r => observer.observe(r));
  });

})();