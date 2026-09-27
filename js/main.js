// El CSP de este sitio es `style-src 'self'` (sin 'unsafe-inline'): asignar
// `elemento.style.propiedad = ...` desde JS cuenta como "estilo en línea" y el
// navegador lo bloquea en silencio. Para los efectos que sí necesitan un valor
// dinámico (barra de progreso, barras de estadísticas, inclinación 3D) se
// inserta una regla en la propia hoja style.css (ya permitida por el CSP) y se
// modifica esa regla via CSSOM — eso no cuenta como estilo en línea.
const styleSheet = document.querySelector('link[href^="css/style.css"]').sheet;
let dynamicRuleCounter = 0;
function dynamicRule(selectorText, initialDecl) {
  const idx = styleSheet.cssRules.length;
  styleSheet.insertRule(`${selectorText} { ${initialDecl} }`, idx);
  return styleSheet.cssRules[idx];
}
function withDynamicId(el) {
  if (!el.dataset.dynId) el.dataset.dynId = 'dyn' + (dynamicRuleCounter += 1);
  return el.dataset.dynId;
}

const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('#nav a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!document.getElementById('consentimiento').checked) {
    return;
  }

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensaje = document.getElementById('mensaje').value.trim();

  const subject = `Solicitud de presupuesto — ${servicio}`;
  const body = [
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    telefono ? `Teléfono: ${telefono}` : null,
    `Servicio: ${servicio}`,
    '',
    mensaje,
  ].filter(Boolean).join('\n');

  const mailto = `mailto:g2ecoclima@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
});

// Formulario rápido de presupuesto (portada): igual que el de contacto, abre el
// programa de correo con la solicitud lista para enviar; no se guarda nada.
const quoteForm = document.getElementById('presupuesto');
if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const servicio = document.getElementById('qServicio').value;
    const ubicacion = document.getElementById('qUbicacion').value.trim();
    const telefono = document.getElementById('qTelefono').value.trim();
    const subject = `Solicitud de presupuesto — ${servicio}`;
    const body = [
      `Servicio: ${servicio}`,
      `Ubicación del proyecto: ${ubicacion}`,
      `Teléfono: ${telefono}`,
    ].join('\n');
    window.location.href = `mailto:g2ecoclima@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Mapa de Google bajo demanda: no se conecta con Google hasta que el usuario lo pide.
const mapContainer = document.getElementById('contactMap');
const mapConsentBtn = document.getElementById('mapConsentBtn');
if (mapContainer && mapConsentBtn) {
  mapConsentBtn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.title = 'Ubicación de G2 Eco Clima S.L.';
    iframe.src = mapContainer.dataset.mapSrc;
    iframe.width = '100%';
    iframe.height = '220';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    mapContainer.innerHTML = '';
    mapContainer.appendChild(iframe);
  });
}

// Aviso de cookies: informativo, se recuerda la elección solo en este navegador.
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner && cookieAccept) {
  try {
    if (!localStorage.getItem('g2ecoclima_cookie_ack')) {
      cookieBanner.hidden = false;
    }
  } catch (e) {
    cookieBanner.hidden = false;
  }
  cookieAccept.addEventListener('click', () => {
    cookieBanner.hidden = true;
    try {
      localStorage.setItem('g2ecoclima_cookie_ack', '1');
    } catch (e) {
      // almacenamiento no disponible: el aviso volverá a mostrarse, sin impacto funcional
    }
  });
}

// Barra de progreso de scroll
const progressBar = document.getElementById('progressBar');
if (progressBar) {
  const progressRule = dynamicRule('#progressBar', 'width: 0%;');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1) * 100;
    progressRule.style.width = pct + '%';
  });
}

// Animación de aparición al hacer scroll
const revealTargets = document.querySelectorAll('.reveal');
if (revealTargets.length && 'IntersectionObserver' in window) {
  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 60);
        revealIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => revealIo.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('in'));
}

// Contadores animados de la barra de estadísticas
const statItems = document.querySelectorAll('.stat-item');
if (statItems.length && 'IntersectionObserver' in window) {
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const strong = entry.target.querySelector('strong');
      const bar = entry.target.querySelector('.bar i');
      const target = parseInt(strong.dataset.count, 10);
      const fill = parseInt(bar.dataset.fill, 10);
      let start = null;
      const dur = 1200;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        strong.textContent = Math.round(p * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      const barRule = dynamicRule(`.stat-item .bar i[data-dyn-id="${withDynamicId(bar)}"]`, 'width: 0%;');
      barRule.style.width = fill + '%';
      statIo.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  statItems.forEach((el) => statIo.observe(el));
}

// Inclinación 3D de las tarjetas de servicio al mover el ratón
document.querySelectorAll('.service-card.tilt').forEach((card) => {
  const tiltRule = dynamicRule(`[data-dyn-id="${withDynamicId(card)}"]`, 'transform: none;');
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltRule.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    tiltRule.style.transform = 'none';
  });
});
