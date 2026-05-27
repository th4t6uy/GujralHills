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
updateNavbar(); // run on load

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
