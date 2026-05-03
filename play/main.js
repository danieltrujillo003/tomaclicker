const configRes = await fetch('../config.json');
const config = await configRes.json();
const APP_VERSION = config.version;

console.log(`Tomaclicker v${APP_VERSION} initialized.`);

const TUNING = {
  finalPhraseSongTimeSec: 34.2,
  climaxClickCount: 95,
  backgroundSongInitialGain: 0.05,
  crossfadeStep: 0.005,
  songGainCap: 1,
  splashGainFloor: 0.4,
  counterScaleTiers: [
    { above: 100, factor: 1.1 },
    { above: 300, factor: 1.2 },
    { above: 10000, factor: 1.3 },
    { above: 1000000, factor: 2.0 },
  ],
  /* Slice horizontal *center* (% of viewport). Symmetric past 0–100 so rain clips left and right evenly; must match `.toma-drop` width (80px → 40px in calc). */
  dropCenterPercentMin: -10,
  dropCenterPercentMax: 110,
  sliceImageIndexMin: 1,
  sliceImageIndexMax: 5,
};

// ==========================================
// 1. DOM ELEMENTS & GLOBAL STATE
// ==========================================
const mainTomato = document.getElementById('main-tomato');
const counterDisplay = document.getElementById('counter-display');
const tomatoSong = document.getElementById('tomato-song');
const phrase = document.getElementById('phrase');
const titleHeading = document.querySelector('h1.title');

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
  if (tomatoSong.currentTime >= TUNING.finalPhraseSongTimeSec) {
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

const DROP_HALF_PX = 40;

const createDrop = () => {
  requestAnimationFrame(() => {
    const tomaDrop = document.createElement('figure');
    tomaDrop.className = 'toma-drop';
    const centerPct = getRandomBetween(
      TUNING.dropCenterPercentMax,
      TUNING.dropCenterPercentMin,
    );
    tomaDrop.style.left = `calc(${centerPct}% - ${DROP_HALF_PX}px)`;

    const dropImg = document.createElement('img');
    dropImg.src = `../assets/slice${getRandomBetween(TUNING.sliceImageIndexMax, TUNING.sliceImageIndexMin)}.png`;
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
  phrase.style.display = 'flex';
  titleHeading.style.display = 'none';
  mainTomato.style.display = 'none';
  counterDisplay.style.display = 'none';
};

const triggerGameLogicUI = () => {
  if (counterStart === TUNING.climaxClickCount) {
    songGainNode.gain.value = TUNING.backgroundSongInitialGain;
    tomatoSong.play().catch(() => console.log("Playback blocked natively."));
  }

  // Audio Ducking: Crossfade background music and SFX to shift user focus
  if (counterStart > TUNING.climaxClickCount) {
    if (songGainNode.gain.value < TUNING.songGainCap) {
      songGainNode.gain.value = Math.min(
        TUNING.songGainCap,
        songGainNode.gain.value + TUNING.crossfadeStep,
      );
    }
    if (splashGainNode.gain.value > TUNING.splashGainFloor) {
      splashGainNode.gain.value = Math.max(
        TUNING.splashGainFloor,
        splashGainNode.gain.value - TUNING.crossfadeStep,
      );
    }
  }

  for (const tier of TUNING.counterScaleTiers) {
    if (counterStart > tier.above) counterStart *= tier.factor;
  }

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
