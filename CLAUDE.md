# Web pública de G2 Eco Clima (g2ecoclima.com)

Responde siempre en español (petición permanente de David).

## Cómo se publica

- GitHub Pages sirve la rama `main` (dominio en `CNAME`). Nada sale en la web hasta que David fusiona el PR ("Merge pull request").
- Trabajar en una rama, abrir PR y avisar a David. Tras fusionar, comprobar en vivo con `curl https://g2ecoclima.com/` (puede tardar 1-2 min).

## Reglas técnicas que no se pueden saltar

- **CSP estricto** (meta en cada HTML): `style-src 'self'`, `font-src 'self'`, `script-src 'self'`, `img-src 'self' data:`, `connect-src` solo la Cloud Function del formulario (en `index.html`). Por tanto:
  - **Nada de `style="..."`** ni `<style>` en el HTML: todo en `css/style.css`.
  - **Fuentes alojadas aquí** (`assets/fonts/*.woff2`, declaradas en `css/fonts.css`). No usar Google Fonts por enlace. Bricolage Grotesque y Hanken Grotesk son **variables** (un archivo, todos los pesos, declaradas con rango); Caveat es estática 600.
  - Sin scripts externos; JS en `js/site.js` y `js/main.js`. Los efectos dinámicos van por CSSOM (ver comentario al inicio de `main.js`).
- Cada cambio de CSS/JS sube el `?v=N` en los HTML (index + aviso-legal + privacidad + cookies) para saltar la caché.
- Las páginas legales comparten `css/style.css`: no romper las clases `site-header`, `brand*`, `legal`, `site-footer`, `footer-*`, `cookie-banner`.
- No inventar contenido: ni reseñas, ni cifras, ni promesas que David no haya confirmado.

## Diseño actual (12/10/2026): "propuesta E"

- Estética de la propuesta D ("cercana": foto en forma de gota del logo, Bricolage Grotesque + Hanken Grotesk + toque manuscrito Caveat, azul marino #0c2a4a y verde #3f8a24) con los **textos de la propuesta A** (elección de David).
- Las propuestas A-E están en el lienzo de diseño (Artifact privado de David): https://claude.ai/artifact/FQH7E3Ki3kwxQtt14fNkBb
- Imágenes de la página en **WebP** con `width`/`height` (los `.jpg` originales se conservan). Imagen para compartir: `assets/web/og-g2ecoclima.jpg` (1200x630).
- Sin aviso de cookies: la web no guarda nada en el navegador. Si algún día se añade analítica o un mapa, hay que volver a ponerlo.
- Secciones: portada, garantías (RITE 13-B-D20-00207251, gases fluorados, grandes instalaciones, mantenimiento propio), servicios, materiales (URSA, Climaver, PPR, cobre/inox), obras reales (Somosaguas, Illescas, Rivas), **reseñas** (QR + botón a Google), presupuesto (formulario `#presupuesto`).

## Formulario de presupuesto (18/10/2026)

- `js/main.js` lo envía a la Cloud Function `solicitud-web-g2` (repo `g2-agentes-financieros`, `src/solicitudes_web.py`), que avisa a David por Telegram (tema General del grupo). Si falla, la web ofrece el correo con la solicitud ya escrita.
- Antirrobots: campo oculto `web` (debe ir vacío) y `t` (hora de carga de la página; menos de 3 s = robot). La función solo acepta el Origin `https://g2ecoclima.com` (y `www.`): **desde local el envío siempre falla y sale el plan B**, es lo esperado.
- La lista de servicios del `<select>` debe coincidir EXACTAMENTE con `SERVICIOS` de `src/solicitudes_web.py`; si se cambia una, cambiar la otra.
- Imágenes: `assets/web/` (portada y materiales salen de la maqueta, mejoradas con superresolución; `hero-gota.jpg` es un recorte limpio sin la zona difuminada), `assets/proyectos/` (fotos reales de obra).
- Logo: `assets/logo_g2_mark.svg` (vectorizado, transparente).

## Reseñas de Google

- Enlace para dejar reseña: `https://g.page/r/CfiXOBdrvdRMEBI/review` (QR en `assets/web/qr-resenas-g2.png`).
- Ficha del Perfil de Empresa en Google Maps (dada por David el 23/10/2026): `https://maps.app.goo.gl/mpjvsKkcFWAb2tMS7` -- va en `hasMap` y `sameAs` de los datos estructurados de `index.html`.
- Mismo QR en presupuestos y partes de correctivo (repo `g2-agentes-financieros`, `src/resenas_google.py`).
- **Pendiente:** cuando haya reseñas reales en Google, David pasará 2-3 para mostrarlas en la sección `#resenas` (hoy solo QR + botón, sin textos de ejemplo).
- Normas de Google: no ofrecer nada a cambio y pedirla a todos por igual.

## Datos de contacto vigentes

Teléfonos 687 763 327 y 685 838 099 · info@g2ecoclima.com (desde el 18/10/2026; antes g2ecoclima@gmail.com) · C/ Bruselas 3, 28983 Parla (Madrid).

Datos registrales (escritura de constitución, certificación del 01/08/2025): Registro Mercantil de **Madrid**, hoja M-861667, inscripción 1ª, folio electrónico (IRUS) 1000455610971. CIF B22627483.
