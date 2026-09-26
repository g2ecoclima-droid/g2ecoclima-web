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
