(function () {
  const galleries = {
    'secure-system': {
      title: 'Secure System — E-Commerce Website',
      folder: 'assets/work/secure-system/',
      count: 6
    },
    'zapsph': {
      title: 'ZapsPH — E-Commerce Website',
      folder: 'assets/work/zapsph/',
      count: 6
    },
    'itph': {
      title: 'ITPH — Real Estate Property Website',
      folder: 'assets/work/itph/',
      count: 6
    },
    'certificates': {
      title: '',
      files: [
        'assets/certificates/fortigate-operator.jpg',
        'assets/certificates/intro-ngfw.jpg',
        'assets/certificates/cybersecurity-cloud.jpg'
      ]
    }
  };

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // gallery markup only exists on work.html

  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const imgEl = document.getElementById('lightboxImg');
  const emptyEl = document.getElementById('lightboxEmpty');
  const hintEl = document.getElementById('lightboxHint');
  const titleEl = document.getElementById('lightboxTitle');
  const countEl = document.getElementById('lightboxCount');

  let currentImages = [];
  let currentIndex = 0;
  let lastFocused = null;

  function probeImages(folder, count) {
  const exts = ['png', 'jpg', 'jpeg', 'webp'];
  const attempts = [];
  for (let i = 1; i <= count; i++) {
    attempts.push(
      new Promise(resolve => {
        let k = 0;
        const tryNext = () => {
          if (k >= exts.length) return resolve(null);
          const src = folder + i + '.' + exts[k++];
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = tryNext;
          img.src = src;
        };
        tryNext();
      })
    );
  }
  return Promise.all(attempts).then(results => results.filter(Boolean));
}

  function render() {
    if (currentImages.length === 0) {
      imgEl.style.display = 'none';
      emptyEl.style.display = 'flex';
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      countEl.textContent = '';
      return;
    }
    imgEl.style.display = 'block';
    emptyEl.style.display = 'none';
    imgEl.src = currentImages[currentIndex];
    const multi = currentImages.length > 1;
    prevBtn.style.display = multi ? 'flex' : 'none';
    nextBtn.style.display = multi ? 'flex' : 'none';
    countEl.textContent = multi ? (currentIndex + 1) + ' / ' + currentImages.length : '';
  }

  function open(id, triggerEl, startIndex) {
    const data = galleries[id];
    if (!data) return;
    lastFocused = triggerEl;
    titleEl.textContent = data.title;
    hintEl.textContent = data.folder ? 'Add images to ' + data.folder : '';
    currentImages = [];
    currentIndex = 0;
    if (data.files) {
      currentImages = data.files.slice();
      currentIndex = startIndex || 0;
    }
    render();

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();

    if (!data.files) {
      probeImages(data.folder, data.count).then(found => {
        currentImages = found;
        currentIndex = 0;
        render();
      });
    }
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + delta + currentImages.length) % currentImages.length;
    render();
  }

  document.querySelectorAll('.project[data-gallery]').forEach(project => {
    const trigger = project.querySelector('.view-shots');
    if (trigger) {
      trigger.addEventListener('click', () => open(project.dataset.gallery, trigger));
    }
  });

  document.querySelectorAll('.cert-tile').forEach(tile => {
    tile.addEventListener('click', () => open('certificates', tile, Number(tile.dataset.cert) || 0));
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
