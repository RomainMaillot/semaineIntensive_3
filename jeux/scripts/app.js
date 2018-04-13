let character = document.createElement('div')
let hudButtons = document.querySelectorAll('.skill')
let lane = document.querySelectorAll('div[class^=lane]')
let left = 0
let chronometer
var chronoTime //contiendra un setInterval
let speed = 4
let triggerKeyDown = new Event('keydown')
let cpuClick = new Event('click')
let mapWrapper = document.querySelector('.map')
let place = Math.floor(Math.random()*4)
let go, game = 1
let jumpImg = document.querySelector('#jumpContainer img')
let jumpstop, timer2, dir
let lifebar = document.querySelector('#lifebar'), lifebarImg = ['./images/lifebar1.png','./images/lifebar3.png']
let reset = document.querySelector('#reset')

//différentes images

const worldImages = {
    lanes: [
        './images/lane1_background.png',
        './images/lane2_background.png',
        './images/lane3_background.png',
        './images/lane4_background.png'
    ],
    obstacles: [
        './images/folder.png',
    ],
    portals: [
        './images/elevator_door.png',
        './images/elevator_door2.png',
        './images/elevator_problem.png',
    ]
}

//lancement de la musique

let music = new Audio('../music/escapelifemusic.mp3')
music.loop = true
music.play()

// définition des sons

const sounds = {
    elevatorSound: new Audio('./sounds/elevator.mp3'),
    jumpSound: new Audio('./sounds/jump.mp3'),
    folderSound: new Audio('./sounds/folder.mp3'),
    impactSound: new Audio('./sounds/impact.mp3'),
    gandalfSound: new Audio('./sounds/gandalf.mp3'),
    elevatorBlockedSound: new Audio('./sounds/elevatorBlocked.mp3'),
    alarmSound: new Audio('./sounds/alarmvol.mp3'),
    timeSlowSound: new Audio('./sounds/slowdown.mp3'),
    gameoverSound: new Audio('./sounds/gameover.mp3'),
    winSound: new Audio('./sounds/win.mp3'),
    menuItemSound: new Audio('./sounds/menuitem.mp3'),
    stopSounds: function () {
        for (sound in this) {
            this[sound].muted = true
        }
    },
    setSounds: function () {
        for (sound in this) {
            this[sound].muted = false
        }
    }
}

const attacker = {
    score: 0,
    health: 2,
    hasJump: true,
    win : function () {

        // window.removeEventListener('keydown')
        let gg = document.querySelector('.gg')
        mapWrapper.style.display = 'none'
        setTimeout( () => {
          gg.style.opacity = '1'
        },50)
          gg.style.display = 'block'
        clearInterval(go)
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
        sounds.winSound.play()
        setTimeout(() => { //gère toute la partie pendant le changement de niveau
            initMap()
            mapWrapper.style.display = 'grid'
            gg.style.display = 'none'
            scrollTo(0, 0)
            this.score += 1
            if (parseInt(localStorage.getItem('bestScore')) < this.score ) {
                localStorage.setItem('bestScore', this.score)
            }

            document.querySelector('.score').innerHTML = `score : ${this.score}`
            clearInterval(chronoTime)
            init()
        }, 2000)
        gameData.world += 1
    },
    lose: function() {
        // window.removeEventListener('keydown')
        let youLose = document.querySelector('.youLose')
        mapWrapper.style.display = 'none'
        sounds.gameoverSound.play()
        setTimeout(() => {
            sounds.stopSounds()
            sounds.menuItemSound.muted = false
        }, 4000)
        if (gameData.gamemode == 1)
        {
          if (game == 1)
          {
            document.querySelector('#reset').innerHTML = 'swap'
            localStorage.setItem('scorePlayer1',attacker.score)
          }
          if (game == 2)
          {
            document.querySelector('#reset').innerHTML = 'retry'
            if (attacker.score > localStorage.getItem('scorePlayer1'))
            {
              document.querySelector('.youLose h2').innerHTML = 'Player 2 win'
            }
            else if (attacker.score < localStorage.getItem('scorePlayer1'))
            {
              document.querySelector('.youLose h2').innerHTML = 'Player 1 win'
            }
            else {
              document.querySelector('.youLose h2').innerHTML = 'tie'
            }
          }
        }
        setTimeout( () => {
          youLose.style.opacity = '1'
        },10)
          youLose.style.display = 'block'
        clearInterval(go)
        if (character.classList.contains('characterL'))
        {
          character.classList.remove('characterL')
        }
        if (character.classList.contains('character'))
        {
          character.classList.remove('character')
        }
        left = 0
        if (character.parentNode != null)
        {
          character.parentNode.removeChild(character)
        }
        let defeatMenuItems = document.querySelectorAll('.youLose_text a')
        for (let i = 0; i < defeatMenuItems.length; i++) {
            defeatMenuItems[i].addEventListener('mouseover', () => {
                sounds.menuItemSound.play()
            })

        }
        reset.addEventListener('click',
        function(e){
          e.preventDefault()
          setTimeout( () => {
            youLose.style.opacity = '0'
          },1700)
          setTimeout(() => { //gère toute la partie pendant le changement de niveau
              initMap()
              mapWrapper.style.display = 'grid'
              youLose.style.display = 'none'
              scrollTo(0, 0)
              clearInterval(chronoTime)
              if (gameData.gamemode == 0)
              {
                attacker.score = 0
                document.querySelector('.score').innerHTML = `score : ${attacker.score}`
              }
              if (gameData.gamemode == 1 && game == 1)
              {
                game += 1
                attacker.score = 0
                document.querySelector('.score').innerHTML = `score : ${attacker.score}`
              }
              else if (gameData.gamemode == 1 && game == 1)
              {
                game = 1
              }
              init()
          }, 2000)
        })
    }
    }

