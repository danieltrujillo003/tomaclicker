const mainTomato = document.getElementById('mainTomato')
const counterDisplay = document.getElementById('counterDisplay')

let counter = 0

counterDisplay.innerText = Math.floor(counter)

mainTomato.addEventListener('click', function (e) {
  if (counter > 100) counter *= 1.1
  if (counter > 300) counter *= 1.2
  if (counter > 10000) counter *= 1.3
  if (counter > 1000000) counter *= 2.0
  else counter++
  counterDisplay.innerText = Math.floor(counter)
  createDrop()
  removeDrop()
});

const createDrop = () => {
  const tomaDrop = document.createElement('figure')
  tomaDrop.className = 'toma-drop'
  tomaDrop.style.left = `${getRandomBetween(100, -10)}%`

  const dropImg = document.createElement('img')
  dropImg.setAttribute('src', `assets/slice${getRandomBetween(5,1)}.png`)
  dropImg.setAttribute('onerror', `onerror="this.src='assets/default.png';this.onerror='';"`)
  dropImg.setAttribute('draggable', 'false')

  tomaDrop.appendChild(dropImg)
  document.body.appendChild(tomaDrop)
}

const removeDrop = () => {
  const drop = document.getElementsByClassName('toma-drop')
  if (drop.length !== 0) {
    setTimeout(() => drop[0].remove(), 3000)
  }
}

const getRandomBetween = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
