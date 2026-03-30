const configRes = await fetch('../config.json');
const config = await configRes.json();
const APP_VERSION = config.version;

const mainTomato = document.getElementById('main-tomato')
const counterDisplay = document.getElementById('counter-display')
const tomatoSong = document.getElementById('tomato-song')
const phrase = document.getElementById('phrase')

phrase.style.display = 'none';

console.log(`Tomaclicker v${APP_VERSION} initialized.`);

const counterStart = 80
let counter = counterStart
counterDisplay.innerText = Math.floor(counter);

const handleInteraction = (e) => {
  // Only prevent default if it's a touch or pointer event to avoid breaking desktop clicks
  if (e.cancelable) e.preventDefault();

  // On the first click, "unlock" the main song for iOS
  if (counter === counterStart) {
    tomatoSong.play().then(() => tomatoSong.pause());
  }

  counter++

  if (counter === 95) {
    tomatoSong.volume = 0.1;
    tomatoSong.play().catch(err => console.error("Playback blocked:", err));
    setTimeout(finalPhrase,34200)
  }

  if (counter > 95 && tomatoSong.volume < 1){
    // Clamp volume to a maximum of 1.0 to avoid errors
    tomatoSong.volume = Math.min(1, tomatoSong.volume + 0.005);
  }

  if (counter > 100) counter *= 1.1
  if (counter > 300) counter *= 1.2
  if (counter > 10000) counter *= 1.3
  if (counter > 1000000) counter *= 2.0

  playSplash();

  counterDisplay.innerText = Math.floor(counter)
  createDrop()
};

// Use pointerdown for faster response on both desktop and mobile
mainTomato.addEventListener('pointerdown', handleInteraction);

const playSplash = () => {
  // Creating a new instance allows sounds to overlap on rapid clicks
  const sound = new Audio('../assets/tomatoe.mp3');
  sound.play().catch(() => { /* Ignore errors if clicking too fast */ });

  // The original logic truncated the sound at 300ms
  setTimeout(() => {
    sound.pause();
    sound.remove(); // Help with memory cleanup
  }, 300);
}

const createDrop = () => {
  const tomaDrop = document.createElement('figure')
  tomaDrop.className = 'toma-drop'
  tomaDrop.style.left = `${getRandomBetween(100, -10)}%`

  const dropImg = document.createElement('img')
  dropImg.src = `../assets/slice${getRandomBetween(5,1)}.png`
  dropImg.onerror = () => { dropImg.src = '../assets/default.png'; };
  dropImg.draggable = false

  // Clean up the element automatically when the animation ends
  tomaDrop.addEventListener('animationend', () => {
    tomaDrop.remove();
  });

  tomaDrop.appendChild(dropImg)
  document.body.appendChild(tomaDrop)
}

const getRandomBetween = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const finalPhrase = () =>{
  phrase.style.display = 'block';
  const title = document.querySelector('h1.title');
  title.style.display = 'none';
  mainTomato.style.display = 'none';
  counterDisplay.style.display = 'none';
}
