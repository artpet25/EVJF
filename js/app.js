if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/EVJF/service-worker.js');
  });
}

const startBtn = document.getElementById('start-btn');
const coverPage = document.getElementById('page-cover');
const mainPage = document.getElementById('page-main');

startBtn.addEventListener('click', () => {
  coverPage.classList.remove('active');
  mainPage.classList.add('active');
});
