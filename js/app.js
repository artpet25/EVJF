if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/EVJF/service-worker.js');
  });
}

const startBtn = document.getElementById('start-btn');
const continueBtn = document.getElementById('continue-btn');
const chronoBtn = document.getElementById('chrono-btn');
const closeChronoBtn = document.getElementById('close-chrono-btn');
const coverPage = document.getElementById('page-cover');
const timerPage = document.getElementById('page-timer');
const mainPage = document.getElementById('page-main');
const chronoModal = document.getElementById('chrono-modal');

const COUNTDOWN_MS = 60 * 60 * 1000;
const COUNTDOWN_KEY = 'evjf-countdown-end';

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function tickCountdown() {
  const endTime = Number(localStorage.getItem(COUNTDOWN_KEY));
  const text = formatCountdown(endTime - Date.now());
  document.getElementById('countdown').textContent = text;
  document.getElementById('countdown-modal').textContent = text;
  document.getElementById('chrono-mini').textContent = text;
}

setInterval(tickCountdown, 1000);
tickCountdown();

startBtn.addEventListener('click', () => {
  if (!localStorage.getItem(COUNTDOWN_KEY)) {
    localStorage.setItem(COUNTDOWN_KEY, Date.now() + COUNTDOWN_MS);
  }
  tickCountdown();
  coverPage.classList.remove('active');
  timerPage.classList.add('active');
});

continueBtn.addEventListener('click', () => {
  timerPage.classList.remove('active');
  mainPage.classList.add('active');
});

chronoBtn.addEventListener('click', () => {
  chronoModal.classList.remove('hidden');
});

closeChronoBtn.addEventListener('click', () => {
  chronoModal.classList.add('hidden');
});

const PHOTOS = [
  'photos/photo-1.jpeg',
  'photos/photo-2.jpeg',
  'photos/photo-3.jpeg',
  'photos/photo-4.jpeg',
  'photos/photo-5.jpeg',
  'photos/photo-6.jpeg',
];

const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

function renderGallery() {
  if (PHOTOS.length === 0) {
    galleryGrid.innerHTML = '<p class="gallery-empty">Les souvenirs seront bientôt ici...</p>';
    return;
  }
  PHOTOS.forEach((src) => {
    const thumb = document.createElement('button');
    thumb.className = 'gallery-thumb';
    thumb.style.backgroundImage = `url(${src})`;
    thumb.setAttribute('aria-label', 'Ouvrir la photo');
    thumb.addEventListener('click', () => {
      lightboxImg.src = src;
      lightbox.classList.remove('hidden');
    });
    galleryGrid.appendChild(thumb);
  });
}

lightboxCloseBtn.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
});

renderGallery();

const SECRET_CODE = '148147';
const codeBtn = document.getElementById('code-btn');
const codeModal = document.getElementById('code-modal');
const codeInput = document.getElementById('code-input');
const codeError = document.getElementById('code-error');
const codeSubmitBtn = document.getElementById('code-submit-btn');
const codeCancelBtn = document.getElementById('code-cancel-btn');
const pageFour = document.getElementById('page-four');

function openCodeModal() {
  codeInput.value = '';
  codeError.classList.add('hidden');
  codeModal.classList.remove('hidden');
  codeInput.focus();
}

function closeCodeModal() {
  codeModal.classList.add('hidden');
}

function submitCode() {
  if (codeInput.value === SECRET_CODE) {
    closeCodeModal();
    mainPage.classList.remove('active');
    pageFour.classList.add('active');
  } else {
    codeError.classList.remove('hidden');
  }
}

codeBtn.addEventListener('click', openCodeModal);
codeCancelBtn.addEventListener('click', closeCodeModal);
codeSubmitBtn.addEventListener('click', submitCode);
codeInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submitCode();
});