const defenser = {
    activeWeapon: null,
    weapons: [
        {
            name: 'dossier',
            interval: 0,
            folderPlace: null,
            behavior: function (laneTargetted) {
                if (this.interval === 0) {
                    defenser.activeWeapon = 'dossier'

                    let folder = document.createElement('div')
                    let posFolder = window.innerWidth + window.scrollX

                    //enregistrement de la lane du dossier
                    this.folderPlace = parseInt(laneTargetted.className.replace('lane', '')) - 1
                    folder.classList.add('folder')
                    laneTargetted.appendChild(folder)
                    let elFolder = document.querySelector('.folder')
                    elFolder.style.left = posFolder + 'px'
                    setInterval(() => {
                        posFolder -= 10
                        elFolder.style.left = posFolder + 'px'
                        if (posFolder < window.scrollX) {
                          if(elFolder.parentNode != null)
                          {
                            elFolder.parentNode.removeChild(elFolder)
                          }
                        }
                        else if (posFolder < left + 35 && posFolder + elFolder.offsetWidth > left + character.offsetWidth && this.folderPlace === place) {
                            attacker.health -= 1
                            lifebar.setAttribute('src', lifebarImg[attacker.health])
                            sounds.impactSound.play()
                            if(elFolder.parentNode != null)
                            {
                              elFolder.parentNode.removeChild(elFolder)
                            }
                        } else {
                            sounds.folderSound.play()
                        }
                    }, 20)
                    this.interval += 4
                    hudButtons[0].style.animation = 'reload ' + this.interval +'s linear 1'
                    hudButtons[0].classList.remove('focus')
                    setTimeout(() => {
                        hudButtons[0].style.animation = ''
                    }, this.interval * 1000)
                }
            }
        },
        {
            name: 'gandalf',
            interval: 0,
            falseWallPos: 5000,
            gandalfPlace: null,
            behavior: function (laneTargetted, mousePos) {
                if (this.interval === 0) {
                    defenser.activeWeapon = 'gandalf'

                    let gandalf = document.createElement('div')
                    let posGandalf = mousePos
                    gandalf.classList.add('gandalfPers')

                    //enregistrement de la place de Gandalf
                    this.gandalfPlace = parseInt(laneTargetted.className.replace('lane', '')) - 1
                    laneTargetted.appendChild(gandalf)
                    let elGandalf = document.querySelector('.gandalfPers')
                    elGandalf.style.left = posGandalf + 'px'

                    //permet la gestion des collisions

                    this.falseWallPos = posGandalf
                    setTimeout(() => {
                        elGandalf.parentNode.removeChild(elGandalf)
                        this.falseWallPos = 5000
                    }, 5000)
                    this.interval += 6
                    hudButtons[1].style.animation = 'reload ' + this.interval +'s linear 1'
                    hudButtons[1].classList.remove('focus')
                    setTimeout(() => {
                        hudButtons[1].style.animation = ''
                    }, this.interval * 1000)
                    sounds.gandalfSound.play()
                }
            }
        },
        {
            name: 'ascenseur',
            interval: 0,
            behavior: function (e) {
                if (this.interval === 0) {
                    defenser.activeWeapon = 'ascenseur'
                    let elevators = document.querySelectorAll('div[class^=corridor] img')
                    for (let i = 0;i<elevators.length;i++)
                    {
                      elevators[i].classList.add('unactivated')
                      elevators[i].setAttribute('src','images/elevator_problem.png')
                      setTimeout(() => {
                          elevators[i].classList.remove('unactivated')

                          elevators[i].parentNode.childNodes[0].setAttribute('src','images/elevator_door.png')
                          elevators[i].parentNode.childNodes[1].setAttribute('src','images/elevator_door2.png')
                      }, 8000)
                    }
                    this.interval += 15
                    hudButtons[2].style.animation = 'reload ' + this.interval +'s linear 1'
                    setTimeout(() => {
                        hudButtons[2].style.animation = ''
                    }, this.interval * 1000)
                    sounds.elevatorBlockedSound.play()
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
                    this.interval += 15
                    hudButtons[3].style.animation = 'reload ' + this.interval +'s linear 1'
                    setTimeout(() => {
                        hudButtons[3].style.animation = ''
                    }, this.interval * 1000)
                    sounds.alarmSound.play()
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
                    this.interval += 8
                    hudButtons[4].style.animation = 'reload ' + this.interval +'s linear 1'
                    setTimeout(() => {
                        hudButtons[4].style.animation = ''
                    }, this.interval * 1000)
                    sounds.timeSlowSound.play()
                }
            }
        }
    ],
}

