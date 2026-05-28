// ── Mobile menu toggle ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Navbar: transparent → solid on scroll ──
const navbar = document.getElementById('navbar');
function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNavbar);
updateNavbar();

// ── Hero logo → navbar merge animation (homepage only) ──
const heroLogoCenter = document.getElementById('heroLogoCenter');
if (heroLogoCenter) {
  // Recalculate target each time in case of resize
  function getMergeParams() {
    const n = document.querySelector('.nav-logo');
    const h = heroLogoCenter;
    if (!n || !h) return { travelY: -163, scaleEnd: 0.308, MERGE_END: 220 };
    const hR = h.getBoundingClientRect();
    const nR = n.getBoundingClientRect();
    const heroCY = hR.top + hR.height / 2;
    const navCY  = nR.top + nR.height / 2;
    const MERGE_END = Math.round(heroCY * 0.6); // scroll distance
    const travelY   = Math.round(navCY - (heroCY - MERGE_END));
    const scaleEnd  = nR.height / hR.height;
    return { travelY, scaleEnd, MERGE_END };
  }

  let params = getMergeParams();
  window.addEventListener('resize', () => { params = getMergeParams(); }, { passive: true });

  function animateHeroLogo() {
    const { travelY, scaleEnd, MERGE_END } = params;
    const progress = Math.min(window.scrollY / MERGE_END, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2; // easeInOutQuad

    heroLogoCenter.style.opacity   = 1 - ease;
    heroLogoCenter.style.transform =
      `translateY(${travelY * ease}px) scale(${1 - (1 - scaleEnd) * ease})`;
  }
  window.addEventListener('scroll', animateHeroLogo, { passive: true });
  animateHeroLogo();
}

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id], footer[id]');
const navAs    = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAs.forEach(a => {
    a.style.color = (a.getAttribute('href') === '#' + current)
      ? '#956834' : '';
  });
});

// ── Counter animation (triggered once when section enters viewport) ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counters = document.querySelectorAll('.counter');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
    }
  });
}, { threshold: 0.3 });

if (counters.length) {
  counterObserver.observe(document.querySelector('.travel-section'));
}

// ── Contact form ──
const msgArea  = document.getElementById('c-msg');
const msgCount = document.getElementById('msgCount');
if (msgArea && msgCount) {
  msgArea.addEventListener('input', () => {
    msgCount.textContent = msgArea.value.length + ' / 180';
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = (document.getElementById('c-name').value    || '').trim();
    const address = (document.getElementById('c-address').value || '').trim();
    const phone   = (document.getElementById('c-phone').value   || '').trim();
    const msg     = (document.getElementById('c-msg').value     || '').trim();
    if (!name || !address) {
      alert('Please fill in the required fields (Name & Address).');
      return;
    }
    const text = `Hello Gujral Hills,\n\nName: ${name}\nAddress: ${address}${phone ? '\nPhone: ' + phone : ''}${msg ? '\nMessage: ' + msg : ''}`;
    window.open('https://wa.me/919424800188?text=' + encodeURIComponent(text), '_blank');
  });
}
