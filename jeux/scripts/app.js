let character = new Image()
let lane = document.querySelectorAll('div[class^=lane]')
let left = 0
let mapWrapper = document.querySelector('.map')
let place = Math.floor(Math.random()*4)
let charImg = ["./images/sprite1.png","./images/sprite2.png","./images/sprite3.png","./images/sprite4.png","./images/sprite5.png","./images/sprite6.png"]
let charImgLeft = ["./images/spriteL1.png","./images/spriteL2.png","./images/spriteL3.png","./images/spriteL4.png","./images/spriteL5.png","./images/spriteL6.png"]
let a = 0, b = 0, go

init()

function init(){
  //on initialise le jeux
  createCharacter()
  initMap()
  listenArrows()
}

function initMap() {

    //Ajoute des noeuds html correspondant

    let oldCorrs = document.querySelectorAll('div[class^=corridor]')

    let lanes = document.querySelectorAll('div[class^=lane]')

    let corrCount = 1 //numéro du couloir
    let laneCorrCount = [0, 0, 0] // compteur des couloirs entre deux lane

    for (let i = 0; i < oldCorrs.length; i++) {
        oldCorrs[i].parentNode.removeChild(oldCorrs[i])
    }
    for (let j = 0; j < 3; j++) {

        for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
            let newCorr = document.createElement('div')
            newCorr.classList.add('corridor' + corrCount)

            lanes[j].after(newCorr)
            corrCount++
            laneCorrCount[j]++
        }
    }

    console.log(laneCorrCount)

    let corrPositions = [[], [], []]

    for (let j = 0; j < 3; j++) { //boucle qui parcours chaque le premier niveau du tableau
        for (let k = 0; k < laneCorrCount[j]; k++) { //boucle qui ajoute le bon nombre de positions
            let randInt = Math.floor(Math.random() * 60)
            corrPositions[j].push(randInt)
        }
        corrPositions[j].sort(function (a, b) {return a - b})
    }

    console.log(corrPositions)

    let map = "" //chaîne de caractère contenant la disposition du terrain

    let fullLane, laneNum = 1, emptyLane = "", corrNum = 0, k = 0

    //REMPLISSAGE DE LA CHAINE //

    //ne doit pas changer
    for (let i = 0; i < 3; i++) {
        fullLane = ""
        emptyLane = ""
        for (let j = 0; j < 60; j++) {
            fullLane += `lane${laneNum} `
        }
        map += `"${fullLane}"`
        map += '\n'
        laneNum++

        //crée et remplit un tableau avec des positions aléatoires pour les couloirs

        for (let j = 0; j < 60; j++) { //parcours la ligne
            if (j === corrPositions[i][k]) {
                emptyLane += `corridor${corrNum + 1}`
                corrNum++
                k++
            } else {
                emptyLane += '. '
            }
        }

        k = 0
        map += `"${emptyLane}"`
        map += '\n'

    }

    fullLane = ""
    for (let j = 0; j < 60; j++) {
        fullLane += `lane${laneNum} `
    }
    map += `"${fullLane}"`

    console.log(map)

    $('.map').css('grid-template-areas', map)
    setElevators()
}

function listenArrows() {
  window.addEventListener('keydown', function(e){
  //on gère les déplacements du personnage en fonction de la touche
  e.preventDefault()
    let nextCorridor = character.parentNode.nextSibling.nextSibling
    let pastCorridor = character.parentNode.previousSibling.previousSibling
    if (e.keyCode==39)
    {
      //déplace le personnage vers la droite
      clearInterval(go)
       go = setInterval( function() {

        if (a < 5){
          left += 10
          character.style.left = left + 'px'
          a += 1
          character.src = charImg[a]
        }
        else {
          a = 0
          left += 20
          character.style.left = left + 'px'
          character.src = charImg[a]
        }
        windowMove()
      },30)
    }
    if (e.keyCode==37)
    {
      //déplace le personnage vers la gauche
      clearInterval(go)
       go = setInterval( function() {

         if (left > 0)
         {
          if (b < 5){
           left -= 10
           character.style.left = left + 'px'
           b += 1
           character.src = charImgLeft[b]
         }
         else {
           b = 0
           left -= 20
           character.style.left = left + 'px'
           character.src = charImgLeft[b]
         }}
         else {
           character.src = charImg[0]
         }
        windowMove()
      },30)
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
}

function setElevators() {
    let elevators = document.querySelectorAll('div[class^=corridor]')

    for (let i = 0; i < elevators.length; i++) {
        for (let j = 0; j < 2; j++) {
            let elevator = document.createElement('img')
            elevator.setAttribute('src', 'images/elevator_door.png')
            elevators[i].appendChild(elevator)
        }
    }
}

function windowMove () {
    if (left > window.innerWidth / 2 && left < window.innerWidth * 2.5) {
        scrollTo(left - window.innerWidth / 2, 0)
    }
}

function createCharacter(){
  //on crée le personnage et on le place sur le terrains
  character.src = charImg[a]
  character.style.position = 'absolute'
  character.style.top = '40px'
  character.style.left = left + 'px'
  character.style.height = '80px'

  lane[place].appendChild(character)
}