const cpu = {
    level: 0,
    play: function () {
        setInterval(() => {
            // dois-je jouer?
            let shallPlay = Math.floor(Math.random() * 5)
            if (defenser.weapons[0].interval === 0 && shallPlay === 0) {
                // sur quelle ligne dois-je jouer?
                defenser.weapons[0].behavior(lane[place])
            }
            if (defenser.weapons[1].interval === 0 && shallPlay === 1) {
                // sur quelle ligne dois-je jouer?
                let randPlace = Math.floor(Math.random() * window.innerWidth / 2 + left)
                defenser.weapons[1].behavior(lane[place], randPlace)
            }
            if (defenser.weapons[2].interval === 0 && shallPlay === 2) {
                defenser.weapons[2].behavior()
            }
            if (defenser.weapons[3].interval === 0 && shallPlay === 3) {
                defenser.weapons[3].behavior()
            }
            if (defenser.weapons[4].interval === 0 && shallPlay === 4) {
                defenser.weapons[4].behavior()
            }
        }, 1000)
    }
}

const gameData = {
  gamemode: localStorage.getItem('gameMode'),
  world: 1,
  background: function () {
    if (gameData.world === 1)
    {
      for (let i = 0; i < lane.length; i++) {
        lane[i].style.background = `url(${worldImages.lanes[i]})`
        lane[i].style.backgroundSize = 'contain'

    }
    // } else if (gameData.world === 2){
    //     for (let i = 0; i < lane.length; i++) {
    //         lane[i].style.background = `url(${worldImages.lanes[i + 4]})`
    //         lane[i].style.backgroundSize = 'contain'
    //     }
    // }

    // rajoutez vos background ici...

    } else {
        for (let i = 0; i < lane.length; i++) {
            lane[i].style.background = `url(${worldImages.lanes[i]})`
            lane[i].style.backgroundSize = 'contain'
        }
    }
  }
}

init()

function init(){
  //on initialise le jeux
  //on crée le personnage et on le place
  createCharacter()
  attacker.hasJump = true
  //on génere la map aléatoirement
  initMap()
  gameData.background()
  //on regarde les déplacement du personnage
  listenArrows()
  //on écoute les attaques du défenseurs au clic
  defenseSkillsInit()
  //initialise le HUD
  hud()
  //remet à 0 les timer des compétences du boss
  initWeapons()
  //initialise le chrono
  chronometer = 50
  chronoSet(1000)
  attacker.health = 2
  lifebar.setAttribute('src', './images/lifebar4.png')
  // réinitialise les malus
  resetMalus()
  if (gameData.gamemode == 0)
  {
    cpu.play()
  }
  setTimeout(() => {
    sounds.setSounds()
  }, 4050)
}

