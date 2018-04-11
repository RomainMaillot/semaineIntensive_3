// import { attacker, defenser } from './playersData.js'

let character = document.createElement('div')
let hudButtons = document.querySelectorAll('.skill')
let lane = document.querySelectorAll('div[class^=lane]')
let left = 0
let chronometer
var chronoTime //contient un setInterval
let speed = 4
let triggerKeyDown = new Event('keydown')
let mapWrapper = document.querySelector('.map')
let place = Math.floor(Math.random()*4)
let go
let jump = true
let jumpImg = document.querySelector('#jumpContainer img')
let jumpstop, timer2, dir

const attacker = {
    score: 0,
    health: 3,
    hasJump: true,
    win : function () {

        // window.removeEventListener('keydown')
        let gg = document.querySelector('.gg')
        mapWrapper.style.display = 'none'
        gg.style.opacity = '1'
        clearInterval(go)
        clearInterval(chronoTime)
        if (character.classList.contains('characterL'))
        {
          character.classList.remove('characterL')
        }
        if (character.classList.contains('character'))
        {
          character.classList.remove('character')
        }
        left = 0
        character.parentNode.removeChild(character)
        setTimeout( () => {
          gg.style.opacity = '0'
        },1700)
        setTimeout(() => { //gère toute la partie pendant le changement de niveau
            initMap()
            mapWrapper.style.display = 'grid'
            scrollTo(0, 0)
            this.score += 1
            if (parseInt(localStorage.getItem('bestScore')) < this.score ) {
                localStorage.setItem('bestScore', this.score)
            }

            document.querySelector('.score').innerHTML = `score : ${this.score}`
            init()
        }, 2000)
    }
}

const defenser = {
    activeWeapon: null,
    weapons: [
        {
            name: 'dossier',
            interval: 30,
            folderPlace: null,
            behavior: function (e) {
                if (this.interval === 0) {
                    defenser.activeWeapon = 'dossier'

                    let folder = document.createElement('div')
                    let posFolder = window.innerWidth + window.scrollX

                    //enregistrement de la lane du dossier
                    this.folderPlace = parseInt(e.currentTarget.className.replace('lane', '')) - 1
                    folder.classList.add('folder')
                    e.currentTarget.appendChild(folder)
                    let elFolder = document.querySelector('.folder')
                    elFolder.style.left = posFolder + 'px'
                    setInterval(() => {
                        posFolder -= 10
                        elFolder.style.left = posFolder + 'px'
                        if (posFolder < window.scrollX) {
                            elFolder.parentNode.removeChild(elFolder)
                        } else if (posFolder < left + 35 && this.folderPlace === place) {
                            // attacker.health -= 1
                            elFolder.parentNode.removeChild(elFolder)
                        }
                    }, 20)
                    this.interval += 30
                    hudButtons[0].style.animation = 'reload ' + this.interval +'s linear 1'
                }
            }
        },
        {
            name: 'gandalf',
            interval: 10,
            falseWallPos: 5000,
            gandalfPlace: null,
            behavior: function (e) {
                if (this.interval === 0) {
                    console.log(e.pageX)
                    defenser.activeWeapon = 'gandalf'

                    let gandalf = document.createElement('div')
                    let posGandalf = e.pageX
                    gandalf.classList.add('gandalfPers')

                    //enregistrement de la place de Gandalf
                    this.gandalfPlace = parseInt(e.currentTarget.className.replace('lane', '')) - 1
                    e.currentTarget.appendChild(gandalf)
                    let elGandalf = document.querySelector('.gandalfPers')
                    elGandalf.style.left = posGandalf + 'px'

                    //permet la gestion des collisions

                    this.falseWallPos = posGandalf
                    // setInterval(() => {
                    //     elGandalf.parentNode.removeChild(elGandalf)
                    //     this.falseWallPos = 5000
                    // }, 10000)
                    this.interval += 10
                    hudButtons[1].style.animation = 'reload ' + this.interval +'s linear 1'
                }
            }
        },
        {
            name: 'ascenseur',
            interval: 25,
            behavior: () => {
                if (this.interval === 0) {
                    defenser.activeWeapon = 'ascenseur'
                    this.interval += 25
                    hudButtons[2].style.animation = 'reload ' + this.interval +'s linear 1'
                }
            }
        },
        {
            name: 'alarme',
            interval: 0,
            behavior: function () {
                let timer = document.querySelector('.timer')
                if (this.interval === 0) {
                    clearInterval(chronoTime)
                    chronoSet(400)
                    timer.classList.add('timerAccelerated')

                    setTimeout(() => {
                        clearInterval(chronoTime)
                        chronoSet(1000)
                        timer.classList.remove('timerAccelerated')
                        this.isActive = false
                    }, 6000)
                    this.interval += 25
                    hudButtons[3].style.animation = 'reload ' + this.interval +'s linear 1'
                }
            }
        },
        {
            name: 'heure sup',
            interval: 0,
            behavior: function () {
                if (this.interval === 0) {
                    clearInterval(go)
                    speed = 9
                    moveCharacater()
                    triggerKeyDown.which = 37
                    document.dispatchEvent(triggerKeyDown)
                    setTimeout(() => {
                        clearInterval(go)
                        speed = 4
                        moveCharacater()
                    }, 5000)
                    this.interval += 25
                    hudButtons[4].style.animation = 'reload ' + this.interval +'s linear 1'
                }
            }
        }
    ],
}

