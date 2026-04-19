// ========== UTILITAIRES ==========

/**
 * Fonction de debouncing pour optimiser les événements fréquents
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai d'attente en ms
 * @returns {Function} - Fonction debouncée
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== GESTION DE LA NAVIGATION ==========

// Sélection des éléments
const navLinks = document.querySelectorAll('.nav-menu li a');
const sections = document.querySelectorAll('.section');
const menuToggle = document.getElementById('menu-toggle');
const hamburger = document.querySelector('.hamburger');

/**
 * Met à jour le lien actif dans la navigation en fonction du scroll
 */
function updateActiveNav() {
  let current = '';
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');

    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Écouter le scroll avec debouncing
window.addEventListener('scroll', debounce(updateActiveNav, 100));

/**
 * Gestion du clic sur les liens de navigation
 */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    // Fermer le menu hamburger
    if (menuToggle) {
      menuToggle.checked = false;
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }

    // Scroll vers la section avec animation fluide
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Mettre à jour aria-expanded quand le menu hamburger change
if (menuToggle && hamburger) {
  menuToggle.addEventListener('change', () => {
    hamburger.setAttribute('aria-expanded', menuToggle.checked ? 'true' : 'false');
  });
}

// ========== ANIMATIONS AU SCROLL ==========

/**
 * Intersection Observer pour animer les éléments au scroll
 */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optionnel : arrêter d'observer une fois visible
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer tous les éléments avec la classe animate-on-scroll
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // Animation de la présentation au chargement
  const presentation = document.querySelector('.presentation');
  if (presentation) {
    presentation.classList.add('fade-in');
  }
});

// ========== BOUTON SCROLL TO TOP ==========

/**
 * Crée et gère le bouton de retour en haut de page
 */
function createScrollToTopButton() {
  // Créer le bouton
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.setAttribute('aria-label', 'Retour en haut de la page');
  scrollToTopBtn.setAttribute('title', 'Retour en haut');

  // Ajouter au DOM
  document.body.appendChild(scrollToTopBtn);

  // Gérer la visibilité du bouton
  const toggleScrollButton = debounce(() => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }, 100);

  window.addEventListener('scroll', toggleScrollButton);

  // Gérer le clic
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Créer le bouton au chargement de la page
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ========== AMÉLIORATIONS DE PERFORMANCE ==========

/**
 * Préchargement des images au survol des liens
 */
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      // Précharger les ressources de la section cible si nécessaire
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          const images = targetSection.querySelectorAll('img[data-src]');
          images.forEach(img => {
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
            }
          });
        }
      }
    }, { once: true });
  });
});

// ========== GESTION DES ERREURS ==========

/**
 * Gestion globale des erreurs
 */
window.addEventListener('error', (event) => {
  console.error('Erreur détectée:', event.error);
  // En production, vous pourriez envoyer ces erreurs à un service de monitoring
});

/**
 * Gestion des promesses rejetées
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
});

// ========== ACCESSIBILITÉ ==========

/**
 * Amélioration de l'accessibilité au clavier
 */
document.addEventListener('DOMContentLoaded', () => {
  // Permettre la navigation au clavier dans les cartes
  const cards = document.querySelectorAll('.experience-card, .project-card, .competence-block');
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
  });

  // Gérer la touche Escape pour fermer le menu mobile
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle && menuToggle.checked) {
      menuToggle.checked = false;
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// ========== CONSOLE INFO ==========

console.log('%cBienvenue sur mon CV!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cSite développé par Matthieu Calesse', 'font-size: 14px; color: #764ba2;');
console.log('%cGitHub: https://github.com/cal-Matthieu', 'font-size: 12px; color: #6c757d;');
