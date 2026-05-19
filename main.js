document.addEventListener('DOMContentLoaded', () => {

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .sidebar-nav a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity  = navLinks.classList.contains('open') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
  }

  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  document.querySelectorAll('.tab-list').forEach(list => {
    const btns   = list.querySelectorAll('.tab-btn');
    const panels = list.closest('.tabs').querySelectorAll('.tab-panel');
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        panels[i].classList.add('active');
      });
    });
  });

  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body   = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      document.querySelectorAll('.accordion-btn.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        btn.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lbImg    = lightbox ? lightbox.querySelector('img') : null;

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      if (lightbox && lbImg) {
        lbImg.src = el.dataset.lightbox;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightbox) {
    const close = lightbox.querySelector('.lightbox-close');
    close.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.time-slot:not(.busy)').forEach(slot => {
    slot.addEventListener('click', () => {
      slot.closest('.time-slots').querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      showNotification('✓ Запит на запис надіслано! Ми зв\'яжемось з вами найближчим часом.');
      bookingForm.reset();
      document.querySelectorAll('.time-slot.selected').forEach(s => s.classList.remove('selected'));
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showNotification('✓ Повідомлення надіслано! Дякуємо за звернення.');
      contactForm.reset();
    });
  }

  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showNotification('✓ Ви успішно підписались на новини Glamour Studio!');
      form.reset();
    });
  });

  function showNotification(msg) {
    const n = document.getElementById('notification');
    if (!n) return;
    n.textContent = msg;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 4000);
  }

  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);
  }
  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      cookieBanner.classList.remove('show');
      localStorage.setItem('cookieAccepted', '1');
    });
  }

  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    let start    = null;

    const counterObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(function step(ts) {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / dur, 1);
          el.textContent = Math.floor(progress * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        });
        counterObs.unobserve(el);
      }
    });
    counterObs.observe(el);
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-filterable');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const regForm = document.getElementById('regForm');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const pwd  = document.getElementById('regPwd').value;
      const pwd2 = document.getElementById('regPwd2').value;
      if (pwd !== pwd2) {
        showNotification(' Паролі не співпадають!');
        return;
      }
      showNotification(' Реєстрацію успішно завершено! Ласкаво просимо!');
      regForm.reset();
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      showNotification(' Вхід виконано успішно!');
      loginForm.reset();
    });
  }

  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.qty-control').querySelector('.qty-input');
      let val = parseInt(input.value) || 1;
      if (btn.dataset.action === 'plus')  val = Math.min(val + 1, 99);
      if (btn.dataset.action === 'minus') val = Math.max(val - 1, 1);
      input.value = val;
    });
  });

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      showNotification(' Товар додано до кошика!');
      btn.textContent = ' Додано';
      setTimeout(() => btn.textContent = 'В кошик', 2000);
    });
  });

});
