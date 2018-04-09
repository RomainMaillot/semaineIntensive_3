let perso = document.createElement('div')
let lane = document.querySelectorAll('div[class^=lane]')
let left = 10

init()

function init(){
  perso.style.width = '2%'
  perso.style.height = '4%'
  perso.style.backgroundColor = 'red'
  perso.style.position = 'absolute'
  perso.style.left = left + 'px'

  lane[(Math.floor(Math.random()*5))].appendChild(perso)

  game()
}


  window.addEventListener('keydown', function(e){
    e.preventDefault()
    switch (e.keyCode) {
      case 39:
        left += 10
        perso.style.left = left + 'px'
        break;
      case 37:
        left -= 10
        perso.style.left = left + 'px'
        break;
    }
  })

  function game(){
  //pour lancer la fonction tous les 40millisecondes
  let gamePlay = setInterval(
    function(){
    },40)
}
