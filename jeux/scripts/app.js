let character = document.createElement('div')
let lane = document.querySelectorAll('div[class^=lane]')
let left = 10
let mapWrapper = document.querySelector('.map')
let place = Math.floor(Math.random()*4)

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
            // if (randInt - corrPositions[j][k - 1] > 10 && (randInt - corrPositions[j - 1][k] > 10 || corrPositions[j - 1][k] - randInt > 10)) {
            //     console.log('suuss la sossiss')
            // }
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

        // for (let j = 0; j < corrCount[i]; j++) { //permet de fouttre le bon nombre de corridor par lane dans le css
        //     for (let k = 0; k < 60; k++) {
                                
        //     }            
        // }

        // for (let j = 0; j < 60; j++) {
        //     let randomChara = Math.floor(Math.random() * 31)
            
        //     if ((randomChara >= 29 || emptyLane.substring(emptyLane.length - 16, emptyLane.length + 1) === ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ") && emptyLane.substring(0, emptyLane.length).includes(`corridor${i * 2}`) === false ) {
        //         emptyLane += `corridor${corrNum + 1}`
        //         corrNum++
        //     } else  {
        //         emptyLane += '. '
        //     }
        // }
        // map += `"${emptyLane}"`
        // map += '\n'
        // console.log(emptyLane.substring(emptyLane.length - 16, emptyLane.length + 1))
    }

    fullLane = ""
    for (let j = 0; j < 60; j++) {
        fullLane += `lane${laneNum} `
    }
    map += `"${fullLane}"`

    console.log(map)

    $('.map').css('grid-template-areas', map)

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
        windowMove()
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
  //on le personnage et on le place sur le terrain
  character.style.width = '1%'
  character.style.height = '50%'
  character.style.backgroundColor = 'red'
  character.style.position = 'absolute'
  character.style.left = left + 'px'
  character.style.bottom = 0

  lane[place].appendChild(character)
}
