let character = document.createElement('div')
let lane = document.querySelectorAll('div[class^=lane]')
let left = 10
let place = Math.floor(Math.random()*5)

init()

function init(){
  //on initialise le jeux
  createCharacter()

}


  window.addEventListener('keydown', function(e){
    //on gère les déplacements du personnage en fonction de la touche
    e.preventDefault()
      let nextCorridor = character.parentNode.nextSibling.nextSibling
      let pastCorridor = character.parentNode.previousSibling.previousSibling
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
      if (e.keyCode==40 && (nextCorridor.offsetLeft - 20) <= left && (nextCorridor.offsetLeft + nextCorridor.offsetWidth)>=(left + character.offsetWidth))
      {
        //déplace le personnage à la ligne inférieur en le supprimant puis en le recréant à la ligne inférieur si un ascenceur est présent
         character.parentNode.removeChild(character)
         place += 1
         lane[place].appendChild(character)
      }
      if (e.keyCode==38 && (pastCorridor.offsetLeft - 20) <= left && (pastCorridor.offsetLeft + pastCorridor.offsetWidth)>=(left + character.offsetWidth))
      {
        //déplace le personnage à la ligne supérieur en le supprimant puis en le recréant à la ligne inférieur si un ascenceur est présent
        character.parentNode.removeChild(character)
        place -= 1
        lane[place].appendChild(character)
      }
  })

function createCharacter(){
  //on le personnage et on le place sur le terrain
  character.style.width = '1%'
  character.style.height = '50%'
  character.style.backgroundColor = 'red'
  character.style.position = 'absolute'
  character.style.left = left + 'px'
  character.style.bottom = 0

  lane[place].appendChild(character)
}
