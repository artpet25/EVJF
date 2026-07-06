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
