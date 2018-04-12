let container = document.querySelector('.container')
let playerModes = document.querySelectorAll('.mode_select a')
let site2 = document.querySelector('.site2')
let button = document.querySelector('.box')
localStorage.setItem('gameMode', '0')

let music = new Audio('./music/escapelifemusic.mp3')
music.play()

button.addEventListener('click', (e) =>  {
  e.preventDefault()
  container.classList.add('transition')

});

button.addEventListener('click', (e) => {
  e.preventDefault()
  setTimeout(() => {
    location.replace('jeux\\index.html')
  }, 285)

})

for (let i = 0; i < playerModes.length; i++) {
  playerModes[i].addEventListener('click', (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('active')
    localStorage.setItem('gameMode', i)
    playerModes[Math.abs(i - 1)].classList.remove('active')
  })
}