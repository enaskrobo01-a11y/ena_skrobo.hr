const toggleBtn = document.getElementById('darkModeToggle');
const themeMenu = document.getElementById('themeMenu');
const themeSwitcher = document.querySelector('.theme-switcher');
const themeLightButton = document.getElementById('themeLight');
const themeDarkButton = document.getElementById('themeDark');

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

if (toggleBtn && themeSwitcher && themeLightButton && themeDarkButton) {
  toggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    themeSwitcher.classList.toggle('open');
    const expanded = themeSwitcher.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', expanded);
  });

  themeLightButton.addEventListener('click', () => {
    applyTheme('light');
    themeSwitcher.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  });

  themeDarkButton.addEventListener('click', () => {
    applyTheme('dark');
    themeSwitcher.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.theme-switcher')) {
      themeSwitcher.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

const navLinks = document.querySelectorAll('.nav-links a');
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);
let currentSection = 'sazetak';

const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 2400);
};

const scrollToSection = (target) => {
  const top = target.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: 'smooth' });
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      if (targetId === `#${currentSection}`) {
        showToast('Već se nalazite u ovoj sekciji.');
        return;
      }
      scrollToSection(target);
    }
  });
});

const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('copy', (event) => {
  event.preventDefault();
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
    event.preventDefault();
  }
});

const heroImage = document.querySelector('.hero-image img');
const imageModal = document.getElementById('imageModal');
const imageModalClose = document.getElementById('imageModalClose');
const imageModalBackdrop = document.getElementById('imageModalBackdrop');

const openImageModal = () => {
  imageModal.classList.add('open');
  imageModal.setAttribute('aria-hidden', 'false');
};

const closeImageModal = () => {
  imageModal.classList.remove('open');
  imageModal.setAttribute('aria-hidden', 'true');
};

heroImage?.addEventListener('click', openImageModal);
imageModalClose?.addEventListener('click', closeImageModal);
imageModalBackdrop?.addEventListener('click', closeImageModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeImageModal();
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((el, idx) => {
  el.style.transitionDelay = `${Math.min(idx * 90, 420)}ms`;
  sectionObserver.observe(el);
});

const highlightSection = () => {
  const sectionIds = ['sazetak', 'uvod', 'razrada', 'zakljucak', 'izvori'];
  let current = sectionIds[0];

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const triggerPoint = section.offsetTop - 140;
    if (window.scrollY >= triggerPoint) {
      current = id;
    }
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', active);
  });
};

window.addEventListener('scroll', highlightSection);
highlightSection();

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = `© ${new Date().getFullYear()}`;
}