init()

function init(){
  //on initialise le jeux
  //on crée le personnage et on le place
  createCharacter()
  //on génere la map aléatoirement
  initMap()
  //on regarde les déplacement du personnage
  listenArrows()
  //on écoute les attaques du défenseurs au clic
  defenseSkillsInit()
  //initialise le HUD
  hud()
  //remet à 0 les timer des compétences du boss
  initWeapons()
  //initialise le chrono
  chronometer = 75
  chronoSet(1000)
}

function moveCharacater () {
    go = setInterval( function(){
    if (dir == 1 && ( left < defenser.weapons[1].falseWallPos - 50 || defenser.weapons[1].gandalfPlace !== place) )
    {
      left += 2
      character.style.left = left + 'px'
      windowMove()
    }
    if (dir == 2 && left > 0)
    {
      left -= 2
      character.style.left = left + 'px'
      windowMove()
    }
  }, speed)
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

    let corrPositions = [[], [], []]

    for (let j = 0; j < 3; j++) { //boucle qui parcours chaque le premier niveau du tableau
        for (let k = 0; k < laneCorrCount[j]; k++) { //boucle qui ajoute le bon nombre de positions
            let randInt = Math.floor(Math.random() * 60)
            corrPositions[j].push(randInt)
        }
        corrPositions[j].sort(function (a, b) {return a - b})
    }

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

    $('.map').css('grid-template-areas', map)
    setElevators()
}


function keyHandler (e) {
    e.preventDefault()
    let elevatorsDown = document.querySelectorAll('div[class^=corridor] img:first-of-type')
    let rectCharacter = character.getBoundingClientRect()
    let elevatorsUp = document.querySelectorAll('div[class^=corridor] img:nth-of-type(2)')
    if (e.keyCode==39)
    {
      character.classList.add('character')
      dir = 1
      clearInterval(go)
      moveCharacater()
      if (character.classList.contains('characterL'))
      {
        character.classList.remove('characterL')
      }
    }
    if (e.keyCode==37)
    {
      character.classList.add('characterL')
      dir = 2
      clearInterval(go)
      moveCharacater()
      if (character.classList.contains('character'))
      {
        character.classList.remove('character')
      }
    }

    for (let i = 0;i<elevatorsDown.length;i++){
      let rectElevatorsDown = elevatorsDown[i].getBoundingClientRect()
      if (e.keyCode == 40 && (elevatorsDown[i].parentNode.offsetLeft - 20) <= left && (elevatorsDown[i].parentNode.offsetLeft + elevatorsDown[i].width + 20)>=(left + character.offsetWidth) && character.parentNode != lane[3] && rectElevatorsDown.top<=rectCharacter.top && (rectElevatorsDown.bottom+30)>=rectCharacter.bottom)
      {
        //déplace le personnage à la ligne inférieur en le supprimant puis en le recréant à la ligne inférieur si un ascenceur est présent
         character.parentNode.removeChild(character)
         place += 1
         lane[place].appendChild(character)
      }
    }
    for (let i = 0;i<elevatorsUp.length;i++)
    {
      let rectElevatorsUp = elevatorsUp[i].getBoundingClientRect()
      if (e.keyCode==38 && (elevatorsUp[i].parentNode.offsetLeft - 20) <= left && (elevatorsUp[i].parentNode.offsetLeft + elevatorsUp[i].width + 20)>=(left + character.offsetWidth) && character.parentNode != lane[0] && rectElevatorsUp.top<=rectCharacter.top && (rectElevatorsUp.bottom+30)>=rectCharacter.bottom)
      {
        //déplace le personnage à la ligne supérieur en le supprimant puis en le recréant à la ligne inférieur si un ascenceur est présent
        character.parentNode.removeChild(character)
        place -= 1
        lane[place].appendChild(character)
      }
    }
    if (e.keyCode == 65 && character.parentNode != lane[0] && jump == true)
    {
      //déplace le personnage à la ligne supérieur si un jump est disponible
      character.parentNode.removeChild(character)
      place -= 1
      lane[place].appendChild(character)
      jump = false
      jumpImg.classList.add('opacity')
      clearInterval(timer2)
      jumpTimer(3)
    }
    if (e.keyCode == 81 && character.parentNode != lane[3] && jump == true)
    {
      //déplace le personnage à la ligne inférieur si un jump est disponible
      character.parentNode.removeChild(character)
      place += 1
      lane[place].appendChild(character)
      jump = false
      jumpImg.classList.add('opacity')
      clearInterval(timer2)
      jumpTimer(3)
    }
}

