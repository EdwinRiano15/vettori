/* =========================================================
   VETTORI | Carruseles de fotos y visor ampliado
   ========================================================= */

/* ---------- 1. Flechas en los carruseles con más de una foto ---------- */
window.addEventListener('load', function () {
  document.querySelectorAll('.slider').forEach(function (slider) {
    if (slider.children.length < 2) return;

    ['prev', 'next'].forEach(function (dir) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'arrow arrow-' + dir;
      b.setAttribute('aria-label', dir === 'prev' ? 'Foto anterior' : 'Foto siguiente');
      b.textContent = dir === 'prev' ? '\u2039' : '\u203A';
      b.addEventListener('click', function () {
        slider.scrollBy({ left: (dir === 'prev' ? -1 : 1) * slider.clientWidth, behavior: 'smooth' });
      });
      slider.parentElement.appendChild(b);
    });
  });
});

/* ---------- 2. Visor ampliado: clic en una foto para verla en grande ---------- */
(function () {
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.innerHTML =
    '<button type="button" class="lb-close" aria-label="Cerrar">&times;</button>' +
    '<button type="button" class="lb-nav lb-prev" aria-label="Foto anterior">&#8249;</button>' +
    '<img alt="">' +
    '<button type="button" class="lb-nav lb-next" aria-label="Foto siguiente">&#8250;</button>';
  document.body.appendChild(box);

  var big = box.querySelector('img');
  var photos = [];
  var i = 0;

  function show(n) {
    i = (n + photos.length) % photos.length;
    big.src = photos[i].currentSrc || photos[i].src;
    big.alt = photos[i].alt;
    box.classList.toggle('single', photos.length < 2);
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('lb-open');
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest('.slider img');

    if (img) {                                   // abrir
      photos = Array.prototype.slice.call(img.parentElement.querySelectorAll('img'));
      show(photos.indexOf(img));
      box.hidden = false;
      document.body.classList.add('lb-open');
      return;
    }
    if (box.hidden) return;

    if (e.target.closest('.lb-prev')) show(i - 1);
    else if (e.target.closest('.lb-next')) show(i + 1);
    else if (e.target !== big) close();          // fondo o botón ×
  });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();