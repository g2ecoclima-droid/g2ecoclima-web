// El CSP de este sitio es `style-src 'self'` (sin 'unsafe-inline'): asignar
// `elemento.style.propiedad = ...` desde JS cuenta como "estilo en línea" y el
// navegador lo bloquea en silencio. Para los efectos que necesitan un valor
// dinámico (barra de progreso) se inserta una regla en la propia hoja
// style.css (ya permitida por el CSP) y se modifica esa regla vía CSSOM.
const styleSheet = document.querySelector('link[href^="css/style.css"]').sheet;
function dynamicRule(selectorText, initialDecl) {
  const idx = styleSheet.cssRules.length;
  styleSheet.insertRule(`${selectorText} { ${initialDecl} }`, idx);
  return styleSheet.cssRules[idx];
}

const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
if (header && navToggle) {
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
}

// Formulario de presupuesto (portada): se envía a G2 y llega como aviso al
// momento. Si el envío falla, se ofrece el correo con la solicitud ya escrita.
const SOLICITUD_URL = 'https://europe-west1-g2-agentes-financieros.cloudfunctions.net/solicitud-web-g2';
const CORREO = 'info@g2ecoclima.com';
const quoteForm = document.getElementById('presupuesto');
if (quoteForm) {
  const cargadoEn = Date.now();
  const estado = document.getElementById('qEstado');
  const boton = document.getElementById('qEnviar');

  const mostrar = (texto, esError, enlaceCorreo) => {
    estado.hidden = false;
    estado.classList.toggle('error', Boolean(esError));
    estado.textContent = texto;
    if (enlaceCorreo) {
      const a = document.createElement('a');
      a.href = enlaceCorreo;
      a.textContent = 'Enviar por correo';
      estado.append(' ', a);
    }
  };

  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const servicio = document.getElementById('qServicio').value;
    const ubicacion = document.getElementById('qUbicacion').value.trim();
    const telefono = document.getElementById('qTelefono').value.trim();
    const cuerpo = new URLSearchParams({
      servicio, ubicacion, telefono,
      web: document.getElementById('qWeb').value,
      t: String(cargadoEn),
    });
    const asunto = `Solicitud de presupuesto — ${servicio}`;
    const texto = [`Servicio: ${servicio}`, `Ubicación del proyecto: ${ubicacion}`, `Teléfono: ${telefono}`].join('\n');
    const mailto = `mailto:${CORREO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    try {
      const resp = await fetch(SOLICITUD_URL, { method: 'POST', body: cuerpo });
      const datos = await resp.json().catch(() => ({}));
      if (resp.ok && datos.ok) {
        quoteForm.reset();
        mostrar('¡Recibido! Te llamamos lo antes posible.');
      } else if (resp.status === 400 && datos.error) {
        mostrar(datos.error, true);
      } else {
        mostrar('No hemos podido enviarlo ahora mismo.', true, mailto);
      }
    } catch (e) {
      mostrar('No hemos podido enviarlo ahora mismo.', true, mailto);
    } finally {
      boton.disabled = false;
      boton.textContent = 'Enviar solicitud';
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
  }, { passive: true });
}
