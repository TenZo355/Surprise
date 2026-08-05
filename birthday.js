/* ======================================================
   AUDIO / MUSIC LOGIC & AUTOPLAY HANDLING (FIXED)
   ====================================================== */
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

// 1. Check for saved custom URL or default directly to juicyluicy.mp3
const savedMusic = localStorage.getItem('bg-music-url');
if (savedMusic && !savedMusic.includes('song.mp3')) {
  audio.src = savedMusic;
} else {
  audio.src = 'juicyluicy.mp3';
  localStorage.removeItem('bg-music-url'); // Clear old cached song.mp3 paths
}

// 2. Play/Pause toggle with graceful fallback prompt
function toggleMusic() {
  if (audio.paused) {
    audio.play().then(() => {
      musicBtn.textContent = '🔊';
    }).catch(err => {
      console.warn("Audio playback error:", err);
      const newUrl = prompt("Could not load 'juicyluicy.mp3'. Make sure the file is in your folder, or enter a direct MP3 link:", "juicyluicy.mp3");
      if (newUrl) {
        audio.src = newUrl;
        localStorage.setItem('bg-music-url', newUrl);
        audio.play().catch(e => console.error("Playback failed:", e));
      }
    });
  } else {
    audio.pause();
    musicBtn.textContent = '🎵';
  }
}

musicBtn.addEventListener('click', toggleMusic);

// Keep button icon in sync with playback status
audio.addEventListener('play', () => { musicBtn.textContent = '🔊'; });
audio.addEventListener('pause', () => { musicBtn.textContent = '🎵'; });

// 3. Silent auto-start on first page interaction (no intrusive alerts)
let autoplayTriggered = false;
document.addEventListener('click', () => {
  if (!autoplayTriggered) {
    autoplayTriggered = true;
    audio.play().then(() => {
      musicBtn.textContent = '🔊';
    }).catch(() => {
      // Catch silently if browser blocks autoplay or file is missing
      musicBtn.textContent = '🎵';
    });
  }
}, { once: true });