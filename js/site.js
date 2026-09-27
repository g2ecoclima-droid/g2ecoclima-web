// Cargado lo antes posible en <head> de cada página.

// Defensa contra clickjacking: la cabecera HTTP X-Frame-Options / CSP frame-ancestors
// no se puede fijar en GitHub Pages (no admite cabeceras personalizadas), así que se
// refuerza aquí. Si el sitio se carga dentro de un iframe ajeno, se saca de él.
if (window.top !== window.self) {
  window.top.location = window.self.location;
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
