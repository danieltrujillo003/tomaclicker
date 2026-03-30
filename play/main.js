const configRes = await fetch('../config.json');
const config = await configRes.json();
const APP_VERSION = config.version;

console.log(`Tomaclicker v${APP_VERSION} initialized.`);

// ==========================================
// 1. DOM ELEMENTS & GLOBAL STATE
// ==========================================
const mainTomato = document.getElementById('main-tomato');
const counterDisplay = document.getElementById('counter-display');
const tomatoSong = document.getElementById('tomato-song');
const phrase = document.getElementById('phrase');

// Initial UI State
// Initial counterDisplay masks the first silent tap required to unlock iOS audio policies
counterDisplay.innerText = '-';
phrase.style.display = 'none';

// Game State
let counterStart = 0;
let hasUnlockedAudio = false;

// ==========================================
// 2. AUDIO ENGINE & ROUTING
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let splashAudioBuffer = null;
let songGainNode = null;
let songSource = null;

// Dedicated GainNode to decouple SFX volume from the global media volume
const splashGainNode = audioCtx.createGain();
splashGainNode.gain.value = 1.0;
splashGainNode.connect(audioCtx.destination);

// Decode audio data into memory on load for zero-latency playback
const loadSplashSound = async () => {
  try {
    const response = await fetch('../assets/tomatoe.mp3');
    const arrayBuffer = await response.arrayBuffer();
    splashAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Error decoding splash audio:", error);
  }
};
loadSplashSound();

const playSplash = () => {
  if (!splashAudioBuffer) return;
  const source = audioCtx.createBufferSource();
  source.buffer = splashAudioBuffer;
  source.connect(splashGainNode);
  source.start(0);
};

// Syncing UI events to the media clock rather than the JS Event Loop to avoid drift
const checkEndingTime = () => {
  if (tomatoSong.currentTime >= 34.2) {
    finalPhrase();
    tomatoSong.removeEventListener('timeupdate', checkEndingTime);
  }
};
tomatoSong.addEventListener('timeupdate', checkEndingTime);

// ==========================================
// 3. UI & GAME LOGIC
// ==========================================
const getRandomBetween = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createDrop = () => {
  requestAnimationFrame(() => {
    const tomaDrop = document.createElement('figure');
    tomaDrop.className = 'toma-drop';
    tomaDrop.style.left = `${getRandomBetween(100, -10)}%`;

    const dropImg = document.createElement('img');
    dropImg.src = `../assets/slice${getRandomBetween(5, 1)}.png`;
    dropImg.onerror = () => { dropImg.src = '../assets/default.png'; };
    dropImg.draggable = false;

    tomaDrop.addEventListener('animationend', () => {
      tomaDrop.remove();
    }, { once: true });

    tomaDrop.appendChild(dropImg);
    document.body.appendChild(tomaDrop);
  });
};

const finalPhrase = () => {
  phrase.style.display = 'block';
  document.querySelector('h1.title').style.display = 'none';
  mainTomato.style.display = 'none';
  counterDisplay.style.display = 'none';
};

const triggerGameLogicUI = () => {
  if (counterStart === 95) {
    songGainNode.gain.value = 0.05;
    tomatoSong.play().catch(() => console.log("Playback blocked natively."));
  }

  // Audio Ducking: Crossfade background music and SFX to shift user focus
  if (counterStart > 95) {
    if (songGainNode.gain.value < 1) {
      songGainNode.gain.value = Math.min(1, songGainNode.gain.value + 0.005);
    }
    if (splashGainNode.gain.value > 0.4) {
      splashGainNode.gain.value = Math.max(0.4, splashGainNode.gain.value - 0.005);
    }
  }

  if (counterStart > 100) counterStart *= 1.1;
  if (counterStart > 300) counterStart *= 1.2;
  if (counterStart > 10000) counterStart *= 1.3;
  if (counterStart > 1000000) counterStart *= 2.0;

  counterDisplay.innerText = Math.floor(counterStart);
  createDrop();
};

// ==========================================
// 4. CORE INTERACTION CONTROLLER
// ==========================================
const handleInteraction = (e) => {
  if (e.cancelable) e.preventDefault();

  // First tap: Unlocks iOS audio context silently
  if (!hasUnlockedAudio) {
    hasUnlockedAudio = true;
    audioCtx.resume();

    // iOS Hack: Safari aggressively suspends audio unless a sound is played immediately
    // upon user interaction. This plays a 1ms silent buffer to permanently unlock the engine.
    const silentBuffer = audioCtx.createBuffer(1, 1, 22050);
    const silentSource = audioCtx.createBufferSource();
    silentSource.buffer = silentBuffer;
    silentSource.connect(audioCtx.destination);
    silentSource.start();

    if (!songGainNode) {
      songGainNode = audioCtx.createGain();
      songGainNode.gain.value = 0;
      songGainNode.connect(audioCtx.destination);

      // Route the HTMLAudioElement through Web Audio API for precise mathematical volume control
      songSource = audioCtx.createMediaElementSource(tomatoSong);
      songSource.connect(songGainNode);
    }
    tomatoSong.load();

    counterDisplay.innerText = Math.floor(counterStart);
    return;
  }

  // Subsequent taps: Full gameplay loop
  counterStart++;
  triggerGameLogicUI();
  playSplash();
};

// ==========================================
// 5. EVENT BINDINGS
// ==========================================
// 'pointerdown' unifies touch/mouse and eliminates the 300ms click delay on mobile
mainTomato.addEventListener('pointerdown', handleInteraction);
