// Cargado lo antes posible en <head> de cada página.
// La protección contra que la web se cargue dentro de otra página ajena
// (clickjacking) la pone Cloudflare como cabecera HTTP (X-Frame-Options y
// CSP frame-ancestors), así que aquí ya no hace falta código para eso.

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
