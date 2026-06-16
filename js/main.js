(function () {
  'use strict';

  const header = document.getElementById('header');
  const hero = document.getElementById('hero');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const reservationForm = document.getElementById('reservationForm');
  const reviewsInner = document.getElementById('reviewsInner');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentImageIndex = 0;
  let galleryImages = [];

  /* ---- Header scroll behavior ---- */
  function updateHeader() {
    const heroBottom = hero.offsetHeight;
    const scrolled = window.scrollY > 60;

    header.classList.toggle('header--scrolled', scrolled);
    header.classList.toggle('header--hero', window.scrollY < heroBottom - 100);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---- Mobile navigation ---- */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Reviews infinite scroll (duplicate cards) ---- */
  if (reviewsInner) {
    const cards = reviewsInner.innerHTML;
    reviewsInner.innerHTML = cards + cards;
  }

  /* ---- Gallery lightbox ---- */
  const galleryItems = document.querySelectorAll('.gallery__item');
  galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
  }));

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentImageIndex].src;
      lightboxImg.alt = galleryImages[currentImageIndex].alt;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  lightboxImg.style.transition = 'opacity 0.15s ease';

  /* ---- Reservation form ---- */
  if (reservationForm) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('arrivee').min = today;
    document.getElementById('depart').min = today;

    document.getElementById('arrivee').addEventListener('change', function () {
      document.getElementById('depart').min = this.value;
    });

    reservationForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nom = document.getElementById('nom').value;
      const email = document.getElementById('email').value;
      const telephone = document.getElementById('telephone').value;
      const arrivee = document.getElementById('arrivee').value;
      const depart = document.getElementById('depart').value;
      const chambre = document.getElementById('chambre');
      const chambreLabel = chambre.options[chambre.selectedIndex].text;
      const personnes = document.getElementById('personnes').value;
      const petitdej = document.getElementById('petitdej').checked;
      const message = document.getElementById('message').value;

      const chambreMap = {
        indifferent: 'Indifférent',
        chambre1: 'Chambre 1 — 50 €',
        chambre2: 'Chambre 2 — 50 €'
      };

      const body = [
        'Bonjour Marie-Claire,',
        '',
        'Je souhaiterais réserver une nuitée au Quai des Rêves.',
        '',
        `Nom : ${nom}`,
        `Email : ${email}`,
        telephone ? `Téléphone : ${telephone}` : '',
        `Arrivée : ${formatDate(arrivee)}`,
        `Départ : ${formatDate(depart)}`,
        `Chambre : ${chambreMap[chambre.value] || chambreLabel}`,
        `Personnes : ${personnes}`,
        petitdej ? 'Petit-déjeuner : Oui (7,50 € / personne)' : 'Petit-déjeuner : Non',
        message ? `\nMessage :\n${message}` : '',
        '',
        'Merci et à bientôt !'
      ].filter(Boolean).join('\n');

      const subject = encodeURIComponent(`Réservation — ${nom} — ${formatDate(arrivee)}`);
      const mailBody = encodeURIComponent(body);

      window.location.href = `mailto:marieclairepaul57@gmail.com?subject=${subject}&body=${mailBody}`;
    });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ---- FAQ: only one open at a time ---- */
  document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq__item').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---- Smooth parallax on hero ---- */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < hero.offsetHeight) {
      const img = hero.querySelector('.hero__bg img');
      if (img) img.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });

})();