function jumpTimer(count) {
  timer2 = setInterval(function(){
    if (count >= 0)
    {
      count -= 1
    }
    if (count == -1)
    {
      jump = true
      jumpImg.classList.remove('opacity')
    }
  },1000)
}

function listenArrows() {
    window.addEventListener('keydown', keyHandler)
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

// bouge la fenêtre en même temps que le personnage et définit la zone de victoire

function windowMove () {
    if (left > window.innerWidth / 2 && left < window.innerWidth * 2.5) {
        scrollTo(left - window.innerWidth / 2, 0)
    }
    if (left > window.innerWidth * 2.9) {
        attacker.win()
    }
}

function createCharacter(){
  //on crée le personnage et on le place sur le terrains
  character.style.background = `url("./images/sprite1.png")`
  character.style.backgroundSize = 'contain'
  character.style.backgroundRepeat = 'no-repeat'
  character.style.position = 'absolute'
  character.style.top = '8vh'
  character.style.zIndex = '2000'
  character.style.left = left + 'px'
  character.style.height = '80px'
  character.style.width = '55px'

  lane[place].appendChild(character)
}

// génère l'action souhaitée sur le terrain en fonction de l'arme choisie
function defenseSkillsInit() {
    for (let i = 0; i < lane.length; i++) {
        lane[i].addEventListener('click', (e) => {
            switch (defenser.activeWeapon) {
                case 'dossier':
                    defenser.weapons[0].behavior(e)
                    break;
                case 'gandalf':
                    defenser.weapons[1].behavior(e)
                    break;

                case 'ascenseur':
                    defenser.weapons[2].behavior(e)
                    break;

                default:
                    break;
            }
        })
    }
}

// initialise les écouteurs d'événements du HUD

function hud() {
    hudButtons[0].addEventListener('click', (e) => {
        e.preventDefault()
        defenser.activeWeapon = 'dossier'
    })
    hudButtons[1].addEventListener('click', (e) => {
        e.preventDefault()
        defenser.activeWeapon = 'gandalf'
    })
    hudButtons[2].addEventListener('click', (e) => {
        e.preventDefault()
        defenser.activeWeapon = 'ascenseur'
    })
    hudButtons[3].addEventListener('click', (e) => {
        e.preventDefault()
        defenser.weapons[3].behavior()
    })
    hudButtons[4].addEventListener('click', (e) => {
        e.preventDefault()
        defenser.weapons[4].behavior()
    })
}

// réinitialise le temps de recharge des armes du boss

function initWeapons() {
    defenser.weapons[0].interval = 0
    defenser.weapons[1].interval = 0
    defenser.weapons[2].interval = 0
    defenser.weapons[3].interval = 0
    defenser.weapons[4].interval = 0
}

//fonction qui prend en charge la défaite

function lose() {
    console.log('t\'as perdu! et moi j\'ai gagné!')
}

//à chaque seconde, recharge des compétences du boss et décompte du temps

setInterval(() => {
    for (let i = 0; i < defenser.weapons.length; i++) {
        if (defenser.weapons[i].interval > 0) {
            defenser.weapons[i].interval -= 1
        } else {
            hudButtons[i].style = ''
        }
        // hudButtons[i].innerHTML = defenser.weapons[i].interval
    }
    if (chronometer === 0) {
        lose()
    }
}, 1000)

//gère le chronomètre
function chronoSet (timerSpeed) {
    chronoTime = setInterval(function () {
        if (chronometer > 0) {
            chronometer -= 1
        }
        document.querySelector('.timer').innerHTML = `Temps restant : ${chronometer} sec`
    }, timerSpeed)
}
