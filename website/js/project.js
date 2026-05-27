/* ── Renders slideshow ── */
(function () {
  const ss = document.getElementById('rendersSlideshow');
  if (!ss) return;

  const slides = ss.querySelectorAll('.slide');
  const dots   = ss.querySelectorAll('.slide-dot');
  const prev   = ss.querySelector('.slide-prev');
  const next   = ss.querySelector('.slide-next');
  let current  = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() { clearInterval(timer); }

  prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  ss.addEventListener('mouseenter', stopAuto);
  ss.addEventListener('mouseleave', startAuto);

  // Keyboard support
  ss.setAttribute('tabindex', '0');
  ss.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
  });

  startAuto();
})();

/* ── Scroll-reveal observer ── */
const revealEls = document.querySelectorAll('.reveal-up');
if (revealEls.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));
}

/* ── Plot counter animation ── */
function animatePlotCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const steps = duration / 16;
  const step = Math.ceil(target / steps);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const plotCounters = document.querySelectorAll('.plot-counter');
let plotCountersFired = false;
if (plotCounters.length) {
  const plotObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !plotCountersFired) {
        plotCountersFired = true;
        plotCounters.forEach(animatePlotCounter);
      }
    });
  }, { threshold: 0.25 });
  plotObs.observe(document.querySelector('.total-plots-section'));
}

/* ── Stacked bar animation ── */
const barSegments = document.querySelectorAll('.type-bar-segment');
let barFired = false;
if (barSegments.length) {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !barFired) {
        barFired = true;
        // Store target widths, start from 0, animate in
        barSegments.forEach(seg => {
          const target = seg.style.width;
          seg.style.width = '0%';
          // Trigger reflow
          seg.getBoundingClientRect();
          seg.classList.add('animated');
          requestAnimationFrame(() => { seg.style.width = target; });
        });
      }
    });
  }, { threshold: 0.3 });
  barObs.observe(document.querySelector('.plots-type-bar-wrap'));
}
