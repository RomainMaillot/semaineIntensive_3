let character = document.createElement('div')
let lane = document.querySelectorAll('div[class^=lane]')
let left = 10
let place = Math.floor(Math.random()*4)

init()

function init(){
  //on initialise le jeux
  createCharacter()
//   initMap()

}

// function initMap() {
//     let map = "" //chaîne de caractère contenant la disposition du terrain

//     let fullLane, laneNum = 1, emptyLane = "", corNum = 1

//     //remplissage de la string
//     for (let i = 0; i < 4; i++) {
//         fullLane = ""
//         emptyLane = ""
//         for (let j = 0; j < 60; j++) {
//             fullLane += `lane${laneNum} `
//         }
//         map += `"${fullLane}"`
//         map += '\n'
//         laneNum++

//         for (let j = 0; j < 60; j++) {
//             let randomChara = Math.floor(Math.random() * 31)
            
//             if ((randomChara >= 29 || emptyLane.substring(emptyLane.length - 16, emptyLane.length + 1) === ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ") && emptyLane.substring(0, emptyLane.length).includes(`corridor${i * 2}`) === false ) {
//                 emptyLane += `corridor${corNum}`
//                 corNum++
//             } else  {
//                 emptyLane += '. '
//             }
//         }
//         map += `"${emptyLane}"`
//         map += '\n'
//         console.log(emptyLane.substring(emptyLane.length - 16, emptyLane.length + 1))
//     }

//     fullLane = ""
//     for (let j = 0; j < 60; j++) {
//         fullLane += `lane${laneNum} `
//     }
//     map += `"${fullLane}"`

//     console.log(map)

//     $('.map').css('grid-template-areas', map)
// }

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
