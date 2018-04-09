let character = document.createElement('div')
let lane = document.querySelectorAll('div[class^=lane]')
let left = 10
let topPos = 10
let random = Math.floor(Math.random()*5)
let compteur = 1

init()

function init(){
  //on initialise le jeux
  createCharacter()

}


  window.addEventListener('keydown', function(e){
    //on gère les déplacements du personnage en fonction de la touche
    e.preventDefault()
      let corridor = character.parentNode.nextSibling.nextSibling
      if (e.keyCode==39)
      {
        //déplace le personnage vers la droite
        left += 10
        character.style.left = left + 'px'
      }
      if (e.keyCode==37 && left > 0)
      {
        //déplace le personnage vers la gauche
        left -= 10
        character.style.left = left + 'px'
      }
      if (e.keyCode==40 && (corridor.offsetLeft - 20) <= left && (corridor.offsetLeft + corridor.offsetWidth)>=(left + character.offsetWidth))
      {
        //déplace le personnage à la ligne inférieur en le supprimant puis en le recréant à la ligne inférieur
         character.parentNode.removeChild(character)
         lane[random+compteur].appendChild(character)
         compteur += 1
      }
  })

function createCharacter(){
  //on le personnage et on le place sur le terrain
  character.style.width = '1%'
  character.style.height = '50%'
  character.style.backgroundColor = 'red'
  character.style.position = 'absolute'
  character.style.left = left + 'px'
  character.style.top = topPos + 'px'

  lane[random].appendChild(character)
}
