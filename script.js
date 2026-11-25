/* ====== EDITÁ SOLO ESTO ====== */
const CONFIG = {
  nombre: 'Francisco Salva Josue',
  edad: 10,
  fecha: '2026-12-13T15:00:00',            // AAAA-MM-DDTHH:MM:SS
  horario: 'De 15:00 a 19:00 hs',
  lugar: 'Salón de fiestas "ASIA EVENTOS"',
  direccion: 'Salta Capital, Argentina mar de java 440, A4400',    // calle y número para que Google Maps marque el lugar exacto
  whatsapp: '5493875116582',                // código país + área + número, sin + ni espacios
  nota: '', // dejalo vacío ('') para ocultarlo
  grupo: ['grupo1', 'grupo2', 'grupo3', 'grupo4', 'grupo5', 'grupo6'] // fotos de /images (.jpg)
};
/* ============================== */

const $ = id => document.getElementById(id);
const fecha = new Date(CONFIG.fecha);
const primerNombre = CONFIG.nombre.split(' ')[0];

// ----- Textos -----
$('nombre').textContent = CONFIG.nombre;
$('edad').textContent = CONFIG.edad;
$('fechaTxt').textContent = fecha.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
$('horaTxt').textContent = CONFIG.horario;
$('lugarTxt').textContent = CONFIG.lugar;
if (CONFIG.nota) $('notaTxt').textContent = CONFIG.nota; else $('notaBox').hidden = true;
$('como').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.direccion);

// ----- Carrusel de fotos del Club (se duplica para que el loop sea continuo) -----
[...CONFIG.grupo, ...CONFIG.grupo].forEach(n => {
  const img = new Image();
  img.src = `images/${n}.jpg`; img.alt = 'Club Misterio'; img.loading = 'lazy';
  $('track').appendChild(img);
});

// ----- Fantasmas y payasos flotando de fondo -----
['👻', '🤡', '🔦', '🕯️', '🎈', '👻', '🤡', '🔦', '👻', '🎈', '🕯️', '👻'].forEach((e, i) => {
  const s = document.createElement('span');
  s.textContent = e;
  s.style.cssText = `left:${(i * 8.5 + Math.random() * 5) % 95}%;font-size:${22 + Math.random() * 26}px;` +
    `animation-duration:${14 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s`;
  $('floaters').appendChild(s);
});

// ----- Aparecer al hacer scroll -----
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('on')), { threshold: .15 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// ----- Cuenta regresiva -----
function tick() {
  const diff = fecha - new Date();
  if (diff <= 0) { $('count').hidden = true; $('fin').hidden = false; return; }
  const v = {
    d: Math.floor(diff / 864e5), h: Math.floor(diff % 864e5 / 36e5),
    m: Math.floor(diff % 36e5 / 6e4), s: Math.floor(diff % 6e4 / 1e3)
  };
  for (const k in v) $(k).textContent = String(v[k]).padStart(2, '0');
}
setInterval(tick, 1000); tick();

// ----- Ampliar fotos al tocarlas -----
document.addEventListener('click', e => {
  if (e.target.closest('.polas img, .track img')) { $('lb').firstElementChild.src = e.target.src; $('lb').hidden = false; }
  else if (e.target.closest('#lb')) $('lb').hidden = true;
});

// ----- Portada: linterna que sigue al dedo / mouse -----
const intro = $('intro');
let movio = false, t = 0;
const luz = (x, y) => { intro.style.setProperty('--x', x + 'px'); intro.style.setProperty('--y', y + 'px'); };
intro.addEventListener('pointermove', e => { movio = true; luz(e.clientX, e.clientY); });
(function auto() { // hasta que el invitado la mueva, la linterna pasea sola
  if (movio) return;
  t += .015;
  luz(innerWidth * (.5 + .32 * Math.sin(t)), innerHeight * (.42 + .22 * Math.sin(t * 1.7)));
  requestAnimationFrame(auto);
})();

function trueno() { // sonido de trueno generado por el navegador
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)(), n = c.sampleRate * 1.6;
    const b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.5);
    const s = c.createBufferSource(), f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 380; s.buffer = b; s.connect(f).connect(c.destination); s.start();
  } catch (err) { }
}

const musica = $('musica');
musica.volume = .6;

$('abrir').onclick = () => {
  intro.classList.add('boom'); trueno();
  musica.play().catch(() => {});
  setTimeout(() => { intro.classList.add('out'); $('invite').hidden = false; scrollTo(0, 0); }, 650);
  setTimeout(() => intro.remove(), 1600);
};

$('sonido').onclick = () => {
  if (musica.paused) { musica.play(); $('sonido').textContent = '🔊'; }
  else { musica.pause(); $('sonido').textContent = '🔇'; }
};

// ----- Confirmación por WhatsApp -----
function enviar(va) {
  const nombre = $('quien').value.trim();
  if (!nombre) { $('quien').focus(); $('quien').placeholder = 'Escribí tu nombre primero'; return; }
  const txt = va
    ? `¡Hola! Soy ${nombre} y confirmo mi asistencia al cumple de ${primerNombre} 🔦👻 Vamos ${$('cant').value}.`
    : `¡Hola! Soy ${nombre}. Lamentablemente no podré ir al cumple de ${primerNombre}. ¡Que lo disfruten!`;
  open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`, '_blank');
}
$('ok').onclick = () => enviar(true);
$('no').onclick = () => enviar(false);
