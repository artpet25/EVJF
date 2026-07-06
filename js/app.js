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
  localStorage.setItem(COUNTDOWN_KEY, Date.now() + COUNTDOWN_MS);
  tickCountdown();
  coverPage.classList.remove('active');
  timerPage.classList.add('active');
});

const videoIntroPage = document.getElementById('page-video-intro');
const introVideo = document.getElementById('intro-video');
const introContinueBtn = document.getElementById('intro-continue-btn');

continueBtn.addEventListener('click', () => {
  timerPage.classList.remove('active');
  videoIntroPage.classList.add('active');
  introVideo.play();
  if (introVideo.requestFullscreen) {
    introVideo.requestFullscreen().catch(() => {});
  }
});

introContinueBtn.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  introVideo.pause();
  videoIntroPage.classList.remove('active');
  mainPage.classList.add('active');
});

introVideo.addEventListener('ended', () => {
  if (document.fullscreenElement) document.exitFullscreen();
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

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxNumber = document.getElementById('lightbox-number');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

function renderGallery() {
  if (PHOTOS.length === 0) {
    galleryGrid.innerHTML = '<p class="gallery-empty">Les souvenirs seront bientôt ici...</p>';
    return;
  }
  PHOTOS.forEach((src, index) => {
    const numeral = ROMAN_NUMERALS[index] || String(index + 1);
    const thumb = document.createElement('button');
    thumb.className = 'gallery-thumb';
    thumb.style.backgroundImage = `url(${src})`;
    thumb.setAttribute('aria-label', `Ouvrir la photo ${numeral}`);
    thumb.innerHTML = `<span class="thumb-number">${numeral}</span>`;
    thumb.addEventListener('click', () => {
      lightboxImg.src = src;
      lightboxNumber.textContent = numeral;
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

const SECRET_CODE = '487114';
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

const backBtn = document.getElementById('back-btn');

backBtn.addEventListener('click', () => {
  pageFour.classList.remove('active');
  mainPage.classList.add('active');
});

const videoBtn = document.getElementById('video-btn');
const videoModal = document.getElementById('video-modal');
const pageVideo = document.getElementById('page-video');
const videoCloseBtn = document.getElementById('video-close-btn');

videoBtn.addEventListener('click', () => {
  pageVideo.src = 'videos/video-1.mp4';
  videoModal.classList.remove('hidden');
  pageVideo.play();
  if (pageVideo.requestFullscreen) {
    pageVideo.requestFullscreen().catch(() => {});
  }
});

function closeVideoModal() {
  pageVideo.pause();
  pageVideo.removeAttribute('src');
  pageVideo.load();
  videoModal.classList.add('hidden');
  nextToFiveBtn.classList.remove('hidden');
}

videoCloseBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    closeVideoModal();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && !videoModal.classList.contains('hidden')) {
    closeVideoModal();
  }
});

const nextToFiveBtn = document.getElementById('next-to-five-btn');
const pageFive = document.getElementById('page-five');

pageVideo.addEventListener('ended', () => {
  nextToFiveBtn.classList.remove('hidden');
});

nextToFiveBtn.addEventListener('click', () => {
  pageFour.classList.remove('active');
  pageFive.classList.add('active');
});

const tapestryThumb = document.getElementById('tapestry-thumb');

tapestryThumb.addEventListener('click', () => {
  lightboxImg.src = 'photos/tapestry-1.jpeg';
  lightboxNumber.textContent = '';
  lightbox.classList.remove('hidden');
});

const nextToSixBtn = document.getElementById('next-to-six-btn');
const pageSix = document.getElementById('page-six');

nextToSixBtn.addEventListener('click', () => {
  pageFive.classList.remove('active');
  pageSix.classList.add('active');
});
