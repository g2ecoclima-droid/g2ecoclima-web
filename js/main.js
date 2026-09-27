document.getElementById('year').textContent = new Date().getFullYear();

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
    iframe.style.border = '0';
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