function moveCharacater () {
    go = setInterval( function(){
    if (dir == 1 && ( (left < defenser.weapons[1].falseWallPos - 50 || left > defenser.weapons[1].falseWallPos) || defenser.weapons[1].gandalfPlace !== place) )
    {
      left += 2
      character.style.left = left + 'px'
      windowMove()
    }
    if (dir == 2 && left > 0 && ( ( left > defenser.weapons[1].falseWallPos + 50 || left < defenser.weapons[1].falseWallPos) || defenser.weapons[1].gandalfPlace !== place) )
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
        if (!elevatorsDown[i].classList.contains('unactivated')){//déplace le personnage à la ligne inférieur en le supprimant puis en le recréant à la ligne inférieur si un ascenceur est présent
            character.parentNode.removeChild(character)
            place += 1
            sounds.elevatorSound.play()
            lane[place].appendChild(character)}
      }
    }
    for (let i = 0;i<elevatorsUp.length;i++)
    {
      let rectElevatorsUp = elevatorsUp[i].getBoundingClientRect()
      if (e.keyCode==38 && (elevatorsUp[i].parentNode.offsetLeft - 20) <= left && (elevatorsUp[i].parentNode.offsetLeft + elevatorsUp[i].width + 20)>=(left + character.offsetWidth) && character.parentNode != lane[0] && rectElevatorsUp.top<=rectCharacter.top && (rectElevatorsUp.bottom+30)>=rectCharacter.bottom)
      {
        if (!elevatorsUp[i].classList.contains('unactivated')){//déplace le personnage à la ligne supérieur en le supprimant puis en le recréant à la ligne inférieur si un ascenceur est présent
            character.parentNode.removeChild(character)
            place -= 1
            sounds.elevatorSound.play()
            lane[place].appendChild(character)}
      }
    }
    if (e.keyCode == 65 && character.parentNode != lane[0] && attacker.hasJump)
    {
      //déplace le personnage à la ligne supérieur si un jump est disponible
      character.parentNode.removeChild(character)
      place -= 1
      lane[place].appendChild(character)
      attacker.hasJump = false
      jumpImg.classList.add('opacity')
      clearInterval(timer2)
      jumpTimer(8)
      sounds.jumpSound.play()
    }
    if (e.keyCode == 81 && character.parentNode != lane[3] && attacker.hasJump)
    {
      //déplace le personnage à la ligne inférieur si un jump est disponible
      character.parentNode.removeChild(character)
      place += 1
      lane[place].appendChild(character)
      attacker.hasJump = false
      jumpImg.classList.add('opacity')
      clearInterval(timer2)
      jumpTimer(8)
      sounds.jumpSound.play()
    }
}

function jumpTimer(count) {
  timer2 = setInterval(function(){
    if (count > 0)
    {
      count -= 1
    }
    if (count == 0)
    {
      attacker.hasJump = true
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
            if (j == 0){
              elevator.setAttribute('src', 'images/elevator_door.png')
              elevators[i].appendChild(elevator)
            }
            else {
              elevator.setAttribute('src', 'images/elevator_door2.png')
              elevators[i].appendChild(elevator)
            }
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
  left = 0
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

  attacker.health = 3
  speed = 4
  dir = null
}

// génère l'action souhaitée sur le terrain en fonction de l'arme choisie
function defenseSkillsInit() {
    let corridors = document.querySelectorAll('div[class^=corridor]')
    for (let i = 0; i < lane.length; i++) {
        lane[i].addEventListener('click', (e) => {
            let laneTargetted = e.currentTarget
            let mousePos = e.pageX
            switch (defenser.activeWeapon) {
                case 'dossier':
                    defenser.weapons[0].behavior(laneTargetted)
                    break;
                case 'gandalf':
                    defenser.weapons[1].behavior(laneTargetted, mousePos)
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
        e.currentTarget.classList.add('focus')
    })
    hudButtons[1].addEventListener('click', (e) => {
        e.preventDefault()
        defenser.activeWeapon = 'gandalf'
        e.currentTarget.classList.add('focus')
    })
    hudButtons[2].addEventListener('click', (e) => {
        e.preventDefault()
        defenser.activeWeapon = 'ascenseur'
        defenser.weapons[2].behavior()
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

function resetMalus() {
    let gandalfs = document.querySelectorAll('.gandalfPers')
    let folders = document.querySelectorAll('.folder')
    for (let i = 0; i < gandalfs.length; i++) {
        gandalfs[i].parentNode.removeChild(gandalfs[i])
    }
    for (let i = 0; i < folders.length; i++) {
        folders[i].parentNode.removeChild(folders[i])
    }
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
        attacker.lose()
    }
    if (attacker.health == 0)
    {
      attacker.lose()
    }
}, 1000)

//gère le chronomètre
function chronoSet (timerSpeed) {
    chronoTime = setInterval(function () {
        if (chronometer > 0) {
            chronometer -= 1
        }
        document.querySelector('.timer').innerHTML = `Time left : ${chronometer} sec`
    }, timerSpeed)
}

function stopSounds() {

}
